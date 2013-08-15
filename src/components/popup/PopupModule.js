(function() {
  goog.provide('ga_popup');

  goog.require('ga_popup_directive');
  goog.require('ga_popup_service');


  angular.module('ga_popup', [
    'ga_popup_directive',
    'ga_popup_service'
  ]);
})();
