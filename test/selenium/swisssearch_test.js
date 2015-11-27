// Swisssearch Test Using Browserstack

var webdriver = require('browserstack-webdriver');
var assert = require('assert');

var QUERYSTRING_OF_RARON = "X=128176.00&Y=629766.00&zoom=10";
var QUERYSTRING_OF_RTE_BERNE_LAUSANNE = "X=154208.00&Y=539257.00&zoom=10";
var QUERYSTRING_OF_PL_CHATEAU_AVENCHES = "X=192310.00&Y=569734.00&zoom=10";
var QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA = "X=117500.00&Y=722500.00&zoom=10";
var QUERYSTRING_MOOS = "X=128630.00&Y=627650.00&zoom=10";
var QUERYSTRING_OF_REALTA = "X=181085.00&Y=751355.00";

var runTest = function(cap, driver, target){
  //swissearch parameter with multiple results
  driver.get(target + '/?swisssearch=raron&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Raron')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), ', Flugplatz')]")).click();
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_RARON + "')]"));
  //parameter should disappear when selection is done
  driver.findElement(webdriver.By.xpath("//*[@id='toptools']//a[contains(@href,'http')]")).getAttribute("href").then(function(val) {
    assert.ok(val.indexOf('swisssearch') == -1);
  });

  //swisssearch parameter with multiple results (locations and layers), reset selection
  driver.get(target + '/?swisssearch=wasser&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Gehe nach')]"));
  driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Karte hinzufügen')]"));
  driver.findElement(webdriver.By.xpath("//button[@ng-click='clearInput()']")).click();
  //parameter should disappear when selection is done
  driver.findElement(webdriver.By.xpath("//*[@id='toptools']//a[contains(@href,'http')]")).getAttribute("href").then(function(val) {
    assert.ok(val.indexOf('swisssearch') == -1);
  });

  //swisssearch Realta industriegebiet 701 with wordforms GI -> industriegebiet (DE)
  driver.get(target + '/?swisssearch=realta gi 701&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_REALTA + "')]"));

  //swisssearch Route de Berne 91 1010 Lausanne with wordforms rte
  driver.get(target + '/?swisssearch=rte berne 91 1010&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_RTE_BERNE_LAUSANNE + "')]"));

  //swisssearch Place du Château, Avenches (Pl -> platz)
  driver.get(target + '/?swisssearch=pl chateau avenches&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_PL_CHATEAU_AVENCHES + "')]"));

  //swisssearch Piazza Mesolcina, Bellinzona (P -> piazza)
  driver.get(target + '/?swisssearch=p Mesolcina Bellinzona&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_OF_PIAZZA_MESOLCINA_BELLINZONA + "')]"));

  //swissearch parameter with 1 result (direct selection doesn't work in safari 5.1)
  driver.get(target + '/?swisssearch=brückenmoostrasse 11 raron&lang=de');
  //wait until topics related stuff is loaded. We know this when catalog is there
  driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
  driver.findElement(webdriver.By.xpath("//a[contains(@href, '" + QUERYSTRING_MOOS + "')]"));
  //parameter stays after initial automatic selection
  driver.findElement(webdriver.By.xpath("//*[@id='toptools']//a[contains(@href,'http')]")).getAttribute("href").then(function(val) {
    assert.ok(val.indexOf(QUERYSTRING_MOOS) > -1);
    assert.ok(val.indexOf('swisssearch=br') > -1);
  });
  //parameter is removed by map action (simulating zoom here)
  driver.findElement(webdriver.By.xpath("//button[@class='ol-zoom-in']")).click();
  driver.findElement(webdriver.By.xpath("//a[contains(@href, 'zoom=11')]"));
  //parameter should disappear when selection is done
  driver.findElement(webdriver.By.xpath("//*[@id='toptools']//a[contains(@href,'http')]")).getAttribute("href").then(function(val) {
    assert.ok(val.indexOf('swisssearch') == -1);
  });
}

module.exports.runTest = runTest;
