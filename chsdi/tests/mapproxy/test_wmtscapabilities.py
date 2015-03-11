#-*- coding: utf-8 -*-

import sys
import os
import random
from unittest import TestCase

import requests


BAD_REFERER = 'http://foo.ch'

GOOD_REFERER = 'http://unittest.geo.admin.ch'

EPSGS = [21781, 4326, 4258, 2056, 3857]


TILES_IDX = {3857: [(7, 67, 45), (10, 533, 360)],
             21781: [(17, 5, 6), (18, 11, 13)],
             2056: [(17, 5, 6), (18, 11, 13)],
             4326: [(10, 6, 4), (15, 222, 123)],
             4258: [(10, 6, 4), (15, 222, 123)]
             }


class TestWmtsGetTileAuth():

    def __init__(self):
        from pyramid.paster import get_app
        self.app = get_app('development.ini')
        try:
            os.environ["http_proxy"] = self.app.registry.settings['http_proxy']
            apache_base_path = self.app.registry.settings['apache_base_path']
            self.mapproxy_url = "http://" + self.app.registry.settings['mapproxyhost'] + '/' + apache_base_path if apache_base_path != '/' else ''
        except KeyError as e:
            raise Exception

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
        self.check_status_code(self.mapproxy_url + '/1.0.0/WMTSCapabilities.xml', BAD_REFERER, 403)

    def test_bad_referer_get_tile(self):
        for path in self.paths:
            yield self.check_status_code, self.mapproxy_url + path, BAD_REFERER, 403

    def test_no_referer_get_capabilties(self):
        self.check_status_code(self.mapproxy_url + '/1.0.0/WMTSCapabilities.xml', None, 403)

    def test_no_referer_get_tile(self):
        for path in self.paths:
            yield self.check_status_code, self.mapproxy_url + path, None, 403

    def test_good_referer_get_capabilties(self):
        self.check_status_code(self.mapproxy_url + '/1.0.0/WMTSCapabilities.xml', GOOD_REFERER, 200)

    def test_good_referer_get_tile(self):
        for path in self.paths:
            yield self.check_status_code, self.mapproxy_url + path, GOOD_REFERER, 200
