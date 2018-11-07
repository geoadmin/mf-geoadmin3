
goog.provide('ga_query_vector');

goog.require('ga_query_vector_directive');
goog.require('ga_query_vector_button_directive');
(function() {

  angular.module('ga_query_vector', [
    'ga_query_vector_directive',
    'ga_query_vector_button_directive'
  ]);
})();
