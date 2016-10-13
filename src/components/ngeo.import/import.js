goog.provide('ngeo.import');

goog.require('ngeo.fileService');
goog.require('ngeo.importDndDirective');
goog.require('ngeo.importLocalDirective');
goog.require('ngeo.importOnlineDirective');
goog.require('ngeo.wmsGetCapDirective');
goog.require('ngeo.wmsGetCapItemDirective');

(function() {

  angular.module('ngeo.import', [
    'ngeo.fileService',
    'ngeo.importDndDirective',
    'ngeo.importLocalDirective',
    'ngeo.importOnlineDirective',
    'ngeo.wmsGetCapDirective',
    'ngeo.wmsGetCapItemDirective'
  ]);
})();
