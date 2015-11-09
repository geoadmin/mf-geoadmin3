# -*- coding: utf-8 -*-
import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from start_test import runStart_test
from kml_test import runKml_test
from search_test import runSearch_test
from swisssearch_test import runSwissSearchTest
from print_test import runPrintTest
from mobile_test import runMobile_test

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
    ### Code pour la déclaration des browser à tester
    desired_cap_list = [
        {'platform': "Windows 7", 'browserName': "chrome", 'version': "43.0", 'screenResolution': "1280x1024" },
        {'platform': "Windows 7", 'browserName': "chrome", 'version': "44.0", 'screenResolution': "1280x1024" },
        {'platform': "Windows 7", 'browserName': "chrome", 'version': "45.0", 'screenResolution': "1280x1024" },
        {'platform': "Windows 8.1", 'browserName': "chrome", 'version': "45.0", 'screenResolution': "1280x1024" },
        {'platform': "Windows 7", 'browserName': "firefox", 'version': "38.0", 'screenResolution': "1280x1024" },
        {'platform': "Windows 7", 'browserName': "firefox", 'version': "39.0", 'screenResolution': "1280x1024" },
        {'platform': "Windows 7", 'browserName': "firefox", 'version': "40.0", 'screenResolution': "1280x1024" },
        {'platform': "Windows 8.1", 'browserName': "firefox", 'version': "40.0", 'screenResolution': "1280x1024"}
#        {'platform': "Windows 7", 'browserName': "internet explorer", 'version': "9.0", 'screenResolution': "1280x1024" },
#        {'platform': "Windows 7", 'browserName': "internet explorer", 'version': "10.0", 'screenResolution': "1280x1024" },
#        {'platform': "Windows 7", 'browserName': "internet explorer", 'version': "11.0", 'screenResolution': "1280x1024" },
        ]
                        
    ### FOR TEST (test only one browser config)
    ## Chrome 43.0
    #desired_cap_list = [{'name': "ltalp test", 'build': "Swiss 1", 'platform': "Windows 7", 'browserName': "chrome", 'version': "43.0", 'screenResolution': "1280x1024", 'tags': "Swisssearch step 1" }]
    ## Firefox 40.0
    #desired_cap_list = [{'name': "ltalp test", 'build': "Swiss 1", 'platform': "Windows 7", 'browserName': "firefox", 'version': "40.0", 'screenResolution': "1280x1024", 'tags': "Swisssearch step 1" }]
    ## Internet Explorer 10.0
#    desired_cap_list = [{'name': "ltalp test", 'build': "Swiss 1", 'platform': "Windows 7", 'browserName': "internet explorer", 'version': "10.0", 'screenResolution': "1280x1024", 'tags': "Swisssearch step 1" }]

    ## okay we will start the script!
    print "Starting SauceLabs script!"

    for current_desired_cap in desired_cap_list: 
        print "+--> Start test with " + current_desired_cap['platform'] + " " + current_desired_cap['browserName'] + " (" + current_desired_cap['version'] + ")"

        driver = webdriver.Remote(
            command_executor='http://' + saucelabs_user + ':' + saucelabs_key + '@ondemand.saucelabs.com:80/wd/hub', desired_capabilities=current_desired_cap)
        try: 
            runStart_test(driver, url)                         ## Ok with Chrome and FF
            runMobile_test(current_desired_cap, driver, url)   ## Ok with Chrome and Firefox
            runSearch_test(desired_cap_list, driver, url)      ## Ok with Chrome and FF
            runKml_test(desired_cap_list, driver, url)         ## Ok with Chrome and FF  
            runSwissSearchTest(driver, url)                 ## Ok with Chrome and FF 
            runPrintTest(driver, url)                       ## Ok with Chrome and FF
        finally:
            driver.quit()
        print "--- end test for this browser"
    print "End full tests"
