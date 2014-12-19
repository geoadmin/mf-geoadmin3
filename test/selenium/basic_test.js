var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var QUERYSTRING_OF_BERN = "X=200393.28&Y=596671.16";

var runTest = function(cap, driver, target){
  var TIMEOUT = 20000;
  driver.manage().timeouts().implicitlyWait(TIMEOUT);
  //We maximizse our window to be sure to be in full resolution
  driver.manage().window().maximize();
  //Goto the travis deployed site.
  driver.get(target + '/?lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  //type in "Bern" into the search field.
  driver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
  //Click on the field "Bern (BE)"
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern (BE)')]")).click();
  //We click on the "share" button
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
}

module.exports.runTest = runTest;
