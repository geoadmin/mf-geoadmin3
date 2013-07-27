(function() {
  goog.provide('ga_share_controller');

  var module = angular.module('ga_share_controller', []);

  module.controller('GaShareController',
      ['$scope', 'gaGlobalOptions', function($scope, gaGlobalOptions) {
        $scope.options = {
          shortenUrl: gaGlobalOptions.serviceUrl
              + '/shorten.json'
        };
      }]);

})();
