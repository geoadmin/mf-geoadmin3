# -*- coding: utf-8 -*-

import pyramid.httpexceptions as exc

from boto.dynamodb import connect_to_region

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


def get_table():

    # url_short is the pkey
    try:
        conn = connect_to_region(region_name='eu-west-1')
        return conn.get_table('shorturl')
    except Exception as e:
        raise exc.HTTPBadRequest('Error during connection %s' % e)
