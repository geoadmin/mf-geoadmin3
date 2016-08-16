# -*- coding: utf-8 -*

import time
import re

# WMS test using saucelabs

QUERYSTRING_WMS = "WMS%7C%7CAGNES%7C%7Chttps:%2F%2Fwms.geo.admin.ch%2F%7C%7Cch.swisstopo.fixpunkte-agnes"
DEFAULT_WAIT_LOADING = 15


def bDoCheckAlertPopup(driver):
    # alert popup don't exist with FF
    if driver.name == 'firefox' or driver.name == 'internet explorer':
        return 0
    else:
        return 1


def getMsgText(driver):
    return driver.find_element_by_css_selector("#import-wms-popup div[ga-import-wms] form .ga-message").text


def runWmsTest(driver, target, is_top_browser):
    print "Start Wms tests"
    driver.get(target)
    # We maximize our window to be sure to be in full resolution
    driver.maximize_window()
    driver.get(target + '/?lang=de')
    # Click on "Werkzeuge"
    driver.find_element_by_css_selector("#toolsHeading").click()
    # Click on "WMS Import"
    driver.find_element_by_link_text("WMS Import").click()
    # Write URL of the chosen WMS
    driver.find_element_by_css_selector("#import-wms-popup [name=\"url\"]").send_keys(
        "https://wms.geo.admin.ch/")
    # Click on "Verbinden"
    driver.find_element_by_xpath(
        "//*[@id='import-wms-popup']//button[contains(text(),'Verbinden')]").click()
    for i in range(DEFAULT_WAIT_LOADING):
        try:
            if re.search(r"^Parsing[\s\S]*$", getMsgText(driver)):
                break
        except:
            pass
        time.sleep(1)
    else:
        raise Exception("parsed WMS - time out(" + str(i) + ")")
    # Click on "AGNES"
    driver.find_element_by_xpath(
        "//*[@id='import-wms-popup']//div[contains(text(),'AGNES')]").click()
    # Click on "Layer hinzufügen"
    # print driver.current_url
    driver.find_element_by_css_selector("#import-wms-popup .ga-import-wms-add").click()
    # wait layer "erfolgreich geladen":
    for i in range(DEFAULT_WAIT_LOADING):
        try:
            # print "Try re.search..."
            if re.search(r"^[\s\S]*erfolgreich[\s\S]*$", getMsgText(driver)):
                break
        except:
            pass
        # Accept alert
        if bDoCheckAlertPopup(driver):
            try:
                alert = driver.switch_to_alert()
                alert.accept()
                # print "alert accepted"
            except Exception as e:
                print '------------'
                print str(e)
        try:
            if re.search(r"^[\s\S]*erfolgreich[\s\S]*$", getMsgText(driver)):
                break
        except:
            pass
        time.sleep(1)
    else:
        raise Exception("parsed WMS - time out(" + str(i) + ")")
    # print driver.current_url
    # Close popup
    driver.find_element_by_css_selector("#import-wms-popup .fa-remove").click()
    # print driver.current_url
    # Mobile Version URL contain QUERYSTRING_WMS ?
    assert QUERYSTRING_WMS in driver.find_element_by_xpath(
        "//*[@id='toptools']/a[3]").get_attribute("href")
    # Was the URL in the address bar adapted?
    # Check if url is adapted to WMS layer
    assert QUERYSTRING_WMS in driver.current_url
    # Go to the WMS layer page
    driver.get(target + '/?lang=de&layers=' + QUERYSTRING_WMS)
    # Check if the WMS Layer is loaded
    driver.find_element_by_xpath(
        "//*[@id='selection']//*[contains(text(), 'AGNES')]")
    print 'Wms tests Ok!'
