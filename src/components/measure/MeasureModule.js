goog.provide('ga_measure');
goog.require('ga_measure_directive');
goog.require('ga_measure_service');
(function() {

  angular.module('ga_measure', [
    'ga_measure_directive',
    'ga_measure_service'
  ]);
})();
