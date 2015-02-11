# -*- coding: utf-8 -*-

from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound

from chsdi.models.bod import get_wmts_models
from chsdi.lib.helpers import locale_negotiator, sanitize_url
from chsdi.lib.validation import MapNameValidation
from chsdi.lib.filters import *


DEFAULT_TILEMATRIXSET = {0: [4000, 1, 1, 14285714.2857],
                         1: [3750, 1, 1, 13392857.1429],
                         2: [3500, 1, 1, 12500000.0],
                         3: [3250, 1, 1, 11607142.8571],
                         4: [3000, 1, 1, 10714285.7143],
                         5: [2750, 1, 1, 9821428.57143],
                         6: [2500, 1, 1, 8928571.42857],
                         7: [2250, 1, 1, 8035714.28571],
                         8: [2000, 1, 1, 7142857.14286],
                         9: [1750, 2, 1, 6250000.0],
                         10: [1500, 2, 1, 5357142.85714],
                         11: [1250, 2, 1, 4464285.71429],
                         12: [1000, 2, 2, 3571428.57143],
                         13: [750, 3, 2, 2678571.42857],
                         14: [650, 3, 2, 2321428.57143],
                         15: [500, 4, 3, 1785714.28571],
                         16: [250, 8, 5, 892857.142857],
                         17: [100, 19, 13, 357142.857143],
                         18: [50, 38, 25, 178571.428571],
                         19: [20, 94, 63, 71428.5714286],
                         20: [10, 188, 125, 35714.2857143],
                         21: [5, 375, 250, 17857.1428571],
                         22: [2.5, 750, 500, 8928.57142857],
                         23: [2.0, 938, 625, 7142.85714286],
                         24: [1.5, 1250, 834, 5357.14285714],
                         25: [1.0, 1875, 1250, 3571.42857143],
                         26: [0.5, 3750, 2500, 1785.71428571],
                         27: [0.25, 7500, 5000, 892.857142857],
                         28: [0.10, 18750, 12500, 357.142857143]}


class WMTSCapabilites(MapNameValidation):

    def __init__(self, request):
        super(WMTSCapabilites, self).__init__()
        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.lang = request.lang
        self.models = get_wmts_models(self.lang)
        self.request = request
        epsg = request.params.get('epsg', '21781')
        available_epsg_codes = ['21781', '4326', '2056', '4258', '3857']
        if epsg in available_epsg_codes:
            if self.mapName != 'api' and epsg != '21781':
                raise HTTPNotFound("EPSG:%s only available for topic 'api'" % epsg)
            self.tileMatrixSet = epsg
        else:
            raise HTTPBadRequest('EPSG:%s not found. Must be one of %s' % (epsg, ", ".join(available_epsg_codes)))

    @view_config(route_name='wmtscapabilities', http_cache=0)
    def wmtscapabilities(self):
        from pyramid.renderers import render_to_response
        scheme = self.request.headers.get(
            'X-Forwarded-Proto',
            self.request.scheme)
        staging = self.request.registry.settings['geodata_staging']
        host = self.request.headers.get(
            'X-Forwarded-Host', self.request.host)
        mapproxyHost = self.request.registry.settings['mapproxyhost']
        request_uri = self.request.environ.get("REQUEST_URI", "")
        apache_base_path = self.request.registry.settings['apache_base_path']
        apache_entry_point = '/' if (apache_base_path == 'main' or 'localhost' in host) else '/' + apache_base_path

        # Default ressource
        s3_url = sanitize_url("%s://wmts.geo.admin.ch/" % scheme)
        mapproxy_url = sanitize_url("%s://%s%s/" % (scheme, mapproxyHost, apache_entry_point))
        onlineressources = {'mapproxy': mapproxy_url, 's3': s3_url}

        layers_query = self.request.db.query(self.models['GetCap'])
        layers_query = filter_by_geodata_staging(
            layers_query,
            self.models['GetCap'].staging,
            staging
        )
        if self.mapName != 'all':
            layers_query = filter_by_map_name(layers_query, self.models['GetCap'], self.mapName)
        layers = layers_query.all()
        if hasattr(self.models['GetCapThemes'], 'oberthema_id'):
            themes = self.request.db.query(self.models['GetCapThemes']).order_by(self.models['GetCapThemes'].oberthema_id).all()
        else:
            themes = self.request.db.query(self.models['GetCapThemes']).all()

        metadata = self.request.db.query(self.models['ServiceMetadata'])\
            .filter(self.models['ServiceMetadata']
                    .pk_map_name.like('%wmts-bgdi%')).first()

        wmts = {
            'layers': layers,
            'themes': themes,
            'metadata': metadata,
            'scheme': scheme,
            'onlineressources': onlineressources,
            'tilematrixset': self.tileMatrixSet,
            'tilematrixsetDefs': DEFAULT_TILEMATRIXSET
        }
        response = render_to_response(
            'chsdi:templates/wmtscapabilities.mako',
            wmts,
            request=self.request)
        response.content_type = 'text/xml'
        return response
