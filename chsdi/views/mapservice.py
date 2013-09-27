# -*- coding: utf-8 -*-

from pyramid.view import view_config
import pyramid.httpexceptions as exc

from sqlalchemy import or_
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from chsdi.models import models_from_name
from chsdi.models.bod import LayersConfig, get_bod_model, computeHeader
from chsdi.lib.validation import MapServiceValidation


class MapService(MapServiceValidation):

    def __init__(self, request):
        super(MapService, self).__init__()
        # Map and topic represents the same resource in chsdi
        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.cbName = request.params.get('callback')
        self.lang = request.lang
        self.searchText = request.params.get('searchText')
        self.geodataStaging = request.registry.settings['geodata_staging']
        self.translate = request.translate
        self.request = request

    @view_config(route_name='mapservice', renderer='jsonp')
    def mapservice(self):
        model = get_bod_model(self.lang)
        results = computeHeader(self.mapName)
        query = self.request.db.query(model)
        query = self._map_name_filter(query, model.maps)
        query = self._geodata_staging_filter(query, model.staging)
        query = self._full_text_search(query, [model.fullTextSearch])
        layers = [layer.layerMetadata() for layer in query]
        results['layers'] = layers
        return results

    @view_config(route_name='layersconfig', renderer='jsonp')
    def layersconfig(self):
        layers = {}
        model = LayersConfig
        query = self.request.db.query(model)
        query = self._map_name_filter(query, model.maps)
        query = self._geodata_staging_filter(query, model.staging)
        for q in query:
            layer = q.getLayerConfig(self.translate)
            layers = dict(layers.items() + layer.items())
        return {'layers': layers}

    @view_config(route_name='getlegend', renderer='jsonp')
    def getlegend(self):
        from pyramid.renderers import render_to_response
        idlayer = self.request.matchdict.get('idlayer')
        layer = self._get_layer_resource(idlayer)

        # only stored layers_config table at the moment
        query = self.request.db.query(LayersConfig)
        query = query.filter(LayersConfig.idBod == idlayer)
        query = query.one()
        config = query.getLayerConfig(self.translate)
        hasLegend = config[idlayer]['hasLegend']

        legend = {
            'layer': layer,
            'hasLegend': hasLegend
        }
        response = render_to_response(
            'chsdi:templates/legend.mako', legend, request=self.request
        )
        if self.cbName is None:
            return response
        return response.body

    # order matters, last route is the default!
    @view_config(route_name='identify', renderer='geojson',
                 request_param='geometryFormat=geojson')
    def view_identify_geosjon(self):
        return self._identify()

    @view_config(route_name='identify', renderer='esrijson')
    def view_identify_esrijson(self):
        return self._identify()

    def _identify(self):
        self.geometry = self.request.params.get('geometry')
        self.geometryType = self.request.params.get('geometryType')
        self.imageDisplay = self.request.params.get('imageDisplay')
        self.mapExtent = self.request.params.get('mapExtent')
        self.tolerance = self.request.params.get('tolerance')
        self.returnGeometry = self.request.params.get('returnGeometry')

        layers = self.request.params.get('layers', 'all')
        models = self._get_models_from_layername(layers)

        if models is None:
            raise exc.HTTPBadRequest('No GeoTable was found for %s' % layers)

        maxFeatures = 100
        queries = list(self._build_queries(models, maxFeatures))

        features = []
        for query in queries:
            for feature in query:
                if self.returnGeometry:
                    f = feature.__geo_interface__
                else:
                    f = feature.__interface__
                if hasattr(f, 'extra'):
                    layerBodId = f.extra['layerBodId']
                    f.extra['layerName'] = self.translate(layerBodId)
                features.append(f)
                if len(features) > maxFeatures:
                    break
            if len(features) > maxFeatures:
                break

        return {'results': features}

    @view_config(route_name='getfeature', renderer='geojson',
                 request_param='geometryFormat=geojson')
    def view_get_feature_geojson(self):
        return self._get_feature()

    @view_config(route_name='getfeature', renderer='esrijson')
    def view_get_feature_esrijson(self):
        return self._get_feature()

    def _get_feature(self):
        self.returnGeometry = self.request.params.get('returnGeometry')
        idlayer = self.request.matchdict.get('idlayer')
        idfeature = self.request.matchdict.get('idfeature')
        models = models_from_name(idlayer)

        if models is None:
            raise exc.HTTPBadRequest('No GeoTable was found for %s' % idlayer)

        # One layer can have several models
        for model in models:
            feature = self._get_feature_resource(idlayer, idfeature, model)
            if feature != 'No Result Found':
                # One layer can have several templates
                break

        if feature == 'No Result Found':
            raise exc.HTTPNotFound('No feature with id %s' % idfeature)

        feature = self._get_feature_resource(idlayer, idfeature, model)
        return feature

    @view_config(route_name='htmlpopup', renderer='jsonp')
    def htmlpopup(self):
        from pyramid.renderers import render_to_response
        self.returnGeometry = False
        idlayer = self.request.matchdict.get('idlayer')
        idfeature = self.request.matchdict.get('idfeature')
        models = models_from_name(idlayer)

        if models is None:
            raise exc.HTTPBadRequest('No GeoTable was found for %s' % idlayer)

        layer = self._get_layer_resource(idlayer)
        # One layer can have several models
        for model in models:
            feature = self._get_feature_resource(idlayer, idfeature, model)
            if feature != 'No Result Found':
                # One layer can have several templates
                model_containing_feature_id = model
                # Exit the loop when a feature is found
                break

        if feature == 'No Result Found':
            raise exc.HTTPNotFound('No feature with id %s' % idfeature)

        template = 'chsdi:%s' % model_containing_feature_id.__template__

        feature.update({'attribution': layer.get('attributes')['dataOwner']})
        feature.update({'fullName': layer.get('fullName')})
        response = render_to_response(
            template,
            feature,
            request=self.request)

        if self.cbName is None:
            return response
        return response.body

    def _get_layer_resource(self, idlayer):
        model = get_bod_model(self.lang)
        query = self.request.db.query(model)
        query = self._map_name_filter(query, model.maps)
        query = query.filter(model.idBod == idlayer)

        try:
            layer = query.one()
        except NoResultFound:
            raise exc.HTTPNotFound('No layer with id %s' % idlayer)
        except MultipleResultsFound:
            raise exc.HTTPInternalServerError()

        layer = layer.layerMetadata()

        return layer

    def _get_feature_resource(self, idlayer, idfeature, model):
        layerName = self.translate(idlayer)
        query = self.request.db.query(model)
        query = query.filter(model.id == idfeature)

        try:
            feature = query.one()
        except NoResultFound:
            return 'No Result Found'
        except MultipleResultsFound:
            raise exc.HTTPInternalServerError()

        if self.returnGeometry:
            feature = feature.__geo_interface__
        else:
            feature = feature.__interface__

        if hasattr(feature, 'extra'):
            feature.extra['layerName'] = layerName
        feature = {'feature': feature}

        return feature

    def _full_text_search(self, query, orm_column):
        filters = []
        for col in orm_column:
            if col is not None:
                filters.append(col.ilike('%%%s%%' % self.searchText))
        query = query.filter(
            or_(*filters)) if self.searchText is not None else query
        return query

    def _map_name_filter(self, query, orm_column):
        if self.mapName != 'all':
            query = query.filter(
                orm_column.ilike('%%%s%%' % self.mapName)
            )
            return query
        return query

    def _geodata_staging_filter(self, query, orm_column):
        if self.geodataStaging == 'test':
            return query
        elif self.geodataStaging == 'integration':
            return (
                query.filter(
                    or_(orm_column == self.geodataStaging,
                        orm_column == 'prod'))
            )
        elif self.geodataStaging == 'prod':
            return query.filter(orm_column == self.geodataStaging)

    def _build_queries(self, models, maxFeatures):
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
                # A maximum of 100 features are return
                quey = query.limit(maxFeatures)
                query = self._full_text_search(
                    query,
                    model.queryable_attributes())
                yield query

    def _get_models_from_layername(self, layers_param):
        layers = self._get_layer_list_from_map(
        ) if layers_param == 'all' else layers_param.split(':')[1].split(',')
        models = [
            models_from_name(layer) for
            layer in layers
            if models_from_name(layer) is not None
        ]
        return models

    def _get_layer_list_from_map(self):
        model = get_bod_model(self.lang)
        query = self.request.db.query(model)
        query = self._map_name_filter(query, model.maps)
        # only return layers which have geometries
        layerList = [
            q.idBod for
            q in query
            if models_from_name(q.idBod) is not None
        ]
        return layerList
