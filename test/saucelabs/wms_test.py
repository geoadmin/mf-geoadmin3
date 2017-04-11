# -*- coding: utf-8 -*

import time
import re
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

# WMS test using saucelabs

QUERYSTRING_WMS = "WMS%7C%7CAGNES%7C%7Chttps:%2F%2Fwms.geo.admin.ch%2F%3F%7C%7Cch.swisstopo.fixpunkte-agnes"
DEFAULT_WAIT_LOADING = 15
WMS_URL = "https://wms.geo.admin.ch/"


def runWmsTest(driver, target, is_top_browser):
    print "Start Import Wms tests"
    driver.get(target)
    # We maximize our window to be sure to be in full resolution
    driver.maximize_window()
    driver.get(target + '/?lang=de')
    # Click on "Werkzeuge"
    driver.find_element_by_css_selector("#toolsHeading").click()
    # Click on "Import"
    driver.find_element_by_link_text("Importieren").click()
    elt = driver.find_element_by_css_selector("#import-popup [ga-import]")
    # Write URL of the chosen WMS
    input = elt.find_element_by_css_selector("[ngeo-import-online] input[name=\"url\"]")
    input.send_keys(WMS_URL)
    # Active blur event (needed for chrome to close the suggestions list)
    input.send_keys(Keys.TAB)
    # Watch button text
    bt = elt.find_element_by_css_selector("[ngeo-import-online] button")
    bt.click()
    for i in range(DEFAULT_WAIT_LOADING):
        try:
            print bt.text
            if re.search("Upload OK", bt.text):
                break
        except:
            pass
        time.sleep(1)
    else:
        raise Exception("Parsing of WMS GetCap failed - time out(" + str(i) + ")")
    # Click on "AGNES"
    elt.find_element_by_xpath("//div[text()[contains(.,'AGNES')]]").click()
    # Click on "Layer hinzufuegen"
    elt.find_element_by_css_selector(".ngeo-add").click()
    # Accept alert message
    try:
        WebDriverWait(driver, DEFAULT_WAIT_LOADING).until(EC.alert_is_present(), "Timed out alert")
        alert = driver.switch_to_alert()
        alert.accept()
    except Exception as e:
        raise Exception("Acceptance of the alert message failed" + str(e))
    # Close popup
    driver.find_element_by_css_selector("#import-popup .fa-remove").click()
    # Mobile Version URL contain QUERYSTRING_WMS ?
    assert QUERYSTRING_WMS in driver.find_element_by_xpath("//*[@id='toptools']/a[3]").get_attribute("href")
    # Was the URL in the address bar adapted?
    # Check if url is adapted to WMS layer
    assert QUERYSTRING_WMS in driver.current_url
    # Go to the WMS layer page
    driver.get(target + '/?lang=de&layers=' + QUERYSTRING_WMS)
    # Check if the WMS Layer is loaded
    driver.find_element_by_xpath("//*[@id='selection']//*[text()[contains(.,'AGNES')]]")
    print 'Import Wms tests Ok!'
