import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

#import assert 
#var assert = require ('assert')
QUERYSTRING_OF_RARON = "X=128114.80&Y=629758.13&zoom=10"

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
print "user: " + saucelabs_user
print "key: " + saucelabs_key

# This is the only code you need to edit in your existing scripts. 
# The command_executor tells the test to run on Sauce, while the desired_capabilties 
# parameter tells us which browsers and OS to spin up.
desired_cap = {
            'platform': "Mac OS X 10.9",
                'browserName': "chrome",
                    'version': "31",
}
# Locally test
browser = webdriver.PhantomJS()

#driver = webdriver.Remote(
#   command_executor='http://YOUR_USERNAME:YOUR_ACCESS_KEY@ondemand.saucelabs.com:80/wd/hub',
#      desired_capabilities=desired_cap)

## okay we will start the script!
print ("Starting SauceLabs script!");

# This is your test logic. You can add multiple tests here.
browser.implicitly_wait(1)
browser.get(url)
## Set the timeout to x ms
browser.set_page_load_timeout(3);

## Go to the deployed site.
##print "Passage en allemand Ok !"
##browser.get(url + '/?lang=de');

print "URL : " + url
print "Step 1 : swisssearch raron, expect QUERYSTRING_OF_RARON" + QUERYSTRING_OF_RARON
browser.get(url + '/?swisssearch=raron&lang=de');
## wait until topics related stuff is loaded. We know this when catalog is there
print "Step 2 : wait end of search"
browser.find_element_by_xpath("//a[contains(text(), 'Grundlagen und Planung')]");
print "Step 3 : Ok ici"
##driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Raron')]"));
##driver.findElement(webdriver.By.xpath("//*[contains(text(), ', Flugplatz')]")).click();
##driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_RARON + "')]"));
##//parameter should disappear when selection is done
##driver.findElement(webdriver.By.xpath("//*[@id='toptools']//a[contains(@href,'http')]")).getAttribute("href").then(function(val) {
##  assert.ok(val.indexOf('swisssearch') == -1);
##});

## Wait until topics related stuff is loaded. We know this when catalog is there
##browser.findElement(browser.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
##if not "Google" in driver.title:
##            raise Exception("Unable to load google page!")
##            elem = driver.find_element_by_name("q")
##            elem.send_keys("Sauce Labs")
##            elem.submit()
##            print driver.title
##else:
##        print "Test Ok"
print "Test End"
# This is where you tell Sauce Labs to stop running tests on your behalf.  
# It's important so that you aren't billed after your test finishes.
driver.quit()
