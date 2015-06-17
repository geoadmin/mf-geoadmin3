goog.provide('ga_help');

goog.require('ga_help_directive');
goog.require('ga_help_service');
(function() {

  angular.module('ga_help', [
    'ga_help_directive',
    'ga_help_service'
  ]);
})();
