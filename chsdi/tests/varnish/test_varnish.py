# -*- coding: utf-8 -*-

import os
import random
import requests
from chsdi.tests.integration import TestsBase


class TestVarnish(TestsBase):

    ''' Testing the Varnish 'security' configuration. As some settings are IP address dependant,
        we use an external HTTP Proxy to make the queries.
    '''

    def hash(self, bits=96):
        assert bits % 8 == 0
        return os.urandom(bits / 8).encode('hex')

    def timestamp(self):
        return random.randrange(20140101, 20141001)

    def setUp(self):
        super(TestVarnish, self).setUp()
        self.registry = self.testapp.app.registry

        try:
            os.environ["http_proxy"] = self.registry.settings['http_proxy']
            self.api_url = "http:" + self.registry.settings['api_url']
            apache_base_path = self.registry.settings['apache_base_path']
            self.mapproxy_url = "http://" + self.registry.settings['mapproxyhost'] + ('/' + apache_base_path if apache_base_path != 'main' else '')
        except KeyError as e:
            raise e

    def tearDown(self):
        if "http_proxy" in os.environ:
            del os.environ["http_proxy"]
        super(TestVarnish, self).tearDown()

    def has_geometric_attributes(self, attrs):
        geometric_attrs = ['x', 'y', 'lon', 'lat', 'geom_st_box2d']
        return len(set(geometric_attrs).intersection(attrs)) > 0


