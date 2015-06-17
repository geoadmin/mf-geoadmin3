goog.provide('ga_importkml_controller');
(function() {

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController', function($scope, gaGlobalOptions) {
    $scope.options = {
      proxyUrl: gaGlobalOptions.ogcproxyUrl
    };
  });
})();
