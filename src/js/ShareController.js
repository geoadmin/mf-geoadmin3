(function() {
  goog.provide('ga_share_controller');

  var module = angular.module('ga_share_controller', []);

  module.controller('GaShareController',
      function($scope, gaGlobalOptions) {
        $scope.options = {
          shortenUrl: gaGlobalOptions.apiUrl
              + '/shorten.json',
          qrcodegeneratorPath: gaGlobalOptions.apiUrl
              + '/qrcodegenerator'
        };
      });

})();
