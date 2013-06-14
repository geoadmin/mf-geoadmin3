(function() {
  goog.provide('ga_backgroundlayerselector');
  goog.require('ga_backgroundlayerselector_directive');
  goog.require('ga_backgroundlayerselector_controller');

  angular.module('ga_backgroundlayerselector', [
    'ga_backgroundlayerselector_directive',
    'ga_backgroundlayerselector_controller'
  ]);
})();
