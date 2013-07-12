# -*- coding: utf-8 -*-


from pyramid.view import view_config

from chsdi.models.bod import Catalog
from chsdi.lib.helpers import locale_negotiator

class CatalogService(object):

    def __init__(self, request):
        self.lang = locale_negotiator(request)
        self.request = request
        self.mapName = request.matchdict.get('map') # The topic

    @view_config(route_name='catalog', http_cache=0, renderer='jsonp')
    def catalog(self):
        from pyramid.renderers import render_to_response

        rows = self.request.db.query(Catalog)\
            .filter(Catalog.topic.ilike('%%%s%%' % self.mapName)).all()

        return {'results': self.tree(rows)}

    def tree(self, rows=[]):
        nodes = {}

        if len(rows) < 1:
            return nodes
    
        for row in rows:
            pid = row.parent_id or 'root'
            if pid  == 'root':
                root = row.to_dict()
                root['children'] = []
                nodes = { 'root' : root }
            else:
                nodes.setdefault(pid, { 'children': [] })
            if row.bod_layer_id is not None:
                nodes.setdefault(row.id, { })
            else:
                nodes.setdefault(row.id, { 'children': [] })
            nodes[row.id].update(row.to_dict())
            nodes[pid]['children'].append(nodes[row.id])
            
    
        return nodes['root']['children'][0]

