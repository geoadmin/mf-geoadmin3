# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.models.bod import get_wmts_models
from chsdi.lib.helpers import locale_negotiator
from chsdi.lib.validation import MapNameValidation


class WMTSCapabilites(MapNameValidation):

    def __init__(self, request):
        super(WMTSCapabilites, self).__init__()
        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.lang = request.lang
        self.models = get_wmts_models(self.lang)
        self.request = request

    @view_config(route_name='wmtscapabilities', http_cache=0)
    def wmtscapabilities(self):
        from pyramid.renderers import render_to_response
        scheme = self.request.headers.get(
            'X-Forwarded-Proto',
            self.request.scheme)
        request_uri = self.request.environ.get("REQUEST_URI", "")
        onlineressource = "%s://wmts.geo.admin.ch" % scheme if request_uri\
            .find("1.0.0") else "%s://api.geo.admin.ch/wmts" % scheme

        cap = self.request.db.query(self.models['GetCap'])\
            .filter(self.models['GetCap']
                    .projekte.ilike('%%%s%%' % self.mapName)).all()

        if hasattr(self.models['GetCapThemes'], 'oberthema_id'):
            themes = self.request.db.query(self.models['GetCapThemes']).order_by(self.models['GetCapThemes'].oberthema_id).all()
        else:
            themes = self.request.db.query(self.models['GetCapThemes']).all()

        metadata = self.request.db.query(self.models['ServiceMetadata'])\
            .filter(self.models['ServiceMetadata']
                    .pk_map_name.like('%wmts-bgdi%')).first()

        wmts = {
            'layers': cap,
            'themes': themes,
            'metadata': metadata,
            'scheme': scheme,
            'onlineressource': onlineressource
        }
        response = render_to_response(
            'chsdi:templates/wmtscapabilities.mako',
            wmts,
            request=self.request)
        response.content_type = 'text/xml'
        return response
