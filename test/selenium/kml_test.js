// KML import test using browserstack

var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var QUERYSTRING_KML = "KML%7C%7Chttp:%2F%2Fopendata.utou.ch%2Furbanproto%2Fgeneva%2Fgeo%2Fkml%2FRoutes.kml";
var POSITION_TO_KML = "X=124759.52&Y=499224.22";

var runTest = function(cap, driver, target) {
  
  //Test executed when a basic page is loaded
  var testOnLoad = function() {
    // Click on "Werkzeuge"
    driver.findElement(webdriver.By.xpath("//a[@id='toolsHeading']")).click();
    // Click on "KML Import"
    driver.findElement(webdriver.By.xpath("//*[contains(text(), 'KML Import')]")).click();
    // Click on "URL"
    driver.findElement(webdriver.By.xpath("//a[contains(text(), 'URL')]")).click();
    // Write URL of the chosen KML
    driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//input[@placeholder='URL einfügen']")).sendKeys('http://opendata.utou.ch/urbanproto/geneva/geo/kml/Routes.kml');
    // Click on "KML Laden"
    driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//button[contains(text(),'KML laden')]")).click();
    // Check if the KML was correctly parsed
    driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//*[contains(text(), 'Parsing erfolgreich')]"));
    // Close popup
    driver.findElement(webdriver.By.xpath("//*[@id='import-kml-popup']//button[@ng-click='close($event)']")).click();

  // Was the URL in the address bar adapted?
    if(!(cap.browser == "IE" && cap.browser_version == "9.0")) {
      // Check if url is adapted to KML presence and KML position
      driver.wait(function() {
        return driver.getCurrentUrl().then(function(url) {
          assert.ok(url.indexOf(QUERYSTRING_KML) > -1);
          assert.ok(url.indexOf(POSITION_TO_KML) > -1);
          return true;
        });
      }, 1000);
    }
  };
  
  //Test executed when a page with a kml is loaded
  var testOnLoadKML = function() {
    // Check if KML has correctly been loaded
    driver.findElement(webdriver.By.xpath("//*[@id='selection']//*[contains(text(), 'Lignes')]"));
  };

  //We maximize our window to be sure to be in full resolution
  driver.manage().window().maximize();

  // Go to the basic page.
  driver.get(target + '/?lang=de').then(testOnLoad);

  // Go to a page with a KML.
  driver.get(target + '/?lang=de&layers='+QUERYSTRING_KML).then(testOnLoadKML);
}

module.exports.runTest = runTest;
