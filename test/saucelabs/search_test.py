# -*- coding: utf-8 -*

from helpers import bCheckIfUrlHasChanged
from helpers import waitForUrlChange
from helpers import bCheckIfLinkIsUpdatedEverywhere

# Search testing using browserstack
QUERYSTRING_OF_BERN = "X=200393.28&Y=596671.16"


def runSearchTest(driver, url, is_top_browser):
    print 'Search_test starts!'
    driver.get(url)
    driver.maximize_window()
    driver.get(url + '/?lang=de')

    #  Send "Bern" to the searchbar
    driver.find_element_by_xpath("//*[@type='search']").send_keys("Bern")

    #  Click on the field "Bern (BE)"
    driver.find_element_by_xpath("//*[contains(text(), 'Bern')]").click()

    if bCheckIfUrlHasChanged(driver):
        #  Was the URL in the address bar adapted?
        current_url = driver.current_url
        try:
            bCheckIfLinkIsUpdatedEverywhere(driver, QUERYSTRING_OF_BERN)
        except:
            try:
                # Wait refresh URL
                waitForUrlChange(driver, current_url)
            except Exception as e:
                print str(e)
                raise Exception('URL has not changed')
            try:
                bCheckIfLinkIsUpdatedEverywhere(driver, QUERYSTRING_OF_BERN)
            except AssertionError as e:
                print str(e)
                raise Exception("Coordinate of raron is not set in the url")
    print 'Search_test completed'
