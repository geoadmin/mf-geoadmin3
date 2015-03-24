# -*- coding: utf-8 -*-

import json
import math
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPInternalServerError
from pyramid.renderers import render_to_response
from pyramid.request import Request

from chsdi.lib.validation.sitemaps import SiteMapValidation
from chsdi.lib.filters import filter_by_geodata_staging

from chsdi.models.vector.kogis import SitemapGebaeuderegister
from chsdi.models.bod import Catalog


class SiteMaps(SiteMapValidation):

    def __init__(self, request):
        super(SiteMaps, self).__init__()
        self.content = request.params.get('content')
        self.basename = 'sitemap'
        self.host = request.registry.settings['geoadminhost']
        self.staging = request.registry.settings['geodata_staging']
        self.request = request
        self.langs = ['de', 'fr', 'it', 'rm', 'en']

# Maximum number of urls allowed in multi-files
__MAX_NUM_URLS__ = 5000
__AMPERSAND__ = '&amp;'


@view_config(route_name='sitemap')
def sitemap(request):
    params = SiteMaps(request)
    funcs = {
        'index': index,
        'base': base,
        'topics': topics,
        'layers': layers,
        'addresses': addresses
    }
    if params.content not in funcs:
        raise HTTPNotFound('Missing function definition')

    return funcs[params.content](params)


def index(params):
    buildFileNames = lambda x: params.basename + '_' + x + '.xml'
    data = {
        'host': params.host,
        'sitemaps': map(buildFileNames, params.in_index)
    }

    response = render_to_response(
        'chsdi:templates/sitemapindex.mako',
        data,
        request=params.request)
    response.content_type = 'application/xml'
    return response


def base(params):
    paths = toAllLanguages(params.langs, ['?'], '', '')
    return asXml(params, paths)


def topics(params):
    topics = getTopics(params)
    paths = []
    for topic in topics:
        langs = topic['langs'].split(',')
        pathstart = '?topic=' + topic['id']
        paths.extend(toAllLanguages(langs, [pathstart], __AMPERSAND__, ''))

    return asXml(params, paths)


def layers(params):
    buildlink = lambda x: '?topic=' + topic['id'] + __AMPERSAND__ + 'layers=' + x.layerBodId
    session = params.request.db
    paths = []
    topics = getTopics(params)
    for topic in topics:
        query = (session.query(Catalog)
                 .filter(Catalog.topic.ilike('%%%s%%' % topic['id']))
                 .filter(Catalog.category.ilike('%%layer%%')))
        query = filter_by_geodata_staging(query, Catalog.staging, params.staging)
        layerlinks = map(buildlink, query.all())
        paths.extend(toAllLanguages(topic['langs'].split(','), layerlinks, __AMPERSAND__, ''))

    return asXml(params, paths)


def addresses(params):
    # index file
    if params.multi_part is None:
        return address_index(params)
    else:
        return address_part(params)


def address_index(params):
    session = params.request.db
    count = session.query(SitemapGebaeuderegister).count()
    max_index = int(math.ceil(count / __MAX_NUM_URLS__))
    names = lambda x: params.basename + '_addresses_' + str(x) + '.xml'
    data = {
        'host': params.host,
        'sitemaps': map(names, range(max_index))
    }
    response = render_to_response(
        'chsdi:templates/sitemapindex.mako',
        data,
        request=params.request)
    response.content_type = 'application/xml'
    return response


def address_part(params):
    session = params.request.db
    query = (session.query(SitemapGebaeuderegister)
             .order_by(SitemapGebaeuderegister.id)
             .offset(params.multi_part)
             .limit(__MAX_NUM_URLS__))
    paths = []
    for res in query.all():
        paths.append('?' + res.__bodId__ + '=' + res.id + __AMPERSAND__ +
                     'X=' + str(int(res.X)) + __AMPERSAND__ +
                     'Y=' + str(int(res.Y)) + __AMPERSAND__ +
                     'zoom=9')
    return asXml(params, paths)


def getTopics(params):
    # Getting all topics
    subreq = Request.blank('/rest/services')
    topicresp = params.request.invoke_subrequest(subreq)
    if topicresp.status_int != 200:
        raise HTTPInternalServerError('Topics service did not return OK status')
    return json.loads(topicresp.body)['topics']


def asXml(params, paths):
    data = {
        'host': params.host,
        'list': paths
    }
    response = render_to_response(
        'chsdi:templates/sitemapurls.mako',
        data,
        request=params.request)
    response.content_type = 'application/xml'
    return response


def toAllLanguages(langs, links, pre, post):
    ret = []
    for lan in langs:
        ret.extend(map(lambda x: x + pre + 'lang=' + lan + post, links))
    return ret
