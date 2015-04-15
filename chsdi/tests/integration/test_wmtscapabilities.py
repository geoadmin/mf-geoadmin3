#-*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase

EPSGS = [21781, 4326, 4258, 2056, 3857]


class TestWmtsCapabilitiesView(TestsBase):

    def test_valid_wmtscapabilities(self):
        resp = self.testapp.get('/rest/services/inspire/1.0.0/WMTSCapabilities.xml', status=200)
        self.failUnless(resp.content_type == 'text/xml')
        resp.mustcontain('TileMatrixSet')

    def test_wrong_map_wmtscapabilities(self):
        resp = self.testapp.get('/rest/services/toto/1.0.0/WMTSCapabilities.xml', status=400)
        resp.mustcontain('The map you provided does not exist')

    def test_wrong_map_epsg_wmtscapabilities(self):
        resp = self.testapp.get('/rest/services/bafu/1.0.0/WMTSCapabilities.xml?epsg=4326', status=404)
        resp.mustcontain("EPSG:4326 only available for topic 'api'")

    def test_wrong_epsg_wmtscapabilities(self):
        resp = self.testapp.get('/rest/services/bafu/1.0.0/WMTSCapabilities.xml?epsg=9999', status=400)
        resp.mustcontain("EPSG:9999 not found. Must be one of 21781, 4326, 2056, 4258, 3857")

    def test_contains_correct_tilelink(self):
        resp = self.testapp.get('/rest/services/api/1.0.0/WMTSCapabilities.xml', status=200)
        # native s3 tiles (always on wmts), row/col order
        resp.mustcontain('<ResourceURL format="image/jpeg" resourceType="tile" template="http://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.jpeg"/>')
        # mapproxy, host dependant, col/row order
        resp.mustcontain('/1.0.0/ch.kantone.cadastralwebmap-farbe/default/{Time}/21781/{TileMatrix}/{TileCol}/{TileRow}.png"/>')

    def test_validate_wmtscapabilities(self):
        import socket
        import subprocess
        import tempfile
        import os
        if socket.gethostname() == 'bgdimf01t':
            self.fail("Cannot run this test on 'bgdimf0t'. Sorry.")
        schema_url = os.path.join(os.path.dirname(__file__), "wmts/1.0.1/wmtsGetCapabilities_response.xsd")
        os.environ['XML_CATALOG_FILES'] = os.path.join(os.path.dirname(__file__), "xml/catalog")

        for lang in ['de', 'fr', 'it', 'en']:
            for epsg in [4326, 4258, 2056, 3857]:
                f = tempfile.NamedTemporaryFile(mode='w+t', prefix='WMTSCapabilities-', suffix='-%s-%s' % (lang, epsg))
                resp = self.testapp.get('/rest/services/api/1.0.0/WMTSCapabilities.xml', params={'lang': lang, 'epsg': epsg}, status=200)
                f.write(resp.body)
                f.seek(0)
                retcode = subprocess.call(["xmllint", "--noout", "--nocatalogs", "--schema", schema_url, f.name])
                f.close()
                self.failUnless(retcode == 0)

    def test_gettile_wmtscapabilities(self):
        resp = self.testapp.get('/rest/services/inspire/1.0.0/WMTSCapabilities.xml', status=200)
        self.failUnless(resp.content_type == 'text/xml')

    def test_tilematrixsets_are_defined(self):
        import xml.etree.ElementTree as etree
        resp = self.testapp.get('/rest/services/inspire/1.0.0/WMTSCapabilities.xml', status=200)

        used_matrices = []
        defined_matrices = []

        root = etree.fromstring(resp.body)

        # Get all used TileMatrixSet
        layers = root.findall('.//{http://www.opengis.net/wmts/1.0}Layer')
        for layer in layers:
            tilematrixsets = layer.findall('.//{http://www.opengis.net/wmts/1.0}TileMatrixSetLink/*')
            for tilematrixset in tilematrixsets:
                s = tilematrixset.text
                if s not in used_matrices:
                    used_matrices.append(s)
        # Get all TileMatrixSets which are defined
        tilematrixsets = root.findall('.//{http://www.opengis.net/wmts/1.0}TileMatrixSet/{http://www.opengis.net/ows/1.1}Identifier')

        for tilematrixset in tilematrixsets:
            t = tilematrixset.text
            if t not in defined_matrices:
                defined_matrices.append(t)

        self.assertTrue(set(used_matrices).issubset(defined_matrices))

    def test_axis_order(self):
        from urlparse import urlparse
        import xml.etree.ElementTree as etree

        for epsg in EPSGS:
            resp = self.testapp.get('/rest/services/api/1.0.0/WMTSCapabilities.xml', params={'epsg': epsg}, status=200)

            root = etree.fromstring(resp.body)
            layers = root.findall('.//{http://www.opengis.net/wmts/1.0}Layer')
            for layer in layers:
                bodid = layer.find('./{http://www.opengis.net/ows/1.1}Identifier').text
                resourceurls = layer.findall('.//{http://www.opengis.net/wmts/1.0}ResourceURL')
                for resourceurl in resourceurls:
                    tpl = resourceurl.attrib['template']
                    tpl_parsed = urlparse(tpl)
                    pth = tpl_parsed.path
                    col_idx = pth.find('{TileCol}')
                    row_idx = pth.find('{TileRow}')
                    is_normal_order = col_idx < row_idx if col_idx > 0 else None
                    if epsg == 21781 and bodid != 'ch.kantone.cadastralwebmap-farbe':
                        self.assertFalse(is_normal_order)
                    else:
                        self.assertTrue(is_normal_order)
