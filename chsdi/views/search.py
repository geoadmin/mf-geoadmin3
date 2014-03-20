# -*- coding: utf-8 -*-

from pyramid.view import view_config
import pyramid.httpexceptions as exc

from chsdi.lib.validation import SearchValidation
from chsdi.lib.helpers import remove_accents
from chsdi.lib.helpers import transformCoordinate
from chsdi.lib.sphinxapi import sphinxapi
from chsdi.lib import mortonspacekey as msk

import re


class Search(SearchValidation):

    LIMIT = 50
    LAYER_LIMIT = 30
    FEATURE_LIMIT = 10
    FEATURE_GEO_LIMIT = 200

    def __init__(self, request):
        super(Search, self).__init__()
        self.quadtree = msk.QuadTree(
            msk.BBox(420000, 30000, 900000, 510000), 20)
        self.sphinx = sphinxapi.SphinxClient()
        self.sphinxHost = request.registry.settings['sphinxhost']
        self.sphinx.SetServer(self.sphinxHost, 9312)
        self.sphinx.SetMatchMode(sphinxapi.SPH_MATCH_EXTENDED)

        self.mapName = request.matchdict.get('map')
        self.hasMap(request.db, self.mapName)
        self.lang = request.lang
        self.cbName = request.params.get('callback')
        self.bbox = request.params.get('bbox')
        self.returnGeometry = request.params.get('returnGeometry', 'true').lower() == 'true'
        self.quadindex = None
        self.featureIndexes = request.params.get('features')
        self.timeInstant = request.params.get('timeInstant')
        self.timeEnabled = request.params.get('timeEnabled')
        self.typeInfo = request.params.get('type')
        self.varnish_authorized = request.headers.get('X-Searchserver-Authorized', 'true').lower() == 'true'

        self.geodataStaging = request.registry.settings['geodata_staging']
        self.results = {'results': []}
        self.request = request

    @view_config(route_name='search', renderer='jsonp')
    def search(self):
        self.sphinx.SetConnectTimeout(2.0)
        # create a quadindex if the bbox is defined
        if self.bbox is not None and self.typeInfo != 'layers':
            self._get_quad_index()
        if self.typeInfo == 'layers':
            # search all layers
            self.searchText = remove_accents(
                self.request.params.get('searchText')
            )
            self._layer_search()
        if self.typeInfo in ('features', 'featureidentify'):
            # search all features within bounding box
            self._feature_bbox_search()
        if self.typeInfo == 'featuresearch':
            # search all features using searchText
            self.searchText = remove_accents(
                self.request.params.get('searchText')
            )
            self._feature_search()
        if self.typeInfo == 'locations':
            # search all features with text and bounding box
            self.searchText = remove_accents(
                self.request.params.get('searchText')
            )
            self._feature_search()
            # swiss search
            self._swiss_search(self.LIMIT)
        return self.results

    def _swiss_search(self, limit):
        if len(self.searchText) < 1:
            return 0
        self.sphinx.SetLimits(0, limit)
        self.sphinx.SetRankingMode(sphinxapi.SPH_RANK_WORDCOUNT)
        self.sphinx.SetSortMode(sphinxapi.SPH_SORT_EXTENDED, 'rank ASC, @weight DESC, num ASC')
        searchText = self._query_fields('@detail')
        try:
            temp = self.sphinx.Query(searchText, index='swisssearch')
        except IOError:
            raise exc.HTTPGatewayTimeout()
        temp = temp['matches'] if temp is not None else temp
        if temp is not None and len(temp) != 0:
            nb_address = 0
            for res in temp:
                if res['attrs']['origin'] == 'address':
                    if nb_address < 20:
                        if not (self.varnish_authorized and self.returnGeometry):
                            if 'geom_st_box2d' in res['attrs'].keys():
                                del res['attrs']['geom_st_box2d']
                        self.results['results'].append(res)
                        nb_address += 1
                else:
                    self.results['results'].append(res)
            return len(temp)
        return 0

    def _layer_search(self):
        # 10 features per layer are returned at max
        self.sphinx.SetLimits(0, self.LAYER_LIMIT)
        self.sphinx.SetRankingMode(sphinxapi.SPH_RANK_WORDCOUNT)
        self.sphinx.SetSortMode(sphinxapi.SPH_SORT_EXTENDED, '@weight DESC')
        index_name = 'layers_%s' % self.lang
        mapName = self.mapName if self.mapName != 'all' else ''
        searchText = ' '.join((
            self._query_fields('@(detail,layer)'),
            '& @topics %s' % mapName,                 # Filter by to topic if string not empty
            '& @staging prod'                         # Only layers in prod are searched
        ))
        try:
            temp = self.sphinx.Query(searchText, index=index_name)
        except IOError:
            raise exc.HTTPGatewayTimeout()
        temp = temp['matches'] if temp is not None else temp
        if temp is not None and len(temp) != 0:
            self.results['results'] += temp
            return len(temp)
        return 0

    def _get_quadindex_string(self):
        ''' Recursive and inclusive search through
            quadindex windows. '''
        if self.quadindex is not None:
            buildQuadQuery = lambda x: ''.join(('@geom_quadindex ', x, ' | '))
            if len(self.quadindex) == 1:
                quadSearch = ''.join(('@geom_quadindex ', self.quadindex, '*'))
            else:
                quadSearch = ''.join(('@geom_quadindex ', self.quadindex, '* | '))
                quadSearch += ''.join(
                    buildQuadQuery(self.quadindex[:-x])
                    for x in range(1, len(self.quadindex))
                )[:-len(' | ')]
            return quadSearch
        return ''

    def _feature_search(self):
        # all features in given bounding box
        if self.featureIndexes is None:
            # we need bounding box and layernames. FIXME: this should be error
            return 0

        self.sphinx.SetLimits(0, self.FEATURE_LIMIT)
        self.sphinx.SetRankingMode(sphinxapi.SPH_RANK_WORDCOUNT)
        self.sphinx.SetSortMode(sphinxapi.SPH_SORT_EXTENDED, '@weight DESC')

        timeFilter = []
        timeInterval = re.search(r'((\b\d{4})-(\d{4}\b))', ' '.join(self.searchText)) or False
        # search for year with getparameter timeInstand=2010
        if self.timeInstant is not None:
            timeFilter = [self.timeInstant]
        # search for year interval with searchText Pattern .*YYYY-YYYY.*
        elif timeInterval:
            numbers = [timeInterval.group(2), timeInterval.group(3)]
            start = min(numbers)
            stop = max(numbers)
            # remove time intervall from searchtext
            self.searchText.remove(timeInterval.group(1))
            if min != max:
                timeFilter = [start, stop]
        searchdText = self._query_fields('@detail')
        if self.quadindex is not None:
            searchdText += ' & (' + self._get_quadindex_string() + ')'
        self._add_feature_queries(searchdText, timeFilter)
        try:
            temp = self.sphinx.RunQueries()
        except IOError:
            raise exc.HTTPGatewayTimeout()
        return self._parse_feature_results(temp)

    def _get_geoanchor_from_bbox(self):
        centerX = (self.bbox[2] + self.bbox[0]) / 2
        centerY = (self.bbox[3] + self.bbox[1]) / 2
        wkt = 'POINT(%s %s)' % (centerX, centerY)
        return transformCoordinate(wkt, 21781, 4326)

    def _feature_bbox_search(self):
        timeFilter = []
        if self.quadindex is None:
            raise exc.HTTPBadRequest('Please provide a bbox parameter')

        if self.featureIndexes is None:
            raise exc.HTTPBadRequest('Please provide a parameter features')

        self.sphinx.SetLimits(0, self.FEATURE_GEO_LIMIT)

        if self.timeInstant is not None:
            timeFilter = [self.timeInstant]
        geoAnchor = self._get_geoanchor_from_bbox()
        self.sphinx.SetGeoAnchor('lat', 'lon', geoAnchor.GetY(), geoAnchor.GetX())
        self.sphinx.SetSortMode(sphinxapi.SPH_SORT_EXTENDED, '@geodist ASC')

        geomFilter = self._get_quadindex_string()
        self._add_feature_queries(geomFilter,timeFilter)
        temp = self.sphinx.RunQueries()
        return self._parse_feature_results(temp)

    def _query_fields(self, fields):
        infix = lambda x: ''.join(('*', x, '* & '))
        prefix = lambda x: ''.join((x, '* & '))
        infixSearchText = ''.join(infix(text) for text in self.searchText)[:-len(' & ')]
        prefixSearchText = ''.join(prefix(text) for text in self.searchText)[:-len(' & ')]
        sentence = ' '.join(self.searchText)

        finalQuery = ''.join((
            '%s "^%s$" | ' % (fields, sentence),         # starts and ends with sentence
            '%s "^%s" | ' % (fields, sentence),          # starts with sentence
            '%s "%s$" | ' % (fields, sentence),          # ends with sentence
            '%s (%s)  | ' % (fields, prefixSearchText),  # matching all words one by one (prefix)
            '%s (%s)' % (fields, infixSearchText)        # matching all words one by one (infix)
        ))

        return finalQuery

    def _add_feature_queries(self, queryText, timeFilter):

        i=0
        for index in self.featureIndexes:
            if timeFilter and self.timeEnabled is not None and self.timeEnabled[i]:
                    if len(timeFilter) == 1:
                        self.sphinx.SetFilter('year', [self.timeInstant])
                    elif len(timeFilter) == 2:
                        self.sphinx.SetFilterRange('year', long(min(timeFilter)), long(max(timeFilter)))
            i += 1
            self.sphinx.AddQuery(queryText, index=str(index))

    def _parse_feature_results(self, results):
        nb_match = 0
        for i in range(0, len(results)):
            if 'error' in results[i]:
                if results[i]['error'] != '':
                    raise exc.HTTPNotFound(results[i]['error'])
            if results[i] is not None:
                nb_match += len(results[i]['matches'])
                # Add results to the list
                self.results['results'] += results[i]['matches']
        return nb_match

    def _get_quad_index(self):
        try:
            quadindex = self.quadtree\
                .bbox_to_morton(
                    msk.BBox(self.bbox[0],
                             self.bbox[1],
                             self.bbox[2],
                             self.bbox[3]))
            self.quadindex = quadindex if quadindex != '' else None
        except ValueError:
            self.quadindex = None
