# -*- coding: utf-8 -*-

import time


def intVersion(ver):
    pos = str.find(str(ver), '.')
    if pos > 0:
        ver_tmp = ver[0:pos]
        return int(ver_tmp)
    else:
        return int(ver)


def bCheckIfUrlHasChanged(driver):
    version = intVersion(driver.desired_capabilities['version'])
    if (driver.name == "internet explorer" and version == 9):
        # With IE 9, url never changed -> do not search on url
        return 0
    else:
        return 1


def waitForUrlChange(driver, pattern, find=True, timeout=10):
    t0 = time.time()
    newUrl = driver.current_url
    if find:
        # We wait until we find pattern
        while pattern not in newUrl:
            newUrl = driver.current_url
            t1 = time.time()
            if t1 - t0 > timeout:
                return True
            time.sleep(.5)
        return False
    else:
        # We wait until we don't find a pattern
        while pattern in newUrl:
            newUrl = driver.current_url
            t1 = time.time()
            if t1 - t0 > timeout:
                return True
            time.sleep(.5)
        return False


def bCheckIfLinkIsUpdatedEverywhere(driver, stringExpected):
    # search in url
    try:
        current_url = driver.current_url
        assert stringExpected in current_url

    except AssertionError:
        raise AssertionError(stringExpected + ' has not be found in url : ' + current_url)

    # search in toptool
    try:
        assert stringExpected in driver.find_element_by_xpath(
            "//*[@id='toptools']/a[3]").get_attribute("href")

    except AssertionError:
        raise AssertionError(stringExpected + ' has not be found in toptool : ' + current_url)
