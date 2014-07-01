# -*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPBadRequest

from chsdi.lib.validation import MapNameValidation


class SearchValidation(MapNameValidation):

    def __init__(self):
        super(SearchValidation, self).__init__()
        self._searchText = None
        self._featureIndexes = None
        self._timeInstant = None
        self._timeEnabled = None
        self._bbox = None
        self._returnGeometry = None
        self._origins = None

    @property
    def searchText(self):
        return self._searchText

    @property
    def featureIndexes(self):
        return self._featureIndexes

    @property
    def timeEnabled(self):
        return self._timeEnabled

    @property
    def bbox(self):
        return self._bbox

    @property
    def timeInstant(self):
        return self._timeInstant

    @property
    def returnGeometry(self):
        return self._returnGeometry

    @property
    def origins(self):
        return self._origins

    @featureIndexes.setter
    def featureIndexes(self, value):
        if value is not None and value != '':
            # SphinxSearch does not support indices longer than 64
            # characters, that's why we have to hardcode here to
            # something below 64 (indices are prepared with this name)
            value = value.replace(
                'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet',
                'ch_swisstopo_geologie-hydro_karte-grundwasservul'
            )
            value = value.replace(
                'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen',
                'ch_swisstopo_geologie-hydro_karte-grundwasservor'
            )
            value = value.replace('.', '_')
            self._featureIndexes = value.split(',')

    @timeEnabled.setter
    def timeEnabled(self, value):
        if value is not None and value != '':
            values = value.split(',')
            result = []
            for val in values:
                result.append(True if val.lower() in ['true', 't', '1'] else False)
            self._timeEnabled = result

    @timeEnabled.setter
    def timeEnabled(self, value):
        if value is not None and value != '':
            values = value.split(',')
            result = []
            for val in values:
                result.append(True if val.lower() in ['true', 't', '1'] else False)
            self._timeEnabled = result

    @searchText.setter
    def searchText(self, value):
        if value is None:
            raise exc.HTTPBadRequest("Please provide a search text")
        searchTextList = value.split(' ')
        # Remove empty strings
        searchTextList = filter(None, searchTextList)
        self._searchText = searchTextList

    @bbox.setter
    def bbox(self, value):
        if value is not None and value != '':
            values = value.split(',')
            if len(values) != 4:
                raise HTTPBadRequest("Please provide 4 coordinates in a comma separated list")
            try:
                values = map(float, values)
            except ValueError:
                raise HTTPBadRequest("Please provide numerical values for the parameter bbox")
            # Swiss extent
            if values[0] >= 420000 and values[1] >= 30000:
                if values[0] < values[1]:
                    raise HTTPBadRequest("The first coordinate must be higher than the second")
            if values[2] >= 420000 and values[3] >= 30000:
                if values[2] < values[3]:
                    raise HTTPBadRequest("The third coordinate must be higher than the fourth")
            self._bbox = values

    @timeInstant.setter
    def timeInstant(self, value):
        if value is not None:
            if len(value) != 4:
                raise HTTPBadRequest('Only years are supported as timeInstant parameter')
            try:
                self._timeInstant = int(value)
            except ValueError:
                raise HTTPBadRequest('Please provide an integer for the parameter timeInstant')
        else:
            self._timeInstant = value

    @returnGeometry.setter
    def returnGeometry(self, value):
        if value is False or value == 'false':
            self._returnGeometry = False
        else:
            self._returnGeometry = True

    @origins.setter
    def origins(self, value):
        if value is not None:
            self._origins = value.split(',')
