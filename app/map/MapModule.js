(function() {
  goog.provide('ga-map');
  goog.require('ga-map-directive');
  goog.require('ga-map-controller');

  angular.module('ga-map', [
    'ga-map-directive',
    'ga-map-controller'
  ]);
})();
