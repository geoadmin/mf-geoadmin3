(function() {
  goog.provide('ga_mouseposition_controller');

  var module = angular.module('ga_mouseposition_controller', []);

  module.controller('GaMousePositionController',
      ['$scope', function($scope) {

        $scope.mousePositionProjections = [{
          value: 'EPSG:21781',
          label: 'CH1903 / LV03',
          format: ol.coordinate.createStringXY(0)
        },
        // {
        //   value: 'EPSG:2056',
        //   label: 'CH1903+ / LV95',
        //   format: ol.coordinate.createStringXY(0)
        // },
        {
          value: 'EPSG:4326',
          label: 'WGS 84',
          format: function(coordinates) {
            return ol.coordinate.toStringHDMS(coordinates) +
                ' (' + ol.coordinate.toStringXY(coordinates, 5) + ')';
          }
        }
        ];

        $scope.options = {
          projection: $scope.mousePositionProjections[0]
        };

      }]);

})();
