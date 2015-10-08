# -*- coding: utf-8 -*-
import time
import sys
import os
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Swisssearch Test Using saucelabs

QUERYSTRING_OF_RARON = "X=128114.80&Y=629758.13&zoom=10";
QUERYSTRING_OF_RTE_BERNE_LAUSANNE = "X=154208.00&Y=539257.00&zoom=10";
QUERYSTRING_OF_PL_CHATEAU_AVENCHES = "X=192310.00&Y=569734.00&zoom=10";
QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA = "X=117501.36&Y=722496.94&zoom=10";
QUERYSTRING_MOOS = "X=128630.00&Y=627650.00&zoom=10";
QUERYSTRING_OF_REALTA = "X=181085.00&Y=751355.00";
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


def runSwissSearchTest(driver, target):
    print "Start Swissearch tests"

    #### NEW TEST ####
    # swissearch parameter with multiple results
    target_url =  target + '/?swisssearch=raron&lang=de'
    driver.get(target_url);
    # wait until the page is loaded. We know this when the title contain (S)chweiz
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")
    current_url = driver.current_url
    ## Ne marche pas avec IE !
    driver.find_element_by_xpath("//*[contains(text(), ', Flugplatz')]").click()
    current_url = driver.current_url
    try:
        assert QUERYSTRING_OF_RARON in current_url
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
        assert QUERYSTRING_OF_RARON in driver.current_url
    # Must also update the link of 'toptool'
    ##TO DO : Make the test

    # parameter should disappear when selection is done
    assert "swisssearch" not in driver.current_url 
    print "Test Raron Ok"


    #### NEW TEST ####
    # swisssearch parameter with multiple results (locations and layers), reset selection
    target_url =  target + '/?swisssearch=wasser&lang=de'
    driver.get(target_url);
    # Wait refresh
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")

    driver.find_element_by_xpath("//*[contains(text(), 'Gehe nach')]")
#    driver.find_element_by_xpath("//div[@id='search-container']/div/form/span[2]/span/div/div/div[2]/div[3]/div, 'Gehe nach')]")
    driver.find_element_by_xpath("//*[contains(text(), 'Karte hinzufügen')]")

    # Clear the result, key word 'swisssearch' must be clear from url
    clear_elem = driver.find_element_by_xpath("//button[@ng-click='clearInput()']").click()
    current_url = driver.current_url
    try:
        assert "swisssearch" not in current_url
    except Exception as e:
        # Wait refresh
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
            print "Current url: " + current_url
            raise Exception("swissearch key word exist in url. But it must be removed after a clear result action")
    
        # Check if url is clean 
        url_result = driver.current_url
        # parameter should disappear when selection is done
        assert "swisssearch" not in url_result
        # Must also update the link of 'toptool'
        ## TO DO : Make the test
    print "Test Wasser for multiple results (locations and layers) Ok"
    
    
    #### NEW TEST ####
    # swissearch parameter with 1 result (direct selection doesn't work in safari 5.1)
    target_url =  target + '/?swisssearch=brückenmoostrasse 11 raron&lang=de'
    driver.get(target_url);
    current_url = driver.current_url
    try:
        assert QUERYSTRING_MOOS in current_url 
    except Exception as e:
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
        current_url = driver.current_url
        assert QUERYSTRING_MOOS in driver.current_url

    # parameter (swisssearch) is removed by map action (simulating zoom here)
    driver.find_element_by_css_selector("button.ol-zoom-out").click()
    try:
        assert "swisssearch" not in driver.current_url
    except Exception as e:
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
        # parameter should disappear when selection is done
        assert "swisssearch" not in driver.current_url
    # Must also update the link of 'toptool'
    ## TO DO : Make the test
    print "Test brückenmoostrasse Ok"


    #### NEW TEST ####
    # swisssearch Route de Berne 91 1010 Lausanne with wordforms rte
    target_url =  target + '/?swisssearch=rte berne 91 1010&lang=de'
    driver.get(target_url)
    try:
        assert QUERYSTRING_OF_RTE_BERNE_LAUSANNE in driver.current_url
    except Exception as e:
        try:
            wait_url_changed(driver, driver.current_url)
        except Exception as e:
            print '-----------'
            print str(e)
        # url has changed, now we can test url parameter's 
        assert QUERYSTRING_OF_RTE_BERNE_LAUSANNE in driver.current_url
    print "Test Route de Berne à Lausanne Ok"


    #### NEW TEST ####
    # swisssearch Realta industriegebiet 701 with wordforms GI -> industriegebiet (DE)
    target_url =  target + '/?swisssearch=realta gi 701&lang=de'
    driver.get(target_url);
    current_url = driver.current_url
    try:
        assert QUERYSTRING_OF_REALTA in driver.current_url
    except Exception as e:
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
        current_url = driver.current_url
        assert QUERYSTRING_OF_REALTA in current_url
    # Must also update the link of 'toptool'
    ## TO DO : Make the test
    print "Test Realta Ok"


    #### NEW TEST ####
    # swisssearch Place du Château, Avenches (Pl -> platz)
    target_url =  target + '/?swisssearch=pl chateau avenches&lang=de'
    driver.get(target_url);
    current_url = driver.current_url
    try:
        assert QUERYSTRING_OF_PL_CHATEAU_AVENCHES in driver.current_url
    except Exception as e:
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
        current_url = driver.current_url
        assert QUERYSTRING_OF_PL_CHATEAU_AVENCHES in current_url
    # Must also update the link of 'toptool'
    ## TO DO : Make the test
    print "Test Place du chateau Avenches Ok"


    #### NEW TEST ####
    # swisssearch Piazza Mesolcina, Bellinzona (P -> piazza)
    target_url =  target + '/?swisssearch=p Mesolcina Bellinzona&lang=de'
    driver.get(target_url);
    current_url = driver.current_url
    try:
        assert QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA in driver.current_url
    except Exception as e:
        try:
            wait_url_changed(driver, current_url)
        except Exception as e:
            print '-----------'
            print str(e)
        current_url = driver.current_url
        assert QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA in current_url
    # Must also update the link of 'toptool'
    ## TO DO : Make the test
    print "Test Bellinzona Ok"
