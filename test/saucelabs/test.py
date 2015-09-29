import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from start_test import start_test
from kml_test import kml_test

if __name__ == '__main__':
    
    if len(sys.argv) < 2:
            print "ERROR: No URL provided. You need to set SAUCELABS_TARGETURL in your environment! Exit"
            sys.exit(2)
    
    url = sys.argv[1]
    
    ### Get value to connect to SauceLabs
    try:
        saucelabs_user = os.environ['SAUCELABS_USER']
        saucelabs_key = os.environ['SAUCELABS_KEY']
    except KeyError:
        print "Please set the environment variable SAUCELABS_USER and SAUCELABS_KEY"
        sys.exit(2)
    #print "user: " + saucelabs_user
    #print "key: " + saucelabs_key
    
    # This is the only code you need to edit in your existing scripts. 
    # The command_executor tells the test to run on Sauce, while the desired_capabilties 
    # parameter tells us which browsers and OS to spin up.
    #desired_cap = {'platform': "Mac OS X 10.9", 'browserName': "chrome", 'version': "31"}
    desired_cap = {'platform': "Windows 8.1", 'browserName': "chrome", 'version': "42.0"}
    
    # Locally test
    #driver = webdriver.PhantomJS()
    
    driver = webdriver.Remote(
       command_executor='http://' + saucelabs_user + ':' + saucelabs_key + '@ondemand.saucelabs.com:80/wd/hub',
       desired_capabilities=desired_cap)
    
    ## okay we will start the script!
    print "Starting SauceLabs script!"


    start_test(driver, url)
    kml_test(cap, driver, target)
    driver.quit()
