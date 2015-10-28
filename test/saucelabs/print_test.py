import sys, os, time
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DEFAULT_WAIT=10

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
    #We maximize our window to be sure to be in full resolution
    #driver.manage().window().maximize();
    print "Start Print tests"
    target_url =  target + '/?lang=de'
    driver.get(target_url)
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
    print "Test Print Ok !"
