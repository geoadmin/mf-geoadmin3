# -*- coding: utf-8 -*-

from chsdi.tests.integration import TestsBase


class TestSnapshotService(TestsBase):

    # Make sure the service removes 'snapshot' and '_escaped_fragment_' parameter from links
    def test_remove_params(self):
        resp = self.testapp.get('/snapshot', params={'snapshot': 'true', '_escaped_fragment_': 'dummy'})
        share_icons = (resp.html.find('div', class_='ga-share-icons'))
        self.failUnless(share_icons is not None)
        first_link = share_icons.find('a')
        self.failUnless(first_link is not None)
        self.failUnless(first_link.get('href').find('snapshot') == -1)
        self.failUnless(first_link.get('href').find('escaped_fragment') == -1)

    # Make sure it works without any parameters
    def test_no_params(self):
        resp = self.testapp.get('/snapshot', status=200)
        self.failUnless(resp.content_type == 'text/html')

    # Make sure language is taken into account
    def test_languages(self):
        resp = self.testapp.get('/snapshot', params={'lang': 'de'}, status=200)
        self.failUnless(resp.html.title.string.find('Karten der Schweiz') != -1)
        resp = self.testapp.get('/snapshot', params={'lang': 'fr'}, status=200)
        self.failUnless(resp.html.title.string.find('Carte de la Suisse') != -1)

    # Make sure topic is taken into account
    def test_topic(self):
        resp = self.testapp.get('/snapshot', params={'lang': 'it', 'topic': 'ech'}, status=200)
        catalog_links = resp.html.find_all('a', class_='ga-catalogitem-entry')
        self.failUnless(catalog_links is not None)
        self.failUnless(len(catalog_links) > 1)
        self.failUnless(catalog_links[1].get('title') == 'Natura ed ambiente')
        resp = self.testapp.get('/snapshot', params={'lang': 'fr', 'topic': 'are'}, status=200)
        catalog_links = resp.html.find_all('a', class_='ga-catalogitem-entry')
        self.failUnless(catalog_links is not None)
        self.failUnless(len(catalog_links) > 1)
        self.failUnless(catalog_links[0].get('title') == 'Charge de trafic')

    # Make sure layers parameter is taken into account
    def test_layers(self):
        resp = self.testapp.get('/snapshot', params={'lang': 'fr', 'topic': 'ech', 'layers': 'ch.bafu.naqua-grundwasser_nitrat,ch.blw.bodeneignung-wasserdurchlaessigkeit'}, status=200)
        abstracts = resp.html.find_all('p', class_='legend-abstract')
        self.failUnless(abstracts is not None)
        self.failUnless(len(abstracts) == 2)
        teststring1 = 'Le nitrate est un'
        teststring2 = 'Les observations de terrain permettent'
        self.failUnless(abstracts[0].string.find(teststring1) != -1 or abstracts[0].string.find(teststring2) != -1)
        self.failUnless(abstracts[1].string.find(teststring1) != -1 or abstracts[1].string.find(teststring2) != -1)

    # Make sure the swisssearch parameter is taken into account
    def test_swisssearch(self):
        resp = self.testapp.get('/snapshot', params={'lang': 'de', 'topic': 'ech', 'swisssearch': 'wasser'}, status=200)
        suggestions = resp.html.find_all('div', class_='tt-search')
        self.failUnless(suggestions is not None)
        self.failUnless(len(suggestions) > 10)

        def hasTerm(term):
            for sug in suggestions:
                if (sug.find('b') and sug.find('b').string.find(term) != -1):
                    return True
            return False
        self.failUnless(hasTerm('Wasserloch'))
        self.failUnless(hasTerm('Hochwasser'))

     # Make sure feature in permalink is included
    def test_feature(self):
        resp = self.testapp.get('/snapshot', params={'lang': 'de', 'topic': 'ech', 'ch.bafu.schutzgebiete-biosphaerenreservate': '1,2'}, status=200)
        htmlpops = resp.html.find_all('div', class_='htmlpopup-content')
        self.failUnless(htmlpops is not None)
        self.failUnless(len(htmlpops) == 2)

        def hasTerm(term):
            for pop in htmlpops:
                for td in pop.find_all('td'):
                    if td.find(term) != -1:
                        return True
            return False
        self.failUnless(hasTerm('Val Mustair'))
        self.failUnless(hasTerm('Biosphärenreservat Entlebuch'))
