goog.provide('ga_offline');

goog.require('ga_offline_directive');
goog.require('ga_offline_service');
(function() {

  angular.module('ga_offline', [
    'ga_offline_directive',
    'ga_offline_service'
  ]);
})();
