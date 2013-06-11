# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.models.vector.swisssearch import SwissSearch
from chsdi.lib.helpers import locale_negotiator

import pyramid.httpexceptions as exc

import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

AVAILABLE_ADDRESSFIELDS = ['cities','swissnames','districts','address','parcel','cantons','postalcodes','egid','all']
MAX_RESULTS = 20

class GeoCodeService(object):

    def __init__(self, request):
        self.request = request
        self.cbName = request.params.get('cb')
        self.format = request.params.get('f')
        self.lang = locale_negotiator(request)
        self.translate = request.translate
        self.no_geom = True
        self.addressfields = None
        origin_to_addressfields = {'zipcode': 'postalcodes', 'sn25': 'swissnames', 'gg25': 'cities', 'kantone': 'cantons', 'district': 'districts', 'address': 'address', 'parcel': 'parcel'}
        self.afs = {}
        for af in AVAILABLE_ADDRESSFIELDS:
            self.afs[af] = request.params.get(af, None)
        self.origins = []
        self.origins = list(origin for origin, af in origin_to_addressfields.iteritems() if self.afs[af] != None or self.afs['all'] != None or self.afs['egid'] != None)

    @view_config(route_name='geocodeservice', renderer='jsonp')
    def index(self):
        return 'OK'

    @view_config(route_name='findaddresscandidates', renderer='jsonp')    
    def findaddresscandidates(self):
         #check if we have at leastd one query
        st = None
        tmp = (query for af, query in self.afs.iteritems() if query != None)
        for query in tmp:
            st = query
        if st == None:
            raise exc.HTTPBadRequest('missing addressFiled parameter(s)')

        onlyOneTerm = False

        ##TODO: search on layers?

        if self.afs['egid'] is not None:
            query = self.request.db.query(SwissSearch).filter(SwissSearch.egid == '' + self.afs['egid'])
            ftsOrderBy = 'egid'
        else:
            ftsOrderBy = "rank asc, CASE WHEN origin = 'address' THEN 1/gid::float WHEN origin = 'parcel' THEN 1/SUBSTRING(name FROM '([0-9]+)')::float ELSE similarity(search_name,'%(query)s') END desc" % {'query': st.replace("'","''").replace('"','\"') }
            terms = st.split()
            terms1 = ' & '.join([term + ('' if term.isdigit() else ':*')  for term in terms])
            tsvector = 'to_tsvector(\'english\',search_name)'
            terms1 =  terms1.replace("'", "''").replace('"', '\"')
            ftsFilter = "%(tsvector)s @@ to_tsquery('english', remove_accents('%(terms1)s'))" %{'tsvector': tsvector, 'terms1': terms1}
            query = self.request.db.query(SwissSearch).filter(ftsFilter)
        
        if onlyOneTerm:
            query = query.filter(SwissSearch.origin != 'parcel')

        referer = self.request.headers.get('referer', '')
        allowed_referers = self.request.registry.settings['address_search_referers'].split(',')
        if not any([ref in referer  for ref in allowed_referers]):
            if not self.no_geom:
               self.origins = [o for o in self.origins if o != 'address']

        query = query.filter(SwissSearch.origin.in_(self.origins))

        #if cities is a number, we assume is bfsnr
        if self.afs['cities'] is not None and self.afs['cities'].isnumeric():
            query = query.filter(SwissSearch.bfsnr == '' + self.afs['cities'])

        query = query.order_by(ftsOrderBy).limit(MAX_RESULTS)

        allresults = query.all()

        ##Create json (right now, same as old)
        return {'results': [f.json(translate = self.translate) for f in allresults]}

