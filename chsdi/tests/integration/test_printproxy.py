# -*- coding: utf-8 -*-

import os.path
import json
from chsdi.tests.integration import TestsBase


class TestPrintProxy(TestsBase):

    def test_info_json(self):
        resp = self.testapp.get('/printproxy/info.json?url=http%3A%2F%2Flocalhost%2Fprintproxy%2Finfo.json', status=200)
        self.failUnless(resp.content_type == 'application/json')
        resp.mustcontain('createURL')
    




