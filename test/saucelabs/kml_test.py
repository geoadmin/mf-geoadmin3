# -*- coding: utf-8 -*

import sys, os, time, unittest, re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select


# KML import test using browserstack

QUERYSTRING_KML = "KML%7C%7Chttp:%2F%2Fopendata.utou.ch%2Furbanproto%2Fgeneva%2Fgeo%2Fkml%2FRoutes.kml"
POSITION_TO_KML = "X=124759.52&Y=499224.22"

def kml_test(cap, driver, target):
    driver.get(target)
    #We maximize our window to be sure to be in full resolution
    driver.maximize_window()
    # Goto the travis deployed site.
    driver.get(target + '/?lang=de')
    #open Geokatalog
    driver.find_element_by_css_selector("#catalogHeading > span.ng-binding").click()    
    #choose Grundlagen und Planung
    driver.find_element_by_link_text("Grundlagen und Planung").click()
    # Click on "Werkzeuge"
    driver.find_element_by_css_selector("#toolsHeading > span.ng-scope").click()    
    # Click on "KML Import"
    driver.find_element_by_xpath("//div[@id='tools']/div/ul/li[2]/a/span").click()
    # Click on "URL"
    driver.find_element_by_link_text("URL").click()
    # Write URL of the chosen KML
    driver.find_element_by_css_selector("div > input[name=\"url\"]").send_keys("http://opendata.utou.ch/urbanproto/geneva/geo/kml/Routes.kml")
    # Click on "KML Laden"
    driver.find_element_by_xpath("//div[@id='import-kml-popup']/div[2]/div/div/div[2]/button").click()
    # Check if the KML was correctly parsed
    for i in range(60):
        try:
            if "Parsing erfolgreich" == driver.find_element_by_css_selector("div.ga-import-kml-result.ng-binding").text: break
        except: pass
        time.sleep(1)
    else: raise Exception("parsed KML - time out(" + str(i) + ")")
    assert "Parsing erfolgreich" in driver.find_element_by_css_selector("div.ga-import-kml-result.ng-binding").text
    # Close popup
    driver.find_element_by_xpath("//div[@id='import-kml-popup']/div/div[2]/button[3]").click()
    # Mobile Version URL contain POSITION_TO_KML ?
    assert POSITION_TO_KML in driver.find_element_by_xpath("//*[@id='toptools']/a[3]").get_attribute("href")
    # Was the URL in the address bar adapted?
    if(not(cap['browserName'] == "internet explorer" and cap['version'] == "9.0")):
        assert POSITION_TO_KML in driver.current_url 
    # Go to the KML linkedURL
    driver.get(target + '/?lang=de&layers=' + QUERYSTRING_KML)
    # wait until topics related stuff is loaded.
    for i in range(60):
        try:
            if "&layers=KML" in driver.current_url: break
        except: pass
        time.sleep(1)
    else: raise Exception("Load KML - time out(" + str(i) + ")")
    # Check if KML has correctly been loaded
    assert "Lignes" in driver.find_element_by_xpath("//*[@id='selection']//*").text

