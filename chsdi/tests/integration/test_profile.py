# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestProfileView(TestsBase):

    def setUp(self):
        super(TestProfileView, self).setUp()
        self.headers = {'X-SearchServer-Authorized': 'true'}

    def test_profile_json_valid(self):
        resp = self.testapp.get('/rest/services/profile.json', params={'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}'}, headers=self.headers, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json[0]['dist'] == 0)
        self.failUnless(resp.json[0]['alts']['DTM25'] == 1138)
        self.failUnless(resp.json[0]['easting'] == 550050)
        self.failUnless(resp.json[0]['northing'] == 206550)

    def test_profile_no_headers(self):
        resp = self.testapp.get('/rest/services/profile.json', params={'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}'}, status=403)

    def test_profile_json_2_models(self):
        params = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', 'elevation_models': 'DTM25,DTM2'}
        resp = self.testapp.get('/rest/services/profile.json', params=params, headers=self.headers, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(resp.json[0]['dist'] == 0)
        self.failUnless(resp.json[0]['alts']['DTM25'] == 1138)
        self.failUnless(resp.json[0]['alts']['DTM2'] == 1138.9)
        self.failUnless(resp.json[0]['easting'] == 550050)
        self.failUnless(resp.json[0]['northing'] == 206550)

    def test_profile_json_with_callback_valid(self):
        params = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', 'callback': 'cb'}
        resp = self.testapp.get('/rest/services/profile.json', params=params, headers=self.headers, status=200)
        self.failUnless(resp.content_type == 'application/javascript')
        resp.mustcontain('cb([')

    def test_profile_json_missing_geom(self):
        resp = self.testapp.get('/rest/services/profile.json', headers=self.headers, status=400)
        resp.mustcontain('Missing parameter geom')

    def test_profile_json_wrong_geom(self):
        params = {'geom': 'toto'}
        resp = self.testapp.get('/rest/services/profile.json', params=params, headers=self.headers, status=400)
        resp.mustcontain('Error loading geometry in JSON string')

    def test_profile_json_nb_points(self):
        params = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', 'nb_points': '150'}
        resp = self.testapp.get('/rest/services/profile.json', params=params, headers=self.headers, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_profile_json_nb_points_wrong(self):
        params = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', 'nb_points': 'toto'}
        resp = self.testapp.get('/rest/services/profile.json', params=params, headers=self.headers, status=400)
        resp.mustcontain("Please provide a numerical value for the parameter 'NbPoints'/'nb_points'")

    def test_profile_csv_valid(self):
        params = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}'}
        resp = self.testapp.get('/rest/services/profile.csv', params=params, headers=self.headers, status=200)
        self.failUnless(resp.content_type == 'text/csv')

    def test_profile_cvs_wrong_geom(self):
        params = {'geom': 'toto'}
        resp = self.testapp.get('/rest/services/profile.csv', params=params, headers=self.headers, status=400)
        resp.mustcontain('Error loading geometry in JSON string')

    def test_profile_json_invalid_linestring(self):
        resp = self.testapp.get('/rest/services/profile.json', params={'geom': '{"type":"LineString","coordinates":[[550050,206550]]}'}, headers=self.headers, status=400)
        resp.mustcontain('Invalid Linestring syntax')
