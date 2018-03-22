# -*- coding: utf-8 -*-

import sys
import getopt
import os
import time
import datetime
from selenium import webdriver
from start_test import runStartTest
from kml_test import runKmlTest
from search_test import runSearchTest
from print_test import runPrintTest
from wms_test import runWmsTest
from tooltip_test import runTooltipTest

DEFAULT_WAIT_FOUND = 5
HELP =  '''
    test.py --url <url to test>
            --tests <list of tests: start,search,kml,print,tooltip,wms,checker>
            --browser <browser to test: chrome|firefox|safari>
            --single  <use only the top browser: true|false>
'''


def parse_args(argv):
    url = None
    tests = []
    browser = None
    single = False

    try:
        opts, args = getopt.getopt(argv, "hu:t:b:s", ["url=", "tests=", "browser=", "single="])
    except getopt.GetoptError:
        print HELP
        sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            print HELP
            sys.exit()
        elif opt in ("-u", "--url"):
            url = arg if arg != 'false' else None
        elif opt in ("-t", "--tests"):
            tests = arg.split(',') if arg != 'false' else []
        elif opt in ("-b", "--browser"):
            browser = arg if arg != 'false' else None
        elif opt in ("-s", "--single"):
            single = True if arg == 'true' else False

    return url, tests, browser, single

if __name__ == '__main__':

    url, tests, browser, single = parse_args(sys.argv[1:])

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
    browsers = [
        # Chrome
        {'platform': "Windows 10", 'browserName': "chrome",
            'version': "58.0", 'screenResolution': "1280x1024"},
        # FireFox
        # FF 48+ driver is bugged
        {'platform': "Windows 10", 'browserName': "firefox",
            'version': "47.0", 'screenResolution': "1280x1024"},
        # Edge
        #{'platform': "Windows 10", 'browserName': "MicrosoftEdge",
        #    'version': "13.10586", 'screenResolution': "1280x1024"},
        # Safari
        {'platform': "OS X 10.11", 'browserName': "safari",
            'version': "9.0", 'screenResolution': "1024x768"}
    ]

    if single:  # The user wants to test the most used browser
        browsers = [browsers[0]]
    elif browser:  # The user specified the browser to test
        bs = []
        for b in browsers:
            if b['browserName'] == browser:
                bs.append(b)
        browsers = bs

    config_test_list = {
        "firefox": ['start', 'search', 'wms', 'tooltip'],
        "chrome": ['start', 'search', 'wms', 'tooltip'],
        "safari": ['start'],
        "MicrosoftEdge": ['start', 'search']
    }

    # okay we will start the script!
    print "Starting SauceLabs script!"

    t0 = time.time()
    print "Start test at " + time.strftime('%d/%m/%y %H:%M', time.localtime())

    doTests = {
        'start': runStartTest,
        'wms': runWmsTest,
        'search': runSearchTest,
        'kml': runKmlTest,
        'print': runPrintTest,
        'tooltip': runTooltipTest
    }

    if len(tests) > 0 and tests[0] == 'all':
        tests = []

    if len(tests) > 0:
        tests = [t for t in tests if t in doTests.keys()]
        if len(tests) == 0:
            print 'No matching tests was found.'
            print 'Please try again...'
            sys.exit(1)

    for browser in browsers:
        try:
            print "+--> Start test with " + browser['platform'] + \
                " " + browser['browserName'] + " (" + browser['version'] + ")"
            driver = webdriver.Remote(
                command_executor='http://' +
                saucelabs_user +
                ':' +
                saucelabs_key +
                '@ondemand.saucelabs.com:80/wd/hub',
                desired_capabilities=browser)
            driver.implicitly_wait(DEFAULT_WAIT_FOUND)

            if driver.name == "MicrosoftEdge":
                print 'Force set version, strange...'
                driver.desired_capabilities['version'] = browser['version']

            for elt in config_test_list[browser['browserName']]:
                if elt in tests or len(tests) == 0:
                    t1 = time.time()
                    doTests[elt](driver, url)
                    tf = time.time()
                    print 'It took %.2f to execute %s...' % ((tf - t1), elt)
        finally:
            driver.quit()

        print "--- end test for this browser"
    print "End full tests"

    t1 = time.time()
    print "End test at " + time.strftime('%d/%m/%y %H:%M', time.localtime())
    print '%s secondes' % str(datetime.timedelta(seconds=(t1 - t0)))
