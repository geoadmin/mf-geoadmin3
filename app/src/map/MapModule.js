(function() {
  goog.provide('ga_map');

  goog.require('ga_map_controller');
  goog.require('ga_map_directive');


  angular.module('ga_map', [
    'ga_map_directive',
    'ga_map_controller'
  ]);
})();
