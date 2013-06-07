# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase
from pyramid import testing

class TestGeoCodeServiceView(TestsBase):

    def test_index_no_parameters(self):
        resp = self.testapp.get('/rest/services/GeocodeServer', status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_find_address_wrong_and_missing_parameters(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates', status=400)
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?somestupid=hoho', status=400)

    def test_find_all_parameters(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?all=maisonnex', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 5)
        self.failUnless(resp.json['results'][0].has_key('name'))
        self.failUnless(resp.json['results'][0]['name'] == 'Maisonnex-dessus')
        self.failUnless(resp.json['results'][0].has_key('id'))
        self.failUnless(resp.json['results'][0]['id'] == 213649)

    def test_find_all_with_lang_parameters(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?lang=fr&&all=maisonnex', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 5)

    def test_find_postcode_parameters(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?all=1290', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 20)

    def test_find_address_general(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?all=dorfstr', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 20)
        self.failUnless(resp.json['results'][0].has_key('service'))
        self.failUnless(resp.json['results'][0]['service'] == 'swissnames')
        self.failUnless(resp.json['results'][3].has_key('service'))
        self.failUnless(resp.json['results'][3]['service'] == 'address')


    def test_find_egid(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?egid=30000000', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 0)
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?egid=867194', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 1)

    def test_find_swissnames(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?swissnames=Beau', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 20)

    def test_find_address(self):
        resp = self.testapp.get('/rest/services/GeocodeServer/findaddresscandidates?address=Beaulieustr', status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json['results']) == 20)
