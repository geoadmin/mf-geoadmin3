# -*- coding: utf-8 -*

import sys, os, time, unittest, re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select

# Mobile Version testing using browserstack

def mobile_test(cap, driver, target):
    driver.get(target)
    #print driver.get_window_size()
    #We resize our window to simulate iPhone 4 like mobile resolution
    driver.set_window_size(320, 480)
    #print driver.get_window_size()
    # Go to the mobile version of map.geo.admin (with link)
    driver.get(target + '/mobile.html?lang=de')
    # Go to the mobile version (click on link "mobile version") # Doesn't works ?? 
    #driver.find_element_by_xpath("//a[contains(text(),'Mobile Version')]").click()
    # Wait until topics related stuff is loaded. We know this when catalog is there
    driver.find_element_by_xpath("//div[@id='zoomButtons']/div/button").click()
    driver.find_element_by_xpath("//button[@id='menu-button']").click()
    #Send "Wasser" to the searchbar
    driver.find_element_by_xpath("//*[@type='search']").send_keys("wasser")
    # Check if result contain data and layer 
    driver.find_element_by_xpath("//*[contains(text(), 'Gehe nach')]")
    driver.find_element_by_xpath("//*[contains(text(), 'Karte hinzufügen')]")
    print "Mobile test Ok !"
