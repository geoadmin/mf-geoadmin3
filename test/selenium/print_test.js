// 03 Print test using browserstack

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  // Click on "Drucken"
  driver.findElement(webdriver.By.xpath("//a[@id='printHeading']")).click();
  // Wait 1 sec for the menu to pull down
  driver.sleep(1000);
  // Try Print
  driver.findElement(webdriver.By.xpath("//button[contains(text(), 'Drucken')]"))
}

module.exports.runTest = runTest;
