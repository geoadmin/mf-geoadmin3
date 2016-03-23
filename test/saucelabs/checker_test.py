# -*- coding: utf-8 -*

import time
from helpers import bCheckIfUrlHasChanged

# Search testing using saucelabs
DEFAULT_WAIT = 6
SHORTEN_LAYER = "ch.swisstopo.lubis-bildstreifen"
SHORTEN_CODE = "20cc812c90"
URL_API_DEV = "https://mf-chsdi3.dev.bgdi.ch/"
URL_API_INT = "https://mf-chsdi3.int.bgdi.ch/"
URL_API_CI = "https://mf-chsdi3.ci.bgdi.ch/"
URL_API_PROD = "https://api3.geo.admin.ch/"
SPHINX_CHECKER = "rest/services/inspire/SearchServer?searchText=wasser&type=locations"
URL_SHORTEN = 'shorten.json?url=https://mf-geoadmin3.int.bgdi.ch/' + \
    '%3FX%3D164565.22%26Y%3D620538.74%26zoom%3D2%26lang%3Den%26topic%3Dlubis%26bgLayer%3D' + \
    'ch.swisstopo.pixelkarte-grau%26catalogNodes%3D1179,1180,1184,1186%26layers%3D' + \
    'ch.swisstopo.lubis-bildstreifen'

list_sitemap = ['sitemap_base.xml',
                'sitemap_topics.xml',
                'sitemap_layers.xml']
key_words_loaderjs = [
    'ch.swisstopo.pixelkarte-farbe',
    'static/js/ga.js',
    'EPSG21781.js']
topics_list = [
    'blw',
    'are',
    'bafu',
    'swisstopo',
    'kgs',
    'funksender',
    'nga',
    'ivs',
    'sachplan',
    'geol',
    'luftbilder',
    'wildruhezonen',
    'vu',
    'aviation',
    'verteidigung',
    'gewiss',
    'inspire',
    'ech']
available_language = ['de', 'fr', 'it', 'en', 'rm']
important_layers = [
    'ch.swisstopo.zeitreihen',
    'ch.swisstopo.lubis-luftbilder_schwarzweiss',
    'ch.swisstopo.lubis-bildstreifen',
    'ch.swisstopo.lubis-luftbilder_infrarot',
    'ch.swisstopo.lubis-luftbilder_farbe',
    'ch.swisstopo.lubis-luftbilder-dritte-firmen',
    'ch.swisstopo.lubis-luftbilder-dritte-kantone',
    'ch.swisstopo.lubis-luftbilder_schraegaufnahmen',
    'ch.swisstopo-vd.stand-oerebkataster',
    'ch.bazl.sachplan-infrastruktur-luftfahrt_kraft',
    'ch.bav.sachplan-infrastruktur-schiene_ausgangslage',
    'ch.bav.sachplan-infrastruktur-schifffahrt_ausgangslage',
    'ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung',
    'ch.bav.sachplan-infrastruktur-schiene_kraft',
    'ch.bfe.sachplan-geologie-tiefenlager',
    'ch.bfe.sachplan-uebertragungsleitungen_anhoerung',
    'ch.bfe.sachplan-uebertragungsleitungen_kraft']


def wait_url_changed(driver, old_url, timeout=DEFAULT_WAIT):
    UrlHasChanged = False
    t0 = time.time()
    while not UrlHasChanged:
        new_url = driver.current_url
        if old_url != new_url:
            UrlHasChanged = True
        t1 = time.time()
        if t1 - t0 > timeout:
            break
        continue
    if not UrlHasChanged:
        raise Exception(
            "Url not changed until end of timeout (" + str(timeout) + ")")
    return bool(not UrlHasChanged)


