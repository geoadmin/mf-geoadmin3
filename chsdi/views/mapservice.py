# -*- coding: utf-8 -*-

from pyramid.view import view_config
from pyramid.renderers import render_to_response
import pyramid.httpexceptions as exc

from sqlalchemy import Text, or_, func
from sqlalchemy.sql.expression import cast
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from chsdi.models import models_from_name
from chsdi.models.bod import LayersConfig, get_bod_model, computeHeader
from chsdi.models.vector import getScale
from chsdi.lib.validation import MapServiceValidation


class LayersParams(MapServiceValidation):

    def __init__(self, request):
        super(LayersParams, self).__init__()

        # Map and topic represent the same resource
        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.cbName = request.params.get('callback')
        self.lang = request.lang
        self.searchText = request.params.get('searchText')
        self.geodataStaging = request.registry.settings['geodata_staging']

        self.translate = request.translate
        self.request = request


class FeaturesParams(MapServiceValidation):

    def __init__(self, request):
        super(FeaturesParams, self).__init__()

        # Map and topic represent the same resource
        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.cbName = request.params.get('callback')
        self.lang = request.lang
        self.searchText = request.params.get('searchText')
        self.geodataStaging = request.registry.settings['geodata_staging']

        self.geometry = request.params.get('geometry')
        self.geometryType = request.params.get('geometryType')
        self.imageDisplay = request.params.get('imageDisplay')
        self.mapExtent = request.params.get('mapExtent')
        self.tolerance = request.params.get('tolerance')
        self.returnGeometry = request.params.get('returnGeometry')
        self.layers = request.params.get('layers', 'all')
        self.timeInstant = request.params.get('timeInstant')

        self.translate = request.translate
        self.request = request


class FeatureParams(MapServiceValidation):

    def __init__(self, request):
        super(FeatureParams, self).__init__()

        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.cbName = request.params.get('callback')
        self.lang = request.lang
        self.geodataStaging = request.registry.settings['geodata_staging']

        self.returnGeometry = request.params.get('returnGeometry')
        self.idlayer = request.matchdict.get('idlayer')
        self.idfeature = request.matchdict.get('idfeature')

        # TODO get rid of those parameters only used for cadastral
        defaultExtent = '42000,30000,350000,900000'
        defaultImageDisplay = '400,600,96'
        self.mapExtent = request.params.get('mapExtent', defaultExtent)
        self.imageDisplay = request.params.get('imageDisplay', defaultImageDisplay)
        self.scale = getScale(self.imageDisplay, self.mapExtent)

        self.translate = request.translate
        self.request = request


# Order matters, last one is the default one
@view_config(route_name='identify', renderer='geojson', request_param='geometryFormat=geojson')
def identify_geojson(request):
    return _indentify(request)


@view_config(route_name='identify', renderer='esrijson')
def identify_esrijson(request):
    return _indentify(request)


def _indentify(request):
    params = FeaturesParams(request)
    if params.layers == 'all':
        model = get_bod_model(params.lang)
        query = params.request.db.query(model)
        layerIds = []
        for layer in _get_layers_metadata_for_params(params, query, model):
            layerIds.append(layer['idBod'])
    else:
        layerIds = params.layers
    models = [
        models_from_name(layerId) for
        layerId in layerIds
        if models_from_name(layerId) is not None
    ]
    if models is None:
        raise exc.HTTPBadRequest('No GeoTable was found for %s' % ' '.join(layerIds))

    maxFeatures = 50
    features = []
    for feature in _get_features_for_extent(params, models, maxFeatures):
        if params.returnGeometry:
            f = feature.__geo_interface__
        else:
            f = feature.__interface__
        if hasattr(f, 'extra'):
            layerBodId = f.extra['layerBodId']
            f.extra['layerName'] = params.translate(layerBodId)
        features.append(f)
        if len(features) > maxFeatures:
            break

    return {'results': features}


@view_config(route_name='feature', renderer='geojson',
             request_param='geometryFormat=geojson')
def view_get_feature_geojson(request):
    return _get_feature_service(request)


@view_config(route_name='feature', renderer='esrijson')
def view_get_feature_esrijson(request):
    return _get_feature_service(request)


