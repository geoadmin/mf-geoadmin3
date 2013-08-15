# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase

class TestMapServiceView(TestsBase):

    def test_metadata_no_parameters(self):
        resp = self.testapp.get('/rest/services/blw/MapServer', status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_metadata_with_searchtext(self):
        resp = self.testapp.get('/rest/services/blw/MapServer', params={'searchText':'wasser'}, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_metadata_with_callback(self):
        resp = self.testapp.get('/rest/services/blw/MapServer', params={'callback':'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_identify_no_parameters(self):
        self.testapp.get('/rest/services/ech/MapServer/identify', status=400)

    def test_identify_without_geometry(self):
        params = {'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter geometry')

    def test_identify_without_geometrytype(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter geometryType')

    def test_identify_without_imagedisplay(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter imageDisplay')

    def test_identify_without_mapextent(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=400)
        resp.mustcontain('')

    def test_identify_without_tolerance(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter tolerance')

    def test_identify_valid(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_identify_valid_with_callback(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all', 'callback': 'cb'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'text/javascript')
        resp.mustcontain('cb({')

    def test_identify_with_searchtext(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all:ch.bafu.bundesinventare-bln', 'searchText': 'pied'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json) == 1)

    def test_identify_with_geojson(self):
        params = {'geometry': '600000,200000,631000,210000', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all:ch.bafu.bundesinventare-bln', 'geometryFormat': 'geojson'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0].has_key('properties'))
        self.failUnless(resp.json['results'][0].has_key('geometry'))

    def test_identify_no_geom(self):
        params = {'geometry': '630000,245000,645000,265000', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '545132,147068,550132,150568', 'tolerance': '1', 'layers': 'all', 'returnGeometry': 'false'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0].has_key('geometry') != True)
        self.failUnless(resp.json['results'][0].has_key('geometryType') != True)

    def test_getfeature_wrong_idlayer(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/toto/362', status=400)
        resp.mustcontain('Please provide a valid layer Id')

    def test_getfeature_wrong_idfeature(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/0', status=400)
        resp.mustcontain('No feature with id')

    def test_getfeature_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['feature'].has_key('attributes'))
        self.failUnless(resp.json['feature'].has_key('geometry'))
        self.failUnless(resp.json['feature']['id'] == 362)

    def test_getfeature_geojson(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362', params={'geometryFormat': 'geojson'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['feature'].has_key('properties'))
        self.failUnless(resp.json['feature'].has_key('geometry'))
        self.failUnless(resp.json['feature']['id'] == 362)

    def test_getfeature_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'text/javascript')
        resp.mustcontain('cb({')

    def test_gethtmlpopup_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362/htmlpopup', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<table')

    def test_gethtmlpopup_valid_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362/htmlpopup', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_getlegend_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/getlegend', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<div class="legend_header">')

    def test_getlegend_valid_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/getlegend', params={'callback' : 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_layersconfig_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/layersconfig', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['layers'].has_key('ch.swisstopo.pixelkarte-farbe'))
        self.failUnless(resp.json['layers']['ch.swisstopo.pixelkarte-farbe'].has_key('attribution'))
        self.failUnless(resp.json['layers']['ch.swisstopo.pixelkarte-farbe'].has_key('label'))
        self.failUnless(resp.json['layers']['ch.swisstopo.pixelkarte-farbe'].has_key('timestamps'))
        self.failUnless(resp.json['layers']['ch.swisstopo.pixelkarte-farbe'].has_key('background'))

    def test_layersconfig_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/layersconfig', params={'callback':'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_layersconfig_wrong_map(self):
        resp = self.testapp.get('/rest/services/foo/MapServer/layersconfig', status=400)
