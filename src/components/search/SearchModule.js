(function() {
  goog.provide('ga_search');
  goog.require('ga_search_controller');
  goog.require('ga_search_directive');

  angular.module('ga_search', [
    'ga_search_controller',
    'ga_search_directive'
  ]);
})();
