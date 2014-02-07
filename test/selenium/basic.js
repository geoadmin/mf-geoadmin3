var webdriver = require('browserstack-webdriver');
var assert = require('assert');

// Input capabilities
var capabilities = {
  'browser' : 'Chrome',
  'browser_version' : '31.0',
  'os' : 'Windows',
  'os_version' : '7',
  'resolution' : '1280x1024', 
  'browserstack.user' : process.env.BROWSERSTACK_USER,
  'browserstack.key' : process.env.BROWSERSTACK_KEY,
  'browserstack.debug' : 'true'
}

var driver = new webdriver.Builder().
  usingServer('http://hub.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

console.log("Starting Browserstack script!");
console.log("Working on branch: "+process.env.CURRENT_BRANCH);

driver.get('https://mf-geoadmin3.dev.bgdi.ch/travis/prod/');
driver.getSession().then(function(sess){console.log("See more results or https://www.browserstack.com/automate/builds/d740ecfdd73f04d9c0a306c35d46de373047687d/sessions/"+sess.id_);});
driver.manage().timeouts().implicitlyWait(1000);
driver.findElement(webdriver.By.xpath("//*[@type='search']")).sendKeys('Bern');
driver.findElement(webdriver.By.xpath("//*[contains(text(), 'Bern (BE)')]")).click();
driver.sleep(2000);
driver.getCurrentUrl().then(function(url) {
  assert.equal(url.substring(8,69), 'mf-geoadmin3.dev.bgdi.ch/travis/prod/?X=200393.27&Y=596671.16');
});
console.log("Browserstack script finished.");

driver.quit();
