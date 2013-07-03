(function() {
  goog.provide('ga_catalogtree');

  goog.require('ga_catalogtree_controller');
  goog.require('ga_catalogtree_directive');

  angular.module('ga_catalogtree', [
    'ga_catalogtree_controller',
    'ga_catalogtree_directive'
  ]);
})();
