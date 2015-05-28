# -*- coding: utf-8 -*-

import uuid
import base64
import time
import zipfile
import StringIO

from boto.dynamodb2.exceptions import ItemNotFound

from boto.exception import S3ResponseError
from boto.s3.key import Key
from boto.utils import parse_ts

from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc
from pyramid.response import Response

from chsdi.models.clientdata_dynamodb import get_dynamodb_table, get_bucket
from chsdi.lib.decorators import requires_authorization, validate_kml_input


def _add_item(id, file_id=False):
    table = get_dynamodb_table(table_name='geoadmin-file-storage')
    try:
        table.put_item(
            data={
                'adminId': id,
                'fileId': file_id,
                'timestamp': time.strftime('%Y-%m-%d %X', time.localtime())
            }
        )
    except Exception as e:
        raise exc.HTTPBadRequest('Error during put item %s' % e)
    return True


def _save_item(admin_id, file_id=None, last_updated=None):
    table = get_dynamodb_table(table_name='geoadmin-file-storage')
    item = None
    if last_updated is not None:
        timestamp = last_updated.strftime('%Y-%m-%d %X')
    else:
        timestamp = time.strftime('%Y-%m-%d %X', time.localtime())
    if file_id is not None:
        try:
            table.put_item(
                data={
                    'adminId': admin_id,
                    'fileId': file_id,
                    'timestamp': timestamp
                }
            )
        except Exception as e:
            raise exc.HTTPBadRequest('Error during put item %s' % e)
        return True

    else:
        try:
            item = table.get_item(adminId=str(admin_id))
        except ItemNotFound:
            return False
        try:
            item['timestamp'] = timestamp
            item.save()
        except Exception as e:
            raise exc.HTTPBadRequest('Timestamp of %s not updated:  %s' % (admin_id, e))


def _is_admin_id(admin_id):
    table = get_dynamodb_table(table_name='geoadmin-file-storage')
    try:
        table.get_item(adminId=str(admin_id))
    except ItemNotFound:
        return False

    return True


def _get_file_id_from_admin_id(admin_id):
    fileId = None
    table = get_dynamodb_table(table_name='geoadmin-file-storage')
    try:
        item = table.get_item(adminId=str(admin_id))
        fileId = item.get('fileId')
    except Exception as e:
        raise exc.HTTPBadRequest('The id %s doesn\'t exist. Error is: %s' % (admin_id, e))
    if fileId is None:
        return False
    return fileId


