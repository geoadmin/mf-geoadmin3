# -*- coding: utf-8 -*-

import os
from unittest import TestCase
from pyramid import testing
from webtest import TestApp
from mapproxy.wsgiapp import make_wsgi_app

from owslib.wmts import WebMapTileService


current = os.path.dirname(__file__)
config_uri = current.replace('chsdi/tests/integration', 'mapproxy/mapproxy.yaml')

app = make_wsgi_app(config_uri)


class TestsBase(TestCase):

    def setUp(self):
        self.testapp = TestApp(app)

    def tearDown(self):
        testing.tearDown()
        del self.testapp


class TestMapproxy(TestsBase):

    def test_wms_capabilities(self):
        resp = self.testapp.get('/service?REQUEST=GetCapabilities', status=200)

        self.failUnless(resp.content_type == 'application/vnd.ogc.wms_xml')
        self.failUnless('WMT_MS_Capabilities' in resp.body)

    def test_wmts_capabilities(self):
        resp = self.testapp.get('/wmts/1.0.0/WMTSCapabilities.xml', status=200)
        self.failUnless(resp.content_type == 'application/xml')
        self.failUnless('wmtsGetCapabilities_response.xsd' in resp.body)
