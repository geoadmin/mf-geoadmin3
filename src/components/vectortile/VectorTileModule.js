goog.provide('ga_vector_tile');

goog.require('ga_vector_tile_feedback');
goog.require('ga_mapbox_style');

(function() {
  angular.module('ga_vector_tile', [
    'ga_vector_tile_feedback',
    'ga_mapbox_style'
  ]);
})();
