import re
from urlparse import urlparse
from httplib2 import Http

from pyramid.view import view_config

from pyramid.httpexceptions import (HTTPForbidden, HTTPBadRequest,
                                    HTTPBadGateway, HTTPNotAcceptable)
from pyramid.response import Response

from StringIO import StringIO
from urllib import urlopen
from zipfile import ZipFile


allowed_hosts = (
    # list allowed hosts here (no port limiting)
)


@view_config(route_name='ogcproxy')
def ogcproxy(request):

    url = request.params.get("url")
    if url is None:
        return HTTPBadRequest()

    # check for full url
    parsed_url = urlparse(url)
    if not parsed_url.netloc or parsed_url.scheme not in ("http", "https"):
        return HTTPBadRequest()

    # forward request to target (without Host Header)
    http = Http(disable_ssl_certificate_validation=True)
    h = dict(request.headers)
    h.pop("Host", h)
    try:
        resp, content = http.request(url, method=request.method,
                                     body=request.body, headers=h)
    except:
        return HTTPBadGateway()

    #  All content types are allowed
    if "content-type" in resp:
        ct = resp["content-type"]
        if resp["content-type"] == "application/vnd.google-earth.kmz":
            zipurl = urlopen(url)
            zipfile = ZipFile(StringIO(zipurl.read()))
            content = ''
            for line in zipfile.open(zipfile.namelist()[0]).readlines():
                content = content + line
            ct = 'application/vnd.google-earth.kml+xml'
    else:
        return HTTPNotAcceptable()

    if content.find('encoding=') > 0:
        m = re.search("encoding=\"(.*?)\\\"", content)
        try:
            data = content.decode(m.group(1))
        except Exception:
            abort(406)
        content = data.encode('utf-8')

    response = Response(content, status=resp.status,
                        headers={"Content-Type": ct})

    return response
