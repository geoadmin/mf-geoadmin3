// Search test using browserstack

var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var QUERYSTRING_OF_BERN = "X=200393.28&Y=596671.16";

var runTest = function(cap, driver, target){
  //Send "Bern" to the searchbar
  driver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
  //Click on the field "Bern (BE)"
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern')]")).click();
  //We click on the "share" button that deploys the share menu
  driver.findElement(webdriver.By.xpath("//a[@id='shareHeading']")).click();
  //Any link with the adapted URL? (there should be many)
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_BERN + "')]"));
  //Was the URL in the address bar adatped?
  if(!(cap.browser == "IE" && cap.browser_version == "9.0")) {
    //check if url is adapted to reflect Bern location
    driver.getCurrentUrl().then(function(url) {
        assert.ok(url.indexOf(QUERYSTRING_OF_BERN) > -1);
    });
  }
  //And have a look at the permanent Link
  driver.findElement(webdriver.By.xpath("//*[@ng-model='permalinkValue']")).getAttribute("value").then(function(val){
      //The perma Link should point to Bern
      assert.ok(val.indexOf(QUERYSTRING_OF_BERN) > -1);
  });
  //We click on the "share" button what closes the share menu
}

module.exports.runTest = runTest;
