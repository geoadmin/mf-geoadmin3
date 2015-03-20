# -*- coding: utf-8 -*-

import re
from urlparse import urlparse
from httplib2 import Http

from pyramid.view import view_config

from pyramid.httpexceptions import HTTPBadRequest, HTTPBadGateway, HTTPNotAcceptable
from pyramid.response import Response
from chsdi.lib.decorators import requires_authorization


from StringIO import StringIO
from urllib import urlopen
from zipfile import ZipFile


allowed_hosts = (
    # list allowed hosts here (no port limiting)
)

DEFAULT_ENCODING = 'utf-8'


class OgcProxy:

    def __init__(self, request):
        self.request = request

    @requires_authorization()
    @view_config(route_name='ogcproxy')
    def ogcproxy(self):

        url = self.request.params.get("url")
        if url is None:
            return HTTPBadRequest()

        # check for full url
        parsed_url = urlparse(url)
        if not parsed_url.netloc or parsed_url.scheme not in ("http", "https"):
            raise HTTPBadRequest()

        # forward request to target (without Host Header)
        http = Http(disable_ssl_certificate_validation=True)
        h = dict(self.request.headers)
        h.pop("Host", h)
        try:
            resp, content = http.request(url, method=self.request.method,
                                         body=self.request.body, headers=h)
        except:
            raise HTTPBadGateway()

        #  All content types are allowed
        if "content-type" in resp:
            ct = resp["content-type"]
            if resp["content-type"] == "application/vnd.google-earth.kmz":
                zipfile = None
                try:
                    zipurl = urlopen(url)
                    zipfile = ZipFile(StringIO(zipurl.read()))
                    content = ''
                    for line in zipfile.open(zipfile.namelist()[0]).readlines():
                        content = content + line
                    ct = 'application/vnd.google-earth.kml+xml'
                except:
                    raise HTTPBadGateway()
                finally:
                    if zipfile:
                        zipurl.close()
        else:
            raise HTTPNotAcceptable()

        if content.find('encoding=') > 0:
            m = re.search("encoding=\"(.*?)\\\"", content)
            doc_encoding = m.group(1)
            if doc_encoding.lower() != DEFAULT_ENCODING:
                try:
                    data = content.decode(doc_encoding, "replace")
                except Exception:
                    raise HTTPNotAcceptable("Cannot decode requested content from advertized encoding: %s into unicode." % doc_encoding)
                content = data.encode(DEFAULT_ENCODING)
                content = content.replace(doc_encoding, DEFAULT_ENCODING)

        response = Response(content, status=resp.status,
                            headers={"Content-Type": ct})

        return response
