(function() {
  goog.provide('ga');
  goog.require('ga-map');
  goog.require('ga-mouseposition');
  goog.require('ga-backgroundlayerselector');
  goog.require('ga-print');

  var module = angular.module('ga', [
    'ga-map',
    'ga-mouseposition',
    'ga-backgroundlayerselector',
    'ga-print'
  ]);

  // Configure the $http service to remove the X-Requested-With
  // header. This is to be able to work with CORS. See
  // <http://stackoverflow.com/questions/15411818/setting-up-cors-with-angular-js>
  module.config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);

  // Configure the $location service to work in HTML5 mode. This is necessary for
  // setting initial states based on the query string.
  module.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);
})();
