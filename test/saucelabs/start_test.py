# -*- coding: utf-8 -*

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
DEFAULT_WAIT_LOAD = 20


def runStartTest(driver, url):
    # Set the timeout to x ms
    driver.set_page_load_timeout(DEFAULT_WAIT_LOAD)
    print 'Start %s:' % url
    driver.get(url + '/?lang=de')
    try:
        WebDriverWait(driver, 10).until(EC.title_contains('chweiz'))
    except Exception as e:
        print '-----------'
        print str(e)
        raise Exception('Unable to load map.geo.admin page!')

    print 'Start Test Ok!'
