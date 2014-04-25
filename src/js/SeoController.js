(function() {
  goog.provide('ga_seo_controller');

  var module = angular.module('ga_seo_controller', []);

  module.controller('GaSeoController',
      function($scope, gaGlobalOptions) {

        $scope.options = {
          htmlUrlTemplate: gaGlobalOptions.cachedMapUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup'
        };

      });

})();
