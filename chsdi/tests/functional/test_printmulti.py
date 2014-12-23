# -*- coding: utf-8  -*-

import unittest
import json
from chsdi.views.printmulti import _get_timestamps


class Test_PrintMulti(unittest.TestCase):

    def test_proxy_no_timestamps(self):
        spec = {"layers": [{}]}

        res = _get_timestamps(spec, '')

        self.assertTrue(len(res) < 1)

    def test_proxy_one_timestamps(self):
        spec = {"layers": [{"timestamps": ["2000", "2005", "2010"]}]}

        res = _get_timestamps(spec, '')

        self.assertTrue(len(res) == 3)

    def test_proxy_many_timestamps(self):
        spec = {"layers": [{"timestamps": ["2000", "2005", "2010"]},
               {"timestamps": ["1990", "2000", "2007"]}]}

        res = _get_timestamps(spec, '')

        self.assertTrue(len(res) == 5)
        self.assertEqual(res['2000'], [0, 1])
        self.assertEqual(res['2007'], [1])
