// Swisssearch Test Using Browserstack

var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var QUERYSTRING_OF_RARON = "X=128180.88&Y=630227.13";
var QUERYSTRING_MOOS = "X=128630.00&Y=627650.00";

var runTest = function(cap, driver, target){
  //swissearch parameter with multiple results
  driver.get(target + '/?swisssearch=raron&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Raron')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Flugfeld')]")).click();
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_RARON + "')]"));
  //parameter should disappear when selection is done
  driver.findElement(webdriver.By.xpath("//input[@ng-model='permalinkValue']")).getAttribute("value").then(function(val) {
    assert.ok(val.indexOf('swisssearch') == -1);
  });

  //swisssearch parameter with multiple results (locations and layers), reset selection
  driver.get(target + '/?swisssearch=wasser&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Gehe nach')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Karte hinzufügen')]"));
  driver.findElement(webdriver.By.xpath("//i[@ng-click='clearInput()']")).click();
  //parameter should disappear when selection is done
  driver.findElement(webdriver.By.xpath("//input[@ng-model='permalinkValue']")).getAttribute("value").then(function(val) {
    assert.ok(val.indexOf('swisssearch') == -1);
  });

  //swissearch parameter with 1 result (direct selection doesn't work in safari 5.1)
  if (!(cap.browser == 'Safari' && cap.browser_version == '5.1')) {
    driver.get(target + '/?swisssearch=brückenmoostrasse 11 raron&lang=de');
    //wait until topics related stuff is loaded. We know this when catalog is there
    driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
    driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_MOOS + "')]"));
    //parameter stays after initial automatic selection
    driver.findElement(webdriver.By.xpath("//input[@ng-model='permalinkValue']")).getAttribute("value").then(function(val) {
      assert.ok(val.indexOf(QUERYSTRING_MOOS) > -1);
      assert.ok(val.indexOf('swisssearch=br') > -1);
    });
    //parameter is removed by map action (simulating zoom here)
    driver.findElement(webdriver.By.xpath("//button[@class='ol-zoom-in']")).click();
    driver.findElement(webdriver.By.xpath("//a[contains(@href, 'zoom=11')]"));
    //parameter should disappear when selection is done
    driver.findElement(webdriver.By.xpath("//input[@ng-model='permalinkValue']")).getAttribute("value").then(function(val) {
      assert.ok(val.indexOf('swisssearch') == -1);
    });
  }
}

module.exports.runTest = runTest;
