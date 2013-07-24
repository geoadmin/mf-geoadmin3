(function() {
  goog.provide('ga_contextmenu_controller');

  var module = angular.module('ga_contextmenu_controller', []);

  module.controller('GaContextMenuController',
      ['$scope', 'gaGlobalOptions', function($scope, gaGlobalOptions) {
        $scope.options = {
          heightUrl: gaGlobalOptions.serviceUrl + "/height",
          qrcodeUrl: gaGlobalOptions.serviceUrl + "/qrcodegenerator"
        };

      }]);

})();
