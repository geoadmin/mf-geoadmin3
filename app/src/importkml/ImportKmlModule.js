(function() {
   goog.provide('ga_importkml');
 
   goog.require('ga_importkml_controller');
   goog.require('ga_importkml_directive');
  
   angular.module('ga_importkml', [
    'ga_importkml_controller',
    'ga_importkml_directive'
  ]);
})();

