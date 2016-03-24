# -*- coding: utf-8 -*-

import sys
import os
import time
import datetime
from selenium import webdriver
from start_test import runStartTest
from kml_test import runKmlTest
from search_test import runSearchTest
from swisssearch_test import runSwissSearchTest
# from print_test import runPrintTest
from mobile_test import runMobileTest
from wms_test import runWmsTest
from checker_test import runCheckerTest
DEFAULT_WAIT_FOUND = 5


def parse_args(args):
    tests = []
    singlebrowser = False
    if len(args) < 2:
        print 'ERROR: No URL provided. You need to set SAUCELABS_TARGETURL in your environment! Exit!'
        sys.exit(1)
    elif len(args) > 4:
        print 'ERROR: too many arguments! Exit!'
        sys.exit(1)
    else:
        url = args[1]
        if len(args) >= 3:
            tests = args[2].split(',')
        if len(args) >= 4:
            singlebrowser = True if args[3] == 'true' else False

    return url, tests, singlebrowser


if __name__ == '__main__':

    url, tests, singlebrowser = parse_args(sys.argv)

    # Get value to connect to SauceLabs
    try:
        saucelabs_user = os.environ['SAUCELABS_USER']
        saucelabs_key = os.environ['SAUCELABS_KEY']
    except KeyError:
        print "Please set the environment variable SAUCELABS_USER and SAUCELABS_KEY"
        sys.exit(2)

    # This is the only code you need to edit in your existing scripts.
    # The command_executor tells the test to run on Sauce, while the desired_capabilties
    # parameter tells us which browsers and OS to spin up.
    # browser list : https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/

    # Top browser and platform according to stats. Update from time to time
    top_browser = {'platform': "Windows 7", 'browserName': "firefox",
                   'version': "44.0", 'screenResolution': "1280x1024"}

    # Tests specific browser (FOR DEBUG ONLY)
    test_browser_FF = {'platform': "Windows 7", 'browserName': "firefox",
                       'version': "44.0", 'screenResolution': "1280x1024"}

    test_browser_IE = {'platform': "Windows 7", 'browserName': "internet explorer",
                       'version': "10.0", 'screenResolution': "1280x1024"}

    test_browser_Safari = {'platform': "OS X 10.11", 'browserName': "safari",
                           'version': "9.0", 'screenResolution': "1280x1024"}

    test_browser_Opera = {'platform': "Windows 7", 'browserName': "opera",
                          'version': "12.12", 'screenResolution': "1280x1024"}

    test_browser_Edge = {'platform': "Windows 10", 'browserName': "MicrosoftEdge",
                         'version': "13.10586", 'screenResolution': "1280x1024"}

    # Use top browser to test a specific browser and use 3rd param to true (FOR DEBUG ONLY)
    # top_browser = test_browser_FF
    # top_browser = test_browser_Opera
    # top_browser = test_browser_Edge
    # top_browser = test_browser_IE
    # top_browser = test_browser_Safari

    desired_cap_list = [
        # Chrome
        {'platform': "Windows 7", 'browserName': "chrome",
            'version': "48.0", 'screenResolution': "1280x1024"},
        {'platform': "Windows 7", 'browserName': "chrome",
            'version': "47.0", 'screenResolution': "1280x1024"},
        {'platform': "Windows 8.1", 'browserName': "chrome",
            'version': "48.0", 'screenResolution': "1280x1024"},
        {'platform': "Windows 10", 'browserName': "chrome",
            'version': "48.0", 'screenResolution': "1280x1024"},
        # FireFox
        {'platform': "Windows 7", 'browserName': "firefox",
            'version': "43.0", 'screenResolution': "1280x1024"},
        {'platform': "Windows 8.1", 'browserName': "firefox",
            'version': "44.0", 'screenResolution': "1280x1024"},
        {'platform': "Windows 10", 'browserName': "firefox",
            'version': "44.0", 'screenResolution': "1280x1024"},
        # Internet Exeplorer
        {'platform': "Windows 7", 'browserName': "internet explorer",
            'version': "9.0", 'screenResolution': "1280x1024"},
        {'platform': "Windows 7", 'browserName': "internet explorer",
            'version': "10.0", 'screenResolution': "1280x1024"},
        {'platform': "Windows 7", 'browserName': "internet explorer",
            'version': "11.0", 'screenResolution': "1280x1024"},
        # Edge
        {'platform': "Windows 10", 'browserName': "MicrosoftEdge",
            'version': "13.10586", 'screenResolution': "1280x1024"},
        # Opera
        {'platform': "Windows 7", 'browserName': "opera",
            'version': "12.12", 'screenResolution': "1280x1024"}
    ]

    # Add top browser
    desired_cap_list.append(top_browser)

    # okay we will start the script!
    print "Starting SauceLabs script!"

    t0 = time.time()
    print "Start test at " + time.strftime('%d/%m/%y %H:%M', time.localtime())

    doTestsLight = {
        'start': runStartTest
        # 'checker': runCheckerTest
    }
    doTestsEdge = {
        'start': runStartTest,
        'search': runSearchTest,
        'swisssearch': runSwissSearchTest,
        'checker': runCheckerTest
    }
    doTests = {
        'start': runStartTest,
        'mobile': runMobileTest,
        'search': runSearchTest,
        'kml': runKmlTest,
        'swisssearch': runSwissSearchTest,
        # 'print': runPrintTest,
        'wms': runWmsTest,
        'checker': runCheckerTest
    }

    if len(tests) > 0 and tests[0] == 'all':
        tests = []

    if len(tests) > 0:
        tests = [t for t in tests if t in doTests.keys()]
        if len(tests) == 0:
            print 'No matching tests was found.'
            print 'Please try again...'
            sys.exit(1)

    # if 3rd parameter equal 'true' use only top browser
    caps_used = [top_browser] if singlebrowser else desired_cap_list

    for current_desired_cap in caps_used:
        print "+--> Start test with " + current_desired_cap['platform'] + \
            " " + current_desired_cap['browserName'] + " (" + current_desired_cap['version'] + ")"
        driver = webdriver.Remote(
            command_executor='http://' +
            saucelabs_user +
            ':' +
            saucelabs_key +
            '@ondemand.saucelabs.com:80/wd/hub',
            desired_capabilities=current_desired_cap)
        driver.implicitly_wait(DEFAULT_WAIT_FOUND)
        if driver.name == "MicrosoftEdge":
            # print 'Force set version, strange...'
            driver.desired_capabilities['version'] = current_desired_cap['version']
        try:
            if driver.name == "internet explorer" or driver.name == "opera" or driver.name == "safari":
                # Use specific test list for IE, Opera and Safari
                DoTestCurrentrowser = doTestsLight
            elif driver.name == "MicrosoftEdge":
                # Use full test list for Edge
                DoTestCurrentrowser = doTestsEdge
            else:
                # Use full test list for all browser
                DoTestCurrentrowser = doTests
            for k, dotest in DoTestCurrentrowser.iteritems():
                if k in tests or len(tests) == 0:
                    t1 = time.time()
                    dotest(driver, url)
                    tf = time.time()
                    print 'It took %.2f to execute %s...' % ((tf - t1), k)
        finally:
            driver.quit()

        print "--- end test for this browser"
    print "End full tests"

    t1 = time.time()
    print "End test at " + time.strftime('%d/%m/%y %H:%M', time.localtime())
    print '%s secondes' % str(datetime.timedelta(seconds=(t1 - t0)))