@view_config(route_name='htmlPopup', renderer='jsonp')
@view_config(route_name='htmlpopup', renderer='jsonp')
def htmlpopup(request):
    params = FeatureParams(request)
    params.returnGeometry = False
    models = models_from_name(params.idlayer)
    if models is None:
        raise exc.HTTPBadRequest('No Vector Table was found for %s' % params.idlayer)
    feature, template = _get_feature(params, models, params.idlayer, params.idfeature)

    modelLayer = get_bod_model(params.lang)
    layer = next(_get_layers_metadata_for_params(
        params,
        request.db.query(modelLayer),
        modelLayer
    ))

    feature.update({'attribution': layer.get('attributes')['dataOwner']})
    feature.update({'fullName': layer.get('fullName')})
    feature.update({'bbox': params.mapExtent.bounds})
    feature.update({'scale': params.scale})
    feature.update({'extended': False})
    response = render_to_response(
        template,
        feature,
        request=request)
    if params.cbName is None:
        return response
    return response.body


def _get_feature_service(request):
    params = FeatureParams(request)
    models = models_from_name(params.idlayer)

    if models is None:
        raise exc.HTTPBadRequest('No Vector Table was found for %s' % params.idlayer)

    feature, template = _get_feature(params, models, params.idlayer, params.idfeature)
    return feature


def _get_layer(query, model, layerId):
    ''' Returns exactly one layer or raises
    an exception. This function can be used with
    both a layer config model or a layer metadata
    model. '''
    query = query.filter(model.idBod == layerId)

    try:
        layer = query.one()
    except NoResultFound:
        raise exc.HTTPNotFound('No layer with id %s' % layerId)
    except MultipleResultsFound:
        raise exc.HTTPInternalServerError('Multiple layers found for the same id %s' % layerId)

    return layer


def _get_feature(params, models, layerId, featureId):
    ''' Returns exactly one feature or raises
    an excpetion '''
    # One layer can have several models
    for model in models:
        query = params.request.db.query(model)
        query = query.filter(model.id == featureId)
        try:
            feature = query.one()
            template = 'chsdi:%s' % model.__template__
        except NoResultFound:
            feature = None
        except MultipleResultsFound:
            raise exc.HTTPInternalServerError('Multiple features found for the same id %s' % featureId)

        if feature is not None:
            template = 'chsdi:%s' % model.__template__
            break

    if feature is None:
        raise exc.HTTPNotFound('No feature with id %s' % featureId)

    if params.returnGeometry:
        feature = feature.__geo_interface__
    else:
        feature = feature.__interface__

    if hasattr(feature, 'extra'):
        feature.extra['layerName'] = params.translate(feature.extra['layerBodId'])

    feature = {'feature': feature}
    return feature, template


def _get_features_for_extent(params, models, maxFeatures):
    ''' Returns a generator function that yields
    a feature. '''
    for vectorLayer in models:
        for model in vectorLayer:
            geomFilter = model.geom_filter(
                params.geometry,
                params.geometryType,
                params.imageDisplay,
                params.mapExtent,
                params.tolerance
            )
            # Can be None because of max and min scale
            if geomFilter is not None:
                query = params.request.db.query(model).filter(geomFilter)
                if params.timeInstant is not None:
                    try:
                        timeInstantColumn = model.time_instant_column()
                    except AttributeError:
                        raise exc.HTTPBadRequest('%s is not time enabled' % model.__bodId__)
                    query = query.filter(timeInstantColumn == params.timeInstant)
                query = query.limit(maxFeatures)
                for feature in query:
                    yield feature


@view_config(route_name='mapservice', renderer='jsonp')
def metadata(request):
    params = LayersParams(request)
    model = get_bod_model(params.lang)
    query = params.request.db.query(model)
    if params.searchText is not None:
        query = _full_text_search(
            query,
            [
                model.fullTextSearch,
                model.idBod,
                model.idGeoCat
            ],
            params.searchText
        )
    results = computeHeader(params.mapName)
    for layer in _get_layers_metadata_for_params(params, query, model):
        results['layers'].append(layer)
    return results

@view_config(route_name='layersconfig', renderer='jsonp')
@view_config(route_name='layersConfig', renderer='jsonp')
def layers_config(request):
    params = LayersParams(request)
    query = params.request.db.query(LayersConfig)
    layers = {}
    for layer in _get_layers_config_for_params(params, query, LayersConfig):
        layers = dict(layers.items() + layer.items())
    return layers


