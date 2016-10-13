goog.provide('ga_tabs');

goog.require('ga_tab_directive');
goog.require('ga_tabs_directive');

(function() {

  angular.module('ga_tabs', [
    'ga_tab_directive',
    'ga_tabs_directive'
  ]);
})();
