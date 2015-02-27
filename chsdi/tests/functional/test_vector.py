# -*- coding: utf-8 -*-

import unittest

from chsdi.models.vector import getFallbackLangMatch


class Test_AttributesTranslations(unittest.TestCase):

    def test_no_lang_specific_attribute(self):
        queryableAttrs = ['toto', 'tutu', 'tata']
        suffix = '_de'
        suffixAttr = '_de'
        attr = 'toto'

        self.assertEqual(None, getFallbackLangMatch(queryableAttrs, suffix, attr, suffixAttr))

    def test_lang_specific_attribute(self):
        queryableAttrs = ['toto', 'toto_de', 'toto_fr']
        suffix = '_fr'
        suffixAttr = '_fr'
        attr = 'toto_fr'

        self.assertEqual('toto_fr', getFallbackLangMatch(queryableAttrs, suffix, attr, suffixAttr))

    def test_attribute_fallback_to_de(self):
        queryableAttrs = ['toto', 'toto_de', 'toto_fr']
        suffix = '_en'
        suffixAttr = '_de'
        attr = 'toto_de'

        self.assertEqual('toto_de', getFallbackLangMatch(queryableAttrs, suffix, attr, suffixAttr))