@view_config(route_name='legend', renderer='jsonp')
def legend(request):
    params = LayersParams(request)
    layerId = request.matchdict.get('idlayer')
    # FIXME a second request shouldn't be necessary (use relationship)
    layerConfig = next(
        _get_layers_config_for_params(
            params,
            params.request.db.query(LayersConfig),
            LayersConfig,
            layerIds=[layerId]
        ))
    model = get_bod_model(params.lang)
    layerMetadata = next(
        _get_layers_metadata_for_params(
            params,
            params.request.db.query(model),
            model,
            layerIds=[layerId]
        ))
    hasLegend = layerConfig[layerId].get('hasLegend')

    # FIXME datenstand if not defined
    # should be available in view_bod_layer_info
    if 'attributes' in layerMetadata.keys():
        if 'dataStatus' in layerMetadata['attributes'].keys():
            status = layerMetadata['attributes']['dataStatus']
            if status == u'bgdi_created':
                models = models_from_name(layerId)
                for model in models:
                    modified = request.db.query(
                        func.max(model.bgdi_created)
                    )
                datenstand = modified.first().pop(0).strftime("%Y%m%d")
                layerMetadata['attributes']['dataStatus'] = datenstand

    legend = {
        'layer': layerMetadata,
        'hasLegend': hasLegend
    }
    response = render_to_response(
        'chsdi:templates/legend.mako',
        legend,
        request=request
    )
    if params.cbName is None:
        return response
    return response.body


def _get_layer(query, model, layerId):
    ''' Returns exactly one result or raises
    raises an exception. '''
    query = query.filter(model.idBod == layerId)
    try:
        layer = query.one()
    except NoResultFound:
        raise exc.HTTPNotFound('No layer with id %s' % layerId)
    except MultipleResultsFound:
        raise exc.HTTPInternalServerError()

    return layer


def _get_layers_config_for_params(params, query, model, layerIds=None):
    ''' Returns a generator function that yields
    layer config dictionaries. '''
    model = LayersConfig
    bgLayers = True
    if params.mapName != 'all':
        # per default we want to include background layers
        query = query.filter(or_(
            model.maps.ilike('%%%s%%' % params.mapName),
            model.background == bgLayers)
        )
    query = _filter_by_geodata_staging(
        query,
        model.staging,
        params.geodataStaging
    )
    if layerIds is not None:
        for layerId in layerIds:
            layer = _get_layer(query, model, layerId)
            yield layer.layerConfig(params.translate)

    for q in query:
        yield q.layerConfig(params.translate)


def _get_layers_metadata_for_params(params, query, model, layerIds=None):
    ''' Returns a generator function that yields
    layer metadata dictionaries. '''
    query = _filter_by_map_name(
        query,
        model.maps,
        params.mapName
    )
    query = _filter_by_geodata_staging(
        query,
        model.staging,
        params.geodataStaging
    )
    if layerIds is not None:
        for layerId in layerIds:
            layer = _get_layer(query, model, layerId)
            yield layer.layerMetadata()

    for q in query:
        yield q.layerMetadata()

# Shared filters


def _filter_by_map_name(query, ormColumn, mapName):
    ''' Applies a map/topic filter '''
    if mapName != 'all':
        return query.filter(
            ormColumn.ilike('%%%s%%' % mapName)
        )
    return query


def _filter_by_geodata_staging(query, ormColumn, staging):
    ''' Applies a filter on geodata based on application
    staging '''
    if staging == 'test':
        return query
    elif staging == 'integration':
        return query.filter(
            or_(
                ormColumn == staging,
                ormColumn == 'prod'
            )
        )
    elif staging == 'prod':
        return query.filter(ormColumn == staging)


