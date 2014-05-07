# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestOwsChecker(TestsBase):

    def test_bykvp_no_args(self):
        self.testapp.get('/owschecker/bykvp', status=400)

    def test_form(self):
        resp = self.testapp.get('/owschecker/form', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain("Hint: Don't use tailing")

    def test_bykvp_minimal_wms_request(self):
        base_url = 'http://wms.geo.admin.ch'
        resp = self.testapp.get('/owschecker/bykvp', params={'service': 'WMS', 'base_url': base_url}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        resp.mustcontain("Checked Service: WMS")

    def test_bykvp_minimal_wmts_request(self):
        base_url = 'http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml'
        resp = self.testapp.get('/owschecker/bykvp', params={'service': 'WMTS', 'base_url': base_url}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        resp.mustcontain("Checked Service: WMTS")

    def test_bykvp_minimal_wfs_request(self):
        base_url = 'http://wfs.geo.admin.ch'
        resp = self.testapp.get('/owschecker/bykvp', params={'service': 'WFS', 'base_url': base_url}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        resp.mustcontain("Checked Service: WFS")
