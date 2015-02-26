#-*- coding: utf-8 -*-


from chsdi.lib.decorators import requires_authorization

import json
import os
import errno
import sys
import time
import urllib
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import (HTTPBadRequest, HTTPInternalServerError)


def make_sure_path_exists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise


def delete_old_files(path):
    now = time.time()
    # older than 1 hour
    cutoff = now - 3600
    files = os.listdir(path)
    for xfile in files:
        fn = path + '/' + xfile
        if os.path.isfile(fn):
            t = os.stat(fn)
            c = t.st_ctime
            # delete file if older than a week
            if c < cutoff:
                os.remove(fn)


class DownloadKML:

    def __init__(self, request):
        self.request = request
        self.tmpdir = request.registry.settings['print_temp_dir'] + '/kml'
        self.host = request.registry.settings['api_url'] + '/kml'

    @requires_authorization()
    @view_config(route_name='downloadkml', renderer='jsonp')
    def downloadkml(self):

        if self.request.method == 'OPTIONS':
            return Response(status=200)

        # IE is always URLEncoding the body
        jsonstring = urllib.unquote_plus(self.request.body)

        try:
            spec = json.loads(jsonstring, encoding=self.request.charset)
        except Exception as e:
            raise HTTPBadRequest()

        kml = spec.get('kml')
        filename = spec.get('filename')
        if kml is None or filename is None:
            raise HTTPBadRequest()

        make_sure_path_exists(self.tmpdir)
        delete_old_files(self.tmpdir)

        #create the file in the tmp dir
        try:
            with open(self.tmpdir + '/' + filename, 'w') as file_:
                file_.write(kml.encode('utf8'))
        except EnvironmentError:
            raise HTTPInternalServerError()

        return {
            'url': self.host + '/' + filename
        }
