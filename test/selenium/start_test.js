// Start Browserstack test

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  //Set the timeout to x ms
  var TIMEOUT = 40000;
  driver.manage().timeouts().implicitlyWait(TIMEOUT);
  
  //Test executed when a basic page is loaded
  var testOnLoad = function() {
    driver.findElement(webdriver.By.xpath("//span[contains(text(), 'Geokatalog')]"));
  };

  //We maximize our window to be sure to be in full resolution
  driver.manage().window().maximize();

  //Go to the deployed site.
  driver.get(target + '/?lang=de').then(testOnLoad);
};

module.exports.runTest = runTest;
