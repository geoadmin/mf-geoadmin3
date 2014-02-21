# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestMapServiceView(TestsBase):

    def test_metadata_no_parameters(self):
        resp = self.testapp.get('/rest/services/blw/MapServer', status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_metadata_no_parameters_topic_all(self):
        resp = self.testapp.get('/rest/services/all/MapServer', status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_metadata_with_searchtext(self):
        resp = self.testapp.get('/rest/services/blw/MapServer', params={'searchText': 'wasser'}, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_metadata_with_callback(self):
        resp = self.testapp.get('/rest/services/blw/MapServer', params={'callback': 'cb'}, status=200)
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

    def test_identify_valid_topic_all(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_identify_valid_with_callback(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all', 'callback': 'cb'}
        resp = self.testapp.get('/rest/services/all/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'text/javascript')
        resp.mustcontain('cb({')

    def test_identify_with_geojson(self):
        params = {'geometry': '600000,200000,631000,210000', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all:ch.bafu.bundesinventare-bln', 'geometryFormat': 'geojson'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('properties' in resp.json['results'][0])
        self.failUnless('geometry' in resp.json['results'][0])

    def test_identify_with_geojson_returned_geometry(self):
        params = {'geometry': '600000,200000,631000,210000', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all:ch.swisstopo.lubis-luftbilder_farbe', 'geometryFormat': 'geojson'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['geometry']['type'] == 'Polygon')

    def test_identify_no_geom(self):
        params = {'geometry': '630000,245000,645000,265000', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '545132,147068,550132,150568', 'tolerance': '1', 'layers': 'all', 'returnGeometry': 'false'}
        resp = self.testapp.get('/rest/services/ech/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(('geometry' not in resp.json['results'][0]))
        self.failUnless(('geometryType' not in resp.json['results'][0]))

    def test_identify_timeinstant(self):
        params = {'geometryType': 'esriGeometryPoint', 'geometry': '630853.809670509,170647.93120352627', 'geometryFormat': 'geojson', 'imageDisplay': '1920,734,96', 'mapExtent': '134253,-21102,1382253,455997', 'tolerance': '5', 'layers': 'all:ch.swisstopo.zeitreihen', 'timeInstant': '1936'}
        resp = self.testapp.get('/rest/services/all/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_identify_wrong_timeinstant(self):
        params = {'geometryType': 'esriGeometryPoint', 'geometry': '630853.809670509,170647.93120352627', 'geometryFormat': 'geojson', 'imageDisplay': '1920,734,96', 'mapExtent': '134253,-21102,1382253,455997', 'tolerance': '5', 'layers': 'all:ch.swisstopo.zeitreihen', 'timeInstant': '19366'}
        resp = self.testapp.get('/rest/services/all/MapServer/identify', params=params, status=400)

    def test_identify_timeinstant_wrong_layer(self):
        params = {'geometryType': 'esriGeometryPoint', 'geometry': '630853.809670509,170647.93120352627', 'geometryFormat': 'geojson', 'imageDisplay': '1920,734,96', 'mapExtent': '134253,-21102,1382253,455997', 'tolerance': '5', 'layers': 'all:ch.bafu.bundesinventare-bln', 'timeInstant': '1936'}
        resp = self.testapp.get('/rest/services/all/MapServer/identify', params=params, status=400)

    def test_identify_oereb(self):
        params = {'geometry': '618953,170093', 'geometryType': 'esriGeometryPoint', 'imageDisplay': '1920,576,96', 'layers': 'all:ch.bav.kataster-belasteter-standorte-oev.oereb', 'mapExtent': '671164.31244,253770,690364.31244,259530', 'tolerance': '5', 'geometryFormat': 'interlis'}
        resp = self.testapp.get('/rest/services/all/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'text/xml')

    def test_identify_oereb_several_layers(self):
        params = {'geometry': '618953,170093', 'geometryType': 'esriGeometryPoint', 'imageDisplay': '1920,576,96', 'layers': 'all:    ch.bav.kataster-belasteter-standorte-oev.oereb,ch.bazl.sicherheitszonenplan.oereb', 'mapExtent': '671164.31244,253770,690364.31244,259530', 'tolerance': '5', 'geometryFormat': 'interlis'}
        resp = self.testapp.get('/rest/services/all/MapServer/identify', params=params, status=400)

    def test_find(self):
        params = {'layer': 'ch.bfs.gebaeude_wohnungs_register', 'searchField': 'egid', 'searchText': '1231641'}
        resp = self.testapp.get('/rest/services/all/MapServer/find', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 1)

    def test_find_geojson(self):
        params = {'layer': 'ch.bfs.gebaeude_wohnungs_register', 'searchField': 'egid', 'searchText': '1231641', 'geometryFormat': 'geojson'}
        resp = self.testapp.get('/rest/services/all/MapServer/find', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_find_withcb(self):
        params = {'layer': 'ch.bfs.gebaeude_wohnungs_register', 'searchField': 'egid', 'searchText': '1231641', 'callback': 'cb'}
        resp = self.testapp.get('/rest/services/all/MapServer/find', params=params, status=200)
        self.failUnless(resp.content_type == 'text/javascript')

    def test_find_nogeom(self):
        params = {'layer': 'ch.are.bauzonen', 'searchField': 'bfs_no', 'searchText': '4262', 'returnGeometry': 'false'}
        resp = self.testapp.get('/rest/services/all/MapServer/find', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_find_wrong_searchfield(self):
        params = {'layer': 'ch.are.bauzonen', 'searchField': 'toto', 'searchText': '4262', 'returnGeometry': 'false'}
        resp = self.testapp.get('/rest/services/all/MapServer/find', params=params, status=400)

    def test_find_nosearchtext(self):
        params = {'layer': 'ch.are.bauzonen', 'searchField': 'toto', 'returnGeometry': 'false'}
        resp = self.testapp.get('/rest/services/all/MapServer/find', params=params, status=400)

    def test_feature_wrong_idlayer(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/toto/362', status=400)
        resp.mustcontain('No Vector Table was found for')

    def test_feature_wrong_idfeature(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/0', status=404)
        resp.mustcontain('No feature with id')

    def test_feature_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('attributes' in resp.json['feature'])
        self.failUnless('geometry' in resp.json['feature'])
        self.failUnless(resp.json['feature']['id'] == 362)

    def test_feature_valid_topic_all(self):
        resp = self.testapp.get('/rest/services/all/MapServer/ch.bafu.bundesinventare-bln/362', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('attributes' in resp.json['feature'])
        self.failUnless('geometry' in resp.json['feature'])
        self.failUnless(resp.json['feature']['id'] == 362)

    def test_feature_geojson(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362', params={'geometryFormat': 'geojson'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('properties' in resp.json['feature'])
        self.failUnless('geometry' in resp.json['feature'])
        self.failUnless(resp.json['feature']['id'] == 362)

    def test_feature_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'text/javascript')
        resp.mustcontain('cb({')

    def test_htmlpopup_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362/htmlPopup', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<table')

    def test_htmlpopup_cadastralwebmap(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.kantone.cadastralwebmap-farbe/14/htmlPopup', params={'mapExtent': '485412.34375,109644.67,512974.44,135580.01999999999', 'imageDisplay': '600,400,96'}, status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<table')

    def test_htmlpopup_valid_topic_all(self):
        resp = self.testapp.get('/rest/services/all/MapServer/ch.bafu.bundesinventare-bln/362/htmlPopup', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<table')

    def test_htmlpopup_valid_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362/htmlPopup', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_htmlpopup_missing_feature(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/1/htmlPopup', status=404)

    def test_extendedhtmlpopup_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bakom.radio-fernsehsender/11/extendedHtmlPopup', status=200)
        self.failUnless(resp.content_type == 'text/html')

    def test_extendedhtmlpopup_valid_langs(self):
        for lang in ('de', 'fr', 'it', 'rm', 'en'):
            resp = self.testapp.get('/rest/services/ech/MapServer/ch.babs.kulturgueter/6967/extendedHtmlPopup', params={'lang': lang}, status=200)
            self.failUnless(resp.content_type == 'text/html')

    def test_extendedhtmlpopup_valid_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bakom.radio-fernsehsender/12/extendedHtmlPopup', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_extendedhtmlpopup_noinfo(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/362/extendedHtmlPopup', status=404)

    def test_legend_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/legend', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<div class="legend-header">')

    def test_legend_valid_all(self):
        resp = self.testapp.get('/rest/services/all/MapServer/ch.bafu.bundesinventare-bln/legend', status=200)
        self.failUnless(resp.content_type == 'text/html')
        resp.mustcontain('<div class="legend-header">')

    def test_legend_wrong_layer_id(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/dummylayer/legend', status=404)

    def test_legend_valid_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/ch.bafu.bundesinventare-bln/legend', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_all_legends(self):
        import os
        legendsPath = os.getcwd() + '/chsdi/static/images/legends/'
        legendNames = os.listdir(legendsPath)
        parseLegendNames = lambda x: x[:-7] if 'big' not in x else x[:-11]
        layers = list(set(map(parseLegendNames, legendNames)))
        for layer in layers:
            for lang in ('de', 'fr', 'it', 'rm', 'en'):
                resp = self.testapp.get('/rest/services/all/MapServer/%s/legend' %layer, params={'callback': 'cb', 'lang': '%s' %lang}, status=200)

    def test_layersconfig_valid(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/layersConfig', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('ch.swisstopo.pixelkarte-farbe' in resp.json)
        self.failUnless('attribution' in resp.json['ch.swisstopo.pixelkarte-farbe'])
        self.failUnless('label' in resp.json['ch.swisstopo.pixelkarte-farbe'])
        self.failUnless('background' in resp.json['ch.swisstopo.pixelkarte-farbe'])

    def test_layersconfig_valid_topic_all(self):
        resp = self.testapp.get('/rest/services/all/MapServer/layersConfig', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('ch.swisstopo.pixelkarte-farbe' in resp.json)
        self.failUnless('attribution' in resp.json['ch.swisstopo.pixelkarte-farbe'])
        self.failUnless('label' in resp.json['ch.swisstopo.pixelkarte-farbe'])
        self.failUnless('background' in resp.json['ch.swisstopo.pixelkarte-farbe'])

    def test_layersconfig_with_callback(self):
        resp = self.testapp.get('/rest/services/ech/MapServer/layersConfig', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_layersconfig_wrong_map(self):
        resp = self.testapp.get('/rest/services/foo/MapServer/layersConfig', status=400)
