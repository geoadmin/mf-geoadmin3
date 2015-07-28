goog.provide('ga_search_controller');
(function() {

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController',
      function($scope, gaGlobalOptions) {
        $scope.options = {
          searchUrl: gaGlobalOptions.cachedApiUrl +
              '/rest/services/{Topic}/SearchServer?',
          featureUrl: gaGlobalOptions.cachedApiUrl +
              '/rest/services/{Topic}/MapServer/{Layer}/{Feature}'
        };
      });
})();

