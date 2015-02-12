# -*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPBadRequest

from chsdi.lib.validation import MapNameValidation

MAX_SPHINX_INDEX_LENGTH = 63

class SearchValidation(MapNameValidation):

    def __init__(self):
        super(SearchValidation, self).__init__()
        self._searchText = None
        self._featureIndexes = None
        self._timeInstant = None
        self._timeEnabled = None
        self._timeStamps = None
        self._bbox = None
        self._returnGeometry = None
        self._origins = None
        self._typeInfo = None
        self._limit = None

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
    def timeStamps(self):
        return self._timeStamps

    @property
    def returnGeometry(self):
        return self._returnGeometry

    @property
    def origins(self):
        return self._origins

    @property
    def typeInfo(self):
        return self._typeInfo

    @property
    def limit(self):
        return self._limit

    @featureIndexes.setter
    def featureIndexes(self, value):
        if value is not None and value != '':
            value = value.replace('.', '_')
            self._featureIndexes = [idx[:MAX_SPHINX_INDEX_LENGTH] for idx in value.split(',')]

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
            if value.isdigit():
                self._timeInstant = int(value)
            else:
                raise HTTPBadRequest('Please provide an integer for the parameter timeInstant')
        else:
            self._timeInstant = value

    @timeStamps.setter
    def timeStamps(self, value):
        if value is not None and value != '':
            values = value.split(',')
            result = []
            for val in values:
                if len(val) != 4 and len(val) != 0:
                    raise HTTPBadRequest('Only years (4 digits) or empty strings are supported in timeStamps parameter')
                if len(val) == 0:
                    result.append(None)
                else:
                    if val.isdigit():
                        result.append(int(val))
                    else:
                        raise HTTPBadRequest('Please provide integers for timeStamps parameter')
            self._timeStamps = result

 
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

    @typeInfo.setter
    def typeInfo(self, value):
        acceptedTypes = ['locations', 'layers', 'featuresearch']
        if value is None:
            raise HTTPBadRequest('Please provide a type parameter. Possible values are %s' % (', '.join(acceptedTypes)))
        elif value not in acceptedTypes:
            raise HTTPBadRequest('The type parameter you provided is not valid. Possible values are %s' % (', '.join(acceptedTypes)))
        self._typeInfo = value

    @limit.setter
    def limit(self, value):
        if value is not None:
            if value.isdigit():
                self._limit = int(value)
            else:
              raise HTTPBadRequest('The limit parameter should be an integer')
