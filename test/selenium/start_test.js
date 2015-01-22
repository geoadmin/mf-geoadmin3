// 01 Start Browserstack test

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  //Set the timeout to x ms
  var TIMEOUT = 40000;
  driver.manage().timeouts().implicitlyWait(TIMEOUT);
  //We maximizse our window to be sure to be in full resolution
  driver.manage().window().maximize();
  //Goto the travis deployed site.
  driver.get(target + '/?lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
};

module.exports.runTest = runTest;
