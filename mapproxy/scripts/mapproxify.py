#!/usr/bin/env python
# -*- coding: utf-8 -*-


"""
mapproxyfy.py Script to generate a MapProxy config file from a layer list.

"""

import os
import sys
import yaml
import json

from babel import support, Locale

from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import engine_from_config

from pyramid.paster import get_appsettings

from chsdi.models.bod import LayersConfig
from chsdi.models.bod import get_wmts_models


DEBUG = False
LANG = 'de'

current_timestamps = {}


basedir = os.path.dirname(os.path.abspath(os.path.join(os.path.abspath(__file__), '../..')))
config_uri = os.path.join(basedir, 'development.ini')
settings = get_appsettings(config_uri)

def getLayersConfigs():

    engine = engine_from_config(settings, 'sqlalchemy.bod.')
    DBSession = scoped_session(sessionmaker())
    DBSession.configure(bind=engine)
    
    
    models = get_wmts_models(LANG)
    layers_query = DBSession.query(models['GetCap'])
    layers_query = layers_query.filter(models['GetCap'].maps.ilike('%%%s%%' % 'api'))
    DBSession.close()

    return  [q for q in layers_query.all()]


try:
    with open(os.path.abspath('mapproxy/templates/mapproxy.tpl')) as f:
            mapproxy_config = yaml.load(f.read())
except EnvironmentError:
    print 'Critical error. Unable to open/read the mapproxy template file. Exit.'
    sys.exit(1)


# Translation
tr = support.Translations.load('chsdi/locale', locales=[LANG], domain='chsdi')


for layersConfig in getLayersConfigs():
    if layersConfig and layersConfig.maps is not None:
        if layersConfig.timestamp is not None and 'api' in layersConfig.maps:
            print layersConfig.bod_layer_id
            bod_layer_id = layersConfig.bod_layer_id
            wmts_source_name = "%s_source" % bod_layer_id
            wmts_cache_name = "%s_cache" % bod_layer_id
            layer_source_name = "%s_source" % bod_layer_id

            timestamps = layersConfig.timestamp.split(',')
            current_timestamp = timestamps[0]
            image_format = layersConfig.arr_all_formats.split(',')[0]
            server_layer_name = bod_layer_id

            current_timestamps[bod_layer_id] = current_timestamp

            dimensions = {'Time': {'default': current_timestamp, 'values': timestamps}}
            title = tr.ugettext(bod_layer_id)

            grid_names = []

            for matrix in ['4258', '4326','2056','3857']:
                grid_name = "epsg_%s" % matrix
                grid_names.append(grid_name)

            cache_name = "%s_cache_out" % (bod_layer_id)
            layer_name = "%s" % (bod_layer_id)

            # layer config: cache_out
            layer = {'name': layer_name, 'title': title, 'dimensions': dimensions, 'sources': [cache_name]}

            cache = {"sources": [wmts_cache_name], "format": "image/%s" % image_format, "grids": grid_names, "disable_storage": True}

            mapproxy_config['layers'].append(layer)
            mapproxy_config['caches'][cache_name] = cache

            # original source (one for all projection)
            wmts_url = "http://wmts6.geo.admin.ch/1.0.0/" + server_layer_name + "/default/" + current_timestamp + "/21781/%(z)d/%(y)d/%(x)d.%(format)s"

            wmts_source = {"url": wmts_url,
                           "type": "tile", 
                           "grid": "swisstopo-pixelkarte", 
                           "transparent": True, 
                           "on_error": {
                               204: {
                                   "response": "transparent",
                                   "cache": True
                               }
                           },
                           "http": {
                               "headers": {
                                   "Referer": "http://mapproxy.geo.admin.ch"
                                }
                            },
                           "coverage": {"bbox": [420000, 30000, 900000, 350000], "bbox_srs": "EPSG:21781"}}

            wmts_cache = {"sources": [wmts_source_name], "format": "image/%s" % image_format, "grids": ["swisstopo-pixelkarte"], "disable_storage": True}

            wmts_layer = {'name': wmts_source_name, 'title': title, 'dimensions': dimensions, 'sources': [wmts_cache_name]}

            if DEBUG:
                print layer

            mapproxy_config['layers'].append(wmts_layer)
            mapproxy_config['caches'][wmts_cache_name] = wmts_cache
            mapproxy_config['sources'][wmts_source_name] = wmts_source

if DEBUG:
    print json.dumps(mapproxy_config, sort_keys=False, indent=4)

# generate the mapproxy.yaml config file
with open('mapproxy/mapproxy.yaml', 'w') as o:
    o.write("# This is a generated file. Do not edit.\n\n")
    o.write(yaml.safe_dump(mapproxy_config, encoding=None))

# apache/mapproxy-current.conf
# map wmts dimension's keyword 'default' with the actual default value
with open('apache/mapproxy-current.conf', 'w') as o:
    conf = ""
    apache_base_path = settings['entry_path']
    apache_entry_point = '/' if apache_base_path == 'main' else  apache_base_path + '/'

    rules_nr = len(current_timestamps)
    tpl = "RewriteRule %s1.0.0/%s/default/default/(.*)   %s1.0.0/%s/default/%s/$1 [S=%d]\n"
    for idx, lyr in enumerate(current_timestamps.keys()):
        conf += tpl % (apache_entry_point, lyr, apache_entry_point, lyr, current_timestamps[lyr], rules_nr - idx - 1)
    o.write("# This is a generated file. Do not edit.\n\n")
    o.write(conf)
