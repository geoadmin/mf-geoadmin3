(function() {
  goog.provide('ga_mouseposition_controller');

  var module = angular.module('ga_mouseposition_controller', [
    'pascalprecht.translate'
  ]);

  module.controller('GaMousePositionController',
      function($scope, $translate) {
        var coordinatesFormat = function(coordinates) {
          return $translate('coordinates_label') + ': ' +
              ol.coordinate.toStringXY(coordinates, 0).
                replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        };

        var coordinatesFormatUTM = function(coordinates) {
          return ol.coordinate.toStringXY(coordinates, 0).
              replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        };

        $scope.mousePositionProjections = [{
          value: 'EPSG:2056',
          label: 'CH1903+ / LV95',
          format: coordinatesFormat
        }, {
          value: 'EPSG:21781',
          label: 'CH1903 / LV03',
          format: coordinatesFormat
        }, {
          value: 'EPSG:4326',
          label: 'WGS 84 (lat/lon)',
          format: function(coordinates) {
            return ol.coordinate.toStringHDMS(coordinates) +
                ' (' + ol.coordinate.toStringXY(coordinates, 5) + ')';
          }
        }, {
          value: 'EPSG:32632',
          label: 'UTM zone 32N',
          format: coordinatesFormatUTM
        }, {
          value: 'EPSG:4326',
          label: 'MGRS',
          format: function(coordinates) {
            coordinates['lon'] = coordinates[0];
            coordinates['lat'] = coordinates[1];
            return window.Proj4js.util.MGRS.forward(coordinates);
          }
        }
        ];

        $scope.options = {
          projection: $scope.mousePositionProjections[0]
        };

      });

})();
