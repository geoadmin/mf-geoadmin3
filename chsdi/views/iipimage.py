# -*- coding: utf-8 -*-

from pyramid.view import view_config

from pyramid.renderers import render_to_response
import pyramid.httpexceptions as exc


@view_config(route_name='iipimage')
def iipimage(request):
    image = request.params.get('image')
    width = request.params.get('width')
    height = request.params.get('height')
    title = request.params.get('title')
    bildnummer = request.params.get('bildnummer')
    datenherr = request.params.get('datenherr')
    layer = request.params.get('layer')

    if None in (image, width, height, title, bildnummer, layer):
        raise exc.HTTPBadRequest('Missing parameter(s)')

    return render_to_response(
        'chsdi:templates/iipimage/viewer.mako',
        {
            'image': image,
            'width': width,
            'height': height,
            'title': title,
            'bildnummer': bildnummer,
            'datenherr': datenherr,
            'layer': layer
        },
        request=request
    )
