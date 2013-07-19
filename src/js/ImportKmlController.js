(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController',
      ['$scope', 'gaGlobalOptions',
       function($scope, gaGlobalOptions) {
         $scope.options = {
           maxFileSize: 20000000, //20mo
           proxyUrl: gaGlobalOptions.baseUrlPath + '/ogcproxy?url=',
           validationServiceUrl: 'http://www.kmlvalidator.org/validate.htm'
         };
  }]);
})();
