# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase

class TestCatalogService(TestsBase):

    def test_catalog_no_params(self):
        resp = self.testapp.get('/rest/services/blw/CatalogServer', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'].has_key('root'))
        self.failUnless(resp.json['results']['root'].has_key('children'))
        self.failUnless(resp.json['results']['root'].has_key('selectedOpen'))
        self.failUnless(resp.json['results']['root'].has_key('category'))

    def test_catalog_with_callback(self):
        resp = self.testapp.get('/rest/services/blw/CatalogServer', params={'callback':'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_catalog_wrong_map(self):
        self.testapp.get('/rest/services/foo/MapServer/identify', status=400)
