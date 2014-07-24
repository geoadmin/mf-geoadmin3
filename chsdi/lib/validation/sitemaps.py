# -*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPBadRequest
from pyramid.httpexceptions import HTTPNotFound

class SiteMapValidation(object):

    def __init__(self):
        self._content = None
        self.contents = [
            'index',
            'base',
            'topics',
            'layers'
        ]

    @property
    def content(self):
        return self._content

    @content.setter
    def content(self, value):
        if value is None:
            raise HTTPBadRequest('Please provide the parameter content  (Required)')
        if value not in self.contents:
            raise HTTPNotFound('Please provide a valid content parameter')
        self._content = value

    def contents(self):
        return self.contents
