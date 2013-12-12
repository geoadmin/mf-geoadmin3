# -*- coding: utf-8 -*-

from pyramid.view import view_config
from pyramid.renderers import render_to_response


@view_config(route_name='ga_api', renderer='json')
def loadjs(request):
    response = render_to_response(
        'chsdi:templates/loader.js',
        {},
        request=request
    )
    response.content_type = 'application/javascript'
    return response
