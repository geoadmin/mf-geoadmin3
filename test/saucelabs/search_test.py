# -*- coding: utf-8 -*-

import sys

from helpers import waitForUrlChange, pageLoadWait
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

# Gloabl css selectors
inputContainerClass = 'ga-search-input-container'
inputClass = 'ga-search-input'
dropDownClass = 'ga-search-dropdown'
itemClass = 'ga-search-item'


def onLocationFail(currentUrl, searchText, resultLocation):
    print 'The map has not been zoomed at the expected location.'
    print 'searchText: %s' % searchText
    print 'Expect to find: %s' % resultLocation
    print 'In: %s' % currentUrl
    sys.exit(1)


def checkVisibleDropDown(driver, inputEl, searchText):
    try:
        # We expect to have the dropdown open
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, dropDownClass)))
    except Exception as e:
        print 'Could not toggle dropdown visibility'
        print 'Input value is: %s' % inputEl.get_attribute('value')
        raise Exception(e)


def checkHiddenDropDown(driver, inputEl, searchText):
    try:
        WebDriverWait(driver, 10).until(
            EC.invisibility_of_element_located((By.CLASS_NAME, dropDownClass)))
    except Exception as e:
        print 'Could not hide dropdown visibility'
        print 'Input value is: %s' % inputEl.get_attribute('value')
        raise Exception(e)


def selectLocationItem(driver, inputEl, searchText, resultTitle, resultLocation):
    searchResultEls = driver.find_elements_by_class_name(itemClass)
    for resultEl in searchResultEls:
        if resultTitle == resultEl.get_attribute('title'):
            resultEl.click()
            break
    # Make sure map is zoomed to the desired location
    if waitForUrlChange(driver, resultLocation):
        onLocationFail(driver.current_url, searchText, resultLocation)


def selectLayerInputItem(driver, inputEl, searchText, resultTitle, layerId):
    searchResultEls = driver.find_elements_by_class_name(itemClass)
    for resultEl in searchResultEls:
        if resultTitle == resultEl.get_attribute('title'):
            resultEl.click()
            break
    # Make sure map is zoomed to the desired location
    if waitForUrlChange(driver, layerId):
        print '%s layer cannot be found in the permalink' % layerId
        sys.exit(1)


def testSearchLocationInput(driver, inputEl, searchTest, timeout=10):
    searchText = searchTest['searchText']
    resultTitle = searchTest['resultTitle']
    resultLocation = searchTest['resultLocation']
    inputEl.send_keys(searchText)
    # Because of the search design we have to trigger a change event
    # to trigger a search request
    driver.execute_script("$('%s').change()" % inputClass)
    checkVisibleDropDown(driver, inputEl, searchText)
    selectLocationItem(driver, inputEl, searchText, resultTitle, resultLocation)
    checkHiddenDropDown(driver, inputEl, searchText)

    # Use clear button
    driver.find_element_by_css_selector(
        '.%s .ga-btn' % inputContainerClass).click()
    # Make sure input field is empty
    if inputEl.get_attribute('value') != '':
        print 'Clear button in search input did not work as expected'
        sys.exit(1)

    print 'Location Search test for %s OK!' % searchText


def testSearchLayerInput(driver, inputEl, searchTest, timeout=10):
    searchText = searchTest['searchText']
    resultTitle = searchTest['resultTitle']
    layerId = searchTest['layerId']
    inputEl.send_keys(searchText)
    # Because of the search design we have to trigger a change event
    # to trigger a search request
    driver.execute_script("$('%s').change()" % inputClass)
    checkVisibleDropDown(driver, inputEl, searchText)
    selectLayerInputItem(driver, inputEl, searchText, resultTitle, layerId)
    checkHiddenDropDown(driver, inputEl, searchText)

    # Use clear button
    driver.find_element_by_css_selector(
        '.%s .ga-btn' % inputContainerClass).click()
    # Make sure input field is empty
    if inputEl.get_attribute('value') != '':
        print 'Clear button in search input did not work as expected'
        sys.exit(1)

    # TODO: Check that the layer has been added to the layer selection

    print 'Layer Search test for %s OK!' % searchText


