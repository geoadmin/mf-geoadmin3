# -*- coding: utf-8 -*-

import unittest

from pyramid import testing

from chsdi.lib.helpers import make_agnostic, make_api_url, check_url, transformCoordinate


class Test_Helpers(unittest.TestCase):

    def test_make_agnostic(self):
        url = 'http://foo.com'
        agnostic_link = make_agnostic(url)
        self.failUnless(not agnostic_link.startswith('http://'))
        self.failUnless(agnostic_link.startswith('//'))

        url_2 = 'https://foo.com'
        agnostic_link_2 = make_agnostic(url_2)
        self.failUnless(not agnostic_link_2.startswith('https://'))
        self.failUnless(agnostic_link_2.startswith('//'))

        url_3 = '//foo.com'
        agnostic_link_3 = make_agnostic(url_3)
        self.assertEqual(url_3, agnostic_link_3)

    def test_make_api_url(self):
        request = testing.DummyRequest()
        request.host = 'api3.geo.admin.ch'
        request.scheme = 'http'
        request.registry.settings = {}
        request.registry.settings['apache_base_path'] = 'main'
        api_url = make_api_url(request, agnostic=True)
        self.failUnless(not api_url.startswith('http://'))
        self.failUnless(api_url.startswith('//'))
        self.assertEqual(api_url, '//api3.geo.admin.ch')

        request.scheme = 'https'
        api_url = make_api_url(request)
        self.assertEqual(api_url, 'https://api3.geo.admin.ch')

        request.host = 'localhost:9000'
        request.scheme = 'http'
        api_url = make_api_url(request)
        self.assertEqual(api_url, api_url)

    def test_check_url(self):
        from pyramid.httpexceptions import HTTPBadRequest
        url = None
        try:
            check_url(url)
        except Exception as e:
            self.failUnless(isinstance(e, HTTPBadRequest))

        url = 'dummy'
        try:
            check_url(url)
        except Exception as e:
            self.failUnless(isinstance(e, HTTPBadRequest))

        url = 'http://dummy.com'
        try:
            check_url(url)
        except Exception as e:
            self.failUnless(isinstance(e, HTTPBadRequest))

        url = 'http://admin.ch'
        self.assertEqual(url, check_url(url))

    def test_transformCoordinate(self):
        from osgeo.ogr import Geometry
        wkt = 'POINT (7.37840 45.91616)'
        srid_from = 4326
        srid_to = 21781
        wkt_21781 = transformCoordinate(wkt, srid_from, srid_to)
        self.failUnless(isinstance(wkt_21781, Geometry))
        self.assertEqual(int(wkt_21781.GetX()), 595324)
        self.assertEqual(int(wkt_21781.GetY()), 84952)
