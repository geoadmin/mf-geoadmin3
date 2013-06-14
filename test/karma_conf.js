// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
  //this automatically includes mocha library (is part of karma)
  MOCHA,
  MOCHA_ADAPTER,
  //loading all external libraries (explicit, because order is important)
  'lib/jquery-2.0.2.min.js',
  'lib/*.js',
  //taps network...probably not a good idea in unit tests
  'http://cdnjs.cloudflare.com/ajax/libs/proj4js/1.1.0/proj4js-compressed.js',
  //load libraries only specific to testing
  'test/angular/angular-mocks.js',
  'test/expect-0.2.0/expect.js',
  'build/app.js',
  //load test specifications (loader first to make sure our app is loaded)
  'test/specs/Loader.spec.js',
  'test/specs/**/*.js'
];


// list of files to exclude
exclude = [
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 8081;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

