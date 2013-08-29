# -*- coding: utf-8 -*-

from pyramid.view import view_config
from pyramid.response import Response

from httplib2 import Http


class Checker(object):

    status_int = 200

    def __init__(self, request):
        self.request = request

    def update_status_int(self, code):
        self.status_int = max(self.status_int, int(code))

    def testurl(self, url):
        h = Http()
        resp, content = h.request(url)

        if resp['status'] != '200':
            self.update_status_int(resp['status'])
            return url + "<br/>" + content

        return 'OK'

    def make_response(self, msg):
        return Response(body=msg, status_int=self.status_int)

    @view_config(route_name='checker_home')
    def home(self):
        _url = self.request.route_url('home')
        return self.make_response(self.testurl(_url))

    @view_config(route_name='checker_api')
    def api_js(self):
        _url = self.request.route_url('api')
        return self.make_response(self.testurl(_url))
