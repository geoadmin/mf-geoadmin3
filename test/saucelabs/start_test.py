import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
DEFAULT_WAIT_LOAD=20

def runStartTest(driver, url):
    # This is your test logic. You can add multiple tests here.
    driver.implicitly_wait(5)
    ## Set the timeout to x ms
    driver.set_page_load_timeout(DEFAULT_WAIT_LOAD)
    ## Go to the deployed site.
    print "Start map.geo.admin.ch:"
    driver.get(url + '/?lang=de')
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")
   
    print "Start Test Ok!"
