# -*- coding: utf-8 -*-

import os.path
import uuid
import base64
import time
import zipfile
import ConfigParser
import StringIO
import datetime

from boto.dynamodb2.table import Table
from boto.dynamodb2 import connect_to_region
from boto.dynamodb2.exceptions import ItemNotFound

#from chsdi.models.clientdata_dynamodb import get_table

from boto.s3.connection import S3Connection
from boto.s3.key import Key

from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc
from pyramid.response import Response

from chsdi.lib.decorators import requires_authorization, validate_kml_input

ISO8601 = '%Y-%m-%dT%H:%M:%SZ'
ISO8601_MS = '%Y-%m-%dT%H:%M:%S.%fZ'
RFC1123 = '%a, %d %b %Y %H:%M:%S %Z'


def _parse_ts(ts):
    dt = None
    ts = ts.strip()
    try:
        dt = datetime.datetime.strptime(ts, ISO8601)
    except:
        dt = None

    if dt is None:
        try:
            dt = datetime.datetime.strptime(ts, ISO8601_MS)
        except:
            dt = None

    if dt is None:
        try:
            dt = datetime.datetime.strptime(ts, RFC1123)
        except:
            dt = None

    return dt


def _get_dynamodb_table():
    table = None
    DYNAMODB_TABLE_NAME = 'geoadmin-file-storage'
    try:
        PROFILE_NAME = 'Credentials'
        user_cfg = os.path.join(os.path.expanduser("~"), '.boto')
        config = ConfigParser.ConfigParser()
        config.read(["/etc/boto.cfg", user_cfg])
        access_key = config.get(PROFILE_NAME, 'aws_access_key_id')
        secret_key = config.get(PROFILE_NAME, 'aws_secret_access_key')
        conn = connect_to_region('eu-west-1', aws_access_key_id=access_key,
                                 aws_secret_access_key=secret_key)
        table = Table(DYNAMODB_TABLE_NAME, connection=conn)
    except:
        table = None

    if table is None:
        try:
            table = Table(DYNAMODB_TABLE_NAME, connection=connect_to_region('eu-west-1'))
        except Exception as e:
            raise exc.HTTPInternalServerError('Unable to access dynamodb table (%s)' % e)

    return table


def _add_item(id, file_id=False):
    table = _get_dynamodb_table()
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
    table = _get_dynamodb_table()
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
    table = _get_dynamodb_table()
    try:
        table.get_item(adminId=str(admin_id))
    except ItemNotFound:
        return False

    return True


def _get_file_id_from_admin_id(admin_id):
    fileId = None
    table = _get_dynamodb_table()
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
        self.bucket = self._get_bucket()
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
            except:
                raise exc.HTTPInternalServerError('Cannot access file with id=%s' % self.file_id)
            if key is not None:
                self.key = key
            else:
                raise exc.HTTPNotFound('File %s not found' % self.file_id)

    def _get_uuid(self):
        return base64.urlsafe_b64encode(uuid.uuid4().bytes).replace('=', '')

    def _get_bucket(self):
        # TODO use profile instead when correctly installed
        PROFILE_NAME = 'profile geoadmin_filestorage'
        BUCKET_NAME = self.request.registry.settings['geoadmin_file_storage_bucket']
        user_cfg = os.path.join(os.path.expanduser("~"), '.boto')
        config = ConfigParser.ConfigParser()
        config.read(["/etc/boto.cfg", user_cfg])
        try:
            access_key = config.get(PROFILE_NAME, 'aws_access_key_id')
            secret_key = config.get(PROFILE_NAME, 'aws_secret_access_key')
        except Exception as e:
            raise exc.HTTPInternalServerError('Error while trying to configure file access (%s)' % e)

        try:
            conn = S3Connection(aws_access_key_id=access_key, aws_secret_access_key=secret_key)
            bucket = conn.get_bucket(BUCKET_NAME)
        except Exception as e:
            raise exc.HTTPBadRequest('Error during connection %s' % e)

        return bucket

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
                last_updated = _parse_ts(key.last_modified)
                _save_item(self.admin_id, file_id=self.file_id, last_updated=last_updated)
            except Exception as e:
                raise exc.HTTPInternalServerError('Cannot create file on S3 (%s)' % e)
        else:
            try:
                if self.key.content_type == 'application/vnd.google-earth.kmz' and ziped_data is not None:
                    data = ziped_data
                self.key.set_contents_from_string(data, replace=True)
                key = self.bucket.get_key(self.key.key)
                last_updated = _parse_ts(key.last_modified)
                _save_item(self.admin_id, last_updated=last_updated)
            except Exception as e:
                raise exc.HTTPInternalServerError('Cannot update file on S3 (%s)' % e)

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
        except:
            raise exc.HTTPNotFound('File %s not found' % self.file_id)

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
            except:
                raise exc.HTTPInternalServerError('Cannot update file with id=%s' % self.admin_id)
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
            except:
                raise exc.HTTPInternalServerError('Error while deleting file %s' % self.file_id)
        else:
            raise exc.HTTPUnauthorized('You are not authorized to delete file %s' % self.file_id)

    @view_config(request_method='OPTIONS', renderer='string')
    def options_file(self):
        # TODO: doesn't seem to be applied
        self.request.response.headers.update({
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,OPTIONS',
            'Access-Control-Allow-Credentials': 'true'})
        return ''
