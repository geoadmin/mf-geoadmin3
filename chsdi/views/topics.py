# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.models.bod import Topics


@view_config(route_name='topics', renderer='jsonp')
def topics(request):
    model = Topics
    query = request.db.query(model).order_by(model.orderKey)
    results = [{
        'id': q.id,
        'langs': q.availableLangs,
        'defaultBackgroundLayer': q.defaultBackgroundLayer,
        'backgroundLayers': q.backgroundLayers,
        'selectedLayers': q.selectedLayers
    } for q in query]
    return {'topics': results}
