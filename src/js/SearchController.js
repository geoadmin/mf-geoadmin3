goog.provide('ga_search_controller');
(function() {

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController', function($scope, gaGlobalOptions) {

    // Set sr param if possible
    var sr = '?';
    if ($scope.map) {
      // No support for web mercator for the search
      sr += 'sr=2056&';
    }

    $scope.options = {
      searchUrl: gaGlobalOptions.cachedApiUrl +
          '/rest/services/{Topic}/SearchServer' + sr,
      featureUrl: gaGlobalOptions.cachedApiUrl +
          '/rest/services/{Topic}/MapServer/{Layer}/{Feature}' + sr
    };
  });
})();
