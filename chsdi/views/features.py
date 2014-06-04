#-*- utf-8 -*-

import re

from pyramid.view import view_config
from pyramid.renderers import render, render_to_response
from pyramid.response import Response
import pyramid.httpexceptions as exc

from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from chsdi.lib.validation.mapservice import MapServiceValidation
from chsdi.lib.filters import full_text_search
from chsdi.models import models_from_name, oereb_models_from_bodid
from chsdi.models.bod import OerebMetadata, get_bod_model
from chsdi.views.layers import get_layer, get_layers_metadata_for_params


# For several features
class FeatureParams(MapServiceValidation):

    def __init__(self, request):
        super(FeatureParams, self).__init__()
        # Map and topic represent the same resource
        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.cbName = request.params.get('callback')
        self.lang = request.lang
        self.geodataStaging = request.registry.settings['geodata_staging']
        self.returnGeometry = request.params.get('returnGeometry')
        self.translate = request.translate
        self.request = request


# For identify services
def _get_features_params(request):
    params = FeatureParams(request)
    params.searchText = request.params.get('searchText')
    params.geometry = request.params.get('geometry')
    params.geometryType = request.params.get('geometryType')
    params.imageDisplay = request.params.get('imageDisplay')
    params.mapExtent = request.params.get('mapExtent')
    params.tolerance = request.params.get('tolerance')
    params.layers = request.params.get('layers', 'all')
    params.timeInstant = request.params.get('timeInstant')
    return params


# For feature, htmlPopup and extendedHtmlPopup services
def _get_feature_params(request):
    params = FeatureParams(request)
    params.layerId = request.matchdict.get('layerId')
    params.featureId = request.matchdict.get('featureId')
    return params


def _get_find_params(request):
    params = FeatureParams(request)
    params.layer = request.params.get('layer')
    params.searchText = request.params.get('searchText')
    params.searchField = request.params.get('searchField')
    return params


@view_config(route_name='identify', request_param='geometryFormat=interlis')
def identify_oereb(request):
    return _identify_oereb(request)


@view_config(route_name='identify', renderer='geojson', request_param='geometryFormat=geojson')
def identify_geojson(request):
    return _identify(request)


@view_config(route_name='identify', renderer='esrijson')
def identify_esrijson(request):
    return _identify(request)


@view_config(route_name='feature', renderer='geojson',
             request_param='geometryFormat=geojson')
def view_get_feature_geojson(request):
    return _get_feature_service(request)


@view_config(route_name='feature', renderer='esrijson')
def view_get_feature_esrijson(request):
    return _get_feature_service(request)


# order matters, last route is the default one!
@view_config(route_name='find', renderer='geojson',
             request_param='geometryFormat=geojson')
def view_find_geojson(request):
    return _find(request)


@view_config(route_name='find', renderer='esrijson')
def view_find_esrijson(request):
    return _find(request)


@view_config(route_name='htmlPopup', renderer='jsonp')
def htmlpopup(request):
    params = _get_feature_params(request)
    params.returnGeometry = False
    feature, vectorModel = _get_feature(params)

    layerModel = get_bod_model(params.lang)
    layer = next(get_layers_metadata_for_params(
        params,
        request.db.query(layerModel),
        layerModel,
        layerIds=[params.layerId]
    ))
    feature.update({'attribution': layer.get('attributes')['dataOwner']})
    feature.update({'fullName': layer.get('fullName')})
    feature.update({'extended': False})

    response = _render_feature_template(vectorModel, feature, request)

    if params.cbName is None:
        return response
    return response.body


@view_config(route_name='extendedHtmlPopup', renderer='jsonp')
def extendedhtmlpopup(request):
    params = _get_feature_params(request)
    params.returnGeometry = False
    feature, vectorModel = _get_feature(params)

    layerModel = get_bod_model(params.lang)
    layer = next(get_layers_metadata_for_params(
        params,
        request.db.query(layerModel),
        layerModel,
        layerIds=[params.layerId]
    ))
    feature.update({'attribution': layer.get('attributes')['dataOwner']})
    feature.update({'fullName': layer.get('fullName')})
    feature.update({'extended': True})

    response = _render_feature_template(vectorModel, feature, request, True)

    if params.cbName is None:
        return response
    return response.body


