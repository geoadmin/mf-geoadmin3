(function() {
  goog.provide('ga_mouseposition_controller');

  var module = angular.module('ga_mouseposition_controller', []);

  module.controller('GaMousePositionController',
      ['$scope', function($scope) {

        $scope.mousePositionProjections = [
          {value: 'EPSG:21781', label: 'CH1903 / LV03'},
          //{value: 'EPSG:2056', label: 'CH1903+ / LV95'},
          {value: 'EPSG:4326', label: 'WGS 84'}
        ];
        $scope.mousePositionProjection =
            $scope.mousePositionProjections[0].value;

      }]);

})();
