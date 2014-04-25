# -*- coding: utf-8 -*-
import os
import subprocess

from pyramid.view import view_config
from pyramid.response import Response
import pyramid.httpexceptions as exc

from chsdi.lib.helpers import remove_accents


@view_config(route_name='snapshot')
def snapshot(request):
    querystring = ''
    remoteUrl = request.registry.settings['geoadminhost']
    install_directory = request.registry.settings['install_directory']
    build_query_string = lambda x: ''.join((x, '=', request.params.get(x), '&'))
    for key in request.params.keys():
        if (key != '_escaped_fragment_') and (key != 'snapshot'):
            querystring += build_query_string(key)
    querystring += 'snapshot=true'

    try:
        content = subprocess.check_output(['phantomjs',
                                           install_directory + '/chsdi/templates/load_page_until.js',
                                           'http://' + remoteUrl + '/?' + remove_accents(querystring),
                                           'seo-load-end',
                                           '10'])

    except (subprocess.CalledProcessError, OSError, ValueError) as e:
        raise exc.HTTPInternalServerError(e)

    if content.startswith('error'):
        raise exc.HTTPInternalServerError('Internal error in PhantomJS snapshot ' +
                                          'script or wrong parameters passed to the script.')
    elif content.startswith('timeout'):
        raise exc.HTTPGatewayTimeout('Page could not be loaded in time by PhantomJS')

    return Response(body=content, content_type='text/html', request=request)
