goog.provide('ga_catalogtree');

goog.require('ga_catalogitem_directive');
goog.require('ga_catalogtree_directive');
(function() {

  angular.module('ga_catalogtree', [
    'ga_catalogitem_directive',
    'ga_catalogtree_directive'
  ]);
})();
