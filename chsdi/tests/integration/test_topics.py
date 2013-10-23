# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestTopicsListingView(TestsBase):

    def test_topics(self):
        resp = self.testapp.get('/rest/services', status=200)
        self.failUnless(resp.content_type == 'application/json')
        topics = resp.json['topics']
        for topic in topics:
            self.failUnless('id' in topic)
            self.failUnless('backgroundLayers' in topic)
            self.failUnless('langs' in topic)
            self.failUnless('selectedLayers' in topic)
            self.failUnless('showCatalog' in topic)

    def test_topics_with_cb(self):
        resp = self.testapp.get('/rest/services', params={'callback': 'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')
