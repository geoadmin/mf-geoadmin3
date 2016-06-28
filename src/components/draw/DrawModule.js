goog.provide('ga_draw');

goog.require('ga_draw_directive');
goog.require('ga_drawstyle_directive');

(function() {
  angular.module('ga_draw', [
    'ga_draw_directive',
    'ga_drawstyle_directive'
  ]);
})();
