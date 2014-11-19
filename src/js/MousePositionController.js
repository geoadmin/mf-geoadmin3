(function() {
  goog.provide('ga_mouseposition_controller');

  var module = angular.module('ga_mouseposition_controller', [
    'pascalprecht.translate'
  ]);

  module.controller('GaMousePositionController',
      function($scope, $translate, $window) {
        var coordinatesFormat = function(coordinates) {
          return $translate.instant('coordinates_label') + ': ' +
              ol.coordinate.toStringXY(coordinates, 0).
                replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        };

        var coordinatesFormatUTM = function(coordinates, zone) {
          var coord = ol.coordinate.toStringXY(coordinates, 0).
            replace(/\B(?=(\d{3})+(?!\d))/g, "'");
          return coord + ' ' + zone;
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
          value: 'EPSG:4326',
          label: 'UTM',
          format: function(coordinates) {
            if (coordinates[0] < 6 && coordinates [0] >= 0) {
              var utm_31t = ol.proj.transform(coordinates,
                'EPSG:4326', 'EPSG:32631');
              return coordinatesFormatUTM(utm_31t, '(zone 31T)');
            } else if (coordinates[0] < 12 && coordinates [0] >= 6) {
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
