# -*- coding: utf-8 -*-

from pyramid.view import view_config
from collections import defaultdict

from chsdi.models.bod import get_catalog_model
from chsdi.lib.helpers import locale_negotiator

class CatalogService(object):

    def __init__(self, request):
        self.lang = locale_negotiator(request)
        self.request = request
        self.mapName = request.matchdict.get('map') # The topic

    @view_config(route_name='catalog', http_cache=0, renderer='jsonp')
    def catalog(self):
        from pyramid.renderers import render_to_response

        model = get_catalog_model(self.lang, self.mapName)
        rows = self.request.db.query(model)\
            .filter(model.topic.ilike('%%%s%%' % self.mapName))\
            .order_by(model.depth)\
            .order_by(model.orderKey).all()

        return {'results': self.tree(rows)}

    def tree(self, rows=[]):
        nodes_all = [] # index equal depth
        nodes_depth = []
        current_depth = 0

        def getListIndexFromPath(list_nodes, category):
            i = 0
            for node in list_nodes:
                if node['category'] == category:
                    return i
                i += 1

        if len(rows) < 1:
            return nodes

        nodes_final = {}
 
        for row in rows:
            pid = row.parentId or 'root'
            depth = row.depth

            if current_depth == depth:
                node = row.to_dict(self.lang)
                if node['category'] != 'layer':
                    node['children'] = []
                nodes_depth.append(node)
            else:
                nodes_all.append(nodes_depth)

                nodes_depth = []
                current_depth = depth # e.g. +1

                node = row.to_dict(self.lang)
                if node['category'] != 'layer':
                    node['children'] = []
                nodes_depth.append(node)

        # Append the last list
        nodes_all.append(nodes_depth)

        for i in range(0, len(nodes_all)):
            for node in nodes_all[i]:
                path = node['path'].split('/')
                if len(path) == 1:
                    nodes_final[path[0]] = node
                elif len(path) == 2:
                    nodes_final[path[0]]['children'].append(node)
                elif len(path) == 3:
                    index = getListIndexFromPath(nodes_final[path[0]]['children'], path[1])
                    nodes_final[path[0]]['children'][index]['children'].append(node)
                elif len(path) == 4:
                    index_1 = getListIndexFromPath(nodes_final[path[0]]['children'], path[1])
                    index_2 = getListIndexFromPath(nodes_final[path[0]]['children'][index_1]['children'], path[2])
                    nodes_final[path[0]]['children'][index_1]['children'][index_2]['children'].append(node)
                elif len(path) == 5:
                    index_1 = getListIndexFromPath(nodes_final[path[0]]['children'], path[1])
                    index_2 = getListIndexFromPath(nodes_final[path[0]]['children'][index_1]['children'], path[2])
                    index_3 = getListIndexFromPath(nodes_final[path[0]]['children'][index_1]['children'][index_2]['children'], path[3])
                    nodes_final[path[0]]['children'][index_1]['children'][index_2]['children'][index_3]['children'].append(node)

        return nodes_final 
