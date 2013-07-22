(function() {
  goog.provide('ga_geolocation');

  goog.require('ga_geolocation_directive');
  goog.require('ga_map_directive');

  angular.module('ga_map', [
    'ga_geolocation_directive'
  ]);
})();
