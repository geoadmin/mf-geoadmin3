// Print test using browserstack

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  //We maximize our window to be sure to be in full resolution
  driver.manage().window().maximize();
  // Goto the travis deployed site.
  driver.get(target + '/?lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  // Click on "Drucken"
  driver.findElement(webdriver.By.xpath("//a[@id='printHeading']")).click();
  // Wait until print is opened and animation is finished
  driver.findElement(webdriver.By.xpath("//div[@id='print' and contains(@class, 'collapse in')]"));
  // Try Print
  driver.findElement(webdriver.By.xpath("//button[contains(text(), 'Erstelle PDF')]")).click();
  // Is it success?
  driver.findElement(webdriver.By.xpath("//span[@ng-if='options.printsuccess']"));
}

module.exports.runTest = runTest;
