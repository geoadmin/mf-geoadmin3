# -*- coding: utf-8 -*-

import json
from pyramid.view import view_config
from pyramid.renderers import render_to_response
from pyramid.request import Request


@view_config(route_name='ga_api', renderer='json')
def loadjs(request):
    mode = request.params.get('mode')
    # Determined automatically in subscriber
    lang = request.lang

    path = '/rest/services/api/MapServer/layersConfig?lang=' + lang
    subRequest = Request.blank(path)
    resp = request.invoke_subrequest(subRequest)
    data = json.loads(resp.body)
    response = render_to_response(
        'chsdi:templates/loader.js',
        {
            'api_url': request.path_url.replace('/loader.js', ''),
            'lang': lang,
            'mode': mode,
            'data': json.dumps(data, separators=(',', ':'))
        },
        request=request
    )
    response.content_type = 'application/javascript'
    return response
