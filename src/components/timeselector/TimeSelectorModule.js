goog.provide('ga_timeselector');

goog.require('ga_time_service');
goog.require('ga_timeselector_directive');

(function() {

  angular.module('ga_timeselector', [
    'ga_timeselector_directive',
    'ga_time_service'
  ]);
})();
