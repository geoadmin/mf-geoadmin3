#-*- utf-8 -*-

import pyramid.httpexceptions as exc

import boto

'''
CREATE a table
--------------

import time
from boto.dynamodb2.table import Table
from boto.dynamodb2.fields import HashKey, GlobalKeysOnlyIndex

table = Table.create(short_urls, schema=[
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

import boto
conn=boto.connect_dynamodb()
table=conn.get_table('short_urls')
table.delete()

'''

# http://boto.readthedocs.org/en/latest/boto_config_tut.html


def get_table():

    # url_short is the pkey
    try:
        conn = boto.connect_dynamodb()
        return conn.get_table('short_urls')
    except Exception as e:
        raise exc.HTTPBadRequest('Error during connection %s' % e)
