# -*- coding: utf-8 -*-

from pyramid.view import view_config
from pyramid.response import Response

from httplib2 import Http


class Checker(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='checker')
    def home(self):
        return Response(body='OK', status_int=200)

    @view_config(route_name='checker_dev')
    def dev(self):
        return Response(body='OK', status_int=200)