class TestHeight(TestVarnish):

    def test_height_no_referer(self):

        payload = {'easting': 600000.0, 'northing': 200000.0, '_id': self.hash()}
        resp = requests.get(self.api_url + '/rest/services/height', params=payload)

        self.failUnless(resp.status_code == 403)

    def test_height_good_referer(self):

        payload = {'easting': 600000.0, 'northing': 200000.0, '_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}
        resp = requests.get(self.api_url + '/rest/services/height', params=payload, headers=headers)

        self.failUnless(resp.status_code == 200)


class TestProfile(TestVarnish):

    def test_profile_json_no_referer(self):

        payload = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', '_id': self.hash()}
        resp = requests.get(self.api_url + '/rest/services/profile.json', params=payload)

        self.failUnless(resp.status_code == 403)

    def test_profile_json_good_referer(self):

        payload = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', '_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}
        resp = requests.get(self.api_url + '/rest/services/profile.json', params=payload, headers=headers)

        self.failUnless(resp.status_code == 200)

    def test_profile_csv_no_referer(self):

        payload = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', '_id': self.hash()}
        resp = requests.get(self.api_url + '/rest/services/profile.csv', params=payload)

        self.failUnless(resp.status_code == 403)

    def test_profile_csv_good_referer(self):

        payload = {'geom': '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}', '_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}
        resp = requests.get(self.api_url + '/rest/services/profile.csv', params=payload, headers=headers)

        self.failUnless(resp.status_code == 200)


class TestLocation(TestVarnish):

    def test_locations_no_referer(self):

        payload = {'type': 'locations', 'searchText': 'fontenay 10 lausanne', '_id': self.hash()}
        r = requests.get(self.api_url + '/rest/services/api/SearchServer', params=payload)

        returned_attrs = r.json()['results'][0]['attrs'].keys()

        self.failUnless('geom_st_box2d' not in r.json()['results'][0]['attrs'])
        self.failUnless(self.has_geometric_attributes(returned_attrs) is False)

    def test_locations_good_referer(self):

        payload = {'type': 'locations', 'searchText': 'fontenay 10 lausanne', '_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}

        r = requests.get(self.api_url + '/rest/services/api/SearchServer', params=payload, headers=headers)

        returned_attrs = r.json()['results'][0]['attrs'].keys()

        self.failUnless('geom_st_box2d' in r.json()['results'][0]['attrs'])
        self.failUnless(self.has_geometric_attributes(returned_attrs) is True)

    def test_location_cached_no_referer(self):

        payload = {'type': 'locations', 'searchText': 'fontenay 10 lausanne'}
        r = requests.get(self.api_url + '/%d/rest/services/api/SearchServer' % self.timestamp(), params=payload)

        returned_attrs = r.json()['results'][0]['attrs'].keys()

        self.failUnless('geom_st_box2d' not in r.json()['results'][0]['attrs'])
        self.failUnless(self.has_geometric_attributes(returned_attrs) is False)

    def test_location_cached_good_referer(self):

        payload = {'type': 'locations', 'searchText': 'fontenay 10 lausanne'}
        headers = {'referer': 'http://unittest.geo.admin.ch'}

        r = requests.get(self.api_url + '/%d/rest/services/api/SearchServer' % self.timestamp(), params=payload, headers=headers)

        returned_attrs = r.json()['results'][0]['attrs'].keys()

        self.failUnless('geom_st_box2d' in r.json()['results'][0]['attrs'])
        self.failUnless(self.has_geometric_attributes(returned_attrs) is True)


class TestGebaeude(TestVarnish):

    ''' Results with layer 'ch.bfs.gebaeude_wohnungs_register' should never return a geometry
        for invalid referers

        See https://github.com/geoadmin/mf-chsdi3/issues/886
    '''

    def test_gebaude_no_referer(self):

        payload = {'_id': self.hash()}
        r = requests.get(self.api_url + '/rest/services/ech/MapServer/ch.bfs.gebaeude_wohnungs_register/490830_0', params=payload)

        self.failUnless('geometry' not in r.json()['feature'].keys())

    def test_find_gebaude_no_referer(self):

        payload = {'layer': 'ch.bfs.gebaeude_wohnungs_register', 'searchText': 'berges', 'searchField': 'strname1', '_id': self.hash()}
        r = requests.get(self.api_url + '/rest/services/ech/MapServer/find', params=payload)

        self.assertTrue('geometry' not in r.json()['results'][0].keys())

    def test_gebaude_good_referer(self):

        payload = {'type': 'location', 'searchText': 'dorf', '_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}

        r = requests.get(self.api_url + '/rest/services/ech/MapServer/ch.bfs.gebaeude_wohnungs_register/490830_0', params=payload, headers=headers)

        self.failUnless('geometry' in r.json()['feature'].keys())

    def test_find_gebaude_good_referer(self):

        payload = {'layer': 'ch.bfs.gebaeude_wohnungs_register', 'searchText': 'berges', 'searchField': 'strname1', '_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}
        r = requests.get(self.api_url + '/rest/services/ech/MapServer/find', params=payload, headers=headers)

        self.assertTrue('geometry' in r.json()['results'][0].keys())


class TestMapproxyGetTile(TestVarnish):

    ''' See https://github.com/geoadmin/mf-chsdi3/issues/873
    '''

    def test_mapproxy_no_referer(self):

        payload = {'_id': self.hash()}

        resp = requests.get(self.mapproxy_url + '/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20111206/3857/13/4265/2883.jpeg', params=payload)

        self.failUnless(resp.status_code == 403)

    def test_mapproxy_bad_referer(self):

        payload = {'_id': self.hash()}
        headers = {'referer': 'http://gooffy-referer.ch'}

        resp = requests.get(self.mapproxy_url + '/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20111206/3857/13/4265/2883.jpeg', params=payload, headers=headers)

        self.failUnless(resp.status_code == 403)

    def test_mapproxy_good_referer(self):

        payload = {'_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}

        resp = requests.get(self.mapproxy_url + '/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20111206/3857/13/4265/2883.jpeg', params=payload, headers=headers)

        self.failUnless(resp.status_code == 200)


class TestOgcproxy(TestVarnish):

    ''' See https://github.com/geoadmin/mf-chsdi3/issues/873
    '''

    def test_ogcproxy_no_referer(self):

        payload = {'_id': self.hash()}

        resp = requests.get(self.api_url + '/ogcproxy?url=http%3A%2F%2Fmapserver1.gr.ch%2Fwms%2Fadmineinteilung%3FSERVICE%3DWMS%26REQUEST%3DGetCapabilities%26VERSION%3D1.3.0', params=payload)

        self.failUnless(resp.status_code == 403)

    def test_ogcproxy_bad_referer(self):

        payload = {'_id': self.hash()}
        headers = {'referer': 'http://goofy-referer.ch'}

        resp = requests.get(self.api_url + '/ogcproxy?url=http%3A%2F%2Fmapserver1.gr.ch%2Fwms%2Fadmineinteilung%3FSERVICE%3DWMS%26REQUEST%3DGetCapabilities%26VERSION%3D1.3.0', params=payload, headers=headers)

        self.failUnless(resp.status_code == 403)

    def test_ogcproxy_good_referer(self):

        payload = {'_id': self.hash()}
        headers = {'referer': 'http://unittest.geo.admin.ch'}

        resp = requests.get(self.api_url + '/ogcproxy?url=http%3A%2F%2Fmapserver1.gr.ch%2Fwms%2Fadmineinteilung%3FSERVICE%3DWMS%26REQUEST%3DGetCapabilities%26VERSION%3D1.3.0', params=payload, headers=headers)

        self.failUnless(resp.status_code == 200)