def runCheckerTest(driver, url):
    print 'Checker tests starts!'

    bApiPage = 1
    bCheckerApi = 1
    bCheckerGeoAdmin = 1
    bCheckerSphinx = 1
    bApiDevPage = 1
    bPythonTranslations = 1
    bShortenUrl = 1
    bFindService = 1
    bLoaderJs = 1
    bSitemapService = 1
    bTopicListing = 1

    try:
        assert "dev" in url
        url_4_api = URL_API_DEV
    except Exception as e:
        try:
            assert "int" in url
            url_4_api = URL_API_INT
        except Exception as e:
            try:
                assert "ci" in url
                url_4_api = URL_API_CI
            except Exception as e:
                url_4_api = URL_API_PROD

    if bFindService:
        print "Test FindService"
        driver.get(
            url_4_api +
            'rest/services/ech/MapServer/find?layer=ch.bafu.bundesinventare-bln' +
            '&searchText=Lavaux&searchField=bln_name&returnGeometry=false')
        assert '"label": "Lavaux' in driver.page_source

        # search word 'sand' in description attribute for layer
        # ch.swisstopo.geologie-geocover
        driver.get(
            url_4_api +
            'rest/services/ech/MapServer/find?layer=ch.swisstopo.geologie-geocover' +
            '&searchText=Sand&searchField=description')
        assert 'sand' in driver.page_source

    if bTopicListing:
        print "Test Topic Listing"
        driver.get(url_4_api + 'rest/services')
        page_source_tmp = driver.page_source
        for elt in topics_list:
            str2search = '"id":"' + elt + '"}'
            print "search topic " + elt + ", key=" + str2search
            try:
                assert str2search in page_source_tmp
            except:
                raise Exception(
                    "Error : topic '" +
                    elt +
                    "' is missing in " +
                    url_4_api +
                    "rest/services")

    if bSitemapService:
        print "Test Sitemap (index)"
        driver.get(url_4_api + 'sitemap?content=index')
        # create dynamic list (depends of environment)
        urls_sitemap = []
        for elt in list_sitemap:
            urls_sitemap.append(url + '/' + elt)

        for elt in urls_sitemap:
            try:
                assert elt in driver.page_source
            except:
                raise Exception(
                    "Error : " +
                    str(elt) +
                    " not found in Sitemap Service page")

        print "Test Sitemap (base)"
        driver.get(url_4_api + 'sitemap?content=base')
        for elt in available_language:
            str2search = '/?lang=' + elt
            try:
                assert str2search in driver.page_source
            except:
                raise Exception(
                    "Error : language '" +
                    elt +
                    "' is missing in " +
                    url_4_api +
                    "sitemap?content=base")

        print "Test Sitemap (topics)"
        driver.get(url_4_api + 'sitemap?content=topics')
        for elt in topics_list:
            str2search = 'topic=' + elt + '&amp;lang='
            try:
                assert str2search in driver.page_source
            except:
                raise Exception(
                    "Error : topic '" +
                    elt +
                    "' is missing in " +
                    url_4_api +
                    "sitemap?content=index page")

        print "Test Sitemap (layers)"
        driver.get(url_4_api + 'sitemap?content=layers')
        page_source_tmp = driver.page_source
        for elt in important_layers:
            str2search = '&amp;layers=' + elt + '&amp;lang='
            print "Search layer : " + elt
            try:
                assert str2search in page_source_tmp
            except:
                raise Exception(
                    "Error : layer '" +
                    elt +
                    "' is missing in " +
                    url_4_api +
                    "sitemap?content=layers")

        # Address index page : TO DO ?
        # https://map.geo.admin.ch/sitemap_addresses_10.xml

        # Sample address index : TO DO ?
        # https://api3.geo.admin.ch/sitemap?content=addresses_33

    if bLoaderJs:
        print "Test Loader JS"
        driver.get(url_4_api + 'loader.js')
        for elt in key_words_loaderjs:
            try:
                assert elt in driver.page_source
            except:
                raise Exception(
                    "Error : " +
                    str(elt) +
                    " not found in loader.js")

        driver.get(url_4_api + 'loader.js?lang=fr')
        assert "Voyage dans le temps - Cartes" in driver.page_source
        driver.get(url_4_api + 'loader.js?mode=debug')
        assert "static/js/ga-debug.js" in driver.page_source

    if bApiPage:
        print "Test API (search words Welcome)"
        driver.get(url_4_api)
        assert "Welcome" in driver.page_source

    if bCheckerApi:
        print "Test Checker API"
        driver.get(url_4_api + 'checker')
        assert "OK" in driver.page_source
        driver.get(url_4_api + 'checker_dev')
        assert "OK" in driver.page_source

    if bCheckerGeoAdmin:
        driver.get(url + '/' + 'checker')
        print "test si Ok est sur la page"
        assert "OK" in driver.page_source

    if bCheckerSphinx:
        print "Test Sphinx Checker"
        driver.get(url_4_api + SPHINX_CHECKER)
        assert "results" in driver.page_source
        assert "origin" in driver.page_source
        assert "geom_quadindex" in driver.page_source
        assert "label" in driver.page_source

    if bApiDevPage:
        print "Test Api Dev Page"
        driver.get(url_4_api + 'dev')
        assert "Shorten url" in driver.page_source
        assert "Map Services" in driver.page_source
        assert "Identify" in driver.page_source
        assert "Layers Configuration" in driver.page_source

    if bPythonTranslations:
        print "Test python Translations"
        driver.get(url_4_api + 'testi18n?lang=de')
        assert "BLN" in driver.page_source
        assert "Jagdbanngebiete" in driver.page_source
        driver.get(url_4_api + 'testi18n?lang=en')
        assert "ILNM" in driver.page_source
        assert "Swiss game reserves" in driver.page_source
        driver.get(url_4_api + 'testi18n?lang=toto')
        try:
            assert "BLN" in driver.page_source
        except Exception as e:
            try:
                assert "ILNM" in driver.page_source
            except Exception as e:
                raise Exception(
                    "Unable to find translation when lang=toto (BLN/ILNM)")

    if bShortenUrl:
        print "Test Shorten URL"
        driver.get(url_4_api + URL_SHORTEN)
        assert "shorturl" in driver.page_source
        assert SHORTEN_CODE in driver.page_source
        # Test url shorten
        if bCheckIfUrlHasChanged(driver):
            driver.get(url_4_api + 'shorten/' + SHORTEN_CODE)
            current_url = driver.current_url
            try:
                print "search in url directly"
                assert SHORTEN_LAYER in current_url
            except Exception as e:
                try:
                    wait_url_changed(driver, current_url)
                except Exception as e:
                    print '-----------'
                    print str(e)
                    print "Current url: " + current_url
                    raise Exception(SHORTEN_LAYER + " not exist on url")

    print 'Checker tests completed'
