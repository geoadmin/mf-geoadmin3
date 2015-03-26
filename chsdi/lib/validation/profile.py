# -*- coding: utf-8 -*-

import geojson

from pyramid.httpexceptions import HTTPBadRequest

from shapely.geometry import asShape


class ProfileValidation(object):

    def __init__(self):
        self._linestring = None
        self._layers = None
        self._nb_points = None
        self._ma_offset = None

    @property
    def linestring(self):
        return self._linestring

    @property
    def layers(self):
        return self._layers

    @property
    def nb_points(self):
        return self._nb_points

    @property
    def ma_offset(self):
        return self._ma_offset

    @linestring.setter
    def linestring(self, value):
        import geojson
        if value is None:
            raise HTTPBadRequest("Missing parameter geom")
        try:
            geom = geojson.loads(value, object_hook=geojson.GeoJSON.to_instance)
        except:
            raise HTTPBadRequest("Error loading geometry in JSON string")
        try:
            shape = asShape(geom)
        except:
            raise HTTPBadRequest("Error converting JSON to Shape")
        try:
            shape.is_valid
        except:
            raise HTTPBadRequest("Invalid Linestring syntax")

        self._linestring = shape

    @layers.setter
    def layers(self, value):
        if value is None:
            self._layers = ['DTM25']
        else:
            value = value.split(',')
            for i in value:
                if i not in ('DTM25', 'DTM2', 'COMB'):
                    raise HTTPBadRequest("Please provide a valid name for the elevation model DTM25, DTM2 or COMB")
            value.sort()
            self._layers = value

    @nb_points.setter
    def nb_points(self, value):
        if value is None:
            self._nb_points = 200
        else:
            if value.isdigit():
                self._nb_points = int(value)
            else:
                raise HTTPBadRequest("Please provide a numerical value for the parameter 'NbPoints'/'nb_points'")


    @ma_offset.setter
    def ma_offset(self, value):
        if value is None:
            self._ma_offset = 3
        else:
            if value.isdigit():
                self._ma_offset = int(value)
            else:
                raise HTTPBadRequest("Please provide a numerical value for the parameter 'offset'")
