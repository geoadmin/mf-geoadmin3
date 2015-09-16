# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestTopicsListingView(TestsBase):

    def test_topics(self):
        resp = self.testapp.get('/rest/services', status=200)
        self.assertTrue(resp.content_type == 'application/json')
        topics = resp.json['topics']
        for topic in topics:
            self.assertTrue('id' in topic)
            self.assertTrue('backgroundLayers' in topic)
            self.assertTrue('langs' in topic)
            self.assertTrue('selectedLayers' in topic)
            self.assertTrue('defaultBackground' in topic)
            self.assertTrue('activatedLayers' in topic)

    def test_topics_with_cb(self):
        resp = self.testapp.get('/rest/services', params={'callback': 'cb'}, status=200)
        self.assertTrue(resp.content_type == 'application/javascript')
