# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.models import models_from_name
from chsdi.models.bod import get_bod_model, computeHeader
from chsdi.lib.helpers import locale_negotiator
from chsdi.lib.validation import MapServiceValidation, validateLayerId

import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

class MapService(MapServiceValidation):

    def __init__(self, request):
        super(MapService, self).__init__()
        self.request = request
        self.mapName = request.matchdict.get('map') # The topic
        self.cbName = request.params.get('cb')
        self.lang = locale_negotiator(request)
        self.searchText = request.params.get('searchText')
        self.translate = request.translate

    @view_config(route_name='mapservice', renderer='jsonp')    
    def metadata(self):
        model = get_bod_model(self.lang)
        results = computeHeader(self.mapName)
        query = self.request.db.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        query = self.fullTextSearch(query, model.fullTextSearch)
        layers = [layer.layerMetadata() for layer in query]
        results['layers'].append(layers)
        return results

    @view_config(route_name='getlegend', renderer='jsonp')
    def getlegend(self):
        from pyramid.renderers import render_to_response
        idlayer = self.request.matchdict.get('idlayer')
        model = get_bod_model(self.lang)
        query = self.request.db.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        query = query.filter(model.idBod==idlayer)
        for layer in query:
            legend = {'layer': layer.layerMetadata()}
        response = render_to_response('chsdi:templates/legend.mako', legend, request = self.request)
        if self.cbName is None:
            return response 
        else:
            return response.body

    # order matters, last route is the default!
    @view_config(route_name='identify', renderer='geojson', request_param='geometryFormat=geojson')
    def view_identify_geosjon(self):
        return self.identify()

    @view_config(route_name='identify', renderer='esrijson')
    def view_identify_esrijson(self):
        return self.identify()

    def identify(self):
        self.geometry = self.request.params.get('geometry')
        self.geometryType = self.request.params.get('geometryType')
        self.imageDisplay = self.request.params.get('imageDisplay')
        self.mapExtent = self.request.params.get('mapExtent')
        self.tolerance = self.request.params.get('tolerance')
        self.returnGeometry = self.request.params.get('returnGeometry', True)
        layers = self.request.params.get('layers','all')
        models = self.getModelsFromLayerName(layers)
        queries = list(self.buildQueries(models))
        features = list(self.getFeaturesFromQueries(queries))
        return {'results': features} 

    @view_config(route_name='getfeature', renderer='geojson', request_param='geometryFormat=geojson')
    def view_getfeature_geojson(self):
        return self.getfeature()

    @view_config(route_name='getfeature', renderer='esrijson')
    def view_getfeature_esrijson(self):
        return self.getfeature()

    def getfeature(self):
        self.returnGeometry = self.request.params.get('returnGeometry', True)
        feature, template = self.getFeature()
        return feature

    @view_config(route_name='htmlpopup', renderer='jsonp')
    def htmlpopup(self):
        from pyramid.renderers import render_to_response
        self.returnGeometry = False
        feature, template = self.getFeature()
        response = render_to_response('chsdi:' + template, feature, request = self.request)
        if self.cbName is None:
            return response
        else:
            return response.body

    def getFeature(self):
        idfeature = self.request.matchdict.get('idfeature')
        idlayer = self.request.matchdict.get('idlayer') 
        model = validateLayerId(idlayer)[0]
        query = self.request.db.query(model).filter(model.id==idfeature)
        if self.returnGeometry:
            feature = [f.__geo_interface__ for f in query]
        else:
            feature = [f.interface for f in query]
        feature = {'feature': feature.pop()} if len(feature) > 0 else {'feature': []}
        template = model.__template__
        return feature, template

    def fullTextSearch(self, query, orm_column):
        query = query.filter(
            orm_column.ilike('%%%s%%' % self.searchText)
        ) if self.searchText is not None else query
        return query

    def getFeaturesFromQueries(self, queries):
       for query in queries:
            for feature in query:
                yield feature.__geo_interface__

    def buildQueries(self, models):
        for layer in models:
            for model in layer:
                geom_filter = model.geom_filter(
                    self.geometry,
                    self.geometryType,
                    self.imageDisplay,
                    self.mapExtent,
                    self.tolerance
                )
                query = self.request.db.query(model).filter(geom_filter)
                query = self.fullTextSearch(query, model.display_field())
                yield query

    def getModelsFromLayerName(self, layers_param):
        layers = self.getLayerListFromMap() if layers_param == 'all' else layers_param.split(':')[1].split(',')
        models = [
            validateLayerId(layer) for
            layer in layers
            if validateLayerId(layer) is not None
        ]
        return models

    def getLayerListFromMap(self):
        model = get_bod_model(self.lang)
        query = self.request.db.query(model).filter(
            model.maps.ilike('%%%s%%' % self.mapName)
        )
        # only return layers which have a model
        layerList = [
            q.idBod for
            q in query
            if models_from_name(q.idBod) is not None
        ]
        return layerList
