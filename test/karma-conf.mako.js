// Karma configuration

// base path, that will be used to resolve files and exclude
% if mode == 'prod':
basePath = '../app-prod';
% else:
basePath = '../app';
% endif

// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
% if mode == 'prod':
  'lib/build.js',
% else:
  'lib/jquery-2.0.2.js',
  'lib/angular-1.1.5.js',
  'lib/bootstrap-3.0.0.js',
  'lib/proj4js-compressed.js',
  'lib/EPSG21781.js',
  '../test/closure-loader-globals.js',
  'lib/ol-whitespace.js',
  '../.build-artefacts/app-whitespace.js',
% endif
  '../test/angular/angular-mocks.js',
  '../test/expect-0.2.0/expect.js',
  '../test/sinon-1.7.3/sinon.js',
  '../test/specs/Loader.spec.js',
  '../test/specs/**/*.js',
  'src/**/*.html'
];


// generate js files from templates
preprocessors = {
  'src/**/*.html': 'html2js'
};


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
