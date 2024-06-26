// Karma configuration
<%
  if mode == 'release':
    basePath = 'prd'
  else:
    basePath = 'src'
%>


module.exports = function(config) {
  config.set({
  // base path, that will be used to resolve files and exclude
  basePath: '..',

  proxies: {
    '/checker': '/base/${basePath}/checker'
  },

  // list of files / patterns to load in the browser
  files: [
    {pattern: '${basePath}/style/font-awesome-4.5.0/font/*', watched: false, included: false, served: true},
    {pattern: '${basePath}/checker', watched: false, included: false, served: true},
    'test/lib/expect.js',
    'test/lib/sinon.js',
    '${basePath}/lib/ol.js',
  % if mode == 'release':
    '${basePath}/style/app.css',
    '${basePath}/lib/d3.min.js',
    '${basePath}/lib/Cesium.min.js',
    '${basePath}/lib/olcesium.js',
    '${basePath}/lib/build.js',
  % else:
    '${basePath}/style/app.css',
    '${basePath}/lib/jquery.js',
    '${basePath}/lib/jQuery.XDomainRequest.js',
    '${basePath}/lib/slip.js',
    '${basePath}/lib/angular.js',
    '${basePath}/lib/angular-translate.js',
    '${basePath}/lib/angular-translate-loader-static-files.js',
    '${basePath}/lib/d3.js',
    '${basePath}/lib/bootstrap.js',
    '${basePath}/lib/typeahead.jquery.js',
    '${basePath}/lib/proj4js-compressed.js',
    '${basePath}/lib/EPSG21781.js',
    '${basePath}/lib/EPSG2056.js',
    '${basePath}/lib/EPSG32631.js',
    '${basePath}/lib/EPSG32632.js',
    '${basePath}/lib/fastclick.js',
    '${basePath}/lib/localforage.js',
    '${basePath}/lib/filesaver.js',
    '${basePath}/lib/moment-with-customlocales.js',
    '${basePath}/lib/gyronorm.complete.js',
    '${basePath}/lib/Cesium/Cesium.js',
    'test/closure-loader-globals.js',
    '${basePath}/lib/olcesium-debug.js',
    '.build-artefacts/app-whitespace.js',
  % endif
    'test/lib/angular-mocks.js',
    'test/specs/Loader.spec.js',
    'test/specs/**/*.js',
    {
      pattern: 'test/data/*',
      watched: true,
      served:  true,
      included: false
    }
  ],


  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['mocha'],


  preprocessors: {
    // In both release mode (build.js) and debug mode (app-whitespace.js) the
    // partials are pre-cached in Angular's $templateCache. So we don't
    // need to use Karma's html2js preprocessor, and cache partials in
    // tests using ngMock's "module" function.
    //'components/**/*.html': 'html2js'
  % if mode == 'debug':
    '.build-artefacts/app-whitespace.js': ['coverage']
  % endif
  },


  // list of files to exclude
  exclude: [
  ],

  // create output in a format than can be consumed by AWS code build
  junitReporter: {
      outputDir: 'junit-reports', // results will be saved as $outputDir/$browserName.xml
      outputFile: 'testreport-${mode}-junit.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
      //suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      //nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      //classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {}, // key value pair of properties to add to the <properties> section of the report
      //xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
  },


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
% if ci == "1":
  reporters: ['junit', 'dots'],
% else:
  reporters: ['junit', 'progress'],
% endif
  // web server port
  port: 8081,


  // cli runner port
  runnerPort: 9100,


  // enable / disable colors in the output (reporters and logs)
  colors: true,


  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
% if mode == 'release':
  logLevel: config.LOG_INFO,
% else:
  logLevel: config.LOG_WARN,
% endif


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: false,


  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera
  // - Safari (only Mac)
  // - PhantomJS
  // - IE (only Windows)
  browsers: ['PhantomJS_desktop'],
  customLaunchers: {
    'PhantomJS_desktop': {
      base: 'PhantomJS',
      options: {
        'viewportSize':  {
          width: 1366,
          height: 768
        }
      }
    }
  },
  // If browser does not capture in given timeout [ms], kill it
  captureTimeout: 5000,


  // Continuous Integration mode
  // if true, it capture browsers, run tests and exit
  singleRun: true,
  browserConsoleLogOptions: {
    level: 'log',
    format: '%b %T: %m',
    terminal: true
  }

  });
};
