# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.lib.validation import SearchValidation
from chsdi.lib.helpers import locale_negotiator, remove_accents
from chsdi.lib.sphinxapi import sphinxapi
from chsdi.lib import mortonspacekey as msk


class Search(SearchValidation):
    ''' The config file is stored at /var/sig/shp/sphinx/local/etc/sphinx.conf
        The indexes are stored in /var/sig/shp/sphinx/data 
        To update all the indexes: /var/sig/shp/sphinx/local/bin/indexer --config /var/sig/shp/sphinx/local/etc/sphinx.conf --rotate
        To stop the deamon: /var/sig/shp/sphinx/local/bin/searchd --config /var/sig/shp/sphinx/local/etc/sphinx.conf --stop
        To start the deamon: /var/sig/shp/sphinx/local/bin/searchd --config /var/sig/shp/sphinx/local/etc/sphinx.conf
        This service always returns a minimum of 35 results.
        More results can be retruned if serveral layers are 
        queried for features. '''

    def __init__(self, request):
        super(Search, self).__init__()
        self.sphinx = sphinxapi.SphinxClient()
        self.sphinx.SetServer("localhost", 3312)
        self.sphinx.SetMatchMode(sphinxapi.SPH_MATCH_ANY)

        self.mapName = request.matchdict.get('map')
        self.searchText = remove_accents(request.params.get('searchText'))
        self.lang = locale_negotiator(request) 
        self.cbName = request.params.get('cb')
        self.bbox =  request.params.get('bbox')
        self.quadindex = request.params.get('quadindex')
        self.layerIndexes = request.params.get('layers')
        self.request = request
        self.results = {}
       
    @view_config(route_name='search', renderer='jsonp')
    def search(self):
        # first search in the field layer
        limit = self._layer_search()
        # then look for features
        if self.layerIndexes is not None:
            limit = len(self.layerIndexes)*5 + 30 - limit
            features = self._feature_search()
            limit -= features
        else:
            limit = 35 - limit
        swissearch = self._swiss_search(limit)
        return self.results

    def _swiss_search(self, limit):
        # 20 addresses, priority according to list order
        indexes = ['zipcode', 'district', 'kantone', 'gg25', 'sn25', 'parcel', 'address']
        for idx in indexes:
            if limit > 0:
                self.sphinx.SetLimits(0, limit)
                self.results[idx] = self.sphinx.Query(self.searchText, index=idx)
                limit -= len(self.results[idx]['matches'])
            else:
                break

    def _layer_search(self):
        # 10 features per layer are returned at max
        self.sphinx.SetLimits(0, 10)
        index_name = 'layers_' + self.lang
        self.results['layers'] = self.sphinx.Query(self.searchText, index=index_name)
        return len(self.results['layers']['matches'])

    def _feature_search(self):
        # 5 features per layer are returned at max
        self.sphinx.SetLimits(0, 5)
        for index in self.layerIndexes:
            self.sphinx.AddQuery(self.searchText, index=index)
        self.results['features'] = self.sphinx.RunQueries()
        return len(self.results['features']['matches'])
