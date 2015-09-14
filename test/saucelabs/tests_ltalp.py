import sys
import os
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
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
###Debug
#print "user: " + saucelabs_user
#print "key: " + saucelabs_key

print "On est sur tests_ltalp.py"

## 1) Locally test
## Create a new instance of the PhantomJS driver
driver = webdriver.PhantomJS()

## 2) Or use a specific browser supported by SauceLabs (remote access)
# This is the only code you need to edit in your existing scripts. 
# The command_executor tells the test to run on Sauce, while the desired_capabilties 
# parameter tells us which browsers and OS to spin up.
desired_cap = {
            'platform': "Mac OS X 10.9",
                'browserName': "chrome",
                    'version': "31",
}
#driver = webdriver.Remote(
#   command_executor='http://YOUR_USERNAME:YOUR_ACCESS_KEY@ondemand.saucelabs.com:80/wd/hub',
#      desired_capabilities=desired_cap)


### Set webdriver config for timeout

# This is your test logic. You can add multiple tests here.
driver.implicitly_wait(1)
driver.get(url)
## Set the timeout to x ms
driver.set_page_load_timeout(3);

#### First exemple
#
## go to the google home page
#driver.get("http://www.google.com")
#
## the page is ajaxy so the title is originally this:
#print "Title of the google page : " + driver.title
#
## find the element that's name attribute is q (the google search box)
#inputElement = driver.find_element_by_name("q")
#
## type in the search
#inputElement.send_keys("cheese!")
#
## Make a screen shot
#driver.get_screenshot_as_file('/home/ltalp/mf-geoadmin3/google_cheese.png')
#
## submit the form (although google automatically searches now without submitting)
#inputElement.submit()
#
#try:
#    # we have to wait for the page to refresh, the last thing that seems to be updated is the title
#    WebDriverWait(driver, 10).until(EC.title_contains("cheese!"))
#
#    # You should see "cheese! - Google Search"
#    print "Nouvelle page pour cheese : " + driver.title
#
#finally:
#    print "End Test google"

## Go to the deployed site.
##print "Passage en allemand Ok !"
##driver.get(url + '/?lang=de');

### End exemple

print "Test pour map.geo.admin : " + url
driver.get(url + '/?lang=de')

driver.implicitly_wait(1)

text_area = driver.find_element_by_id('search-container')
text_area.send_keys("print 'Salavaux'")
##driver.find_element_by_xpath("//a[contains(text(), 'Grundlagen und Planung')]")[0];

# Make a screenshot
driver.get_screenshot_as_file('/home/ltalp/mf-geoadmin3/map.geo.admin_search_salavaux.png')

#driver.find_element_by_xpath("//*[@type='search']")).sendKeys('Bern');
print "Test End"
driver.quit()
