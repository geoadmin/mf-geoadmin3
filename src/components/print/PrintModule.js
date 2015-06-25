goog.provide('ga_print');

goog.require('ngeo.CreatePrint');
goog.require('ngeo.PrintUtils');
(function() {

  angular.module('ga_print', [
    'ga_print_directive',
    'ga_print_style_service',
    'ngeo.CreatePrint',
    'ngeo.PrintUtils'
  ]);
})();
