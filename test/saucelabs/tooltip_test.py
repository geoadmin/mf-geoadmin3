# -*- coding: utf-8 -*-

from helpers import pageLoadWait
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


tooltipTests = [
  {
    'permalink': '?topic=ech&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&X=183500.00&'
                 'Y=699500.00&zoom=2&layers=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
  }
]


def runTooltipTest(driver, target, is_top_browser):
    print('Start tooltip tests')
    htmlHeaderCss = 'htmlpopup-header'
    htmlContainerCss = 'htmlpopup-container'
    topToolsId = 'toptools'
    wait = WebDriverWait(driver, 10)

    for tooltipTest in tooltipTests:
        permalink = tooltipTest['permalink']
        url = '%s%s' % (target, permalink)
        pageLoadWait(driver, url)
        viewport = driver.find_element_by_css_selector('.ol-viewport')

        # Click on map and open the tooltip
        action = ActionChains(driver)
        # Move to the center of viewport
        action.move_to_element(viewport)
        action.click()
        action.perform()

        # Wait until at least the first result
        wait.until(
            EC.visibility_of_element_located((By.CLASS_NAME, htmlContainerCss)))
        htmlContainerEl = driver.find_element_by_css_selector('.%s' % htmlContainerCss)
        assert u'BFS-Nummer' in htmlContainerEl.text, htmlContainerEl.text
        assert u'Name' in htmlContainerEl.text, htmlContainerEl.text
        assert u'Fläche' in htmlContainerEl.text, htmlContainerEl.text
        assert u'Perimeter' in htmlContainerEl.text, htmlContainerEl.text

        # Change language to fr
        fr = driver.find_element_by_css_selector('#%s div div :nth-child(2)' % topToolsId)
        action = ActionChains(driver)
        action.move_to_element(fr)
        action.click()
        action.perform()
        wait.until(
            EC.text_to_be_present_in_element((By.CSS_SELECTOR, 'div.%s > span' % htmlHeaderCss), u'limites'))
        htmlContainerEl = driver.find_element_by_css_selector('.%s' % htmlContainerCss)
        assert u'Numéro OFS' in htmlContainerEl.text, htmlContainerEl.text
        assert u'Nom' in htmlContainerEl.text, htmlContainerEl.text
        assert u'Surface' in htmlContainerEl.text, htmlContainerEl.text
        assert u'Périmètre' in htmlContainerEl.text, htmlContainerEl.text
