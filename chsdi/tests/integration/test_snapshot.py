# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestSnapshotService(TestsBase):

    def test_snpashot(self):
        resp = self.testapp.get('/snapshot', params={'snapshot': 'true', 'X': '190000', 'Y': '660000', 'topic': 'ech', 'bgLayer': 'ch.swisstopo.pixelkarte-farbe', 'layers': 'ch.swisstopo.swissimage,ch.are.agglomerationen_isolierte_staedte-2000'}, status=200)
