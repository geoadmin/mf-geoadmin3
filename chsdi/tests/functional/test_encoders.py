# -*- coding: utf-8 -*-

import unittest


class Test_EsriGeoJSON(unittest.TestCase):

    def _callFUT(self, **kwargs):
        from chsdi.esrigeojsonencoder import EsriGeoJSONEncoder
        return EsriGeoJSONEncoder(**kwargs)

    def test_json(self):
        encoder = self._callFUT()
        result = encoder.default({"a": 1})
        self.assertEqual(result, {'a': 1})

    def test_geojson(self):
        encoder = self._callFUT()
        from geojson import Point
        point = Point([600000, 200000], properties={'name': 'toto'})
        result = encoder.default(point)
        self.assertEqual(result, {'spatialReference': {'wkid': 21781}, 'attributes': {'name': 'toto'}, 'y': 200000, 'x': 600000, 'type': 'point'})

    def test_dumps(self):
        from chsdi.esrigeojsonencoder import dumps as esri_dumps
        from geojson import Point
        point = Point([600000, 200000], properties={'name': 'toto'})

        result = esri_dumps(point)
        self.assertEqual(result, '{"spatialReference": {"wkid": 21781}, "attributes": {"name": "toto"}, "y": 200000, "x": 600000, "type": "point"}')

    # Testing loading EsriGeometries
    def test_loads_simple_point(self):
        from chsdi.esrigeojsonencoder import loads as esri_loads
        from geojson import Point
        point = "650000,220000"

        result = esri_loads(point)
        self.assertTrue(isinstance(result, Point))

    def test_loads_point_with_crs(self):
        from chsdi.esrigeojsonencoder import loads as esri_loads
        from geojson import Point
        point = """{"x": -122.65,"y": 45.53, "spatialReference": { "wkid": 4326}}"""

        result = esri_loads(point)
        self.assertTrue(isinstance(result, Point))
        self.assertEqual(result.crs.properties['name'], "urn:ogc:def:crs:EPSG:4326")

    def test_loads_linestring(self):
        from chsdi.esrigeojsonencoder import loads as esri_loads
        from geojson import LineString
        line = """{"paths": [[[ 600000,200000], [ 623000,210000], [ 654000,201000], [ 655000, 208000]]],
             "spatialReference": {"wkid": 21781 }}"""

        result = esri_loads(line)
        self.assertEqual(type(result), LineString)
        self.assertTrue(isinstance(result, LineString))
        self.assertEqual(result.crs.properties['name'], "urn:ogc:def:crs:EPSG:21781")

    def test_loads_polygon(self):
        from chsdi.esrigeojsonencoder import loads as esri_loads
        from geojson import Polygon
        polygon = """{"rings": [[[ 600000,200000], [ 623000,210000], [ 654000,201000], [ 655000, 208000], [ 600000,200000]]],
             "spatialReference": {"wkid": 21781 }}"""

        result = esri_loads(polygon)
        self.assertTrue(isinstance(result, Polygon))
        self.assertEqual(result.crs.properties['name'], "urn:ogc:def:crs:EPSG:21781")

    def test_loads_bbox(self):
        from chsdi.esrigeojsonencoder import loads as esri_loads
        from geojson import Polygon
        bbox = """600000,200000,650000,250000"""

        result = esri_loads(bbox)
        self.assertTrue(isinstance(result, Polygon))
        self.assertEqual(result.crs.properties['name'], "urn:ogc:def:crs:EPSG:21781")
