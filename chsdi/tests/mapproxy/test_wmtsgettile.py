#-*- coding: utf-8 -*-

import os
import requests

from pyramid.paster import get_app

EPSGS = [21781, 2056, 3857, 4326, 4258]

app = get_app('development.ini')

try:
    apache_base_path = app.registry.settings['apache_base_path']
    base_url = "http://" + app.registry.settings['mapproxyhost'] + '/' + apache_base_path if apache_base_path != '/' else ''
except KeyError as e:
    base_url = 'http://wmts10.geo.admin.ch'


def hash(bits=96):
    assert bits % 8 == 0
    return os.urandom(bits / 8).encode('hex')


def get_headers():
    return {'User-Agent': 'WMTS Unit Tester v0.0.1', 'Referer': 'http://unittest.geo.admin.ch'}


def check_status_code(path):
    if not path.startswith('http'):
        url = base_url + path
    else:
        url = path.replace('http://wmts10.geo.admin.ch', base_url)
    resp = requests.get(url, headers=get_headers())
    assert resp.status_code in [200, 204, 304]


def test_generator():
    param_list = get_tile()
    for params in param_list:
        yield check_status_code, params[0]


def get_tile():
    from urlparse import urlparse, urlunparse
    import xml.etree.ElementTree as etree

    tiles = {3857: [(7, 67, 45), (10, 533, 360)],
             21781: [(17, 5, 6), (18, 11, 13)],
             2056: [(17, 5, 6), (18, 11, 13)],
             4326: [(18, 55, 30), (15, 2, 2)],
             4258: [(18, 55, 30), (15, 2, 2)]
             }
    param_list = []

    for epsg in EPSGS:
        capabilities_name = "WMTSCapabilities.EPSG.%d.xml" % epsg if epsg != 21781 else "WMTSCapabilities.xml"
        resp = requests.get(base_url + '/1.0.0/%s' % capabilities_name, params={'_id': hash()},
                            headers=get_headers())

        root = etree.fromstring(resp.content)
        layers = root.findall('.//{http://www.opengis.net/wmts/1.0}Layer')
        for layer in layers:
            resourceurls = layer.findall('.//{http://www.opengis.net/wmts/1.0}ResourceURL')
            for resourceurl in resourceurls:
                tpl = resourceurl.attrib['template']
                tpl_parsed = urlparse(tpl)
                pth = tpl_parsed.path

                dim = layer.find('.//{http://www.opengis.net/wmts/1.0}Dimension')
                times = dim.findall('./{http://www.opengis.net/wmts/1.0}Value')

                tiles_proj = tiles[epsg]

                for tile in tiles_proj:
                    zoom, col, row = tile
                    for time in times:
                        t = time.text
                        try:
                            pth2 = pth.replace('{TileCol}', str(col)).replace('{TileRow}', str(row)).replace('{TileMatrix}', str(zoom)).replace('{Time}', str(t))
                        except:
                            print 'Cannot replace in template %s' % pth
                        url = urlunparse((tpl_parsed.scheme, tpl_parsed.netloc, pth2, '', '', ''))
                        param_list.append((url,))

    return param_list
