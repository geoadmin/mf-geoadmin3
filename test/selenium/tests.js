var webdriver = require('browserstack-webdriver');
var cmd = require('commander');

cmd.version('0.0.1')
    .option('-t, --target <url>', 'The URL to run the tests against')
    .parse(process.argv);

if (!cmd.target || cmd.target.length <= 0) {
    console.log('ERROR: no url provided. Use -t URL.', cmd.target);
    return 2;
}

if (!process.env.BROWSERSTACK_USER ||
    process.env.BROWSERSTACK_USER.length <= 0 ||
    !process.env.BROWSERSTACK_KEY ||
    process.env.BROWSERSTACK_KEY.length <= 0) {
  console.log("ERROR: browserstack tests are aborting. You need to set BROWSERSTACK_USER and BROWSERSTACK_KEY in your environment!");
  return 1;
}

//load the capabilities/browsers we want to test.
var browsers = require('./browsers.js');

//load the tests.
var basictest = require('./basic_test.js');

//okay we will start the script!
console.log("Starting Browserstack script!");

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
    basictest.runTest(cap, driver, cmd.target); 
  }catch(err){
    //we need this block for the finally, as we definitly want to quit the driver, otherwise it stays idle for ~2 min blocking the next testrun.
    throw err;
  }finally{
    driver.quit();
  }
});

