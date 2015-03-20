#-*- coding: utf-8 -*-

import urllib
import requests
from urlparse import urlparse, urlunsplit

from pyramid.paster import get_app

app = get_app('development.ini')

geodata_staging = 'prod'

try:
    api_url = "http:" + app.registry.settings['api_url']
    base_url = "http://" + app.registry.settings['wmshost'] + '/'
    geodata_staging = app.registry.settings['geodata_staging']
except KeyError as e:
    base_url = 'http://wms.geo.admin.ch'


def get_wms_layers():
    resp = requests.get(api_url + '/rest/services/all/MapServer/layersConfig')
    layers = resp.json()

    return [layers[k] for k in layers.keys() if layers[k]['type'] == 'wms']


def build_wms_request(cfg):

    wmsUrl = cfg['wmsUrl']
    scheme, netloc, path, params, query, fragment = urlparse(wmsUrl)

    scheme = scheme if scheme in ['http', 'https'] else 'http'

    base_url = urlunsplit([scheme, netloc, path, None, None])

    payload = {'LAYERS': cfg['wmsLayers'],
               'FORMAT': 'image/' + cfg['format'],
               'SRS': 'EPSG:21781',
               'BBOX': '600000,200000,610000,210000',
               'HEIGHT': 1000,
               'WIDTH': 1000,
               'EXCEPTION': 'application/vnd.ogc.se_xm',
               'REQUEST': 'GetMap',
               'VERSION': '1.1.1',
               'SERVICE': 'WMS'
               }

    return base_url + '?' + urllib.urlencode(payload)


def check_status_code(url):
    resp = requests.get(url)
    assert resp.status_code in [200, 204, 304]
    assert resp.headers['content-type'] in ['image/png', 'image/jpeg']
    if geodata_staging == 'prod':
        assert 'wms-bod' not in url


def test_generator():
    param_list = get_wms_layers()
    for params in param_list:
        yield check_status_code, build_wms_request(params)