def testSwissSearchParameter(driver, url, inputEl, searchTest, timeout=10):
    searchText = searchTest['searchText']
    oneResOnly = searchTest['oneResOnly']
    resultTitle = searchTest['resultTitle']
    resultLocation = searchTest['resultLocation']
    targetUrl = url + '/?lang=de&swisssearch=%s' % searchText
    driver.get(targetUrl)
    # One result only -> zoom to the desired location
    if oneResOnly:
        if waitForUrlChange(driver, resultLocation):
            onLocationFail(driver.current_url, searchText, resultLocation)
        try:
            assert "swisssearch" in driver.current_url
        except AssertionError as e:
            raise Exception(e)
        # parameter (swisssearch) is removed by map action (simulating zoom)
        driver.find_element_by_css_selector("button.ol-zoom-out").click()
    else:
        selectLocationItem(driver, inputEl, searchText, resultTitle, resultLocation)
    if waitForUrlChange(driver, 'swisssearch', find=False):
        print 'swissearch param can still be found in the URL after a map move'
        sys.exit(1)

    print 'SwissSearch parameter test for %s OK!' % searchText


searchLocationTests = [
    {
        'searchText': u'Kanalstrasse bus rar',
        'resultTitle': u'Bus Raron, Kanalstrasse',
        'resultLocation': u'X=128141.00&Y=627443.00&zoom=13'
    },
    {
        'searchText': u'p Mesolcina Bellinzona',
        'resultTitle': u'Bus Bellinzona, Piazza Mesolcina',
        'resultLocation': u'X=117500.00&Y=722500.00&zoom=13'
    },
    {
        'searchText': u'bruckenmoostrasse 11 raron',
        'resultTitle': u'Brückenmoosstrasse 11 3942 Raron',
        'resultLocation': u'X=128630.00&Y=627650.00&zoom=10'
    },
    {
        'searchText': u'rte berne 91 1010',
        'resultTitle': u'Route de Berne 91 1010 Lausanne',
        'resultLocation': u'X=154208.00&Y=539257.00&zoom=10'
    },
    {
        'searchText': u'pl chateau 3 laus',
        'resultTitle': u'Place du Château 3 1005 Lausanne',
        'resultLocation': u'X=152885.00&Y=538433.00&zoom=10'
    },
    {
        'searchText': u'basel',
        'resultTitle': u'Basel (BS)',
        'resultLocation': 'X=267108.81&Y=611722.92&zoom=6'
    },
    {
        'searchText': u'bern',
        'resultTitle': u'Bern (BE)',
        'resultLocation': u'X=200393.28&Y=596671.16&zoom=5'
    }
]


searchLayerTests = [
    {
        'searchText': u'wasser',
        'resultTitle': u'Grundwasser: VOC',
        'layerId': u'ch.bafu.naqua-grundwasser_voc'
    },
    {
        'searchText': u'kulturt',
        'resultTitle': u'Bodeneignung: Kulturtyp',
        'layerId': u'ch.blw.bodeneignung-kulturtyp'
    }
]


swissSearchParamTests = [
    {
        'searchText': u'chemin des caves 11',
        'oneResOnly': True,
        'resultTitle': u'Chemin des Caves 11 1040 Echallens',
        'resultLocation': u'X=166096.00&Y=538398.00&zoom=10'
    },
    {
        'searchText': u'oliviers vinzel 1',
        'oneResOnly': False,
        'resultTitle': u'Chemin des Oliviers 8 1184 Vinzel',
        'resultLocation': u'X=144687.00&Y=511163.00&zoom=10'
    }
]


def runSearchTest(driver, target, is_top_browser):
    print 'Start Search tests'

    # swissearch parameter with multiple results
    targetUrl = target + '/?lang=de'
    driver.get(targetUrl)
    pageLoadWait(driver, targetUrl)

    # Test interactions with input element, dropdown list, clear btn etc..
    inputSearchEl = driver.find_element_by_class_name(inputClass)
    for searchTest in searchLocationTests:
        testSearchLocationInput(driver, inputSearchEl, searchTest)

    for searchTest in searchLayerTests:
        testSearchLayerInput(driver, inputSearchEl, searchTest)

    # Test swissearch parameter in permalink
    for swissSearchTest in swissSearchParamTests:
        testSwissSearchParameter(driver, target, inputSearchEl, swissSearchTest)
