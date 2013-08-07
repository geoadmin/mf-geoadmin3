# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.lib.validation import SearchValidation
from chsdi.lib.helpers import locale_negotiator, remove_accents
from chsdi.lib.sphinxapi import sphinxapi
from chsdi.lib import mortonspacekey as msk


class Search(SearchValidation):
    ''' 
        The config file is stored at /var/sig/shp/sphinx/local/etc/sphinx.conf
        The indexes are stored in /var/sig/shp/sphinx/data 
        To update all the indexes: /var/sig/shp/sphinx/local/bin/indexer --config /var/sig/shp/sphinx/local/etc/sphinx.conf --rotate
        To stop the deamon: /var/sig/shp/sphinx/local/bin/searchd --config /var/sig/shp/sphinx/local/etc/sphinx.conf --stop
        To start the deamon: /var/sig/shp/sphinx/local/bin/searchd --config /var/sig/shp/sphinx/local/etc/sphinx.conf
        This service always returns a maximum ranging between 30 and 30 + x*5 results, where x is the number of queryable layers.
        More results can be retruned if serveral layers are 
        queried for features. 
    '''

    LIMIT = 30
    LAYER_LIMIT = 20
    FEATURE_LIMIT = 5

    def __init__(self, request):
        super(Search, self).__init__()
        self.quadtree = msk.QuadTree(msk.BBox(420000,30000,900000,510000),20)
        self.sphinx = sphinxapi.SphinxClient()
        self.sphinx.SetServer("localhost", 3312)
        self.sphinx.SetMatchMode(sphinxapi.SPH_MATCH_EXTENDED)

        self.mapName = request.matchdict.get('map')
        self.searchText = remove_accents(request.params.get('searchText'))
        self.lang = str(locale_negotiator(request))
        self.cbName = request.params.get('callback')
        self.bbox =  request.params.get('bbox')
        self.quadindex = None
        self.featureIndexes = request.params.get('features')
        self.typeInfo = request.params.get('type')
        self.geodataStaging = request.registry.settings['geodata_staging']
        self.results = {'results': []}
       
    @view_config(route_name='search', renderer='jsonp')
    def search(self):
        # create a quadindex if the bbox is defined
        if self.bbox is not None and self.typeInfo != 'layers':
            self._get_quad_index()
        if self.typeInfo == 'layers':
            self._layer_search()
        if self.featureIndexes is not None and self.typeInfo == 'locations':
            limit = len(self.featureIndexes)*self.FEATURE_LIMIT + self.LIMIT
            features = self._feature_search()
            limit -= features
        else:
            limit = self.LIMIT
        if self.typeInfo == 'locations':
            self._swiss_search(limit)
        return self.results

    def _swiss_search(self, limit):
        # 20 addresses in general, priority according to list order
        indexes = ('zipcode', 'district', 'kantone', 'gg25', 'sn25', 'parcel', 'address')
        for idx in indexes:
            if limit > 0:
                self.sphinx.SetLimits(0, limit)
                if self.quadindex is not None:
                    searchText = self._query_detail('@detail')
                    searchText += ' & @geom_quadindex ' + self.quadindex + '*'
                else:
                    searchText = self._query_detail('@detail')
                temp = self.sphinx.Query(searchText, index=idx)['matches']
                if len(temp) != 0:
                    self.results['results'] += temp
                limit -= len(temp)
            else:
                break

        if self.quadindex is not None:
            for idx in indexes:
                # if the limit has not been reached yet, try to look outside the bbox
                if limit > 0:
                    self.sphinx.SetLimits(0, limit)
                    searchText = self._query_detail('@detail')
                    searchText += ' & @geom_quadindex !' + self.quadindex + '*'
                    temp = self.sphinx.Query(searchText, index=idx)['matches']
                    if len(temp) != 0:
                        self.results['results'] += temp
                    limit -= len(temp)
                else:
                    break
             

    def _layer_search(self):
        # 10 features per layer are returned at max
        self.sphinx.SetLimits(0, self.LAYER_LIMIT)
        index_name = 'layers_' + self.lang
        searchText = self._query_layers_detail('@(detail,layer)')
        searchText += ' & @topics ' + self.mapName
        # We only take the layers in prod for now
        searchText += ' & @staging prod'
        temp = self.sphinx.Query(searchText, index=index_name)
        if len(temp['matches']) != 0:
            self.results['results'] += temp['matches']
        return len(temp)

    def _feature_search(self):
        # 5 features per layer are returned at max
        self.sphinx.SetLimits(0, self.FEATURE_LIMIT)
        if self.quadindex is None:
            searchText = self._query_detail('@detail')
            self._add_feature_queries(searchText)
        else:
            searchText = self._query_detail('@detail')
            searchText += ' & @geom_quadindex ' + self.quadindex + '*'
            self._add_feature_queries(searchText)
        temp = self.sphinx.RunQueries()
        nb_match = self._nb_of_match(temp)

        # look outside the bbox if no match when the bbox is defined
        if self.quadindex is not None and nb_match == 0:
            searchText = self._query_detail('@detail')
            searchText += ' & @geom_quadindex !' + self.quadindex + '*'
            self._add_feature_queries(searchText)
            
            temp = self.sphinx.RunQueries()
            nb_match = self._nb_of_match(temp)

        return nb_match

    def _query_detail(self, fields):
        searchText = ''
        counter = 1
        for text in self.searchText:
            if counter != len(self.searchText):
                searchText += fields + ' *' + text + '* & '
            else:
                searchText += fields + ' *' + text + '*'
            counter += 1
        return searchText

    def _query_layers_detail(self, fields):
        searchText = ''
        counter = 1
        for text in self.searchText:
            if counter != len(self.searchText):
                searchText += fields + ' ' + text + ' & '
            else:
                searchText += fields + ' ' + text
            counter += 1
        return searchText

    def _add_feature_queries(self, searchText):
        for index in self.featureIndexes:
            self.sphinx.AddQuery(searchText, index=str(index))

    def _nb_of_match(self, results):
        nb_match = 0 
        for i in range(0, len(results)):
            nb_match += len(results[i]['matches'])
            # Add results to the list
            self.results['results'] += results[i]['matches']
        return nb_match

    def _get_quad_index(self):
        try:
            self.quadindex = self.quadtree.bbox_to_morton(msk.BBox(self.bbox[0],
                                                                   self.bbox[1],
                                                                   self.bbox[2],
                                                                   self.bbox[3])) 
        except ValueError:
            self.quadindex = None 
