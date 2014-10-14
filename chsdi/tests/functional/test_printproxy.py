# -*- coding: utf-8  -*-

import unittest
import json
from chsdi.views.printproxy import PrintProxy


class Test_PrintProxy(unittest.TestCase):

    def _callFUT(self):
        request = None
        proxy = PrintProxy(request)
        return proxy

    def test_proxy_no_timestamps(self):
        proxy = self._callFUT()
        spec = {"layers": [{}]}

        res = proxy._get_timestamps(spec)

        self.assertTrue(len(res) < 1)

    def test_proxy_one_timestamps(self):
        proxy = self._callFUT()
        spec = {"layers": [{"timestamps": ["2000", "2005", "2010"]}]}

        res = proxy._get_timestamps(spec)

        self.assertTrue(len(res) == 3)

    def test_proxy_many_timestamps(self):
        proxy = self._callFUT()
        spec = {"layers": [{"timestamps": ["2000", "2005", "2010"]},
               {"timestamps": ["1990", "2000", "2007"]}]}

        res = proxy._get_timestamps(spec)

        self.assertTrue(len(res) == 5)
        self.assertEqual(res['2000'], [0, 1])
        self.assertEqual(res['2007'], [1])
