# -*- coding: utf-8 -*-

from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound

from chsdi.models.bod import get_wmts_models
from chsdi.lib.helpers import sanitize_url
from chsdi.lib.validation import MapNameValidation
from chsdi.lib.filters import filter_by_geodata_staging, filter_by_map_name


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
            'tilematrixset': self.tileMatrixSet
        }
        response = render_to_response(
            'chsdi:templates/wmtscapabilities.mako',
            wmts,
            request=self.request)
        response.content_type = 'text/xml'
        return response
