goog.provide('ga_edit');

goog.require('ga_edit_directive');
goog.require('ga_editglstyle_directive');

(function() {
  angular.module('ga_edit', [
    'ga_edit_directive',
    'ga_editglstyle_directive'
  ]);
})();
