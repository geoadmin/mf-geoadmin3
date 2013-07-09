(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController', ['$scope', function($scope) {
    
    $scope.upload = {
        userMessage: "No user message"
    };
  
    $scope.file = null;
    $scope.fileName = "No content";
    
    $scope.setFile= function(inputFile) {
        
         $scope.$apply(function($scope) {
             $scope.file = inputFile.files[0];
             $scope.fileName = $scope.file.name;
             $scope.upload.userMessage = "Upload succeed (Controller way)";
        });
    };
  }]);

})();

