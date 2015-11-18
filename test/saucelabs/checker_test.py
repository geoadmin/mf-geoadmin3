# -*- coding: utf-8 -*
import sys
import os
import unittest, time, re
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from helpers import intVersion
from helpers import bCheckIfUrlHasChanged

# Search testing using saucelabs 
DEFAULT_WAIT=6
SHORTEN_LAYER="ch.swisstopo.lubis-bildstreifen"
SHORTEN_CODE="20cc812c90"
URL_API_DEV="https://mf-chsdi3.dev.bgdi.ch/"
URL_API_INT="https://mf-chsdi3.int.bgdi.ch/"
URL_API_PROD="https://api3.geo.admin.ch/"
SPHINX_CHECKER="rest/services/inspire/SearchServer?searchText=wasser&type=locations"
URL_SHORTEN="shorten.json?url=https://mf-geoadmin3.int.bgdi.ch/%3FX%3D164565.22%26Y%3D620538.74%26zoom%3D2%26lang%3Den%26topic%3Dlubis%26bgLayer%3Dch.swisstopo.pixelkarte-grau%26catalogNodes%3D1179,1180,1184,1186%26layers%3Dch.swisstopo.lubis-bildstreifen"

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
        raise Exception("Url not changed until end of timeout (" + str(timeout) + ")")
    return bool(not UrlHasChanged)


def runCheckerTest(driver, url):
    print 'Checker tests starts!'
    
    bApiPage = 0
    bCheckerApi = 0
    bCheckerGeoAdmin = 0
    bCheckerSphinx = 0
    bApiDevPage = 0
    bPythonTranslations = 0
    bShortenUrl = 0

    try:
        assert "dev" in url
        url_4_api = URL_API_DEV
    except Exception as e:
        try:
            assert "int" in url
            url_4_api = URL_API_INT
        except Exception as e:
            url_4_api = URL_API_PROD
    print "URL of API : " + url_4_api

    if bApiPage:
        print "Test API (search words Welcome)"
        driver.get(url_4_api)
        assert "Welcome" in driver.page_source

    if bCheckerApi:
        print "Test Checker API"
        driver.get(url_4_api + 'checker')
        assert "OK" in driver.page_source

    if bCheckerGeoAdmin:
        driver.get(url + 'checker')
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
                raise Exception("Unable to find translation when lang=toto (BLN/ILNM)")

    if bShortenUrl:
        print "Test Shorten URL"
        driver.get(url_4_api + URL_SHORTEN)
        assert "shorturl" in driver.page_source
        assert SHORTEN_CODE in driver.page_source
        ## Test url shorten
        if bCheckIfUrlHasChanged(driver):
            driver.get(url_4_api + 'shorten/' + SHORTEN_CODE)
            current_url = driver.current_url
            try :
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
