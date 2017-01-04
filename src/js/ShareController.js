goog.provide('ga_share_controller');
(function() {

  var module = angular.module('ga_share_controller', []);

  module.controller('GaShareController', function($scope, gaGlobalOptions) {
    $scope.options = {
      qrcodegeneratorPath: gaGlobalOptions.apiUrl + '/qrcodegenerator'
    };
  });
})();
