# -*- coding: utf-8 -*-

import unittest

from pyramid import testing

from chsdi.lib.zadara_helpers import find_files


class Test_ZadaraHelpers(unittest.TestCase):

    def test_find_files(self):
        import os
        request = testing.DummyRequest()
        request.host = 'api3.geo.admin.ch'
        request.scheme = 'http'
        request.registry.settings = {}
        request.registry.settings['apache_base_path'] = 'main'
        request.registry.settings['zadara_dir'] = '/var/local/cartoweb/downloads/'
        layerBodId = 'ch.swisstopo.geologie-gisgeol'
        fileName = os.listdir(request.registry.settings['zadara_dir'] + layerBodId)[0]
        prefixFileName = fileName.split('.pdf')[0]
        for f in find_files(request, layerBodId, prefixFileName):
            self.failUnless('name' in f)
            self.failUnless('size' in f)
            self.failUnless('url' in f)
            self.assertEqual(f['url'], ''.join(
                ('//', request.host, '/downloads/', layerBodId, '/', fileName)
            ))
            self.failUnless(isinstance(f['size'], int))
            self.assertEqual(f['name'], fileName)
