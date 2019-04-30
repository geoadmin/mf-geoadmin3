goog.provide('ga_vector_tile_feedback');

goog.require('ga_vector_tile_feedback_directive');
goog.require('ga_vector_tile_feedback_modal_directive');

(function() {
  angular.module('ga_vector_tile_feedback', [
    'ga_vector_tile_feedback_directive',
    'ga_vector_tile_feedback_modal_directive'
  ]);
})();
