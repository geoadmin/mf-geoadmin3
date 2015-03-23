# -*- coding: utf-8 -*-

import datetime
from pyramid.config import Configurator
from pyramid.events import BeforeRender, NewRequest
from chsdi.subscribers import add_localizer, add_renderer_globals
from pyramid.renderers import JSONP
from sqlalchemy.orm import scoped_session, sessionmaker

from chsdi.renderers import EsriJSON, CSVRenderer
from chsdi.models import initialize_sql
from papyrus.renderers import GeoJSON
from chsdi.lib.raster.georaster import init_rasterfiles


def db(request):
    maker = request.registry.dbmaker
    session = maker()

    def cleanup(request):
        session.close()
    request.add_finished_callback(cleanup)

    return session


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    app_version = settings.get('app_version')
    settings['app_version'] = app_version
    config = Configurator(settings=settings)
    config.include('pyramid_mako')

    # init raster files for height/profile and preload COMB file
    init_rasterfiles(settings.get('dtm_base_path'), ['COMB'])

    # configure 'locale' dir as the translation dir for chsdi app
    config.add_translation_dirs('chsdi:locale/')
    config.add_subscriber(add_localizer, NewRequest)
    config.add_subscriber(add_renderer_globals, BeforeRender)

    # renderers
    config.add_mako_renderer('.html')
    config.add_mako_renderer('.js')
    config.add_renderer('jsonp', JSONP(param_name='callback', indent=None, separators=(',', ':')))
    config.add_renderer('geojson', GeoJSON(jsonp_param_name='callback'))
    config.add_renderer('esrijson', EsriJSON(jsonp_param_name='callback'))
    config.add_renderer('csv', CSVRenderer)

    # sql section
    config.registry.dbmaker = scoped_session(sessionmaker())
    config.add_request_method(db, reify=True)
    initialize_sql(settings)

    # route definitions
    config.add_route('ogcproxy', '/ogcproxy')
    config.add_route('print_create', '/printmulti/create.json')
    config.add_route('print_progress', '/printprogress')
    config.add_route('print_cancel', '/printcancel')
    config.add_route('dev', '/dev')
    config.add_route('ga_api', '/uncached_loader.js')
    config.add_route('testi18n', '/testi18n')
    config.add_route('topics', '/rest/services')
    config.add_route('mapservice', '/rest/services/{map}/MapServer')
    config.add_route('layersConfig', '/rest/services/{map}/MapServer/layersConfig')
    config.add_route('catalog', '/rest/services/{map}/CatalogServer')
    config.add_route('identify', '/rest/services/{map}/MapServer/identify')
    config.add_route('find', '/rest/services/{map}/MapServer/find')
    config.add_route('attribute_values', '/rest/services/{map}/MapServer/{layerId}/attributes/{attribute}')
    config.add_route('legend', '/rest/services/{map}/MapServer/{layerId}/legend')
    config.add_route('releases', '/rest/services/{map}/MapServer/{layerId}/releases')
    config.add_route('featureAttributes', '/rest/services/{map}/MapServer/{layerId}')
    config.add_route('feature', '/rest/services/{map}/MapServer/{layerId}/{featureId}')
    config.add_route('htmlPopup', '/rest/services/{map}/MapServer/{layerId}/{featureId}/htmlPopup')
    config.add_route('extendedHtmlPopup', '/rest/services/{map}/MapServer/{layerId}/{featureId}/extendedHtmlPopup')
    config.add_route('search', '/rest/services/{map}/SearchServer')
    config.add_route('wmtscapabilities', '/rest/services/{map}/1.0.0/WMTSCapabilities.xml')
    config.add_route('profile_json', '/rest/services/profile.json')
    config.add_route('profile_csv', '/rest/services/profile.csv')
    config.add_route('height', '/rest/services/height')
    config.add_route('feedback', '/feedback')
    config.add_route('owschecker_bykvp', '/owschecker/bykvp')
    config.add_route('owschecker_form', '/owschecker/form')
    config.add_route('qrcodegenerator', '/qrcodegenerator')
    config.add_route('sitemap', '/sitemap')
    config.add_route('luftbilder', '/luftbilder/viewer.html')
    config.add_route('checker', '/checker')
    config.add_route('checker_dev', '/checker_dev')
    config.add_route('downloadkml', '/downloadkml')

    # Some views for specific routes
    config.add_view(route_name='dev', renderer='chsdi:templates/index.mako')
    config.add_view(route_name='testi18n', renderer='chsdi:templates/testi18n.mako')

    # Shortener
    config.add_route('shorten', '/shorten.json')
    config.add_route('shorten_redirect', '/shorten/{id}')

    # static view definitions
    config.add_static_view('static', 'chsdi:static')
    config.add_static_view('images', 'chsdi:static/images')
    config.add_static_view('examples', 'chsdi:static/doc/examples')
    # keep this the last one
    config.add_static_view('/', 'chsdi:static/doc/build')

    # required to find code decorated by view_config
    config.scan(ignore=['chsdi.tests', 'chsdi.models.bod', 'chsdi.models.vector'])
    return config.make_wsgi_app()
