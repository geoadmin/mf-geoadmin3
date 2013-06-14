(function() {
  goog.provide('ga-mouseposition');
  goog.require('ga-mouseposition-filter');
  goog.require('ga-mouseposition-controller');

  angular.module('ga-mouseposition', [
    'ga-mouseposition-filter',
    'ga-mouseposition-controller'
  ]);
})();
