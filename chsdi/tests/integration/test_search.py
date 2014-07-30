# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestSearchServiceView(TestsBase):

    def test_no_type(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'ga'}, status=400)

    def test_search_layers(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'wand', 'type': 'layers'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['lang'] == 'de')

    def test_search_layers_with_cb(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'wand', 'type': 'layers', 'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_search_layers_all_langs(self):
        langs = ('de', 'fr', 'it', 'en', 'rm')
        for lang in langs:
            resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'wand', 'type': 'layers', 'lang': lang}, status=200)
            self.failUnless(resp.content_type == 'application/json')
            self.failUnless(resp.json['results'][0]['attrs']['lang'] == lang)

    def test_search_layers_for_one_layer(self):
        resp = self.testapp.get('/rest/services/blw/SearchServer', params={'searchText': 'ch.blw.klimaeignung-spezialkulturen', 'type': 'layers'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 1)

    def test_search_layers_accents(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': '*%+&/()=?!üäöéà$@i£$', 'type': 'layers'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 0)

    def test_search_locations(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'rue des berges', 'type': 'locations', 'bbox': '551306.5625,167918.328125,551754.125,168514.625'}, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_search_loactions_with_cb(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'rue des berges', 'type': 'locations', 'bbox': '551306.5625,167918.328125,551754.125,168514.625', 'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_search_locations_all_langs(self):
        # even if not lang dependent
        langs = ('de', 'fr', 'it', 'en', 'rm')
        for lang in langs:
            resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'mont d\'or', 'type': 'locations', 'bbox': '551306.5625,167918.328125,551754.125,168514.625', 'lang': lang}, status=200)
            self.failUnless(resp.content_type == 'application/json')

    def test_search_locations_prefix_sentence_match(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'lausann', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['detail'] == 'lausanne vd')
        self.failUnless(resp.json['results'][0]['attrs']['origin'] == 'gg25')

    def test_search_locations_wrong_topic(self):
        resp = self.testapp.get('/rest/services/toto/SearchServer', params={'searchText': 'vd 446', 'type': 'locations', 'bbox': '551306.5625,167918.328125,551754.125,168514.625'}, status=400)

    def test_search_locations_lausanne(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'lausanne', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['detail'] == 'lausanne vd')

    def test_search_locations_wil(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'wil', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['detail'][:3] == 'wil')

    def test_search_locations_fontenay(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'fontenay 10 lausanne', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['detail'] == 'chemin de fontenay 10 1007 lausanne 5586 lausanne ch vd')

    def test_search_locations_wilenstrasse_wil(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'wilenstrasse wil', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('wilenstrasse' in resp.json['results'][0]['attrs']['detail'])
        self.failUnless('wil' in resp.json['results'][0]['attrs']['detail'])

    def test_search_location_max_address(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'seftigenstrasse', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) <= 20)

    def test_search_locations_no_geometry(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'seftigenstrasse 264', 'type': 'locations', 'returnGeometry': 'false'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('geom_st_box2d' not in resp.json['results'][0]['attrs'].keys())

    def test_locations_searchtext_apostrophe(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'av mont d\'or lausanne', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['detail'] == 'avenue du mont-d\'or 1 1007 lausanne 5586 lausanne ch vd')
        self.failUnless(resp.json['results'][0]['attrs']['num'] == 1)

    def test_address_order(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'isabelle de montolieu', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['detail'] == 'chemin isabelle-de-montolieu 1 1010 lausanne 5586 lausanne ch vd')
        self.failUnless(resp.json['results'][0]['attrs']['num'] == 1)

    def test_search_address_with_letters(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'Rhonesand 16', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][1]['attrs']['detail'] == 'rhonesandstrasse 16a 3900 brig 6002 brig-glis ch vs')

    def test_search_features(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'vd 446', 'type': 'featuresearch', 'bbox': '551306.5625,167918.328125,551754.125,168514.625', 'features': 'ch.astra.ivs-reg_loc'}, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_search_features(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': '4331', 'type': 'featuresearch', 'features': 'ch.bafu.hydrologie-gewaesserzustandsmessstationen'}, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_search_locations_not_authorized(self):
        self.testapp.extra_environ = {'HTTP_X_SEARCHSERVER_AUTHORIZED': 'false'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'Beaulieustrasse 2', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('geom_st_box2d' not in resp.json['results'][0]['attrs'].keys())

    def test_search_locations_escape_charachters(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': 'Biel/Bienne', 'type': 'locations'}, status=200)
        self.failUnless(len(resp.json['results']) > 0)

    def test_search_locations_authorized(self):
        self.testapp.extra_environ = {'HTTP_X_SEARCHSERVER_AUTHORIZED': 'true'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'Beaulieustrasse 2', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('geom_st_box2d' in resp.json['results'][0]['attrs'].keys())

    def test_search_locations_authorizedi_not_set(self):
        self.testapp.extra_environ = {}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'Beaulieustrasse 2', 'type': 'locations'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('geom_st_box2d' in resp.json['results'][0]['attrs'].keys())

    def test_search_locations_authorized_no_geometry(self):
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params={'searchText': 'Beaulieustrasse 2', 'type': 'locations', 'returnGeometry': 'false'}, headers=dict(HTTP_X_SEARCHSERVER_AUTHORIZED='true'), status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless('geom_st_box2d' not in resp.json['results'][0]['attrs'].keys())

    def test_search_locations_one_origin(self):
        params = {'searchText': 'vaud', 'type': 'locations', 'origins': 'gg25'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params=params, status=200)
        self.failUnless(len(resp.json['results']) == 1)

    def test_search_locations_several_origins(self):
        params = {'searchText': 'vaud', 'type': 'locations', 'origins': 'district,gg25'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params=params, status=200)
        self.failUnless(len(resp.json['results']) == 3)

    def test_search_locations_bad_origin(self):
        params = {'searchText': 'vaud', 'type': 'locations', 'origins': 'dummy'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params=params, status=400)

    def test_search_locations_prefix_parcel(self):
        params = {'searchText': 'parcel val', 'type': 'locations'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params=params, status=200)
        self.failUnless(resp.json['results'][0]['attrs']['origin'] == 'parcel')

    def test_search_locations_with_bbox(self):
        params = {'type': 'locations', 'searchText': 'buechli tegerfelden', 'bbox': '664100,268443,664150,268643'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params=params, status=200)
        self.failUnless(resp.json['results'][0]['attrs']['detail'] == 'buechli  5306 tegerfelden 4320 tegerfelden ch ag')
        self.failUnless(len(resp.json['results']) == 1)

    def test_search_locations_bbox_only(self):
        params = {'type': 'locations', 'bbox': '664126,268543,664126,268543'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) > 1)

    def test_search_locations_noparams(self):
        params = {'type': 'locations'}
        resp = self.testapp.get('/rest/services/inspire/SearchServer', params=params, status=400)

    def test_features_bbox(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'features': 'ch.astra.ivs-reg_loc', 'type': 'featureidentify', 'bbox': '551306.5625,167918.328125,551754.125,168514.625'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['origin'] == 'feature')
        self.failUnless(resp.json['results'][0]['attrs']['feature_id'] == '43543')

    def test_features_time(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': '19810590048970', 'features': 'ch.swisstopo.lubis-luftbilder_farbe', 'type': 'featuresearch', 'bbox': '542199,206799,542201,206801', 'timeInstant': '1981'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['origin'] == 'feature')

    def test_features_timeInterval(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': '1993034 1990-2010', 'features': 'ch.swisstopo.fixpunkte-lfp1,ch.swisstopo.lubis-luftbilder_schwarzweiss,ch.swisstopo.lubis-luftbilder_farbe', 'timeEnabled': 'false,true,true', 'type': 'featuresearch'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['origin'] == 'feature')

    def test_features_timeInterval_only(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': '1990-2010', 'features': 'ch.swisstopo.fixpunkte-lfp1,ch.swisstopo.lubis-luftbilder_schwarzweiss,ch.swisstopo.lubis-luftbilder_farbe', 'timeEnabled': 'false,true,true', 'type': 'featuresearch'}, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json['results'][0]['attrs']['origin'] == 'feature')

    def test_features_wrong_time(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': '19810590048970', 'features': 'ch.swisstopo.lubis-luftbilder_farbe', 'type': 'featuresearch', 'bbox': '542200,206800,542200,206800', 'timeInstant': '19522'}, status=400)

    def test_features_wrong_time_2(self):
        resp = self.testapp.get('/rest/services/ech/SearchServer', params={'searchText': '19810590048970', 'features': 'ch.swisstopo.lubis-luftbilder_farbe', 'type': 'featuresearch', 'bbox': '542200,206800,542200,206800', 'timeInstant': '1952.00'}, status=400)

    def test_featuressearch_geodist(self):
        resp = self.testapp.get('/rest/services/all/SearchServer', params={'features': 'ch.babs.kulturgueter', 'type': 'featureidentify', 'bbox': '688290,166864,688309,166884'})
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 1)
        self.failUnless(resp.json['results'][0]['attrs']['origin'] == 'feature')
        self.failUnless(resp.json['results'][0]['attrs']['detail'] == 'general-suworow-denkmal')
