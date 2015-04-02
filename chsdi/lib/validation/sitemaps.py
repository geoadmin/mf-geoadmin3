# -*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPBadRequest
from pyramid.httpexceptions import HTTPNotFound

class SiteMapValidation(object):

    def __init__(self):
        self._content = None
        self._in_index = ['base', 'topics', 'layers']
        self._multi_sitemaps = ['addresses']
        self._multi_part = None
        self._contents = ['index'] + self._in_index + self._multi_sitemaps

    @property
    def content(self):
        return self._content

    @content.setter
    def content(self, value):
        if value is None:
            raise HTTPBadRequest('Please provide the parameter content  (Required)')
        clist = value.split('_')
        value = clist[0]
        if value not in self._contents:
            raise HTTPNotFound('Please provide a valid content parameter')
        if len(clist) > 2:
            raise HTTPBadRequest('Malformed content parameter')
        if len(clist) == 2:
            if clist[1].isdigit():
                self._multi_part = int(clist[1])
            else:
                raise HTTPBadRequest('Content parameter should have integer index value')
            if self._multi_part < 0:
                raise HTTPBadRequest('Content parameter should have integer greater zero')
        self._content = value

    @property
    def in_index(self):
        return self._in_index

    @property
    def multi_part(self):
        return self._multi_part
