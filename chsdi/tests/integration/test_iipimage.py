# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestIipimage(TestsBase):

    def test_iipimage(self):
        params = {'image': 'CH253/1954/253NW177_1278.jp2', 'width': '8954', 'height': '9430', 'title': 'Bildnummer', 'bildnummer': '1278', 'datenherr': 'swisstopo', 'layer': 'Luftbilder'}
        resp = self.testapp.get('/iipimage/viewer.html', params=params, status=200)
        self.failUnless(resp.content_type == 'text/html')

    def test_iipimage_fail(self):
        resp = self.testapp.get('/iipimage/viewer.html', status=400)
