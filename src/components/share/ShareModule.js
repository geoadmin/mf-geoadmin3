goog.provide('ga_share');

goog.require('ga_share_directive');
goog.require('ga_sharecopybt_directive');
goog.require('ga_sharecopyinput_directive');
goog.require('ga_sharecopyinputgroup_directive');
goog.require('ga_sharedraw_directive');
goog.require('ga_shareembed_directive');

(function() {
  angular.module('ga_share', [
    'ga_share_directive',
    'ga_sharecopybt_directive',
    'ga_sharecopyinput_directive',
    'ga_sharecopyinputgroup_directive',
    'ga_sharedraw_directive',
    'ga_shareembed_directive'
  ]);
})();
