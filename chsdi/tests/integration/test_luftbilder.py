# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestLuftbilder(TestsBase):

    def test_luftbilder(self):
        params = {'width': '4641', 'height': '7000', 'title': 'Bildnummer',
                  'bildnummer': '19280250012535', 'datenherr': 'swisstopo', 'layer': 'Luftbilder'}
        resp = self.testapp.get('/luftbilder/viewer.html', params=params, status=200)
        self.failUnless(resp.content_type == 'text/html')

    def test_luftbilder_fail(self):
        resp = self.testapp.get('/luftbilder/viewer.html', status=400)
