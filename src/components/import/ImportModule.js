goog.provide('ga_import');

goog.require('ga_import_directive');
goog.require('ga_tabs');
goog.require('gettext');
goog.require('ngeo.import.importModule');

(function() {

  angular.module('ga_import', [
    'ga_import_directive',
    'ga_tabs',
    'gettext',
    'ngeo.import'
  ]);
})();
