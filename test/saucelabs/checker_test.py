# -*- coding: utf-8 -*


def CheckerGeoAdmin(driver, url, url_4_api, is_top_browser):
    if is_top_browser == 1:
        print "  Test Checker GeoAdmin"
        driver.get(url + '/' + 'checker')
        assert "OK" in driver.page_source

checkerFunctions = [
    CheckerGeoAdmin]