def _identify_oereb(request):
    def insertTimestamps(header, comments):
        pos = re.search(r'\?>', header).end()
        return ''.join((
            header[:pos],
            comments,
            header[pos:]
        ))

    params = _get_features_params(request)
    # At the moment only one layer at a time and no support of all
    if params.layers == 'all' or len(params.layers) > 1:
        raise exc.HTTPBadRequest('Please specify the id of the layer you want to query')
    layerBodId = params.layers[0]
    query = params.request.db.query(OerebMetadata)
    layerMetadata = get_layer(
        query,
        OerebMetadata,
        layerBodId
    )
    header = layerMetadata.header
    footer = layerMetadata.footer
    data_created = layerMetadata.data_created
    data_imported = layerMetadata.data_imported

    comments = render(
        'chsdi:templates/oereb_timestamps.mako',
        {
            'data_imported': data_imported,
            'data_created': data_created
        }
    )
    header = insertTimestamps(header, comments)

    # Only relation 1 to 1 is needed at the moment
    layerVectorModel = [[oereb_models_from_bodid(layerBodId)[0]]]
    features = []
    for feature in _get_features_for_extent(params, layerVectorModel):
        temp = feature.xmlData.split('##')
        for fragment in temp:
            if fragment not in features:
                features.append(fragment)
    results = ''.join((
        header,
        ''.join(features),
        footer
    ))
    response = Response(results)
    response.content_type = 'text/xml'
    return response


def _identify(request):
    params = _get_features_params(request)
    if params.layers == 'all':
        model = get_bod_model(params.lang)
        query = params.request.db.query(model)
        layerIds = []
        for layer in get_layers_metadata_for_params(params, query, model):
            layerIds.append(layer['layerBodId'])
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
    for feature in _get_features_for_extent(params, models, maxFeatures=maxFeatures):
        f = _process_feature(feature, params)
        features.append(f)
        if len(features) > maxFeatures:
            break

    return {'results': features}


def _get_feature_service(request):
    params = _get_feature_params(request)
    feature, vectorModel = _get_feature(params)
    return feature


def _get_feature(params, extended=False):
    ''' Returns exactly one feature or raises
    an excpetion '''
    models = models_from_name(params.layerId)
    if models is None:
        raise exc.HTTPBadRequest('No Vector Table was found for %s' % params.layerId)

    # One layer can have several models
    for model in models:
        query = params.request.db.query(model)
        query = query.filter(model.id == params.featureId)
        try:
            feature = query.one()
        except NoResultFound:
            feature = None
        except MultipleResultsFound:
            raise exc.HTTPInternalServerError('Multiple features found for the same id %s' % params.featureId)

        if feature is not None:
            vectorModel = model
            break

    if feature is None:
        raise exc.HTTPNotFound('No feature with id %s' % params.featureId)
    feature = _process_feature(feature, params)
    feature = {'feature': feature}
    return feature, vectorModel


def _render_feature_template(vectorModel, feature, request, extended=False):
    hasExtendedInfo = True if hasattr(vectorModel, '__extended_info__') else False
    if extended and not hasExtendedInfo:
        raise exc.HTTPNotFound('No extended info has been found for %s' % vectorModel.__bodId__)
    return render_to_response(
        'chsdi:%s' % vectorModel.__template__,
        {
            'feature': feature,
            'hasExtendedInfo': hasExtendedInfo
        },
        request=request)


def _get_features_for_extent(params, models, maxFeatures=None):
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
                query = query.limit(maxFeatures) if maxFeatures is not None else query
                for feature in query:
                    yield feature


def _find(request):
    params = _get_find_params(request)
    if params.searchText is None:
        raise exc.HTTPBadRequest('Please provide a searchText')
    models = models_from_name(params.layer)
    features = []
    findColumn = lambda x: (x, x.get_column_by_name(params.searchField))
    if models is None:
        raise exc.HTTPBadRequest('No Vector Table was found for %s' % params.layer)
    for model in models:
        vectorModel, searchColumn = findColumn(model)
        if searchColumn is None:
            raise exc.HTTPBadRequest('Please provide an existing searchField')
        query = request.db.query(vectorModel)
        query = full_text_search(
            query,
            [searchColumn],
            params.searchText
        ).limit(50)
        for feature in query:
            f = _process_feature(feature, params)
            features.append(f)

    return {'results': features}


def _process_feature(feature, params):
    # TODO find a way to use translate directly in the model
    f = feature.__geo_interface__ if params.returnGeometry else feature.__interface__
    if hasattr(f, 'extra'):
        layerBodId = f.extra['layerBodId']
        f.extra['layerName'] = params.translate(layerBodId)
    else:
        layerBodId = f.get('layerBodId')
        f['layerName'] = params.translate(layerBodId)
    return f