def _full_text_search(query, ormColumns, searchText):
    ''' Given a list of columns and a searchText, returns
    a filtered query '''
    filters = []
    for col in ormColumns:
        if col is not None:
            col = cast(col, Text)
            filters.append(col.ilike('%%%s%%' % searchText))
    return query.filter(
        or_(*filters)) if searchText is not None else query


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

    @view_config(route_name='identify', request_param='geometryFormat=interlis')
    def view_identify_oereb(self):
        from chsdi.models import oereb_models_from_bodid
        from chsdi.models.bod import OerebMetadata
        from pyramid.response import Response
        self.geometry = self.request.params.get('geometry')
        self.geometryType = self.request.params.get('geometryType')
        self.imageDisplay = self.request.params.get('imageDisplay')
        self.mapExtent = self.request.params.get('mapExtent')
        self.tolerance = self.request.params.get('tolerance')
        # FIXME not supported at the moment
        self.returnGeometry = self.request.params.get('returnGeometry')
        self.layers = self.request.params.get('layers', 'all')

        # At the moment only one layer at a time and no support of all
        if self.layers == 'all' or len(self.layers) > 1:
            raise exc.HTTPBadRequest('Please specify the id of the layer you want to query')
        idBod = self.layers[0]
        model = OerebMetadata
        query = self.request.db.query(model)
        query = query.filter(model.idBod == idBod)
        try:
            layer_metadata = query.one()
        except NoResultFound:
            raise exc.HTTPNotFound('No layer with id %s' % idBod)
        except MultipleResultsFound:
            raise exc.HTTPInternalServerError()
        header = layer_metadata.header
        footer = layer_metadata.footer

        # Only relation 1 to 1 at the moment
        model = oereb_models_from_bodid(idBod)[0]
        geom_filter = model.geom_filter(
            self.geometry,
            self.geometryType,
            self.imageDisplay,
            self.mapExtent,
            self.tolerance
        )
        query = self.request.db.query(model).filter(geom_filter)
        features = []
        for q in query:
            temp = q.xmlData.split('##')
            for fragment in temp:
                if fragment not in features:
                    features.append(fragment)

        results = header + ''.join(features) + footer
        response = Response(results)
        response.content_type = 'text/xml'
        return response

    # order matters, last route is the default!
    @view_config(route_name='find', renderer='geojson',
                 request_param='geometryFormat=geojson')
    def view_find_geosjon(self):
        return self._find()

    @view_config(route_name='find', renderer='esrijson',
                 request_param='geometryFormat=esrijson')
    def view_find_esrijson(self):
        return self._find()

    @view_config(route_name='find', renderer='esrijson')
    def _find(self):
        self.searchFields = self.request.params.get('searchFields')
        self.returnGeometry = self.request.params.get('returnGeometry')
        layers = self.request.params.get('layers')
        models = models_from_name(layers)
        # Iterate through models here
        searchColumn = models[0].get_column_by_name(self.searchFields)
        if searchColumn is None:
            exc.HTTPNotFound('No column with the name %s was found for %s.' % (self.searchFields, layers))
        query = self.request.db.query(models[0])
        query = self._full_text_search(query, [searchColumn])
        features = []
        for feature in query:
            if self.returnGeometry:
                f = feature.__geo_interface__
            else:
                f = feature.__interface__
            if hasattr(f, 'extra'):
                layerBodId = f.extra['layerBodId']
                f.extra['layerName'] = self.translate(layerBodId)
            features.append(f)

        return {'results': features}

    @view_config(route_name='extendedHtmlPopup', renderer='jsonp')
    def extendedhtmlpopup(self):
        template, feature = self._get_html_response('extended')
        feature.update({'extended': True})
        response = render_to_response(
            template,
            feature,
            request=self.request)
        if self.cbName is None:
            return response
        return response.body

    def _get_html_response(self, htmlType):
        defaultExtent = '42000,30000,350000,900000'
        defaultImageDisplay = '400,600,96'
        self.imageDisplay = self.request.params.get('imageDisplay', defaultImageDisplay)
        self.mapExtent = self.request.params.get('mapExtent', defaultExtent)
        scale = getScale(self.imageDisplay, self.mapExtent)
        idlayer = self.request.matchdict.get('idlayer')
        idfeature = self.request.matchdict.get('idfeature')
        models = models_from_name(idlayer)

        if models is None:
            raise exc.HTTPBadRequest('No GeoTable was found for %s' % idlayer)

        layer = self._get_layer_resource(idlayer)
        # One layer can have several models
        for model in models:
            if htmlType == 'extended' and not hasattr(model, '__extended_info__'):
                raise exc.HTTPNotFound('No extended info has been found for %s' % idlayer)
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
        feature.update({'bbox': self.mapExtent.bounds})
        feature.update({'scale': scale})
        return template, feature

    def _get_feature_resource(self, idlayer, idfeature, model):
        layerName = self.translate(idlayer)
        geometryFormat = self.request.params.get('geometryFormat', 'esrijson')
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
                col = cast(col, Text)
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
