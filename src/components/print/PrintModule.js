goog.provide('ga_print');

goog.require('ga_print_directive');
goog.require('ga_printstyle_service');

(function() {

  angular.module('ga_print', [
    'ga_print_directive',
    'ga_printlayer_service'
  ]);
})();
