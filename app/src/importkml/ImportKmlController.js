(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController', ['$scope', gaGlobalOptions, function($scope) {
    
    $scope.file = null;
    $scope.fileUrl = null;
    $scope.fileContent = null;
    $scope.options = {
        serviceUrl: gaGlobalOptions.serviceUrl;
    }
    /*$scope.setFile= function(inputFile) {
        
         $scope.$apply(function($scope) {
             $scope.file = inputFile.files[0];
             $scope.fileName = $scope.file.name;
             $scope.upload.userMessage = "Upload succeed (Controller way)";
        });
    };*/

  }]);
})();
