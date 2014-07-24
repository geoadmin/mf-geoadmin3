# -*- coding: utf-8 -*-

import json
from sqlalchemy.orm import scoped_session, sessionmaker

from pyramid.view import view_config
from pyramid.renderers import render_to_response
from pyramid.httpexceptions import HTTPNotFound, HTTPInternalServerError
from pyramid.request import Request

from chsdi.models.bod import Catalog
from chsdi.lib.validation.sitemaps import SiteMapValidation

__AMPERSAND__ = '&amp;'


class SiteMaps(SiteMapValidation):

    def __init__(self, request):
        super(SiteMaps, self).__init__()
        self.content = request.params.get('content')
        self.basename = 'sitemap'
        self.host = request.registry.settings['geoadminhost']
        self.request = request
        self.langs = ['de', 'fr', 'it', 'rm', 'en']


@view_config(route_name='sitemap')
def sitemap(request):
    params = SiteMaps(request)
    funcs = {
        'index': index,
        'base': base,
        'topics': topics,
        'layers': layers
    }
    if params.content not in funcs:
        raise HTTPNotFound('Missing function definition')

    return funcs[params.content](params)


def index(params):
    # We don't want to include a self-reference
    filteredlist = filter(lambda x: x != 'index', params.contents)
    buildFileNames = lambda x: params.basename + '_' + x + '.xml'
    data = {
        'host': params.host,
        'sitemaps': map(buildFileNames, filteredlist)
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
    session = scoped_session(sessionmaker())
    paths = []
    topics = getTopics(params)
    for topic in topics:
        query = (session.query(Catalog)
                 .filter(Catalog.topic.ilike('%%%s%%' % topic['id']))
                 .filter(Catalog.category.ilike('%%layer%%')))
        layerlinks = map(buildlink, query.all())
        paths.extend(toAllLanguages(topic['langs'].split(','), layerlinks, __AMPERSAND__, ''))
    session.close()
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
