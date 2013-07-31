# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.models.bod import Topics

@view_config(route_name='topics', http_cache=0, renderer='jsonp')
def topics(request):
    model = Topics 
    query = request.db.query(model).order_by(model.orderKey)
    results = [q.id for q in query]
    return { 'topics': results }
