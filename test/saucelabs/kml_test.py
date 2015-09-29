import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# KML import test using browserstack

QUERYSTRING_KML = "KML%7C%7Chttp:%2F%2Fopendata.utou.ch%2Furbanproto%2Fgeneva%2Fgeo%2Fkml%2FRoutes.kml";
POSITION_TO_KML = "X=124759.52&Y=499224.22";

def runTest(cap, driver, target):
    #We maximize our window to be sure to be in full resolution
    driver.manage().window().maximize()
    # Goto the travis deployed site.
    driver.get(target + '/?lang=de');
    #wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"))

  # Click on "Werkzeuge"
  driver.findElement(webdriver.By.xpath("//a[@id='toolsHeading']")).click()
  # Click on "KML Import"
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'KML Import')]")).click()
  # Click on "URL"
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'URL')]")).click()
  # Write URL of the chosen KML
  driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//input[@placeholder='URL einfügen']")).sendKeys('http://opendata.utou.ch/urbanproto/geneva/geo/kml/Routes.kml')
  # Click on "KML Laden"
  driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//button[contains(text(),'KML laden')]")).click()
  # Check if the KML was correctly parsed
  driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//*[contains(text(), 'Parsing erfolgreich')]"))
  # Close popup
  driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//button[@ng-click='close($event)']")).click()

  driver.findElement(webdriver.By.xpath("//*[@id='toptools']//a[contains(@href,'" + POSITION_TO_KML + "')]"))

  # Was the URL in the address bar adapted?
  if(not(cap.browser == "IE" and cap.browser_version == "9.0")):
      driver.getCurrentUrl().then(function(url) {
      assert.ok(url.indexOf(POSITION_TO_KML) > -1)
    })
  }
  # Go to the KML linkedURL
  driver.get(target + '/?lang=de&layers='+QUERYSTRING_KML)
  # wait until topics related stuff is loaded.
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"))
  # Check if KML has correctly been loaded
  driver.findElement(webdriver.By.xpath("//*[@id='selection']//*[contains(text(), 'Lignes')]"))


module.exports.runTest = runTest
