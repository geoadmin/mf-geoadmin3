(function() {
  goog.provide('ga_measure_controller');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_measure_controller', [
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaMeasureController',
      function($scope, $translate, gaGlobalOptions, $http, $rootScope, gaUrlUtils, $document) {
        $scope.options = {
          waitClass: 'ga-measure-wait',
          isProfileActive: false,
          profileUrl: gaGlobalOptions.mapUrl + '/rest/services/profile.json',
          profileOptions: {
              xLabel: 'profile_x_label',
              yLabel: 'profile_y_label',
              margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 60
              },
              width: 600,
              height: 350,
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
            styles['MultiPolygon'] = styles['Polygon'];
            styles['LineString'] = styles['Polygon'];
            styles['MultiLineString'] = styles['LineString'];
             
            styles['Circle'] = [
              new ol.style.Style({
                stroke: stroke
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
            styles['MultiPoint'] = styles['Point'];
            
            return function(feature, resolution) {
                return styles[feature.getGeometry().getType()];
            };
          })()
        };

        $scope.options.drawStyleFunction = (function() {
          return function(feature, resolution) {
            var styles;
            if (feature.getGeometry().getType() === 'Polygon') {
              styles =  [
                new ol.style.Style({
                  fill: new ol.style.Fill({
                    color: [255, 255, 255, 0.4]
                  }),
                  stroke: new ol.style.Stroke({
                    color: [255, 255, 255, 0],
                    width: 0
                  })
                })
              ];
            } else {
              styles = $scope.options.styleFunction(feature, resolution);
            }
            return styles;
          }
        })();
        
        var bodyEl = angular.element($document[0].body);
        var isProfileCreated = false;
        var createProfile = function(feature, callback) {
          var coordinates = feature.getGeometry().getCoordinates();
          var wkt = '{"type":"LineString","coordinates":' +
              angular.toJson(coordinates) + '}'; 
          var template = $scope.options.profileUrl + '?geom=' + wkt +
              '&elevation_models=' +
              $scope.options.profileOptions.elevationModel;
          var http = $http.get(template);
          if (!callback) {
            callback = function(data, status) {
              isProfileCreated = true;
              $rootScope.$broadcast('gaProfileDataLoaded', data);
            };
          }
          http.success(callback);
          http.error(function(data, status) {
            bodyEl.removeClass($scope.options.waitClass);
          });;
        };

        var updateProfile = function(feature) {
          createProfile(feature, function(data, status) {
            $rootScope.$broadcast('gaProfileDataUpdated', data);
          });
        };

       $scope.options.drawProfile = function(feature) {
         if (feature) {
           if (!isProfileCreated) {
             createProfile(feature);
           } else {
             updateProfile(feature);
           }
         }
       }

      });
})();
