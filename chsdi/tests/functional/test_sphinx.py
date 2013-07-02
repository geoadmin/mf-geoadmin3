# -*- coding: utf-8  -*-

import unittest
from chsdi.lib.sphinxapi import sphinxapi


class Test_SphinxApi(unittest.TestCase):
    def _callFUT(self):
        api = sphinxapi.SphinxClient()
        return api

    def test_sphinx_api(self):
        api = self._callFUT()
        docs = ['this is my test text to be highlighted','this is another test text to be highlighted']
        words = 'test text'
        index = 'test1'
        opts = {'before_match':'<b>', 'after_match':'</b>', 'chunk_separator':' ... ', 'limit':400, 'around':15}
        res = api.BuildExcerpts(docs, index, words, opts)
        self.assertFalse(res)
