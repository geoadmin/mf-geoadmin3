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

# Search testing using browserstack
QUERYSTRING_OF_BERN = "X=200393.28&Y=596671.16";
DEFAULT_WAIT=15

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

def runSearchTest(cap, driver, url):
    print 'Search_test starts!'
    driver.get(url)
    driver.maximize_window()
    driver.get(url + '/?lang=de')
   
    #  Send "Bern" to the searchbar
    driver.find_element_by_xpath("//*[@type='search']").send_keys("Bern")

    #  Click on the field "Bern (BE)"
    driver.find_element_by_xpath("//*[contains(text(), 'Bern')]").click()

    if bCheckIfUrlHasChanged(driver):
        #  Was the URL in the address bar adapted?
        current_url = driver.current_url
        try:
            assert QUERYSTRING_OF_BERN in driver.current_url
        except Exception as e:
        # Wait refresh URL
            try:
                wait_url_changed(driver, current_url)
            except Exception as e:
                print '-----------'
                print str(e)
                print "Current url: " + current_url
                raise Exception("Coordinate of raron is not set in the url")
            # Check if url contain coordinate of raron
            assert QUERYSTRING_OF_BERN in driver.current_url

        # Specifically search if href of links is updated
        assert QUERYSTRING_OF_BERN in driver.find_element_by_xpath("//*[@id='toptools']/a[3]").get_attribute("href")

    print 'Search_test completed'
