(function() {
  goog.provide('ga_map');

  goog.require('ga_map_directive');
  goog.require('ga_map_geolocation');
  goog.require('ga_map_service');

  angular.module('ga_map', [
    'ga_map_directive',
    'ga_map_service',
    'ga_map_geolocation'
  ]);
})();
