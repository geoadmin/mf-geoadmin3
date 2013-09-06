(function() {
  goog.provide('ga_contextpopup_controller');

  var module = angular.module('ga_contextpopup_controller', []);

  module.controller('GaContextPopupController',
      function($scope, gaGlobalOptions) {
        $scope.options = {
          heightUrl: gaGlobalOptions.serviceUrl + "/rest/services/height",
          qrcodeUrl: gaGlobalOptions.serviceUrl + "/qrcodegenerator"
        };

      });

})();
