// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  'app/lib/jquery-2.0.2.min.js',
  'app/lib/angular-1.1.5.js',
  'app/lib/bootstrap-3.0.0.js',
  'app/lib/proj4js-compressed.js',
  'app/lib/EPSG21781.js',
  'test/closure-loader-globals.js',
  'app/lib/ol-whitespace.js',
  '.build-artefacts/app-whitespace.js',
  'test/angular/angular-mocks.js',
  'test/expect-0.2.0/expect.js',
  'test/sinon-1.7.3/sinon.js',
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

