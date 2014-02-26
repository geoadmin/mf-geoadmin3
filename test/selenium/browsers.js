// Input capabilities
var capabilities = [{
    'browser' : 'Chrome',
    'browser_version' : '31.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY
  },
  {
    'browser' : 'IE',
    'browser_version' : '9.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY
  },
  {
    'browser' : 'IE',
    'browser_version' : '10.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY
  },
  {
    'browser' : 'IE',
    'browser_version' : '11.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY
  },
  {
    'browser' : 'Firefox',
    'browser_version' : '27.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY
  },
  {
    'browser' : 'Safari',
    'browser_version' : '5.1',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1280x1024',
    'browserstack.user' : process.env.BROWSERSTACK_USER,
    'browserstack.key' : process.env.BROWSERSTACK_KEY
  } 
]

module.exports.capabilities = capabilities;
