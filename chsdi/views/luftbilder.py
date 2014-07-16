# -*- coding: utf-8 -*-

from pyramid.view import view_config

from pyramid.renderers import render_to_response
import pyramid.httpexceptions as exc


@view_config(route_name='luftbilder')
# Keep old route to not loose old existing links
@view_config(route_name='iipimage')
def luftbilder(request):
    width = request.params.get('width')
    height = request.params.get('height')
    rotation = request.params.get('rotation')
    title = request.params.get('title')
    bildnummer = request.params.get('bildnummer')
    datenherr = request.params.get('datenherr')
    layer = request.params.get('layer')
    lang = request.params.get('lang')
    baseUrl = request.registry.settings.get('geoadminhost')

    if None in (width, height, title, bildnummer, layer):
        raise exc.HTTPBadRequest('Missing parameter(s)')

    return render_to_response(
        'chsdi:templates/luftbilder/viewer.mako',
        {
            'width': width,
            'height': height,
            'rotation': rotation,
            'title': title,
            'bildnummer': bildnummer,
            'datenherr': datenherr,
            'layer': layer,
            'baseUrl': baseUrl,
            'lang': lang
        },
        request=request
    )
