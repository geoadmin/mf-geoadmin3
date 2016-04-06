# -*- coding: utf-8 -*-

import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DEFAULT_WAIT = 10
QUERYSTRING_KML = 'KML%7C%7Chttp:%2F%2Fopendata.utou.ch%2Furbanproto%2Fgeneva%2Fgeo%2Fkml%2FRoutes.kml'
QUERYSTRING_EXTERNAL_WMS = 'WMS||Schulkreis||https:%2F%2Fwww.gis.stadt-zuerich.ch' + \
    '%2Fmaps%2Fservices%2Fwms%2FWMS-ZH-STZH-OGD%2FMapServer%2FWMSServer||Schulkreis'
QUERYSTRING_PUBLIC_GEO_KML = 'KML||https:%2F%2Fpublic.geo.admin.ch%2F6YiSYr3XRmG_14aKz2HNRg'


def wait_printSucessTagExist(driver, timeout=DEFAULT_WAIT):
    TagPrintSuccessExist = False
    t0 = time.time()
    while not TagPrintSuccessExist:
        try:
            driver.find_element_by_xpath(
                "//span[@ng-if='options.printsuccess']")
            TagPrintSuccessExist = True
        except Exception:
            pass
        t1 = time.time()
        if t1 - t0 > timeout:
            break
        continue
    if not TagPrintSuccessExist:
        raise Exception(
            "success tag not find, print was not done (" + str(timeout) + ")")
    return bool(not TagPrintSuccessExist)


def runPrintTest(driver, target, is_top_browser):
    print "Start Print tests"

    # Put all layer type together for one print only
    print 'Print all layer type (wmts, wms, wms single tiles, aggregate, geojson,' + \
        ' internal andexternal kml, external wms)'
    target_full = target + '/?lang=de&layers=ch.swisstopo.landesschwerenetz,' + \
        'ch.swisstopo.landesschwerenetz,ch.bazl.luftfahrthindernis,' + \
        'ch.bav.sachplan-infrastruktur-schiene_kraft,'
    target_full += 'ch.bfs.gebaeude_wohnungs_register,ch.bafu.hydroweb-messstationen_grundwasser,' + \
        QUERYSTRING_KML + ',' + QUERYSTRING_EXTERNAL_WMS + ',' + QUERYSTRING_PUBLIC_GEO_KML
    PrintTest(driver, target_full)
    print "Test Print Ok !"


def PrintTest(driver, target_spec):
    # We maximize our window to be sure to be in full resolution
    # driver.manage().window().maximize();
    driver.get(target_spec)
    # wait until the page is loaded. We know this when title page is set to
    # Schweiz
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")
    # Click on "Drucken"
    driver.find_element_by_xpath("//a[@id='printHeading']").click()
    # Wait until print is opened and animation is finished
    driver.find_element_by_xpath(
        "//div[@id='print' and contains(@class, 'collapse in')]")
    # Wait until configuration is loaded
    driver.find_element_by_xpath(
        "//*[@id='print']//option[@label='A4 portrait']")

    # Selenium with IE is not able to handle menu selection
    if (driver.name != "internet explorer"):
        # Click on the orientation
        driver.find_element_by_xpath(
            "//*[@id='print']//select[@ng-model='layout']").click()
        # Click on "A3 Landscape"
        driver.find_element_by_xpath(
            "//*[@id='print']//option[@label='A3 landscape']").click()
        # Click on the scale
        driver.find_element_by_xpath(
            "//*[@id='print']//select[@ng-model='scale']").click()
        # Click on 1:200:000
        driver.find_element_by_xpath(
            "//*[@id='print']//option[@label='1:200,000']").click()
        if (driver.name != "firefox"):
            # Add legend
            driver.find_element_by_xpath(
                "//*[@id='print']//input[@ng-model='options.legend']").click()
            # Add Coordinate system
            driver.find_element_by_xpath(
                "//*[@id='print']//input[@ng-model='options.graticule']").click()

    # Try Print
    driver.find_element_by_xpath(
        "//button[contains(text(), 'Erstelle PDF')]").click()
    # Did it succeed?
    try:
        wait_printSucessTagExist(driver)
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception(
            "Print doesn't work, not find the tag for print success")
