#-*- coding: utf-8 -*-

import sys
import os
import random
import requests
from testconfig import config as tc


EPSGS = [21781, 2056, 3857, 4326, 4258]


try:
    base_url = "http:" + tc['vars']['mapproxy_url']
except KeyError as e:
    base_url = 'http://wmts10.geo.admin.ch'


def hash(bits=96):
    assert bits % 8 == 0
    return os.urandom(bits / 8).encode('hex')


def get_headers():
    return {'User-Agent': 'WMTS Unit Tester v0.0.1', 'Referer': 'http://unittest.geo.admin.ch'}


def check_status_code(path):
    print path
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
    import urllib2
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
        resp = requests.get(base_url + '/rest/services/api/1.0.0/WMTSCapabilities.xml', params={'epsg': epsg, '_id': hash()},
                            headers=get_headers())
        root = etree.fromstring(resp.content)
        layers = root.findall('.//{http://www.opengis.net/wmts/1.0}Layer')
        for layer in layers:
            bodid = layer.find('./{http://www.opengis.net/ows/1.1}Identifier').text
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
