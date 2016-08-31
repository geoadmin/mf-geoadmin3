# -*- coding: utf-8 -*

import time


# KML import test using browserstack

QUERYSTRING_KML = "KML%7C%7Chttp:%2F%2Fopendata.utou.ch%2Furbanproto%2Fgeneva%2Fgeo%2Fkml%2FRoutes.kml"
POSITION_TO_KML = "X=124759.52&Y=499224.22"


def runKmlTest(driver, target, is_top_browser):
    print 'Start Kml tests'
    driver.get(target)
    # We maximize our window to be sure to be in full resolution
    driver.maximize_window()
    # Goto the travis deployed site.
    driver.get(target + '/?lang=de')
    # Click on "Werkzeuge"
    driver.find_element_by_css_selector("#toolsHeading").click()
    # Click on "KML Import"
    driver.find_element_by_link_text("KML Import").click()
    # Click on "URL"
    driver.find_element_by_link_text("URL").click()
    # Write URL of the chosen KML
    driver.find_element_by_css_selector("#import-kml-popup [name=\"url\"]").send_keys(
        "http://opendata.utou.ch/urbanproto/geneva/geo/kml/Routes.kml")
    # Click on "KML Laden"
    driver.find_element_by_css_selector("#import-kml-popup .ga-import-kml-load").click()
    # Check if the KML was correctly parsed
    for i in range(60):
        try:
            if "Parsing erfolgreich" == driver.find_element_by_css_selector(
                    "#import-kml-popup .ga-import-kml-result").text:
                break
        except:
            pass
        time.sleep(1)
    else:
        raise Exception("parsed KML - time out(" + str(i) + ")")
    assert "Parsing erfolgreich" in driver.find_element_by_css_selector(
        "#import-kml-popup .ga-import-kml-result").text

    # Close popup
    driver.find_element_by_css_selector("#import-kml-popup .fa-remove").click()

    # Mobile Version URL contain POSITION_TO_KML ?
    assert POSITION_TO_KML in driver.find_element_by_xpath(
        "//*[@id='toptools']/a[3]").get_attribute("href")
    # Was the URL in the address bar adapted?
    assert POSITION_TO_KML in driver.current_url
    # Go to the KML linkedURL
    driver.get(target + '/?lang=de&layers=' + QUERYSTRING_KML)
    # wait until topics related stuff is loaded.
    for i in range(60):
        try:
            if "&layers=KML" in driver.current_url:
                break
        except:
            pass
        time.sleep(1)
    else:
        raise Exception("Load KML - time out(" + str(i) + ")")
    # Check if KML has correctly been loaded
    driver.find_element_by_xpath(
        "//*[@id='selection']//*[contains(text(), 'Lignes')]")
    print 'Import KML layer from link OK!'
