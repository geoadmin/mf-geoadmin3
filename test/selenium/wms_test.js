// WMS test using browserstack

var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var QUERYSTRING_WMS = "WMS%7C%7CAGNES%7C%7Chttp:%2F%2Fwms.geo.admin.ch%2F%7C%7Cch.swisstopo.fixpunkte-agnes";

var runTest = function(cap, driver, target) {
  //We maximize our window to be sure to be in full resolution
  driver.manage().window().maximize();
  // Goto the travis deployed site.
  driver.get(target + '/?lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));

  // Click on "Werkzeuge"
  driver.findElement(webdriver.By.xpath("//a[@id='toolsHeading']")).click();
  // Click on "WMS Import"
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'WMS Import')]")).click();
  // Click on the URL input field
  driver.findElement(webdriver.By.xpath("//*[@id='import-wms-popup']//input[@placeholder='URL']")).click();
  // Write URL of the chosen WMS
  driver.findElement(webdriver.By.xpath("//*[@id='import-wms-popup']//input[@placeholder='URL']")).sendKeys('http://wms.geo.admin.ch/');
  // Click on "Verbinden"
  driver.findElement(webdriver.By.xpath("//*[@id='import-wms-popup']//button[contains(text(),'Verbinden')]")).click();
  // Click on "AGNES"
  driver.findElement(webdriver.By.xpath("//*[@id='import-wms-popup']//div[contains(text(),'AGNES')]")).click();
  // Click on "Layer hinzufügen"
  driver.findElement(webdriver.By.xpath("//*[@id='import-wms-popup']//button[contains(text(),'Layer hinzufügen')]")).click();
  driver.wait(function() {
    try {
      driver.switchTo().alert();
      return true;
    }
    catch (e) {
    }
  }, 2000);
  // Accept the alert
  driver.switchTo().alert().accept();
  // Check if the WMS was correctly parsed
  driver.findElement(webdriver.By.xpath("//*[@id='import-wms-popup']//div[contains(text(),'WMS Layer erfolgreich geladen')]"));
  // Close popup
  driver.findElement(webdriver.By.xpath("//*[@id='import-wms-popup']//button[@ng-click='close($event)']")).click();

  // Was the URL in the address bar adapted?
  if(!(cap.browser == "IE" && cap.browser_version == "9.0")) {
    // Check if url is adapted to WMS layer
    driver.getCurrentUrl().then(function(url) {
      assert.ok(url.indexOf(QUERYSTRING_WMS) > -1);
    });
  }

  // Go to the WMS layer page
  driver.get(target + '/?lang=de&layers=' + QUERYSTRING_WMS);
  // Check if the page is loaded
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  // Check if the WMS Layer is loaded
  driver.findElement(webdriver.By.xpath("//*[@id='selection']//*[contains(text(), 'AGNES')]"));

}

module.exports.runTest = runTest;
