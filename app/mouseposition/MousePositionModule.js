(function() {
  goog.provide('ga_mouseposition');
  goog.require('ga_mouseposition_filter');
  goog.require('ga_mouseposition_controller');

  angular.module('ga_mouseposition', [
    'ga_mouseposition_filter',
    'ga_mouseposition_controller'
  ]);
})();
