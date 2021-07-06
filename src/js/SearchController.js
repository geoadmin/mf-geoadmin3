goog.provide('ga_search_controller');
(function() {

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController', function($scope, gaGlobalOptions) {

    // Set sr param if possible
    var sr = '?';
    if ($scope.map) {
      var epsgCode = $scope.map.getView().getProjection().getCode();
      sr += 'sr=' + epsgCode.split(':')[1] + '&';
    }

    $scope.options = {
      searchUrl: gaGlobalOptions.apiUrl +
          '/rest/services/{Topic}/SearchServer' + sr,
      featureUrl: gaGlobalOptions.apiUrl +
          '/rest/services/{Topic}/MapServer/{Layer}/{Feature}' + sr
    };
  });
})();
