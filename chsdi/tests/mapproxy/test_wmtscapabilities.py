#-*- coding: utf-8 -*-

import sys
import os
import random
from unittest import TestCase
from testconfig import config as tc


BAD_REFERER = 'http://foo.ch'

GOOD_REFERER = 'http://unittest.geo.admin.ch'

EPSGS = [21781, 4326, 4258, 2056, 3857]


TILES_IDX = {3857: [(7, 67, 45), (10, 533, 360)],
             21781: [(17, 5, 6), (18, 11, 13)],
             2056: [(17, 5, 6), (18, 11, 13)],
             4326: [(10, 6, 4), (15, 222, 123)],
             4258: [(10, 6, 4), (15, 222, 123)]
             }


class TestWmtsCapabilitiesView(TestCase):

    def setUp(self):
        try:
            self.url = "http:" + tc['vars']['mapproxy_url']
        except KeyError as e:
            self.url = os.getenv('conf_to_use', "http://api3.geo.admin.ch")

    def hash(self, bits=96):
        assert bits % 8 == 0
        return os.urandom(bits / 8).encode('hex')

    def get_headers(self):
        return {'referer': 'http://unittest.geo.admin.ch'}

    def test_axis_order(self):
        from urlparse import urlparse
        import xml.etree.ElementTree as etree

        for epsg in EPSGS:
            resp = requests.get(self.url + '/rest/services/api/1.0.0/WMTSCapabilities.xml', params={'epsg': epsg, '_id': self.hash()},
                                headers=self.get_headers())

            print resp.encoding

            root = etree.fromstring(resp.content)
            layers = root.findall('.//{http://www.opengis.net/wmts/1.0}Layer')
            for layer in layers:
                bodid = layer.find('./{http://www.opengis.net/ows/1.1}Identifier').text
                resourceurls = layer.findall('.//{http://www.opengis.net/wmts/1.0}ResourceURL')
                for resourceurl in resourceurls:
                    tpl = resourceurl.attrib['template']
                    tpl_parsed = urlparse(tpl)
                    pth = tpl_parsed.path
                    col_idx = pth.find('{TileCol}')
                    row_idx = pth.find('{TileRow}')
                    is_normal_order = col_idx < row_idx if col_idx > 0 else None
                    if epsg == 21781 and bodid != 'ch.kantone.cadastralwebmap-farbe':
                        self.assertFalse(is_normal_order)
                    else:
                        self.assertTrue(is_normal_order)


class TestWmtsGetTileAuth():

    def __init__(self):
        try:
            self.url = "http:" + tc['vars']['mapproxy_url']
        except KeyError as e:
            self.url = os.getenv('conf_to_use', "http://api3.geo.admin.ch")
        self.paths = ['/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20130903/3857/7/67/45.jpeg',
                      '/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/2056/17/5/6.jpeg',
                      '/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20130903/4258/10/6/4.jpeg',
                      '/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20120809/4326/10/6/4.jpeg']

    def hash(self, bits=96):
        assert bits % 8 == 0
        return os.urandom(bits / 8).encode('hex')

    def check_status_code(self, url, referer, code):
        headers = None
        if referer:
            headers = {'Referer': referer}
            resp = requests.get(url, params={'_id': self.hash()}, headers=headers)
        else:
            resp = requests.get(url, params={'_id': self.hash()})
        assert int(resp.status_code) == code

    def test_bad_referer_get_capabilties(self):
        self.check_status_code(self.url + '/rest/services/api/1.0.0/WMTSCapabilities.xml', BAD_REFERER, 403)

    def test_bad_referer_get_tile(self):
        for path in self.paths:
            yield self.check_status_code, self.url + path, BAD_REFERER, 403

    def test_no_referer_get_capabilties(self):
        self.check_status_code(self.url + '/rest/services/api/1.0.0/WMTSCapabilities.xml', None, 403)

    def test_no_referer_get_tile(self):
        for path in self.paths:
            yield self.check_status_code, self.url + path, None, 403

    def test_good_referer_get_capabilties(self):
        self.check_status_code(self.url + '/rest/services/api/1.0.0/WMTSCapabilities.xml', GOOD_REFERER, 200)

    def test_good_referer_get_tile(self):
        for path in self.paths:
            yield self.check_status_code, self.url + path, GOOD_REFERER, 200
