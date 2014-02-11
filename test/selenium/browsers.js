// Input capabilities
var capabilities = [{
    'browser' : 'Chrome',
    'browser_version' : '31.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY,
    'browserstack.debug' : 'true'
  },
  {
    'browser' : 'IE',
    'browser_version' : '9.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY,
    'browserstack.debug' : 'true'
  }
]

module.exports.capabilities = capabilities;
