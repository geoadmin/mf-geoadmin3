# -*- coding: utf-8 -*-

import os
from unittest import TestCase
from pyramid import testing
from webtest import TestApp
from paste.deploy import loadapp

current = os.path.dirname(__file__)
app = loadapp('config:' + current.replace('chsdi/tests/integration', 'development.ini'))


class TestsBase(TestCase):

    def setUp(self):
        self.testapp = TestApp(app)

    def tearDown(self):
        testing.tearDown()
        del self.testapp
