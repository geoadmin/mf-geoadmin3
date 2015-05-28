# -*- coding: utf-8 -*-

from functools import wraps
import xml.parsers.expat

from pyramid.view import view_config
import pyramid.httpexceptions as exc

import urllib


EXPECTED_CONTENT_TYPE = 'application/vnd.google-earth.kml+xml'

def requires_authorization():
    def wrapper(f):
        @wraps(f)
        def wrapped(self, *args, **kwargs):
            if hasattr(self, 'request'):
                request = self.request
            else:
                request = self
            if request.headers.get('X-SearchServer-Authorized', '').lower() != 'true':
                raise exc.HTTPForbidden(detail='This service requires an authorization')
            else:
                return f(self, *args, **kwargs)
        return wrapped
    return wrapper

def validate_kml_input():
    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            if hasattr(self, 'request'):
                request = self.request
            else:
                request = self

            MAX_FILE_SIZE = 1024 * 1024 * 2

            # IE9 simply doesn't send content_type header. So we set it ourself
            if request.user_agent is not None and 'MSIE 9.0' in request.user_agent:
                request.content_type = EXPECTED_CONTENT_TYPE

            if request.content_type != EXPECTED_CONTENT_TYPE:
                raise exc.HTTPUnsupportedMediaType('Only KML file are accepted')

            # IE9 sends data urlencoded
            data = urllib.unquote_plus(request.body)
            if len(data) > MAX_FILE_SIZE:
                raise exc.HTTPRequestEntityTooLarge('File size exceed %s bytes' % MAX_FILE_SIZE)
            try:
                p = xml.parsers.expat.ParserCreate()
                p.Parse(data)
            except Exception:
                raise exc.HTTPUnsupportedMediaType('Only valid KML file are accepted')

            request.body = data

            return func(self, *args, **kwargs)
        return wrapper
    return decorator
