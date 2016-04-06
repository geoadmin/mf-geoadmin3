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
URL_SHORTEN = 'shorten.json?url=https://mf-geoadmin3.int.bgdi.ch/' + \
    '%3FX%3D164565.22%26Y%3D620538.74%26zoom%3D2%26lang%3Den%26topic%3Dlubis%26bgLayer%3D' + \
    'ch.swisstopo.pixelkarte-grau%26catalogNodes%3D1179,1180,1184,1186%26layers%3D' + \
    'ch.swisstopo.lubis-bildstreifen'


def runCheckerTest(driver, url, is_top_browser):
    print 'Checker tests starts!'

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
                print '-----------'
                print str(e)
                print "Current url: " + url

    for ckFunc in checkerFunctions:
        ckFunc(driver, url, url_4_api, is_top_browser)

    print 'Checker tests completed'


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


def SiteMap(driver, url, url_4_api, is_top_browser):
    if is_top_browser == 1:
        print "  Test geoadmin Sitemap"
        driver.get(url + '/' + 'sitemap_index.xml')
        assert "sitemapindex" in driver.page_source


def ApiPage(driver, url, url_4_api, is_top_browser):
    print "  Test API (search words Welcome)"
    driver.get(url_4_api)
    assert "Welcome" in driver.page_source


def CheckerGeoAdmin(driver, url, url_4_api, is_top_browser):
    if is_top_browser == 1:
        print "  Test Checker GeoAdmin"
        driver.get(url + '/' + 'checker')
        assert "OK" in driver.page_source


def ShortenUrl(driver, url, url_4_api, is_top_browser):
    print "  Test Shorten URL"
    driver.get(url_4_api + URL_SHORTEN)
    assert "shorturl" in driver.page_source
    assert SHORTEN_CODE in driver.page_source
    # Test url shorten
    if bCheckIfUrlHasChanged(driver):
        driver.get(url_4_api + 'shorten/' + SHORTEN_CODE)
        current_url = driver.current_url
        try:
            # print "search in url directly"
            assert SHORTEN_LAYER in current_url
        except Exception as e:
            try:
                wait_url_changed(driver, current_url)
            except Exception as e:
                print '-----------'
                print str(e)
                print "Current url: " + current_url
                raise Exception(SHORTEN_LAYER + " not exist on url")


checkerFunctions = [
    SiteMap,
    ApiPage,
    CheckerGeoAdmin,
    ShortenUrl]