@view_defaults(renderer='jsonp', route_name='files')
class FileView(object):

    def __init__(self, request):
        self.request = request
        self.bucket = get_bucket(request)
        if request.matched_route.name == 'files':
            self.admin_id = None
            self.key = None
            id = request.matchdict['id']
            if _is_admin_id(id):
                self.admin_id = id
                self.file_id = _get_file_id_from_admin_id(self.admin_id)
            else:
                self.file_id = id
            try:
                key = self.bucket.get_key(self.file_id)
            except S3ResponseError as e:
                raise exc.HTTPInternalServerError('Cannot access file with id=%s: %s' % (self.file_id, e))
            except Exception as e:
                raise exc.HTTPInternalServerError('Cannot access file with id=%s: %s' % (self.file_id, e))

            if key is not None:
                self.key = key
            else:
                raise exc.HTTPNotFound('File %s not found' % self.file_id)

    def _get_uuid(self):
        return base64.urlsafe_b64encode(uuid.uuid4().bytes).replace('=', '')

    @view_config(route_name='files_collection', request_method='OPTIONS', renderer='string')
    def options_files_collection(self):
        # TODO: doesn't seem to be applied
        self.request.response.headers.update({
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,OPTIONS',
            'Access-Control-Allow-Credentials': 'true'})
        return ''

    def _save_to_s3(self, data, mime, update=False, compress=False):
        ziped_data = None
        if compress and mime == 'application/vnd.google-earth.kml+xml':
            tmp = StringIO.StringIO()
            zf = zipfile.ZipFile(tmp, mode='w', compression=zipfile.ZIP_DEFLATED, )
            try:
                zf.writestr('doc.kml', data)
                mime = 'application/vnd.google-earth.kmz'
            finally:
                zf.close()
            ziped_data = tmp.getvalue()

        if not update:
            if ziped_data is not None:
                data = ziped_data
            try:
                k = Key(self.bucket)
                k.key = self.file_id
                k.set_metadata('Content-Type', mime)
                k.set_contents_from_string(data, replace=False)
                key = self.bucket.get_key(k.key)
                last_updated = parse_ts(key.last_modified)
            except Exception as e:
                raise exc.HTTPInternalServerError('Error while configuring S3 key (%s) %s' % (self.file_id, e))
            try:
                _save_item(self.admin_id, file_id=self.file_id, last_updated=last_updated)
            except Exception as e:
                raise exc.HTTPInternalServerError('Cannot create file on Dynamodb (%s)' % e)
        else:
            try:
                if self.key.content_type == 'application/vnd.google-earth.kmz' and ziped_data is not None:
                    data = ziped_data
                self.key.set_contents_from_string(data, replace=True)
                key = self.bucket.get_key(self.key.key)
                last_updated = parse_ts(key.last_modified)
            except:
                raise exc.HTTPInternalServerError('Error while updating S3 key (%s) %s' % (self.key.key, e))
            try:
                _save_item(self.admin_id, last_updated=last_updated)
            except Exception as e:
                raise exc.HTTPInternalServerError('Cannot update file on Dynamodb (%s) %s' % (self.file_id, e))

    @view_config(route_name='files_collection', request_method='POST')
    @requires_authorization()
    @validate_kml_input()
    def create_file(self):
        self.file_id = self._get_uuid()
        self.admin_id = self._get_uuid()
        mime = self.request.content_type
        data = self.request.body
        self._save_to_s3(data, mime)

        return {'adminId': self.admin_id, 'fileId': self.file_id}

    @view_config(request_method='GET')
    def read_file(self):
        try:
            if self.admin_id is not None:
                return {'fileId': self.file_id}
            else:
                data = self.key.get_contents_as_string()
                return Response(data, content_type=self.key.content_type)
        except Exception as e:
            raise exc.HTTPNotFound('File %s not found %s' % (self.file_id, e))

    @view_config(request_method='POST')
    @requires_authorization()
    @validate_kml_input()
    def update_file(self):
        data = self.request.body
        mime = self.request.content_type

        if self.admin_id is not None:
            try:
                self._save_to_s3(data, mime, update=True)

                return {'adminId': self.admin_id, 'fileId': self.file_id, 'status': 'updated'}
            except Exception as e:
                raise exc.HTTPInternalServerError('Cannot update file with id=%s %s' % (self.admin_id, e))
        else:
            # Fork file, get new file ids
            self.file_id = self._get_uuid()
            self.admin_id = self._get_uuid()

            del self.key

            self._save_to_s3(data, mime)

            return {'adminId': self.admin_id, 'fileId': self.file_id, 'status': 'copied'}

    @view_config(request_method='DELETE')
    @requires_authorization()
    def delete_file(self):
        if self.admin_id is not None:
            try:
                self.bucket.delete_key(self.key)
                return {'success': True}
            except Exception as e:
                raise exc.HTTPInternalServerError('Error while deleting file %s. %e' % (self.file_id, e))
        else:
            raise exc.HTTPUnauthorized('You are not authorized to delete file %s' % self.file_id)

    @view_config(request_method='OPTIONS', renderer='string')
    def options_file(self):
        # TODO: doesn't seem to be applied
        self.request.response.headers.update({
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,OPTIONS',
            'Access-Control-Allow-Credentials': 'true'
        })
        return ''
