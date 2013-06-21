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
        This service always returns a maximum ranging between 35 and 35 + x*5 results, where x is the number of layers on which we look for features.
        More results can be retruned if serveral layers are 
        queried for features. 
    '''

    LIMIT = 35
    LAYER_LIMIT = 10
    FEATURE_LIMIT = 5

    def __init__(self, request):
        super(Search, self).__init__()
        self.quadtree = msk.QuadTree(msk.BBox(420000,30000,900000,510000),20)
        self.sphinx = sphinxapi.SphinxClient()
        self.sphinx.SetServer("localhost", 3312)
        self.sphinx.SetMatchMode(sphinxapi.SPH_MATCH_EXTENDED)

        self.mapName = request.matchdict.get('map')
        self.searchText = remove_accents(request.params.get('searchText'))
        self.lang = locale_negotiator(request) 
        self.cbName = request.params.get('cb')
        self.bbox =  request.params.get('bbox')
        self.quadindex = None
        self.featureIndexes = request.params.get('features')
        self.request = request
        self.results = {}
       
    @view_config(route_name='search', renderer='jsonp')
    def search(self):
        # create a quadindex if the bbox is defined
        if self.bbox is not None:
            self._get_quad_index()
        # first search in the field layer
        limit = self._layer_search()
        # then look for features
        if self.featureIndexes is not None:
            limit = len(self.featureIndexes)*5 + 30 - limit
            features = self._feature_search()
            limit -= features
        else:
            limit = self.LIMIT - limit
        swissearch = self._swiss_search(limit)
        return self.results

    def _swiss_search(self, limit):
        # 20 addresses in general, priority according to list order
        indexes = ('zipcode', 'district', 'kantone', 'gg25', 'sn25', 'parcel', 'address')
        for idx in indexes:
            if limit > 0:
                self.sphinx.SetLimits(0, limit)
                if self.quadindex is not None:
                    searchText = '@detail ' + self.searchText
                    searchText += ' & @geom_quadindex ' + self.quadindex + '*'
                else:
                    searchText = self.searchText
                self.results[idx] = self.sphinx.Query(searchText, index=idx)
                limit -= len(self.results[idx]['matches'])
            else:
                break

    def _layer_search(self):
        # 10 features per layer are returned at max
        self.sphinx.SetLimits(0, self.LAYER_LIMIT)
        index_name = 'layers_' + self.lang
        searchText = '@(detail,layer) ' + self.searchText + ' @topics ' + self.mapName
        self.results['layers'] = self.sphinx.Query(searchText, index=index_name)
        return len(self.results['layers']['matches'])

    def _feature_search(self):
        # 5 features per layer are returned at max
        self.sphinx.SetLimits(0, self.FEATURE_LIMIT)
        for index in self.featureIndexes:
            if self.quadindex is not None:
                searchText = '@detail ' + self.searchText
                searchText += ' @geom_quadindex ' + self.quadindex + '*'
            else:
                searchText = self.searchText
            self.sphinx.AddQuery(searchText, index=index)
        self.results['features'] = self.sphinx.RunQueries()
        nb_layers = len(self.results['features'])
        nb_results = 0
        if nb_results > 1:
            for i in range(0, nb_layers):
                nb_results += len(self.results['features'][i]['matches'])
        return nb_results

    def _get_quad_index(self):
        try:
            self.quadindex = self.quadtree.bbox_to_morton(msk.BBox(self.bbox[0],
                                                                   self.bbox[1],
                                                                   self.bbox[2],
                                                                   self.bbox[3])) 
        except ValueError:
            self.quadindex = None 
