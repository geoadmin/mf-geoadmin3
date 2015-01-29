# -*- coding: utf-8 -*-

import os
import decimal
import datetime


from pyramid.view import view_config
from pyramid.renderers import render_to_response
import pyramid.httpexceptions as exc

from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from chsdi.lib.validation.mapservice import MapServiceValidation
from chsdi.models import models_from_name
from chsdi.models.bod import LayersConfig, get_bod_model, computeHeader
from chsdi.lib.filters import *

SAMPLE_SIZE = 100
MAX_ATTRIBUTES_VALUES = 5


class LayersParams(MapServiceValidation):

    def __init__(self, request):
        super(LayersParams, self).__init__()

        # Map and topic represent the same resource
        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.cbName = request.params.get('callback')
        self.lang = request.lang
        self.searchText = request.params.get('searchText')
        # Not to be published in doc
        self.chargeable = request.params.get('chargeable')
        self.geodataStaging = request.registry.settings['geodata_staging']

        self.translate = request.translate
        self.request = request


@view_config(route_name='mapservice', renderer='jsonp')
def metadata(request):
    params = LayersParams(request)
    model = get_bod_model(params.lang)
    query = params.request.db.query(model)
    query = _filter_on_chargeable_attr(params, query, model)
    if params.searchText is not None:
        query = full_text_search(
            query,
            [
                model.fullTextSearch,
                model.layerBodId,
                model.idGeoCat
            ],
            params.searchText
        )
    results = computeHeader(params.mapName)
    for layer in get_layers_metadata_for_params(params, query, model):
        results['layers'].append(layer)
    return results


@view_config(route_name='layersConfig', renderer='jsonp')
def layers_config(request):
    params = LayersParams(request)
    query = params.request.db.query(LayersConfig)
    layers = {}
    for layer in get_layers_config_for_params(params, query, LayersConfig):
        layers = dict(layers.items() + layer.items())
    return layers


@view_config(route_name='legend', renderer='jsonp')
def legend(request):
    params = LayersParams(request)
    layerId = request.matchdict.get('layerId')
    model = get_bod_model(params.lang)
    query = params.request.db.query(model)
    layerMetadata = next(get_layers_metadata_for_params(
        params,
        query,
        model,
        layerIds=[layerId]
    ))
    # FIXME datenstand if not defined
    # should be available in view_bod_layer_info
    if 'attributes' in layerMetadata:
        if 'dataStatus' in layerMetadata['attributes']:
            status = layerMetadata['attributes']['dataStatus']
            if status == u'bgdi_created':
                layerMetadata['attributes']['dataStatus'] = params.translate('None') + params.translate('Datenstand')
    legend = {
        'layer': layerMetadata,
        'hasLegend': _has_legend(layerId, params.lang)
    }
    response = render_to_response(
        'chsdi:templates/legend.mako',
        {'legend': legend},
        request=request
    )
    if params.cbName is None:
        return response
    return response.body


def _find_type(model, colProp):
    if hasattr(model, '__table__') and hasattr(model, colProp):
        return model.get_column_by_name(colProp).type


def _get_models_attributes_keys(models):
    allAttributes = []
    for model in models:
        if hasattr(model, '__queryable_attributes__'):
            attributes = model.__queryable_attributes__
        else:
            # Maybe this should be removed since only searchable layers
            # have attributes that can be queried
            attributes = model().getAttributesKeys(excludePkey=False)
        allAttributes = allAttributes + attributes
    return list(set(allAttributes))


# Could be moved in features.py as it accesses vector models
@view_config(route_name='featureAttributes', renderer='jsonp')
def feature_attributes(request):
    ''' This service is used to expose the
    attributes of vector layers. '''
    params = LayersParams(request)
    layerId = request.matchdict.get('layerId')
    models = models_from_name(layerId)
    # Models for the same layer have the same attributes
    if models is None:
        raise exc.HTTPBadRequest('No Vector Table was found for %s' % layerId)

    # Take into account all models and remove duplicated keys
    attributes = _get_models_attributes_keys(models)
    trackAttributesNames = []
    fields = []

    def insertValueAt(field, attrName, value):
        if field['name'] == attrName:
            if len(field['values']) < MAX_ATTRIBUTES_VALUES and \
               value not in field['values']:
                field['values'].append(value)
                field['values'].sort()
        return field

    for model in models:
        query = params.request.db.query(model)
        query = query.limit(SAMPLE_SIZE)

        for rowIndex, row in enumerate(query):
            # attrName as defined in the model
            for attrIndex, attrName in enumerate(attributes):
                featureAttrs = row.getAttributes(excludePkey=False)
                if attrName not in trackAttributesNames and \
                   attrName in featureAttrs:
                    fieldType = _find_type(model(), attrName)
                    fields.append({'name': attrName, 'type': str(fieldType),
                                   'alias': params.translate("%s.%s" % (layerId, attrName)),
                                   'values': []
                                   })
                    trackAttributesNames.append(attrName)
                if attrName in featureAttrs:
                    for fieldsIndex, field in enumerate(fields):
                        value = featureAttrs[attrName]
                        if isinstance(value, (decimal.Decimal, datetime.date, datetime.datetime)):
                            value = str(value)
                        fields[fieldsIndex] = insertValueAt(field, attrName, value)

    return {'id': layerId, 'name': params.translate(layerId), 'fields': fields}


def _has_legend(layerId, lang):
    legendsDir = os.path.join(os.path.dirname(__file__), '../static/images/legends')
    image = "%s_%s.png" % (layerId, lang)
    imageFullPath = os.path.abspath(os.path.join(legendsDir, image))
    return os.path.exists(imageFullPath)


def _filter_on_chargeable_attr(params, query, model):
    ''' Filter on chargeable parameter '''
    if params.chargeable is not None:
        return query.filter(model.chargeable == params.chargeable)
    return query


def get_layer(query, model, layerId):
    ''' Returns exactly one layer or raises
    an exception. This function can be used with
    both a layer config model or a layer metadata
    model. '''
    query = query.filter(model.layerBodId == layerId)

    try:
        layer = query.one()
    except NoResultFound:
        raise exc.HTTPNotFound('No layer with id %s' % layerId)
    except MultipleResultsFound:
        raise exc.HTTPInternalServerError('Multiple layers found for the same id %s' % layerId)

    return layer


def get_layers_metadata_for_params(params, query, model, layerIds=None):
    ''' Returns a generator function that yields
    layer metadata dictionaries. '''
    query = filter_by_map_name(
        query,
        model,
        params.mapName
    )
    query = filter_by_geodata_staging(
        query,
        model.staging,
        params.geodataStaging
    )
    if layerIds is not None:
        for layerId in layerIds:
            layer = get_layer(query, model, layerId)
            yield layer.layerMetadata()

    for q in query:
        yield q.layerMetadata()


def get_layers_config_for_params(params, query, model, layerIds=None):
    ''' Returns a generator function that yields
    layer config dictionaries. '''
    model = LayersConfig
    query = filter_by_map_name(
        query,
        model,
        params.mapName
    )
    query = filter_by_geodata_staging(
        query,
        model.staging,
        params.geodataStaging
    )
    if layerIds is not None:
        for layerId in layerIds:
            layer = get_layer(query, model, layerId)
            yield layer.layerConfig(params)

    for q in query:
        yield q.layerConfig(params)
