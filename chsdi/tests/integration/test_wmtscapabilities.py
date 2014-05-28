# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestWmtsCapabilitiesView(TestsBase):

    def test_valid_wmtscapabilities(self):
        resp = self.testapp.get('/rest/services/inspire/1.0.0/WMTSCapabilities.xml', status=200)
        self.failUnless(resp.content_type == 'text/xml')
        resp.mustcontain('TileMatrixSet')

    def test_wrong_map_wmtscapabilities(self):
        resp = self.testapp.get('/rest/services/toto/1.0.0/WMTSCapabilities.xml', status=400)
        resp.mustcontain('The map you provided does not exist')

    def test_validate_wmtscapabilities(self):
        import socket
        import subprocess
        import tempfile
        import os
        if socket.gethostname() == 'bgdimf01t':
            self.fail("Cannot run this test on 'bgdimf0t'. Sorry.")
        schema_url = os.path.join(os.path.dirname(__file__), "wmts/1.0/wmtsGetCapabilities_response.xsd")
        os.environ['XML_CATALOG_FILES'] = os.path.join(os.path.dirname(__file__), "xml/catalog")

        for lang in ['de', 'fr']:
            f = tempfile.NamedTemporaryFile(mode='w+t', prefix='WMTSCapabilities-', suffix='-' + lang)
            resp = self.testapp.get('/rest/services/inspire/1.0.0/WMTSCapabilities.xml', params={'lang': lang, 'epsg': 4326}, status=200)
            f.write(resp.body)
            f.seek(0)
            retcode = subprocess.call(["xmllint", "--noout", "--nocatalogs", "--schema", schema_url, f.name])
            f.close()
            self.failUnless(retcode == 0)

    def test_gettile_wmtscapavilities(self):
        import xml
        resp = self.testapp.get('/rest/services/inspire/1.0.0/WMTSCapabilities.xml', status=200)
        dom = xml.dom.minidom.parseString(resp.body)
        self.failUnless(resp.content_type == 'text/xml')
