# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


def _validate_scheme(scheme, body):
    import subprocess
    import tempfile
    import os
    schema_url = os.path.join(os.path.dirname(__file__), "sitemaps/" + scheme)
    os.environ['XML_CATALOG_FILES'] = os.path.join(os.path.dirname(__file__), "xml/catalog")
    f = tempfile.NamedTemporaryFile(mode='w+t', prefix='sitemap-index')
    f.write(body)
    f.seek(0)
    retcode = subprocess.call(["xmllint", "--noout", "--nocatalogs", "--schema", schema_url, f.name])
    f.close()
    return retcode


class TestSitemapView(TestsBase):

    def __init__(self, other):
        super(TestsBase, self).__init__(other)
        self.sitemaps_with_urls = ['base', 'topics', 'layers']

    def test_no_parameter_failure(self):
        resp = self.testapp.get('/sitemap', status=400)
        resp.mustcontain('Please provide the parameter content')

    def test_wrong_parameter_failure(self):
        resp = self.testapp.get('/sitemap?dummy=base', status=400)
        resp.mustcontain('Please provide the parameter content')

    def test_wrong_parameter_values_failure(self):
        resp = self.testapp.get('/sitemap?content=wrongthing', status=404)
        resp.mustcontain('Please provide a valid content parameter')

    def test_index_file(self):
        resp = self.testapp.get('/sitemap?content=index', status=200)
        resp.content_type == 'application/xml'
        # contains all links
        for urlbase in self.sitemaps_with_urls:
            resp.mustcontain('sitemap_' + urlbase + '.xml')
        # contains correct domain
        self.failUnless(self.testapp.app.registry.settings.get('geoadminhost') in resp.body)
        # validate scheme
        self.failUnless(0 == _validate_scheme('siteindex.xsd', resp.body))

    def test_base_file(self):
        resp = self.testapp.get('/sitemap?content=base', status=200)
        resp.content_type == 'application/xml'
        # contains all languages
        for lang in ['de', 'fr', 'it', 'rm', 'en']:
            resp.mustcontain('lang=' + lang)
        # contains correct domain
        self.failUnless(self.testapp.app.registry.settings.get('geoadminhost') in resp.body)
        # validate scheme
        self.failUnless(0 == _validate_scheme('sitemap.xsd', resp.body))

    def test_topics_file(self):
        resp = self.testapp.get('/sitemap?content=topics', status=200)
        resp.content_type == 'application/xml'
        # contains all languages
        for lang in ['de', 'fr', 'it', 'rm', 'en']:
            resp.mustcontain('lang=' + lang)
        # test for some topics
        for topic in ['blw', 'ech', 'swisstopo', 'luftbilder', 'inspire']:
            resp.mustcontain('topic=' + topic)
        # contains correct domain
        self.failUnless(self.testapp.app.registry.settings.get('geoadminhost') in resp.body)
        # validate scheme
        self.failUnless(0 == _validate_scheme('sitemap.xsd', resp.body))

    def test_layers_file(self):
        resp = self.testapp.get('/sitemap?content=layers', status=200)
        resp.content_type == 'application/xml'
        # contains all languages
        for lang in ['de', 'fr', 'it', 'rm', 'en']:
            resp.mustcontain('lang=' + lang)
        # test for some topics
        for topic in ['blw', 'ech', 'swisstopo', 'luftbilder', 'inspire']:
            resp.mustcontain('topic=' + topic)
        # test for some layers
        for layer in ['ch.blw.bodeneignung-kulturtyp', 'ch.bafu.laerm-strassenlaerm_tag', 'ch.swisstopo-vd.spannungsarme-gebiete']:
            resp.mustcontain('layers=' + layer)
        # contains correct domain
        self.failUnless(self.testapp.app.registry.settings.get('geoadminhost') in resp.body)
        # validate scheme
        self.failUnless(0 == _validate_scheme('sitemap.xsd', resp.body))
