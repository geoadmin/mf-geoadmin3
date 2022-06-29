goog.provide('ga_contextpopup_controller');

(function() {

  var module = angular.module('ga_contextpopup_controller', []);

  module.controller('GaContextPopupController', function($scope,
      gaGlobalOptions) {
    $scope.options = {
      qrcodeUrl: gaGlobalOptions.qrcodeUrl + gaGlobalOptions.qrcodePath
    };
  });
})();
