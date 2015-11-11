import sys, os, time
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DEFAULT_WAIT=10
QUERYSTRING_KML="KML%7C%7Chttp:%2F%2Fopendata.utou.ch%2Furbanproto%2Fgeneva%2Fgeo%2Fkml%2FRoutes.kml"
QUERYSTRING_EXTERNAL_WMS="WMS||Schulkreis||https:%2F%2Fwww.gis.stadt-zuerich.ch%2Fmaps%2Fservices%2Fwms%2FWMS-ZH-STZH-OGD%2FMapServer%2FWMSServer||Schulkreis"
QUERYSTRING_PUBLIC_GEO_KML="KML||https:%2F%2Fpublic.geo.admin.ch%2F6YiSYr3XRmG_14aKz2HNRg"

def wait_printSucessTagExist(driver, timeout=DEFAULT_WAIT):
    UrlHasChanged = False
    TagPrintSuccessExist = False
    t0 = time.time()
    while not TagPrintSuccessExist:
        try:
            #print "Test find element in wait_printSucessTagExist()"
            driver.find_element_by_xpath("//span[@ng-if='options.printsuccess']")
            TagPrintSuccessExist = True
#            print "Time wait : " + str(round((t1 - t0), 2))
        except Exception:
            pass
        t1 = time.time()
        if t1 - t0 > timeout:
            break
        continue
    if not TagPrintSuccessExist:
        raise Exception("success tag not find, print was not done (" + str(timeout) + ")")
    return bool(not TagPrintSuccessExist)


def runPrintTest(driver, target): 
    print "Start Print tests"

    # Make a print test of differents layer types

    bDoWmts = 1
    bDoWms = 1
    bDoWmsWithoutSingleTile = 1
    bDoAggregate = 1
    bDoGeojson = 1
    bDoExternalKml = 1
    bDoExternalWms = 1
    bDoMapGeoKml = 1

    # WMTS
    if bDoWmts:
        print "Print test of WMTS Layer : ch.swisstopo.landesschwerenetz"
        target_spec = target + '/?lang=de&layers=ch.swisstopo.landesschwerenetz&X=190000.00&Y=660000.00&zoom=3'
        PrintTest(driver, target_spec)

    # WMS 
    if bDoWms:
        print "Print test of WMS layer : ch.bazl.luftfahrthindernis"
        target_spec = target + '/?lang=de&layers=ch.bazl.luftfahrthindernis&X=190000.00&Y=660000.00&zoom=5'
        PrintTest(driver, target_spec)

    # WMS without single tiles : ch.bav.sachplan-infrastruktur-schiene_kraft
    if bDoWmsWithoutSingleTile:
        print "Print test of WMS (single tile ='f') : ch.bav.sachplan-infrastruktur-schiene_kraft"
        target_spec = target + '/?lang=de&ch.bav.sachplan-infrastruktur-schiene_kraft'
        PrintTest(driver, target_spec)

    # AGGREGATE : ch.bfs.gebaeude_wohnungs_register
    if bDoAggregate:
        print "Print test of Aggregate layer : ch.bfs.gebaeude_wohnungs_register"
        target_spec = target + '/?lang=de&layers=ch.bfs.gebaeude_wohnungs_register&X=190000.00&Y=660000.00&zoom=3'
        PrintTest(driver, target_spec)

    # Geojson
    if bDoGeojson:
        print "Print test of Geojson layer : ch.bafu.hydroweb-messstationen_grundwasser"
        target_spec = target + '/?lang=de&layers=ch.bafu.hydroweb-messstationen_grundwasser&X=190000.00&Y=660000.00&zoom=3'
        PrintTest(driver, target_spec)

    # External KML
    if bDoExternalKml:
        print "Print test of external Kml : http://opendata.utou.ch/urbanproto/geneva/geo/kml/Routes.kml"
        target_spec = target + '?lang=de&layers=' + QUERYSTRING_KML
        PrintTest(driver, target_spec)

    # External WMS 
    if bDoExternalWms:
        print "Print test of external wms : Schukreis (Zurich)"
        target_spec = target + '?lang=de&layers=' + QUERYSTRING_EXTERNAL_WMS 
        PrintTest(driver, target_spec)

    # KML from public.geo.admin.ch
    if bDoMapGeoKml:
        print "Print test of KML from public.geo.admin.ch" 
        target_spec = target + '?lang=de&layers=' + QUERYSTRING_PUBLIC_GEO_KML
        PrintTest(driver, target_spec)
 
    print "Test Print Ok !"


def PrintTest(driver, target_spec):
    #We maximize our window to be sure to be in full resolution
    #driver.manage().window().maximize();
    driver.get(target_spec)
    # wait until the page is loaded. We know this when title page is set to Schweiz
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")
    current_url = driver.current_url
    # Click on "Drucken"
    driver.find_element_by_xpath("//a[@id='printHeading']").click()
    # Wait until print is opened and animation is finished
    driver.find_element_by_xpath("//div[@id='print' and contains(@class, 'collapse in')]")
    # Wait until configuration is loaded
    driver.find_element_by_xpath("//*[@id='print']//option[@label='A4 portrait']")

    # Selenium with IE is not able to handle menu selection
    if (driver.name != "internet explorer"):
        # Click on the orientation
        driver.find_element_by_xpath("//*[@id='print']//select[@ng-model='layout']").click()
        # Click on "A3 Landscape"
        driver.find_element_by_xpath("//*[@id='print']//option[@label='A3 landscape']").click()
        # Click on the scale
        driver.find_element_by_xpath("//*[@id='print']//select[@ng-model='scale']").click()
        # Click on 1:200:000
        driver.find_element_by_xpath("//*[@id='print']//option[@label='1:200,000']").click()
        if (driver.name != "firefox"):
            # Add legend
            driver.find_element_by_xpath("//*[@id='print']//input[@ng-model='options.legend']").click()
            # Add Coordinate system
            driver.find_element_by_xpath("//*[@id='print']//input[@ng-model='options.graticule']").click()

    # Try Print
    driver.find_element_by_xpath("//button[contains(text(), 'Erstelle PDF')]").click()
    # Did it succeed?
    try:
        wait_printSucessTagExist(driver)
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Print doesn't work, not find the tag for print success")
