//we need webdriver in order to initiate the webdriver here.
var webdriver = require('browserstack-webdriver');

//load the capabilities/browsers we want to test.
var browsers = require('./browsers.js');

//load the tests.
var basictest = require('./basic_test.js');

//okay we will start the script!
console.log("Starting Browserstack script!");
console.log("Working on branch: "+process.env.CURRENT_BRANCH);

//for every browser config we want to run all the tests
browsers.capabilities.forEach(function(cap){

  //we build the driver only once for all tests per browser.
  var driver = new webdriver.Builder().
    usingServer('http://hub.browserstack.com/wd/hub').
    withCapabilities(cap).
    build();
    
  //show a link for each browser + version for visual results.
  driver.getSession().then(function(sess){
    console.log("running test for: " + cap.browser + "(" + cap.browser_version + ") on " + cap.os + " " + cap.os_version);
    console.log("  See more results or https://www.browserstack.com/automate/builds/d740ecfdd73f04d9c0a306c35d46de373047687d/sessions/"+sess.id_);
  });

  //run all the tests
  try{
    basictest.runTest(cap, driver); 
  }catch(err){
    //we need this block for the finally, as we definitly want to quit the driver, otherwise it stays idle for ~2 min blocking the next testrun.
    throw err;
  }finally{
    driver.quit();
  }
});

