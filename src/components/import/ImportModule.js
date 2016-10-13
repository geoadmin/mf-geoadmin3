goog.provide('ga_import');

goog.require('ga_import_directive');
goog.require('ga_tabs');
goog.require('ngeo.import');

(function() {

  angular.module('ga_import', [
    'ga_import_directive',
    'ga_tabs',
    'ngeo.import'
  ]);
})();
