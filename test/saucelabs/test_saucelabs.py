import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

webdriver = require('browserstack-webdriver')
cmd = require('commander')

cmd.version('0.0.1')
cmd.option('-t, --target <url>', 'The URL to run the tests against')
cmd.parse(process.argv)

if (not cmd.target or cmd.target.length <= 0):
          console.log('ERROR: no url provided. Use -t URL.', cmd.target)
          return 2

if (not process.env.BROWSERSTACK_USER or
    process.env.BROWSERSTACK_USER.length <= 0 or
    not process.env.BROWSERSTACK_KEY or
    process.env.BROWSERSTACK_KEY.length <= 0):
          console.log("ERROR: browserstack tests are aborting. You need to set BROWSERSTACK_USER and BROWSERSTACK_KEY in your environment!")
          return 1

#load the capabilities/browsers we want to test.
browsers = require('./browsers.py')

#load the tests.
startTest = require('./start_test.py')
searchTest = require('./search_test.py')
swisssearchTest = require('./swisssearch_test.py')
kmlTest = require('./kml_test.py')
wmsTest = require('./wms_test.py')
mobileTest = require('./mobile_test.py')
printTest = require('./print_test.py')

#okay we will start the script!
console.log("Starting Browserstack script!")

# Start full test only for one browser (use Chrome for the print)
RunFullTests = function(cap) {
  if cap.browser == "Chrome" and cap.browser_version == "43.0" and cap.os_version == "7":
          return true
  else:
         return false

#run tests for all browser (3 last version of IE, Chrome, Firefox) 
browsers.capabilities.forEach(function(cap) {
  #we build the driver only once for all tests per browser.
    driver = new webdriver.Builder().
    usingServer('http://hub.browserstack.com/wd/hub').
    withCapabilities(cap).
    build()
    
#show a link for each browser + version for visual results.
  driver.getSession().then(function(sess) {
    console.log("running all tests for: " + cap.browser + "(" + cap.browser_version + ") on " + cap.os + " " + cap.os_version)
    console.log("  See more results or https://www.browserstack.com/automate/builds/dddb1242fb9f3ffe297b057e6da2ea964b4caf1a/sessions/" + sess.id_)
  })

#run all the tests
  try:
    startTest.runTest(cap, driver, cmd.target)
    if (RunFullTests(cap)):
         searchTest.runTest(cap, driver, cmd.target)
         swisssearchTest.runTest(cap, driver, cmd.target)
         mobileTest.runTest(cap, driver, cmd.target)
         kmlTest.runTest(cap, driver, cmd.target)
         wmsTest.runTest(cap, driver, cmd.target)
#Keep the print test last, as this results in a downloadpdf command,
#which leaves the page in a browser dependant state
      printTest.runTest(cap, driver, cmd.target)
  
  } catch(err) {
#we need this block for the finally, as we definitly want to quit the driver, otherwise it stays idle for ~2 min blocking the next testrun.
    throw err
    driver.quit()
  }
  finally {
    driver.quit()
  }
})
