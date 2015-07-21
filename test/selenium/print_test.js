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
  // Wait until configuration is loaded
  driver.findElement(webdriver.By.xpath("//*[@id='print']//option[@label='A4 portrait']"));

  // Selenium IE and FF are not able to handle menu selection
  if(!(cap.browser != "IE" || cap.browser != "Firefox")){
    // Click on the orientation
    driver.findElement(webdriver.By.xpath("//*[@id='print']//select[@ng-model='layout']")).click();
    // Click on "A3 Landscape"
    driver.findElement(webdriver.By.xpath("//*[@id='print']//option[@label='A3 landscape']")).click();
    // Click on the scale
    driver.findElement(webdriver.By.xpath("//*[@id='print']//select[@ng-model='scale']")).click();
    // Click on 1:200:000
    driver.findElement(webdriver.By.xpath("//*[@id='print']//option[@label='1:200,000']")).click();
    // Add legend
    driver.findElement(webdriver.By.xpath("//*[@id='print']//input[@ng-model='options.legend']")).click();
    // Add Coordinate system
    driver.findElement(webdriver.By.xpath("//*[@id='print']//input[@ng-model='options.graticule']")).click();
  }

  // Try Print
  driver.findElement(webdriver.By.xpath("//button[contains(text(), 'Erstelle PDF')]")).click();
  // Did it succeed?
  driver.findElement(webdriver.By.xpath("//span[@ng-if='options.printsuccess']"));
}

module.exports.runTest = runTest;
