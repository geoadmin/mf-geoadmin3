# -*- coding: utf-8 -*-

import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from helpers import bCheckIfUrlHasChanged

# Swisssearch Test Using saucelabs

QUERYSTRING_OF_RARON = "X=128114.80&Y=629758.13&zoom=10"
QUERYSTRING_OF_RARON_KANALSTRASSE = "X=128141.00&Y=627443.00&zoom=10"
QUERYSTRING_OF_RTE_BERNE_LAUSANNE = "X=154207.56&Y=539257.38&zoom=10"
QUERYSTRING_OF_PL_CHATEAU_AVENCHES = "X=192309.80&Y=569734.06&zoom=10"
QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA = "X=117500.00&Y=722500.00&zoom=10"
QUERYSTRING_MOOS = "X=128630.12&Y=627650.38&zoom=10"
QUERYSTRING_OF_REALTA = "X=181085.41&Y=751355.13&zoom=10"
DEFAULT_WAIT = 6


def wait_url_changed(driver, old_url, timeout=DEFAULT_WAIT):
    UrlHasChanged = False
    t0 = time.time()
    while not UrlHasChanged:
        new_url = driver.current_url
        if old_url != new_url:
            UrlHasChanged = True
        t1 = time.time()
        if t1 - t0 > timeout:
            break
        continue
    if not UrlHasChanged:
        raise Exception(
            "Url not changed until end of timeout (" + str(timeout) + ")")
    return bool(not UrlHasChanged)


