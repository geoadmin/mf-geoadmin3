# -*- coding: utf-8 -*-

import datetime
from pyramid.view import view_config
from pyramid.renderers import render_to_response
from chsdi.models.clientdata_dynamodb import get_dynamodb_table


@view_config(route_name='adminkml', renderer='json')
def admin_kml(self):
    bucket_name = self.registry.settings.get('geoadmin_file_storage_bucket')
    files = kml_load(bucket_name=bucket_name)
    kmls = {'files': files, 'count': len(files), 'bucket': self.registry.settings.get('api_url')}
    response = render_to_response(
        'chsdi:templates/adminkml.mako',
        kmls)
    response.content_type = 'text/html'
    return response


def kml_load(bucket_name='public.geo.admin.ch'):
    now = datetime.datetime.now()
    date = now.strftime('%Y-%m-%d')
    table = get_dynamodb_table(table_name='geoadmin-file-storage')
    fileid = []
    results = table.query_2(bucket__eq=bucket_name, timestamp__beginswith=date, index='bucketTimestampIndex', limit=50, reverse=True)
    for f in results:
        fileid.append((f['fileId'], f['adminId'], f['timestamp']))
    return fileid
