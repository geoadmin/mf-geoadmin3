(function() {
  goog.provide('ga_seo_controller');

  var module = angular.module('ga_seo_controller', []);

  module.controller('GaSeoController',
      function($scope, gaGlobalOptions) {

        $scope.options = {
          htmlUrlTemplate: gaGlobalOptions.cachedMapUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup',
          searchUrl: gaGlobalOptions.mapUrl + '/rest/services/ech/SearchServer',
          identifyUrl: gaGlobalOptions.mapUrl + '/rest/services/all/MapServer/identify'
        };

      });

})();
