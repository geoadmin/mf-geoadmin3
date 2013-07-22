(function() {
  goog.provide('ga_permalinkpanel_controller');

  var module = angular.module('ga_permalinkpanel_controller', []);

  module.controller('GaPermalinkPanelController',
      ['$scope', 'gaGlobalOptions', function($scope, gaGlobalOptions) {
        $scope.options = {
          shortenUrl: gaGlobalOptions.serviceUrl
              + '/shorten.json?cb=JSON_CALLBACK'
        };
      }]);

})();
