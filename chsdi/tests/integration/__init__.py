# -*- coding: utf-8 -*-

from unittest import TestCase

class TestsBase(TestCase):

    def setUp(self):
        from paste.deploy import loadapp
        import os
        current = os.path.dirname( __file__ )
        app = loadapp('config:' + current.replace('chsdi/tests/integration', 'development.ini'))
        from webtest import TestApp
        self.testapp = TestApp(app)
