(function() {
  goog.provide('ga_measure_controller');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_measure_controller', [
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaMeasureController',
      function($scope, $translate, gaGlobalOptions, $http, $rootScope, gaUrlUtils) {
        $scope.options = {
          isProfileActive: false,
          //profileUrl: gaGlobalOptions.baseUrlPath + '/profile.json',
          profileUrl: "https://api3.geo.admin.ch/rest/services/profile.json",
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
              height: 350
          },
          styleFunction: (function() {
            var styles = {};
            styles['Polygon'] = [
              new ol.style.Style({
                fill: new ol.style.Fill({
                  color: [255, 0, 0, 0.4]
                }),
                stroke: new ol.style.Stroke({
                  color: [255, 0, 0, 1],
                  width: 2
                })
              })
            ];
            styles['MultiPolygon'] = styles['Polygon'];

            styles['LineString'] = [
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: [255, 0, 0, 0.7],
                  width: 3,
                  lineCap: 'dash'
                })
              })
            ];
            styles['MultiLineString'] = styles['LineString'];

            styles['Point'] = [
              new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 4,
                  fill: new ol.style.Fill({
                    color: [255, 0, 0, 0.4]
                  }),
                  stroke: new ol.style.Stroke({
                    color: [255, 0, 0, 1],
                    width: 1
                  })
                })
              })
            ];
            styles['MultiPoint'] = styles['Point'];

            return function(feature, resolution) {
                return styles[feature.getGeometry().getType()];
            };
          })()
        };

        var isProfileCreated = false;
        //http/api3.geo.admin.ch/rest/services/profile.json?geom=
        //{“type”%3A”LineString”%2C”coordinates”%3A[[550050%2C20
        //6550]%2C[556950%2C204150]%2C[561050%2C207950]]};
        var createProfile = function(feature, callback) {
          var coordinates = feature.getGeometry().getCoordinates();
          var wkt = '{"type":"LineString","coordinates":' + angular.toJson(coordinates) + '}'; 
          var template = $scope.options.profileUrl + '?geom=' + wkt;
          var http = $http.get(template);
          if (!callback) {
            callback = function(data, status) {
              isProfileCreated = true;
              $rootScope.$broadcast('gaProfileDataLoaded', data);
            };
          }
          http.success(callback); 
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
