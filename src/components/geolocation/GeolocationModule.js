(function() {
  goog.provide('ga_geolocation');

  goog.require('ga_geolocation_directive');

  angular.module('ga_geolocation', [
    'ga_geolocation_directive'
  ]);
})();
