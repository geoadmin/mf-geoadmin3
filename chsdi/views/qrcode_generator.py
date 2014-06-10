#-*- coding: utf-8 -*-

from urlparse import urlparse
import StringIO

from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest
from pyramid.response import Response


@view_config(route_name='qrcode')
def qrcode(request):

    url = _check_url(
        request.params.get('url')
    )
    img = _make_qrcode_img(url)
    response = Response(img, content_type='image/png')
    return response


def _make_qrcode_img(url):
    import qrcode
    # For a qrcode of 128px
    qr = qrcode.QRCode(box_size=3)
    try:
        qr.add_data(url)
        qr.make(fit=True)
        output = StringIO.StringIO()
        img = qr.make_image()
        img.save(output)
    except:
        raise HTTPBadRequest('An error occured during the qrcode generation')
    return output.getvalue()


def _check_url(url):
    if url is None:
        raise HTTPBadRequest('The parameter url is missing from the request')
    hostname = urlparse(url).hostname
    if hostname is None:
        raise HTTPBadRequest('Could not determine the hostname')
    domain = ".".join(hostname.split(".")[-2:])
    if all(('admin.ch' not in domain, 'swisstopo.ch' not in domain, 'bgdi.ch' not in domain)):
        raise HTTPBadRequest('Shortener can only be used for admin.ch, swisstopo.ch and bgdi.ch domains')
    return url
