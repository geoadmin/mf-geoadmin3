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

})();
