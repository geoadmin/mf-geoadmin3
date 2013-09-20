from urlparse import urlparse
from httplib2 import Http
import Cookie

from pyramid.view import view_config

from pyramid.httpexceptions import (HTTPForbidden, HTTPBadRequest,
                                    HTTPBadGateway, HTTPNotAcceptable)
from pyramid.response import Response

BASE_URL = "http://api.geo.admin.ch/main/wsgi/print/"


@view_config(route_name='printproxy')
def printproxy(request):
    url = request.params.get("url")
    if url is None:
        return HTTPBadRequest()

    # check for full url
    parsed_url = urlparse(url)
    if not parsed_url.netloc or parsed_url.scheme not in ("http", "https"):
        return HTTPBadRequest()

    printpath = request.params.get('path')

    method = request.method

    body = None
    if method in ('POST', 'PUT'):
        body = request.body

    # forward request to target (without Host Header)
    http = Http(disable_ssl_certificate_validation=True)
    h = dict(request.headers)
    h.pop("Host", h)
    try:
        if url:
            resp, content = http.request(
                BASE_URL + str(printpath) + "?url=" + url,
                method=method,
                body=body,
                headers=h)
        else:
            resp, content = http.request(
                BASE_URL,
                method=request.method,
                body=request.body,
                headers=h)
    except:
        return HTTPBadGateway()

    headers = {}
    if "content-type" in resp:
        headers["Content-Type"] = resp["content-type"]
    if "set-cookie" in resp:
        c = Cookie.SimpleCookie()
        c.load(resp["set-cookie"])
        morsel = c.get('SRV')
        if morsel is not None:
            # morsel['max-age'] = 60 * 15 # seconds
            morsel['path'] = request.path
            headers["Set-Cookie"] = "SRV=%s; path=%s" % (
                morsel.value, morsel['path'])

    if "Cookie" in resp:
        headers["Cookie"] = resp["Cookie"]
    if "Content-Disposition" in resp:
        headers["Content-Disposition"] = resp["Content-Disposition"]
    if "content-disposition" in resp:
        headers["Content-Disposition"] = resp["content-disposition"]

    response = Response(content, status=resp.status,
                        headers=headers)

    return response
