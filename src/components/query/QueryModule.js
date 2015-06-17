goog.provide('ga_query');

goog.require('ga_query_directive');
goog.require('ga_query_service');
(function() {

  angular.module('ga_query', [
    'ga_query_directive',
    'ga_query_service'
  ]);
})();

