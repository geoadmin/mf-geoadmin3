(function() {
  goog.provide('ga_seo_controller');

  var module = angular.module('ga_seo_controller', []);

  module.controller('GaSeoController',
      function($scope, gaGlobalOptions) {

        $scope.options = {
          htmlUrlTemplate: gaGlobalOptions.cachedApiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup',
          searchUrl: gaGlobalOptions.apiUrl + '/rest/services/ech/SearchServer',
          identifyUrl: gaGlobalOptions.apiUrl + '/rest/services/all/MapServer/identify'
        };

      });

})();
