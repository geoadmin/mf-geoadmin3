(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController',
      ['$scope', 
       function($scope, $http, $log, $translate, gaGlobalOptions, gaBrowserSniffer) {
         $scope.options = {
           proxyUrl: 'ogcproxy?url=',
           validationServiceUrl: 'http://www.kmlvalidator.org/validate.htm'
         };
  }]);


})();
