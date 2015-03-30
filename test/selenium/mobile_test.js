// Browserstack Mobile test

var webdriver = require('browserstack-webdriver');

var runTest = function(mobCap, mdriver, target) {
  //Set the timeout to x ms
  var TIMEOUT = 90000;
  mdriver.manage().timeouts().implicitlyWait(TIMEOUT);
  //Goto the travis deployed site.
  mdriver.get(target + '/mobile.html?lang=de');
  //wait until page is loaded (it is when zoomButtons are visible)
  mdriver.findElement(webdriver.By.xpath("//div[@id='zoomButtons']"));
  mdriver.findElement(webdriver.By.xpath("//div[@id='pulldown']"));
  mdriver.findElement(webdriver.By.xpath("//img[@alt='small_logo']"));
  //Send "Bern" to the searchbar
  mdriver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
  //Click on the field "Bern"
  mdriver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern')]")).click();
};

module.exports.runTest = runTest;
