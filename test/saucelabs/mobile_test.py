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
  #Go to the mobile version of map.geo.admin
  driver.get(target + '/mobile.html?lang=de')
  #Wait until topics related stuff is loaded. We know this when catalog is there
  driver.find_element_by_xpath("//div[@id='zoomButtons']").click()
  driver.find_element_by_xpath("//div[@id='pulldown']").click()
  #Send "Bern" to the searchbar
  driver.find_element_by_xpath("//*[@type='search']").send_keys("Bern")
  #Click on the field "Bern"
  driver.find_element_by_xpath("//*[contains(text(), 'Bern')]").click()
