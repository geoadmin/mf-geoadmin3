var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var runTest = function(cap, driver){
  driver.get('https://mf-geoadmin3.dev.bgdi.ch/travis/prod/');
  driver.manage().timeouts().implicitlyWait(1000);
  driver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern (BE)')]")).click().then(function(){
    driver.sleep(3000).then(function() {
      driver.getCurrentUrl().then(function(url) {
        driver.findElement(webdriver.By.xpath("//a[@id='shareHeading']")).click();
        driver.findElement(webdriver.By.xpath("//*[@ng-model='permalinkValue']")).getAttribute("value").then(function(val){
          // If we are on IE 9 we take the permalink instead of the url, as the url does not get changed.
          if(cap.browser == "IE" && cap.browser_version == "9.0")
            url = val;
          assert.equal(url.substring(8,69), 'mf-geoadmin3.dev.bgdi.ch/travis/prod/?X=200393.27&Y=596671.16');
        });
      });
    });
  });

  driver.quit();
}

module.exports.runTest = runTest;