def runSwissSearchTest(driver, target):
    print "Start Swissearch tests"

    # swissearch parameter with multiple results
    target_url = target + '/?swisssearch=raron&lang=de'
    driver.get(target_url)
    # wait until the page is loaded. We know this when the title contain
    # (S)chweiz
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")
    current_url = driver.current_url
    # Ne marche pas avec IE !
    if bCheckIfUrlHasChanged(driver):
        time.sleep(1)
        driver.find_element_by_xpath(
            "//*[contains(text(), ', Kanalstrasse')]").click()
        for i in range(10):
            try:
                if QUERYSTRING_OF_RARON_KANALSTRASSE in driver.current_url:
                    break
            except:
                pass
            time.sleep(1)
        else:
            raise Exception("runSwissSearchTest - time out(" + str(i) + ")")

        # Must also update the link of 'toptool'
        assert QUERYSTRING_OF_RARON_KANALSTRASSE in driver.find_element_by_xpath(
            "//*[@id='toptools']/a[3]").get_attribute("href")

        # parameter should disappear when selection is done
        assert "swisssearch" not in driver.current_url
    print "Test Raron Ok"

    # swisssearch Piazza Mesolcina, Bellinzona (P -> piazza)
    target_url = target + '/?swisssearch=p Mesolcina Bellinzona&lang=de'
    driver.get(target_url)
    current_url = driver.current_url
    if bCheckIfUrlHasChanged(driver):
        for i in range(10):
            try:
                if QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA in driver.current_url:
                    break
            except:
                pass
            time.sleep(1)
        else:
            raise Exception("runSwissSearchTest - time out(" + str(i) + ")")
    assert QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA in driver.find_element_by_xpath(
        "//*[@id='toptools']/a[3]").get_attribute("href")
    print "Test Bellinzona Ok"

    # swisssearch parameter with multiple results (locations and layers),
    # reset selection
    target_url = target + '/?swisssearch=wasser&lang=de'
    driver.get(target_url)
    # Wait refresh
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception("Unable to load map.geo.admin page!")

    driver.find_element_by_xpath("//*[contains(text(), 'Gehe nach')]")
    driver.find_element_by_xpath("//*[contains(text(), 'Karte hinzufügen')]")

    # Clear the result, key word 'swisssearch' must be clear from url
    driver.find_element_by_xpath(
        "//button[@ng-click='clearInput()']").click()
    current_url = driver.current_url
    if bCheckIfUrlHasChanged(driver):
        try:
            assert "swisssearch" not in current_url
        except Exception as e:
            # Wait refresh
            try:
                wait_url_changed(driver, current_url)
            except Exception as e:
                print '-----------'
                print str(e)
                print "Current url: " + current_url
                raise Exception(
                    "swissearch key word exist in url. But it must be removed after a clear result action")

            # Check if url is clean
            url_result = driver.current_url
            # parameter should disappear when selection is done
            assert "swisssearch" not in url_result
    print "Test Wasser for multiple results (locations and layers) Ok"

    # swissearch parameter with 1 result (direct selection doesn't work in IE
    # 9)
    if bCheckIfUrlHasChanged(driver):
        target_url = target + '/?swisssearch=brückenmoostrasse 11 raron&lang=de'
        driver.get(target_url)
        # wait until the page is loaded. We know this when the title contain
        # (S)chweiz
        for i in range(10):
            try:
                if QUERYSTRING_MOOS in driver.current_url:
                    break
            except:
                pass
            time.sleep(1)
        else:
            raise Exception("runSwissSearchTest - time out(" + str(i) + ")")
        # Check link in toptool
        assert QUERYSTRING_MOOS in driver.find_element_by_xpath(
            "//*[@id='toptools']/a[3]").get_attribute("href")

        # parameter (swisssearch) is removed by map action (simulating zoom
        # here)
        driver.find_element_by_css_selector("button.ol-zoom-out").click()
        try:
            assert "swisssearch" not in driver.current_url
        except Exception as e:
            try:
                wait_url_changed(driver, current_url)
            except Exception as e:
                print '-----------'
                print str(e)
            # parameter should disappear when selection is done
            assert "swisssearch" not in driver.current_url
        print "Test brückenmoostrasse Ok"

    # swisssearch Route de Berne 91 1010 Lausanne with wordforms rte
    target_url = target + '/?swisssearch=rte berne 91 1010&lang=de'
    driver.get(target_url)
    if bCheckIfUrlHasChanged(driver):
        for i in range(10):
            try:
                if QUERYSTRING_OF_RTE_BERNE_LAUSANNE in driver.current_url:
                    break
            except:
                pass
            time.sleep(1)
        else:
            raise Exception("runSwissSearchTest - time out(" + str(i) + ")")
        # Check link in toptool
        assert QUERYSTRING_OF_RTE_BERNE_LAUSANNE in driver.find_element_by_xpath(
            "//*[@id='toptools']/a[3]").get_attribute("href")
    print "Test Route de Berne à Lausanne Ok"

    # swisssearch Realta industriegebiet 701 with wordforms GI ->
    # industriegebiet (DE)
    target_url = target + '/?swisssearch=realta gi 701&lang=de'
    driver.get(target_url)
    current_url = driver.current_url
    if bCheckIfUrlHasChanged(driver):
        for i in range(10):
            try:
                if QUERYSTRING_OF_REALTA in driver.current_url:
                    break
            except:
                pass
            time.sleep(1)
        else:
            raise Exception("runSwissSearchTest - time out(" + str(i) + ")")
        # Check link in toptool
        assert QUERYSTRING_OF_REALTA in driver.find_element_by_xpath(
            "//*[@id='toptools']/a[3]").get_attribute("href")
    print "Test Realta Ok"

    # swisssearch Place du Château, Avenches (Pl -> platz)
    target_url = target + '/?swisssearch=pl chateau avenches&lang=de'
    driver.get(target_url)
    current_url = driver.current_url
    if bCheckIfUrlHasChanged(driver):
        for i in range(10):
            try:
                if QUERYSTRING_OF_PL_CHATEAU_AVENCHES in driver.current_url:
                    break
            except:
                pass
            time.sleep(1)
        else:
            raise Exception("runSwissSearchTest - time out(" + str(i) + ")")
        # Check link in toptool
        assert QUERYSTRING_OF_PL_CHATEAU_AVENCHES in driver.find_element_by_xpath(
            "//*[@id='toptools']/a[3]").get_attribute("href")
    print "Test Place du chateau Avenches Ok"
