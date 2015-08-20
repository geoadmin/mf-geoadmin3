// Search test using browserstack

var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var QUERYSTRING_OF_BERN = "X=200393.28&Y=596671.16";

var runTest = function(cap, driver, target){
  // Send "Bern" to the searchbar
  driver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
  // Click on the field "Bern (BE)"
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern')]")).click();
  // Specifically search if href of links is updated
  driver.findElement(webdriver.By.xpath("//*[@id='toptools']//a[contains(@href,'" + QUERYSTRING_OF_BERN + "')]"))
  // Was the URL in the address bar adapted?
  if(!(cap.browser == "IE" && cap.browser_version == "9.0")) {
    driver.getCurrentUrl().then(function(url) {
      assert.ok(url.indexOf(QUERYSTRING_OF_BERN) > -1);
    });
  }
}

module.exports.runTest = runTest;
