goog.provide('ga_mouseposition_controller');

goog.require('ga_measure_service');

(function() {

  var module = angular.module('ga_mouseposition_controller', [
    'ga_measure_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaMousePositionController',
      function($scope, $translate, $window, gaMeasure) {
        var coordinatesFormat = function(coordinates) {
          return $translate.instant('coordinates_label') + ': ' +
              gaMeasure.formatCoordinates(coordinates);
        };

        var coordinatesFormatUTM = function(coordinates, zone) {
          return gaMeasure.formatCoordinates(coordinates) + ' ' + zone;
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
                ' (' + ol.coordinate.format(coordinates, '{y}, {x}', 5) + ')';
          }
        }, {
          value: 'EPSG:4326',
          label: 'UTM',
          format: function(coordinates) {
            if (coordinates[0] < 6 && coordinates[0] >= 0) {
              var utm_31t = ol.proj.transform(coordinates,
                'EPSG:4326', 'EPSG:32631');
              return coordinatesFormatUTM(utm_31t, '(zone 31T)');
            } else if (coordinates[0] < 12 && coordinates[0] >= 6) {
              var utm_32t = ol.proj.transform(coordinates,
                'EPSG:4326', 'EPSG:32632');
              return coordinatesFormatUTM(utm_32t, '(zone 32T)');
            } else {
              return '-';
            }
          }
        }, {
          value: 'EPSG:4326',
          label: 'MGRS',
          format: function(coordinates) {
            coordinates['lon'] = coordinates[0];
            coordinates['lat'] = coordinates[1];
            return $window.proj4.mgrs.forward(coordinates).
                replace(/(.{5})/g, '$1 ');
          }
        }
        ];

        $scope.options = {
          projection: $scope.mousePositionProjections[0]
        };

      });

})();
