// 03 Print test using browserstack

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  // Click on "Drucken"
  driver.findElement(webdriver.By.xpath("//a[@id='printHeading']")).click();
  // Wait until print is opened and animation is finished
  driver.findElement(webdriver.By.xpath("//div[@id='print' and contains(@class, 'collapse in')]"));
  // Try Print
  driver.findElement(webdriver.By.xpath("//button[contains(text(), 'Drucken')]")).click();
  // Is it success?
  driver.findElement(webdriver.By.xpath("//span[@ng-if='options.printsuccess']"));
}

module.exports.runTest = runTest;
