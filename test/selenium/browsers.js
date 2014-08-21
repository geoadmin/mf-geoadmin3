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
    'browserstack.key' : process.env.BROWSERSTACK_KEY
  };
}

var capabilities = [
    create('Windows', '7', '1280x1024', 'Chrome', '33.0'),
    create('Windows', '7', '1280x1024', 'Chrome', '34.0'),
    create('Windows', '7', '1280x1024', 'Chrome', '35.0'),
    create('Windows', '7', '1280x1024', 'IE', '9.0'),
    create('Windows', '7', '1280x1024', 'IE', '10.0'),
    create('Windows', '7', '1280x1024', 'IE', '11.0'),
    create('Windows', '7', '1280x1024', 'Firefox', '28.0'),
    create('Windows', '7', '1280x1024', 'Firefox', '29.0'),
    create('Windows', '7', '1280x1024', 'Safari', '5.1')
]

module.exports.capabilities = capabilities;
