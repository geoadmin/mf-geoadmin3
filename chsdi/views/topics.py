# -*- coding: utf-8 -*-

from pyramid.view import view_config

from chsdi.models.bod import Topics


@view_config(route_name='topics', renderer='jsonp')
def topics(request):
    model = Topics
    geodataStaging = request.registry.settings['geodata_staging']
    query = request.db.query(model).order_by(model.orderKey)
    query = _geodata_staging_filter(query, model.staging, geodataStaging)
    results = [{
        'id': q.id,
        'langs': q.availableLangs,
        'defaultBackgroundLayer': q.defaultBackgroundLayer,
        'backgroundLayers': q.backgroundLayers,
        'selectedLayers': q.selectedLayers
    } for q in query]
    return {'topics': results}


def _geodata_staging_filter(query, orm_column, geodataStaging):
    if geodataStaging == 'test':
        return query
    elif geodataStaging == 'integration':
        return (
            query.filter(
                or_(orm_column == geodataStaging,
                    orm_column == 'prod'))
        )
    elif geodataStaging == 'prod':
        return query.filter(orm_column == geodataStaging)
