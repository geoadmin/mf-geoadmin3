# -*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPBadRequest


class HeightValidation(object):

    def __init__(self):
        self._lon = None
        self._lat = None
        self._layers = None

    @property
    def lon(self):
        return self._lon

    @property
    def lat(self):
        return self._lat

    @property
    def layers(self):
        return self._layers

    @lon.setter
    def lon(self, value):
        if value is None:
            raise HTTPBadRequest("Missing parameter 'easting'/'lon'")
        try:
            self._lon = float(value)
        except ValueError:
            raise HTTPBadRequest("Please provide numerical values for the parameter 'easting'/'lon'")

    @lat.setter
    def lat(self, value):
        if value is None:
            raise HTTPBadRequest("Missing parameter 'norhting'/'lat'")
        try:
            self._lat = float(value)
        except ValueError:
            raise HTTPBadRequest("Please provide numerical values for the parameter 'northing'/'lat'")

    @layers.setter
    def layers(self, value):
        if not isinstance(value, list):
            value = value.split(',')
            for i in value:
                if i not in ('DTM25', 'DTM2', 'COMB'):
                    raise HTTPBadRequest("Please provide a valid name for the elevation model DTM25, DTM2 or COMB")
        self._layers = value
