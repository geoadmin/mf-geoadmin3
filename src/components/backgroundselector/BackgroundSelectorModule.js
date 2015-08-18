goog.provide('ga_backgroundselector');

goog.require('ga_background_service');
goog.require('ga_backgroundselector_directive');
(function() {

  angular.module('ga_backgroundselector', [
    'ga_backgroundselector_directive',
    'ga_background_service'
  ]);
})();
