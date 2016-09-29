# -*- coding: utf-8 -*

import sys
from helpers import waitForUrlChange, pageLoadWait

QUERYSTRING_OF_AVENCHES = 'X=191917.41&Y=569374.22&zoom=6'
QUERYSTRING_WHEN_ZOOM_IN = 'zoom=2'
DEFAULT_WAIT = 6


def runMobileTest(driver, target, is_top_browser):
    print "Start Mobile tests"
    target_url = target + '?lang=de'
    driver.get(target_url)

    pageLoadWait(driver, target_url)
    current_url = driver.current_url
    # Switch to Mobile Version
    driver.find_element_by_link_text("Mobile Version").click()

    try:
        waitForUrlChange(driver, current_url)
        # Rem : mobile.html is replace by index.tml
    except Exception as e:
        print '-----------'
        print str(e)
        print "Current url: " + current_url
        raise Exception("Mobile version not loaded !")

    # Zoom-in
    driver.find_element_by_css_selector("button.ol-zoom-in").click()
    if waitForUrlChange(driver, QUERYSTRING_WHEN_ZOOM_IN):
        print 'Mobile: expected pattern %s was not found after a zoom in' % QUERYSTRING_WHEN_ZOOM_IN
        sys.exit(1)

    # Make a search
    driver.find_element_by_xpath("//input[@type='search']").clear()
    driver.find_element_by_xpath(
        "//input[@type='search']").send_keys("Avenches")
    driver.find_element_by_css_selector("span.ga-search-highlight").click()

    if waitForUrlChange(driver, QUERYSTRING_OF_AVENCHES):
        print 'Mobile: expected pattern %s was not found after a search' % QUERYSTRING_OF_AVENCHES
        sys.exit(1)

    # Check result search of 'wasser'. Must return locations (Gehe nach) and
    # layers (Karte hinzufügen)
    driver.find_element_by_xpath("//input[@type='search']").clear()
    driver.find_element_by_xpath("//*[@type='search']").send_keys("wasser")
    # Check if result contain data and layer
    driver.find_element_by_xpath("//*[contains(text(), 'Gehe nach')]")
    driver.find_element_by_xpath("//*[contains(text(), 'Karte hinzufügen')]")

    print "Mobile tests Ok !"
