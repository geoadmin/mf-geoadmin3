goog.provide('ga_mapbox_style');

goog.require('ga_mapbox_style_edit_directive');
goog.require('ga_mapbox_style_edit_properties_directive');
goog.require('ga_mapbox_style_edit_font_size_directive');
goog.require('ga_mapbox_style_color_picker_directive');
goog.require('ga_mapbox_style_toggle_directive');

(function() {
  angular.module('ga_mapbox_style', [
    'ga_mapbox_style_edit_directive',
    'ga_mapbox_style_edit_properties_directive',
    'ga_mapbox_style_edit_font_size_directive',
    'ga_mapbox_style_color_picker_directive',
    'ga_mapbox_style_toggle_directive'
  ]);
})();
