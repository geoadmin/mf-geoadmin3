(function() {
  var appModule = angular.module('app', [
    'app.map',
    'app.mouseposition',
    'app.backgroundlayerselector',
    'app.print'
  ]);

  // Configure the $http service to remove the X-Requested-With
  // header. This is to be able to work with CORS. See
  // <http://stackoverflow.com/questions/15411818/setting-up-cors-with-angular-js>
  appModule.config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);

  // Configure the $location service to work in HTML5 mode. This is necessary for
  // setting initial states based on the query string.
  appModule.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);
})();
