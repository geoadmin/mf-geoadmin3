(function() {
  goog.provide('ga_measure_controller');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_measure_controller', [
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);
  module.controller('GaMeasureController',
      function($scope, $translate, $q, $http, $rootScope, $window, $timeout,
          gaBrowserSniffer, gaGlobalOptions, gaUrlUtils, gaPrintService) {
        $scope.options = {
          isProfileActive: false,
          profileOptions: {
              xLabel: 'profile_x_label',
              yLabel: 'profile_y_label',
              margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 60
              },
              height: 188,
              elevationModel: 'COMB'
          },
          styleFunction: (function() {
            var styles = {};

            var stroke = new ol.style.Stroke({
              color: [255, 0, 0, 1],
              width: 3
            });
            
            var strokeDashed = new ol.style.Stroke({
              color: [255, 0, 0, 1],
              width: 3,
              lineDash: [8]
            });
            var fill = new ol.style.Fill({
              color: [255, 0, 0, 0.4]
            })

            styles['Polygon'] = [
              new ol.style.Style({
                fill: fill,
                stroke: strokeDashed
              })
            ];

            styles['LineString'] = [
              new ol.style.Style({
                stroke: strokeDashed
              })
            ];

            styles['Point'] = [
              new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 4,
                  fill: fill,
                  stroke: stroke
                })
              })
            ];

            styles['Circle'] = [
              new ol.style.Style({
                stroke: stroke
              })
            ];
            
            return function(feature, resolution) {
                return styles[feature.getGeometry().getType()];
            };
          })()
        };

        $scope.options.drawStyleFunction = (function() {
          var drawStylePolygon = [new ol.style.Style({
            fill: new ol.style.Fill({
              color: [255, 255, 255, 0.4]
            }),
            stroke: new ol.style.Stroke({
              color: [255, 255, 255, 0],
              width: 0
            })
          })];

          return function(feature, resolution) {
            if (feature.getGeometry().getType() === 'Polygon') {
              return drawStylePolygon;
            } else {
              return $scope.options.styleFunction(feature, resolution);
            }
          }
        })();
        
        // Allow to print dynamic profile from measure popup
        $scope.print = function() {
          var contentEl = $('#measure-popup .ga-popup-content');
          var onLoad = function(printWindow) {
            var profile = $(printWindow.document).find('[ga-profile]');
            // HACK IE, for some obscure reason an A4 page in IE is not
            // 600 pixels width so calculation of the scale is not optimal.
            var b = (gaBrowserSniffer.msie) ? 1000 : 600;
            // Same IE mistery here, a js error occurs using jQuery width() function.
            var a = parseInt(profile.find('svg').attr('width'), 10);
            var scale = b / a;
            profile.css({
              position: 'absolute',
              left: (-(a - a * scale) / 2) + 'px',
              top: '200px',
              transform: 'scale(' + scale + ')'
            });
            printWindow.print();
          }
          $timeout(function() {
            gaPrintService.htmlPrintout(contentEl.clone().html(), undefined, onLoad);
          }, 0, false);
        }; 
      });
})();
