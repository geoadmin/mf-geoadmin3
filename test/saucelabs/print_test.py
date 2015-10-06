import sys, os, time
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DEFAULT_WAIT=6

def wait_printSucessTagExist(driver, timeout=DEFAULT_WAIT):
    UrlHasChanged = False
    TagPrintSuccessExist = False
    t0 = time.time()
    while not TagPrintSuccessExist:
        try:
            driver.find_element_by_xpath("//span[@ng-if='options.printsuccess']")
            TagPrintSuccessExist = True
            #print "Time wait : " + str(t1 - t0)
        except Exception:
            pass
        t1 = time.time()
        if t1 - t0 > timeout:
            break
        continue
    if not TagPrintSuccessExist:
        raise Exception("Print success tag not find, print was not done (" + str(timeout) + ")")
    return bool(not TagPrintSuccessExist)



def runPrintTest(driver, target): 
    #We maximize our window to be sure to be in full resolution
    #driver.manage().window().maximize();
    # Goto the travis deployed site.
    target_url =  target + '/?lang=de'
    driver.get(target_url)
    # wait until topics related stuff is loaded. We know this when catalog is there
    #driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
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

    # Selenium IE and FF are not able to handle menu selection
    #if(!(cap.browser != "IE" || cap.browser != "Firefox")): ### Ne fonctionne pas je pense !
    #if (driver.name != "internet explorer") and (driver.name != "firefox"):
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
    current_url = driver.current_url
    driver.find_element_by_xpath("//button[contains(text(), 'Erstelle PDF')]").click()
    # Did it succeed?
    try:
        wait_printSucessTagExist(driver)
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Print doesn't work, not find the tag for print success")
    print "Test Print Ok !"

