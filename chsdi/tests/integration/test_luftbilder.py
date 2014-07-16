# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestLuftbilder(TestsBase):

    ## Old, we ensure backward compatibility here
    def test_luftbilder_old(self):
        params = {'width': '4641', 'height': '7000', 'title': 'Bildnummer',
                  'bildnummer': '19280250012535', 'datenherr': 'swisstopo', 'layer': 'Luftbilder'}
        resp = self.testapp.get('/luftbilder/viewer.html', params=params, status=200)
        self.failUnless(resp.content_type == 'text/html')

    def test_lufbilder(self):
        params = {'width': '4641', 'height': '7000', 'title': 'Bildnummer',
                  'bildnummer': '19280250012535', 'datenherr': 'swisstopo', 'layer': 'ch.swisstopo.lubis-luftbilder_schwarzweiss'}
        resp = self.testapp.get('/luftbilder/viewer.html', params=params, status=200)
        self.failUnless(resp.content_type == 'text/html')

    def test_luftbilder_fail(self):
        resp = self.testapp.get('/luftbilder/viewer.html', status=400)
