/*
 * This script should be called with phantomjs
 * It loads a given page and waits until
 * and element with a given ID is present on
 * the page.
 * It times out after a given timout is passed
 * > phantomjs load_page_until.js "http://map.geo.admin.ch/?topic=ech&snapshot=true" seo-load-end 10
 */

var page = require('webpage').create();
var system = require('system');

/*
 * We need 3 parameters passed to this script
 * 1. the webpage to open
 * 2. the id of the element on which to wait
 * 3. the timeout until the process is stopped (in seconds)
 *
 */
var errorMsg = 'error';
var checkCompleteInterval;
var maxTime = parseInt(system.args[3]) * 1000;

var checkComplete = function() {

  var foundId = page.evaluate(function(id) {
    var element = document.getElementById(id);
    return element ? true : false;
  }, system.args[2]);

  var timeout = (new Date().getTime() - startTime) > maxTime ? true : false;

  if (foundId || timeout) {
    clearInterval(checkCompleteInterval);
    if (timeout) {
      console.log('timeout');
    } else {
      console.log(page.content);
    }
    phantom.exit();
  }
}


if (system.args.length !== 4 || !maxTime || !page) {
  console.log(errorMsg);
  phantom.exit();
} else {
  var startTime = new Date().getTime();
  page.open(system.args[1], function(status) {
    if (status !== 'success') {
      console.log(errorMsg);
      phantom.exit();
    } else {
      checkCompleteInterval = setInterval(checkComplete, 250);
    }
  });
}

