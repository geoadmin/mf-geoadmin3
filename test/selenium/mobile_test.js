// Mobile Version testing using browserstack

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  //We resize our window to simulate iPhone 4 like mobile resolution
  driver.manage().window().setSize(320, 480);
  //Go to the mobile version of map.geo.admin
  driver.get(target + '/mobile.html?lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//div[@id='zoomButtons']"));
  driver.findElement(webdriver.By.xpath("//div[@id='pulldown']"));
  driver.findElement(webdriver.By.xpath("//img[@alt='small_logo']"));
  //Send "Bern" to the searchbar
  driver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
  //Click on the field "Bern"
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern')]")).click();
};

module.exports.runTest = runTest;
