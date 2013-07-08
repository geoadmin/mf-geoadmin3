(function() {
  goog.provide('ga_map_controller');
  goog.require('ga_map_service');

  var module = angular.module('ga_map_controller', [
    'ga_map_service'
  ]);

  module.controller('GaMapController',
      ['$scope', 'gaMap', function($scope, gaMap) {

        // FIXME
        // Directives (other than the map directive) expect to
        // find the map object in their parent's scopes. They
        // should use the gaMap service instead.
        $scope.map = gaMap.map;

      }]);

})();
