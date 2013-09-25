(function() {
  goog.provide('ga_mouseposition_controller');

  var module = angular.module('ga_mouseposition_controller', [
    'pascalprecht.translate'
  ]);

  module.controller('GaMousePositionController',
      function($scope, $translate) {
        var coordinatesFormat = function(coordinates) {
          return $translate('coordinates_label') + ': ' +
              ol.coordinate.toStringXY(coordinates, 0);
        };

        $scope.mousePositionProjections = [{
          value: 'EPSG:21781',
          label: 'CH1903 / LV03',
          format: coordinatesFormat
        }, {
          value: 'EPSG:2056',
          label: 'CH1903+ / LV95',
          format: coordinatesFormat
        }, {
          value: 'EPSG:4326',
          label: 'WGS 84 (long/lat)',
          format: function(coordinates) {
            return ol.coordinate.toStringHDMS(coordinates) +
                ' (' + ol.coordinate.toStringXY(coordinates, 5) + ')';
          }
        }
        ];

        $scope.options = {
          projection: $scope.mousePositionProjections[0]
        };

      });

})();
