#!/usr/bin/env python
# -*- coding: utf-8 -*-


"""
mapproxyfy.py Script to generate a MapProxy config file from a layer list.

Each layer's timestamp, we should define. a source, two cache and two layers.
A layer for two timestamps will have the following elements:

layers:
    ch.swisstopo.pixelkarte-farbe_20140520
    ch.swisstopo.pixelkarte-farbe_20140520_source
    ch.swisstopo.pixelkarte-farbe_20111027
    ch.swisstopo.pixelkarte-farbe_20111027_source
    ch.swisstopo.pixelkarte-farbe


caches:
     ch.swisstopo.pixelkarte-farbe_20140520_cache
     ch.swisstopo.pixelkarte-farbe_20140520_cache_out
     ch.swisstopo.pixelkarte-farbe_20111027_cache
     ch.swisstopo.pixelkarte-farbe_2011127_cache_out


source:
     ch.swisstopo.pixelkarte-farbe_20140520_source
     ch.swisstopo.pixelkarte-farbe_20111127_source


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
from chsdi.lib.filters import filter_by_geodata_staging


DEBUG = False
LANG = 'de'
STAGING = 'prod'

total_timestamps = 0

EPSG_CODES = ['4258',  # ETRS89 (source: epsg-registry.org, but many WMTS client use 4852)
              '4326',  # WGS1984
              '2056',  # LV95
              '3857']  # Pseudo-Mercator Webmapping

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
    layers_query = filter_by_geodata_staging(
        layers_query,
        models['GetCap'].staging,
        STAGING
    )
    DBSession.close()

    return [q for q in layers_query.all()]


try:
    with open(os.path.abspath('mapproxy/templates/mapproxy.tpl')) as f:
        mapproxy_config = yaml.load(f.read())
except EnvironmentError:
    print 'Critical error. Unable to open/read the mapproxy template file. Exit.'
    sys.exit(1)


# Translation
tr = support.Translations.load('chsdi/locale', locales=[LANG], domain='chsdi')

for part in ['caches', 'sources']:
    if mapproxy_config[part] is None:
        mapproxy_config[part] = {}
if mapproxy_config['layers'] is None:
    mapproxy_config['layers'] = []

for idx, layersConfig in enumerate(getLayersConfigs()):
    if layersConfig and layersConfig.maps is not None:
        if layersConfig.timestamp is not None and 'api' in layersConfig.maps:
            print idx, layersConfig.bod_layer_id
            bod_layer_id = layersConfig.bod_layer_id

            timestamps = layersConfig.timestamp.split(',')
            total_timestamps += len(timestamps)
            current_timestamp = timestamps[0]
            image_format = layersConfig.arr_all_formats.split(',')[0]
            server_layer_name = bod_layer_id

            current_timestamps[bod_layer_id] = current_timestamp

            title = tr.ugettext(bod_layer_id)

            grid_names = []

            for matrix in ['4258', '4326', '2056', '3857']:
                grid_name = "epsg_%s" % matrix
                grid_names.append(grid_name)

            for timestamp in timestamps:
                wmts_source_name = "%s_%s_source" % (bod_layer_id, timestamp)
                wmts_cache_name = "%s_%s_cache" % (bod_layer_id, timestamp)
                layer_source_name = "%s_%s_source" % (bod_layer_id, timestamp)

                cache_name = "%s_%s_cache_out" % (bod_layer_id, timestamp)
                layer_name = "%s_%s" % (bod_layer_id, timestamp)
                dimensions = {'Time': {'default': timestamp, 'values': [timestamp]}}

                # layer config: cache_out
                layer = {'name': layer_name, 'title': "%s (%s)" % (title, timestamp), 'dimensions': dimensions, 'sources': [cache_name]}

                cache = {"sources": [wmts_cache_name], "format": "image/%s" % image_format, "grids": grid_names, "disable_storage": True, "meta_size": [1, 1], "meta_buffer": 0}

                if '.swissimage' in wmts_cache_name:
                    cache["image"] = {"resampling_method": "bilinear"}
                elif '.swisstlm3d-karte' in wmts_cache_name:
                    cache["image"] = {"resampling_method": "nearest"}

                mapproxy_config['layers'].append(layer)
                mapproxy_config['caches'][cache_name] = cache

                # original source (one for all projection)
                wmts_url = "http://wmts6.geo.admin.ch/1.0.0/" + server_layer_name + "/default/" + timestamp + "/21781/%(z)d/%(y)d/%(x)d.%(format)s"

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

                if '.swissimage' in wmts_cache_name:
                    wmts_source["grid"] = "swisstopo-swissimage"
                    wmts_cache["grids"] = ["swisstopo-swissimage"]

                layer_title = "%s (%s, source)" % (title, timestamp)
                wmts_layer = {'name': wmts_source_name, 'title': layer_title, 'dimensions': dimensions, 'sources': [wmts_cache_name]}
                wmts_layer_current = {'name': wmts_source_name, 'title': "%s ('alias')" % title, 'dimensions': dimensions, 'sources': [wmts_cache_name]}

                if timestamp == current_timestamp:
                    layer_current = {'name': bod_layer_id, 'title': "%s ('current')" % title, 'dimensions': dimensions, 'sources': [wmts_cache_name]}
                    mapproxy_config['layers'].append(layer_current)

                if DEBUG:
                    print layer

                mapproxy_config['layers'].append(wmts_layer)
                mapproxy_config['caches'][wmts_cache_name] = wmts_cache
                mapproxy_config['sources'][wmts_source_name] = wmts_source

print "=============="
print "Layers: %d, timestamps: %d" % (idx + 1, total_timestamps)

if DEBUG:
    print json.dumps(mapproxy_config, sort_keys=False, indent=4)

# generate the mapproxy.yaml config file
with open('mapproxy/mapproxy.yaml', 'w') as o:
    o.write("# This is a generated file. Do not edit.\n\n")
    o.write(yaml.safe_dump(mapproxy_config, encoding=None))
