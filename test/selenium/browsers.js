// Input capabilities
//

var os = function(obj, os, version, resolution) {
  obj['os'] = os;
  obj['os_version'] = version;
  obj['resolution'] = resolution;
};

var browser = function(obj, browser, version) {
  obj['browser'] = browser;
  obj['browser_version'] = version;
};

var create = function(os, osver, res, browser, brover) {
  return {
    'os' : os,
    'os_version' : osver,
    'resolution' : res,
    'browser' : browser,
    'browser_version' : brover,
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY,
    'browserstack.bfcache' : '0',
    'browserstack.debug' : false // switch this to true to debug (visual logs) 
  };
}

// Capabilities are available on :
// https://www.browserstack.com/automate/capabilities
// And browsers versions on :
// https://www.browserstack.com/list-of-browsers-and-platforms?product=automate

var capabilities = [
    create('Windows', '7', '1280x1024', 'Chrome', '36.0'),
    create('Windows', '7', '1280x1024', 'Chrome', '37.0'),
    create('Windows', '7', '1280x1024', 'Chrome', '38.0'),
    create('Windows', '8.1', '1280x1024', 'Chrome', '38.0'),
    create('Windows', '7', '1280x1024', 'IE', '9.0'),
    create('Windows', '7', '1280x1024', 'IE', '10.0'),
    create('Windows', '7', '1280x1024', 'IE', '11.0'),
    create('Windows', '8.1', '1280x1024', 'IE', '11.0'),
    create('Windows', '7', '1280x1024', 'Firefox', '31.0'),
    create('Windows', '7', '1280x1024', 'Firefox', '32.0'),
    create('Windows', '7', '1280x1024', 'Firefox', '33.0'),
    create('Windows', '8.1', '1280x1024', 'Firefox', '33.0')
];

module.exports.capabilities = capabilities;
