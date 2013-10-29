# -*- coding: utf-8 -*-

import unittest

from pyramid import testing


class Test_EsriGeoJSON(unittest.TestCase):

    def _callFUT(self, **kwargs):
        from chsdi.renderers import EsriJSON
        fake_info = {}
        return EsriJSON(**kwargs)(fake_info)

    def test_json(self):
        renderer = self._callFUT()
        result = renderer({'a': 1}, {})
        self.assertEqual(result, '{"a": 1}')

    def test_geojson(self):
        from geojson import Point
        f = Point([600000, 200000], properties={'name': 'toto'})
        renderer = self._callFUT()
        request = testing.DummyRequest()
        result = renderer(f, {'request': request})
        self.assertEqual(result, '{"spatialReference": {"wkid": 21781}, "attributes": {"name": "toto"}, "y": 200000, "x": 600000}')

        self.assertEqual(request.response.content_type, 'application/json')

    def test_jsonp(self):
        renderer = self._callFUT(jsonp_param_name="cb")
        from geojson import Point
        f = Point([600000, 200000], properties={'name': 'toto'})
        request = testing.DummyRequest()
        request.params['cb'] = 'jsonp_cb'
        result = renderer(f, {'request': request})
        self.assertEqual(result, 'jsonp_cb({"spatialReference": {"wkid": 21781}, "attributes": {"name": "toto"}, "y": 200000, "x": 600000});')
        self.assertEqual(request.response.content_type, 'text/javascript')
