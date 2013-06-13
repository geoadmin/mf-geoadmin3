# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.lib.validation import SearchValidation
from chsdi.lib.helpers import locale_negotiator, remove_accents
from chsdi.lib.sphinxapi import sphinxapi
from chsdi.lib import mortonspacekey as msk

SPH_MATCH_ANY = 1

class Search(SearchValidation): 

    def __init__(self, request):
        super(Search, self).__init__()
        self.sphinx = sphinxapi.SphinxClient()
        self.sphinx.SetServer("localhost", 3312)
        self.sphinx.SetMatchMode(SPH_MATCH_ANY)

        self.mapName = request.matchdict.get('map')
        self.searchText = remove_accents(request.params.get('searchText'))
        self.lang = locale_negotiator(request) 
        self.cbName = request.params.get('cb')
        self.bbox =  request.params.get('bbox')
        self.layerIndexes = request.params.get('layers')
        self.request = request
        self.results = {}
       
    @view_config(route_name='search', renderer='jsonp')
    def search(self):
        swissearch = self._swiss_search()
        layers = self._layer_search()
        if self.layerIndexes is not None:
            features = self._feature_search() 
        return self.results

    def _swiss_search(self):
        # 20 addresses ordered by rank
        self.setLimits(20, 20)
        self.results['swisssearch'] = self.sphinx.Query(self.searchText, index='swisssearch')

    def _layer_search(self):
        # 10 features per layer are returned at max
        self.setLimits(10, 10)
        index_name = 'layers_' + self.lang
        self.results['layers'] = self.sphinx.Query(self.searchText, index=index_name)

    def _feature_search(self):
        # 5 features per layer are returned at max
        self.setLimits(5, 5)
        for index in self.layerIndexes:
            self.sphinx.AddQuery(self.searchText, index=index)
        self.results['features'] = self.sphinx.RunQueries()
