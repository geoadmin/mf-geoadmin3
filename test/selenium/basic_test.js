var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var URL_OF_BERN = "mf-geoadmin3.dev.bgdi.ch/travis/prod/?X=200393.27&Y=596671.16";

var runTest = function(cap, driver){
  //on every action we wait a maximum of 10 seconds before thrwosing and error (ajax etc.)
  driver.manage().timeouts().implicitlyWait(30000);
  //Goto the travis deployed site.
  driver.get('https://mf-geoadmin3.dev.bgdi.ch/travis/prod/');
  //type in "Bern" into the search field.
  driver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
  //Click on the field "Bern (BE)"
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern (BE)')]")).click().then(function(){
    driver.sleep(5000);
    //The first test does not have to work on IE 9
    if(!(cap.browser == "IE" && cap.browser_version == "9.0")){

      //If we have a look at the URL
      driver.getCurrentUrl().then(function(url){
        //We should be located in Bern
        assert.equal(url.substring(8,69),  URL_OF_BERN);
      });
    }
  });

  //We click on the "share" button
  driver.findElement(webdriver.By.xpath("//a[@id='shareHeading']")).click();
  //And have a look at the permanent Link
  driver.findElement(webdriver.By.xpath("//*[@ng-model='permalinkValue']")).getAttribute("value").then(function(val){
    //The perma Link should point to Bern
    assert.equal(val.substring(8,69),  URL_OF_BERN);
  }); 
}

module.exports.runTest = runTest;
