(function() {
  goog.provide('ga_print');

  goog.require('ga_print_directive');
  goog.require('ga_print_style_service');

  angular.module('ga_print', [
    'ga_print_directive',
    'ga_print_style_service'
  ]);
})();

