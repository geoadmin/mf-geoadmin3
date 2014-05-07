# -*- coding: utf-8 -*-

import datetime
from pyramid.mako_templating import renderer_factory as mako_renderer_factory
from pyramid.config import Configurator
from pyramid.events import BeforeRender, NewRequest
from chsdi.subscribers import add_localizer, add_renderer_globals
from pyramid.renderers import JSONP
from sqlalchemy.orm import scoped_session, sessionmaker

from chsdi.renderers import EsriJSON, CSVRenderer
from chsdi.models import initialize_sql
from papyrus.renderers import GeoJSON


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

    # ogcproxy
    config.add_route('ogcproxy', '/ogcproxy')

    # printproxy
    config.add_route('printproxy', '/printproxy')

    # configure 'locale' dir as the translation dir for chsdi app
    config.add_translation_dirs('chsdi:locale/')
    config.add_subscriber(add_localizer, NewRequest)
    config.add_subscriber(add_renderer_globals, BeforeRender)

    # renderers
    config.add_renderer('.html', mako_renderer_factory)
    config.add_renderer('.js', mako_renderer_factory)
    config.add_renderer('jsonp', JSONP(param_name='callback', indent=4))
    config.add_renderer('geojson', GeoJSON(jsonp_param_name='callback'))
    config.add_renderer('esrijson', EsriJSON(jsonp_param_name='callback'))
    config.add_renderer('csv', CSVRenderer)

    # sql section
    config.registry.dbmaker = scoped_session(sessionmaker())
    config.add_request_method(db, reify=True)
    initialize_sql(settings)

    # Static config
    config.add_route('home', '/')
    config.add_route('dev', '/dev')
    config.add_route('ga_api', '/loader.js')
    config.add_route('testi18n', '/testi18n')
    config.add_view(route_name='home', renderer='chsdi:static/doc/build/index.html', http_cache=3600)
    config.add_view(route_name='dev', renderer='chsdi:templates/index.pt', http_cache=0)
    config.add_view(route_name='testi18n', renderer='chsdi:templates/testi18n.mako', http_cache=0)

    # Application specific
    config.add_route('topics', '/rest/services')
    config.add_route('mapservice', '/rest/services/{map}/MapServer')
    config.add_route('layersConfig', '/rest/services/{map}/MapServer/layersConfig')
    config.add_route('catalog', '/rest/services/{map}/CatalogServer')
    config.add_route('identify', '/rest/services/{map}/MapServer/identify')
    config.add_route('find', '/rest/services/{map}/MapServer/find')
    config.add_route('legend', '/rest/services/{map}/MapServer/{layerId}/legend')
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

    # Service to create the luftbilder viewer
    config.add_route('luftbilder', '/luftbilder/viewer.html')
    # We keep the route to the old name to not loose existing links
    config.add_route('iipimage', '/iipimage/viewer.html')

    # Service to create snapshot of map.geo.admin.ch
    config.add_route('snapshot', '/snapshot')

    # Checker section
    config.add_route('checker', '/checker')
    config.add_route('checker_dev', '/checker_dev')

    config.scan(ignore=['chsdi.tests', 'chsdi.models.bod', 'chsdi.models.vector'])  # required to find code decorated by view_config

    config.add_static_view('static', 'chsdi:static', cache_max_age=datetime.timedelta(days=365))
    config.add_static_view('static/css', 'chsdi:static/css', cache_max_age=datetime.timedelta(days=365))
    config.add_static_view('static/js', 'chsdi:static/js', cache_max_age=datetime.timedelta(days=365))
    config.add_static_view('static/images', 'chsdi:static/images', cache_max_age=datetime.timedelta(days=365))
    config.add_static_view('img', 'chsdi:static/images', cache_max_age=datetime.timedelta(days=365))
    config.add_static_view('examples', 'chsdi:static/doc/examples', cache_max_age=datetime.timedelta(days=365))
    # Static view for sphinx
    config.add_static_view('/', 'chsdi:static/doc/build', cache_max_age=datetime.timedelta(days=365))

    return config.make_wsgi_app()
