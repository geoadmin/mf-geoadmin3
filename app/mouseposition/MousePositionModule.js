(function() {
  goog.provide('ga_mouseposition');

  goog.require('ga_mouseposition_controller');
  goog.require('ga_mouseposition_filter');


  angular.module('ga_mouseposition', [
    'ga_mouseposition_filter',
    'ga_mouseposition_controller'
  ]);
})();
