# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestQRCodeView(TestsBase):

    def test_qrcode(self):
        resp = self.testapp.get('/qrcode', params={'url': 'http://s.geo.admin.ch/e83c57af1'}, status=200)
        self.failUnless(resp.content_type == 'image/png')

    def test_qrcode_badurl(self):
        resp = self.testapp.get('/qrcode', params={'url': 'http://dummy.com'}, status=400)
