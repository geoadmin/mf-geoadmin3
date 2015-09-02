import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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

# This is your test logic. You can add multiple tests here.
driver.implicitly_wait(10)
#driver.get(url)
## Set the timeout to x ms
driver.set_page_load_timeout(10)
## Go to the deployed site.
print "Ouverture de la page map.geo.admin.ch:"
driver.get('https://map.geo.admin.ch/?lang=de')
#driver.get('http://google.com')
#driver.get(url + '/?lang=de')
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
driver.quit()
