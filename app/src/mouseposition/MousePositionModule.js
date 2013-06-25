(function() {
  goog.provide('ga_mouseposition');

  goog.require('ga_mouseposition_controller');
  goog.require('ga_mouseposition_directive');

  angular.module('ga_mouseposition', [
    'ga_mouseposition_controller',
    'ga_mouseposition_directive'
  ]);
})();
