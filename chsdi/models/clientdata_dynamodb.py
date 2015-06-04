# -*- coding: utf-8 -*-

import pyramid.httpexceptions as exc

from boto import connect_s3
from boto.dynamodb2 import connect_to_region
from boto.dynamodb2.table import Table

'''
CREATE a table
--------------

import time
from boto.dynamodb2.table import Table
from boto.dynamodb2.fields import HashKey, GlobalKeysOnlyIndex

table = Table.create(shorturl, schema=[
    HashKey('url_short'),
], throughput={
    'read': 18,
    'write': 18,
},
global_indexes=[
    GlobalKeysOnlyIndex('UrlIndex', parts=[
        HashKey('url')
    ], throughput={
        'read': 18,
        'write': 18
    }),
])
time.sleep(30)

DROP a table
------------

from boto.dynamodb import connect_to_region

conn = connect_to_region(region_name='eu-west-1')
table=conn.get_table('shorturl')
table.delete()

'''

# http://boto.readthedocs.org/en/latest/boto_config_tut.html


def _get_dynamodb_conn(region='eu-west-1'):
    try:
        conn = connect_to_region(region)
    except Exception as e:
        raise exc.HTTPBadRequest('DynamoDB: Error during connection init %s' % e)
    return conn


def _get_s3_conn(profile_name='geoadmin_filestorage'):
    # TODO use profile instead when correctly installed
    try:
        conn = connect_s3(profile_name=profile_name)
    except Exception as e:
        raise exc.HTTPBadRequest('S3: Error during connection %s' % e)
    return conn


conn_dynamodb = _get_dynamodb_conn()
conn_s3 = _get_s3_conn()


def get_dynamodb_table(table_name='shorturl'):
    try:
        table = Table(table_name, connection=conn_dynamodb)
    except Exception as e:
        raise exc.HTTPBadRequest('Error during connection to the table %s' % e)
    return table


def get_bucket(request):
    bucket_name = request.registry.settings['geoadmin_file_storage_bucket']
    try:
        bucket = conn_s3.get_bucket(bucket_name)
    except Exception as e:
        raise exc.HTTPBadRequest('Error during connection %s' % e)
    return bucket
