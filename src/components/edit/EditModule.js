goog.provide('ga_edit');

goog.require('ga_color_directive');
goog.require('ga_edit_directive');
goog.require('ga_editglstyle_directive');
goog.require('ga_size_directive');
goog.require('ga_toggle_directive');

(function() {
  angular.module('ga_edit', [
    'ga_edit_directive',
    'ga_editglstyle_directive',
    'ga_color_directive',
    'ga_size_directive',
    'ga_toggle_directive'
  ]);
})();
