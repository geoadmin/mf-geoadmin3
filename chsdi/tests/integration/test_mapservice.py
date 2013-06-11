# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase

class TestMapServiceView(TestsBase):

    def test_metadata_no_parameters(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer', status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_metadata_with_searchtext(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer', params={'searchText':'wasser'}, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_metadata_with_cb(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer', params={'cb':'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_identify_no_parameters(self):
        self.testapp.get('/rest/services/geoadmin/MapServer/identify', status=400)

    def test_identify_without_geometry(self):
        params = {'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter geometry')

    def test_identify_without_geometrytype(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter geometryType')

    def test_identify_without_imagedisplay(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter imageDisplay')

    def test_identify_without_mapextent(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('')

    def test_identify_without_tolerance(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter tolerance')

    def test_identify_valid(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_identify_valid_with_cb(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all', 'callback': 'cb'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'text/javascript')
        resp.mustcontain('cb({')

    def test_identify_with_searchtext(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all:ch.bafu.bundesinventare-bln', 'searchText': 'pied'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json) == 1)

    def test_identify_with_geojson(self):
        params = {'geometry': '600000,200000,631000,210000', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all:ch.bafu.bundesinventare-bln', 'geometryFormat': 'geojson'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0].has_key('properties'))
        self.failUnless(resp.json['results'][0].has_key('geometry'))

    def test_getfeature_wrong_idlayer(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/toto/362', status=400)
        resp.mustcontain('Please provide a valid layer Id')

    def test_getfeature_wrong_idfeature(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/0', status=400)
        resp.mustcontain('No feature with id')

    def test_getfeature_valid(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/362', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['feature'].has_key('attributes'))
        self.failUnless(resp.json['feature'].has_key('geometry'))
        self.failUnless(resp.json['feature']['id'] == 362)

    def test_getfeature_geojson(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/362', params={'geometryFormat': 'geojson'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['feature'].has_key('properties'))
        self.failUnless(resp.json['feature'].has_key('geometry'))
        self.failUnless(resp.json['feature']['id'] == 362)

    def test_getfeature_with_cb(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/362', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'text/javascript')
        resp.mustcontain('cb({')

    def test_gethtmlpopup_valid(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/362/htmlpopup', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<table')

    def test_gethtmlpopup_valid_with_cb(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/362/htmlpopup', params={'cb': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_getlegend_valid(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/getlegend', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<div class="legend_header">')

    def test_getlegend_valid_with_cb(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/ch.bafu.bundesinventare-bln/getlegend', params={'cb' : 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')
