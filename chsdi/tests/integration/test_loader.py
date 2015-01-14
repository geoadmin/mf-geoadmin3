# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestLoaderJs(TestsBase):

    def test_loaderjs(self):
        resp = self.testapp.get('/uncached_loader.js', status=200)
        self.failUnless(resp.content_type == 'application/javascript')
        resp.mustcontain('ga.js')
        resp.mustcontain('ga.css')
        resp.mustcontain('proj4.js')
        resp.mustcontain('EPSG21781.js')
        resp.mustcontain('EPSG2056.js')

    def test_loaderjs_lang(self):
        resp = self.testapp.get('/uncached_loader.js', params={'lang': 'en'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')
        resp.mustcontain('ga.js')
        resp.mustcontain('ga.css')
        resp.mustcontain('proj4.js')
        resp.mustcontain('EPSG21781.js')
        resp.mustcontain('EPSG2056.js')

    def test_loaderjs_debug(self):
        resp = self.testapp.get('/uncached_loader.js', params={'mode': 'debug'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')
        resp.mustcontain('ga-debug.js')
        resp.mustcontain('ga.css')
        resp.mustcontain('proj4.js')
        resp.mustcontain('EPSG21781.js')
        resp.mustcontain('EPSG2056.js')

    def test_loaderjs_waf(self):
        resp = self.testapp.get('/uncached_loader.js', params={'mode': 'waf'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')
        resp.mustcontain('old-ga-waf.js')
        resp.mustcontain('ga.css')
        resp.mustcontain('proj4.js')
        resp.mustcontain('EPSG21781.js')
        resp.mustcontain('EPSG2056.js')

    def test_loaderjs_wafint(self):
        resp = self.testapp.get('/uncached_loader.js', params={'mode': 'wafint'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')
        resp.mustcontain('old-ga-wafint.js')
        resp.mustcontain('ga.css')
        resp.mustcontain('proj4.js')
        resp.mustcontain('EPSG21781.js')
        resp.mustcontain('EPSG2056.js')
