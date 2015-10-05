import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def start_test(driver, url):
    # This is your test logic. You can add multiple tests here.
    driver.implicitly_wait(5)
    #driver.get(url)
    ## Set the timeout to x ms
    driver.set_page_load_timeout(10)
    ## Go to the deployed site.
    print "Ouverture de la page map.geo.admin.ch:"
    #driver.get('https://map.geo.admin.ch/?lang=de')
    driver.get(url + '/?lang=de')
    ## Wait until topics related stuff is loaded. We know this when catalog is there
        #driver.find_elements_by_xpath("//a[contains(text(), 'Grunaasdfasdfasdfsdfsdfasdfdlagen und Planung')]")
    #driver.find_element_by_partial_link_text("Grundlagen und Planung")
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
    
    #if not "Google" in driver.title:
    if not "chweiz" in driver.title:
                raise Exception("Unable to load map.geo.admin page!")
                elem = driver.find_element_by_name("q")
                elem.send_keys("Sauce Labs")
                elem.submit()
                print driver.title
    else:
            print "Test Ok"
    
    # This is where you tell Sauce Labs to stop running tests on your behalf.  
    # It's important so that you aren't billed after your test finishes.



