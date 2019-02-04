goog.provide('ga_vector_feedback');

goog.require('ga_vector_feedback_directive');
goog.require('ga_vector_feedback_modal_directive');

(function() {
  angular.module('ga_vector_feedback', [
    'ga_vector_feedback_directive',
    'ga_vector_feedback_modal_directive'
  ]);
})();
