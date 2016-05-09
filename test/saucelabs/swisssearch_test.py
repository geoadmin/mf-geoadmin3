# -*- coding: utf-8 -*-

import time
import sys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

DEFAULT_WAIT = 10


def waitUrlChange(driver, oldUrl, timeout=DEFAULT_WAIT):
    t0 = time.time()
    newUrl = driver.current_url
    while newUrl == oldUrl:
        newUrl = driver.current_url
        t1 = time.time()
        if t1 - t0 > timeout:
            return True
    return False


def testSearchInput(driver, inputEl, searchTest, timeout=DEFAULT_WAIT):
    oldUrl = driver.current_url
    inputContainerClass = 'ga-search-input-container'
    dropDownClass = 'ga-search-dropdown'
    itemClass = 'ga-search-item'
    searchText = searchTest['searchText']
    resultTitle = searchTest['resultTitle']
    resultLocation = searchTest['resultLocation']
    inputEl.send_keys(searchText)
    # Because of the search design we have to trigger a change event
    # to trigger a search request
    driver.execute_script("$('ga-search-input').change()")
    try:
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, dropDownClass)))
    except Exception as e:
        print 'Could not toggle dropdown visibility using searchText: %s' % searchText
        print 'Input value is: %s' % inputEl.get_attribute('value')
        raise Exception(e)
    searchResultEls = driver.find_elements_by_class_name(itemClass)
    for resultEl in searchResultEls:
        if resultTitle == resultEl.get_attribute('title'):
            resultEl.click()
            break
    # Make sure map is zoomed to the desired location
    if waitUrlChange(driver, oldUrl):
        print 'The map has not been zoomed at the expected location.'
        print 'searchText: %s' % searchText
        print 'Expect to find: %s' % resultLocation
        print 'In: %s' % driver.current_url
        sys.exit(1)

    # Use clear button
    driver.find_element_by_css_selector(
        '.%s .ga-btn' % inputContainerClass).click()
    try:
        WebDriverWait(driver, 10).until(
            EC.invisibility_of_element_located((By.CLASS_NAME, dropDownClass)))
    except Exception as e:
        print 'Could not hide dropdown visibility using the search button'
        raise Exception(e)
    # Make sure input field is empty
    if inputEl.get_attribute('value') != '':
        print 'Clear button in search input did not work as expected'
        sys.exit(1)

    print 'Search test for %s OK!' % searchText


def testSwissSearchParameter():
    return None


searchTests = [
    {
        'searchText': u'Kanalstrasse',
        'resultTitle': u'Bus Raron, Kanalstrasse',
        'resultLocation': u'X=128141.00&Y=627443.00&zoom=10'
    },
    {
        'searchText': u'p Mesolcina Bellinzona',
        'resultTitle': u'Bus Bellinzona, Piazza Mesolcina',
        'resultLocation': u'X=117500.00&Y=722500.00&zoom=10'
    },
    {
        'searchText': u'brückenmoostrasse 11 raron',
        'resultTitle': u'Brückenmoosstrasse 11 3942 Raron',
        'resultLocation': u'X=128630.12&Y=627650.38&zoom=10'
    },
    {
        'searchText': u'rte berne 91 1010',
        'resultTitle': u'Route de Berne 91 1010 Lausanne',
        'resultLocation': u'X=154207.56&Y=539257.38&zoom=10'
    },
    {
        'searchText': u'pl chateau 3 laus',
        'resultTitle': u'Place du Château 3 1005 Lausanne',
        'resultLocation': u'X=152884.58&Y=538433.38&zoom=10'
    }
]


def runSwissSearchTest(driver, target, is_top_browser):
    print 'Start Swissearch tests'

    # swissearch parameter with multiple results
    targetUrl = target + '/?lang=de'
    driver.get(targetUrl)
    # wait until the page is loaded. We know this when the title contain
    # (S)chweiz
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception('Unable to load map.geo.admin page!')

    inputSearchEl = driver.find_element_by_class_name('ga-search-input')
    for searchTest in searchTests:
        testSearchInput(driver, inputSearchEl, searchTest)
