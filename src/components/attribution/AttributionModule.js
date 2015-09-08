goog.provide('ga_attribution');

goog.require('ga_attribution_directive');
goog.require('ga_attribution_service');

(function() {

  angular.module('ga_attribution', [
    'ga_attribution_directive',
    'ga_attribution_service'
  ]);
})();
