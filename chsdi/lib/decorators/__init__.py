# -*- coding: utf-8 -*-

from functools import wraps
from pyramid.view import view_config

from pyramid.httpexceptions import HTTPForbidden


def requires_authorization():
    def wrapper(f):
        @wraps(f)
        def wrapped(self, *args, **kwargs):
            if hasattr(self, 'request'):
                request = self.request
            else:
                request = self
            if request.headers.get('X-SearchServer-Authorized', '').lower() != 'true':
                raise HTTPForbidden(detail='This service requires an authorization')
            else:
                return f(self, *args, **kwargs)
        return wrapped
    return wrapper
