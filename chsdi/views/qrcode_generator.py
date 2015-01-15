# -*- coding: utf-8 -*-

import httplib2
import json
import StringIO

from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest
from pyramid.response import Response

from chsdi.lib.helpers import check_url, make_api_url, quoting


@view_config(route_name='qrcodegenerator')
def qrcode(request):

    url = quoting(check_url(
        request.params.get('url')
    ))
    url = _shorten_url(request, url)
    img = _make_qrcode_img(url)
    response = Response(img, content_type='image/png')
    return response


def _make_qrcode_img(url):
    import qrcode
    # For a qrcode of 128px
    qr = qrcode.QRCode(
        box_size=4,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        border=3
    )
    try:
        qr.add_data(url)
        qr.make()
        output = StringIO.StringIO()
        img = qr.make_image()
        img.save(output)
    except:
        raise HTTPBadRequest('An error occured during the qrcode generation')
    return output.getvalue()


def _shorten_url(request, url):
    API3_SHORTEN_URL = make_api_url(request) + '/shorten.json?url=%s'
    try:
        h = httplib2.Http()
        resp, content = h.request(API3_SHORTEN_URL % url, 'GET')
        resp = json.loads(content)
        url = resp['shorturl']
        return url
    except:
        return url
