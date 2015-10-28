# -*- coding: utf-8 -*

import sys, os, time, unittest, re
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
QUERYSTRING_OF_AVENCHES = 'X=191917.41&Y=569374.22&zoom=6'
QUERYSTRING_WHEN_ZOOM_IN = 'zoom=2'
DEFAULT_WAIT=6

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


def runMobile_test(cap, driver, target):
    print "Start Mobile tests"
    target_url =  target + '?lang=de'
    driver.get(target_url)

    # wait until the page is loaded. We know this when the title contain (S)chweiz
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")
    current_url = driver.current_url

    # Switch to Mobile Version 
    driver.find_element_by_link_text("Mobile Version").click()

    try:
        wait_url_changed(driver, current_url)
        ## Rem : mobile.html is replace by index.tml
    except Exception as e:
        print '-----------'
        print str(e)
        print "Current url: " + current_url
        raise Exception("Mobile version not loaded !")

    # Zoom-in
    driver.find_element_by_css_selector("button.ol-zoom-in").click()
    current_url = driver.current_url
    try:
        assert QUERYSTRING_WHEN_ZOOM_IN in current_url
    except Exception as e:
        # Wait refresh URL
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
            print "Current url: " + current_url
            raise Exception("Zoom click not set in the url")
        # Check if the zoom in click update the url 
        assert QUERYSTRING_WHEN_ZOOM_IN in driver.current_url 

    # Make a search
    driver.find_element_by_xpath("//input[@type='search']").clear()
    driver.find_element_by_xpath("//input[@type='search']").send_keys("Avenches")
    driver.find_element_by_css_selector("span.ga-search-highlight").click()
    current_url = driver.current_url
    try:
        assert QUERYSTRING_OF_AVENCHES in current_url
    except Exception as e:
        # Wait refresh URL
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
            print "Current url: " + current_url
            raise Exception("Coordinate of Avenches is not set in the url")
        # Check if url contain coordinate of avenches
        assert QUERYSTRING_OF_AVENCHES in driver.current_url 

    # Check result search of 'wasser'. Must return locations (Gehe nach) and layers (Karte hinzufügen)
    driver.find_element_by_xpath("//input[@type='search']").clear()
    driver.find_element_by_xpath("//*[@type='search']").send_keys("wasser")
    # Check if result contain data and layer 
    driver.find_element_by_xpath("//*[contains(text(), 'Gehe nach')]")
    driver.find_element_by_xpath("//*[contains(text(), 'Karte hinzufügen')]")

    print "Mobile test Ok !"
