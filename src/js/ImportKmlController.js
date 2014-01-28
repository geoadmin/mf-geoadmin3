(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController',
      function($scope) {
         $scope.options = {
           maxFileSize: 20000000, //20mo
           validationServiceUrl: 'http://www.kmlvalidator.org/validate.htm'
         };
  });
})();
