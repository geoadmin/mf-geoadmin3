(function() {
  goog.provide('ga_measure_directive');

  goog.require('ga_debounce_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_measure_directive', [
    'ga_debounce_service',
    'ga_map_service'
  ]);

  module.filter('measure', function() {
    return function(floatInMeter, type, units) {
       // Type could be: volume, area or distance
       var factor = 1000;
       switch (type) {
         case 'volume': factor = Math.pow(factor, 3);
                        break;
         case 'area': factor = Math.pow(factor, 2);
                      break;
         default: break;
       }
       units = units || [' km', ' m'];
       floatInMeter = floatInMeter || 0;
       var measure = floatInMeter.toFixed(2);
       var km = Math.floor(measure / factor);

       if (km <= 0) {
         if (parseInt(measure) == 0) {
           measure = 0;
         }
         return measure + units[1];
       }

       var str = '' + km;
       var m = Math.floor(Math.floor(measure) % factor * 100 / factor);

       if (m > 0) {
         str += '.';
         if (m < 10) {
           str += '0';
         }
         str += m;
       }
       str += ' ' + units[0];
       return str;
    };
  });

  module.directive('gaMeasure',
    function($rootScope, $document, gaDebounce, gaDefinePropertiesForLayer) {
      return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
          return 'components/measure/partials/measure.html';
        },
        scope: {
          map: '=gaMeasureMap',
          options: '=gaMeasureOptions',
          isActive: '=gaMeasureActive'
        },
        link: function(scope, elt, attrs, controller) {
          var bodyEl = angular.element($document[0].body);
          var isClick = false;
          var isSnapOnFirstPoint = false;
          var sketchFeatArea, sketchFeatDistance, sketchFeatAzimuth;
          var deregister, deregisterFeature;
          var styleFunction = scope.options.styleFunction;

          var layer = new ol.layer.Vector({
            type: 'MEASURE',
            label: 'measure',
            source: new ol.source.Vector(),
            styleFunction: scope.options.styleFunction
          });
          gaDefinePropertiesForLayer(layer);
          layer.highlight = true;

          // Creates the additional overlay to display azimuth circle
          var featuresOverlay = new ol.FeatureOverlay();
          featuresOverlay.setStyleFunction(scope.options.styleFunction);

          var drawArea = new ol.interaction.Draw({
            type: 'Polygon',
            styleFunction: scope.options.drawStyleFunction
          });

          // Activate the component: add listeners, last features drawn and draw
          // interaction.
          var activate = function() {
            scope.map.addLayer(layer);
            scope.map.addInteraction(drawArea);
            featuresOverlay.setMap(scope.map);


            // Add events
            deregister = [
              drawArea.on('drawstart', function(evt) {

                // Clear the layer
                layer.getSource().clear();

                // Initialisation of the sketchFeatures
                var isSnapOnLastPoint = false;
                sketchFeatArea = evt.feature;
                var firstPoint = sketchFeatArea.getGeometry()
                    .getCoordinates()[0][0];
                sketchFeatDistance = new ol.Feature(
                    new ol.geom.LineString([firstPoint]));
                sketchFeatAzimuth = new ol.Feature(
                    new ol.geom.Circle(firstPoint, 0));
                featuresOverlay.addFeature(sketchFeatAzimuth);

                deregisterFeature = sketchFeatArea.on('change',
                  function(evt) {

                    if (!isClick) {
                      var feature = evt.target; //sketchFeatArea
                      var lineCoords = feature.getGeometry()
                          .getCoordinates()[0];
                      var lastPoint = lineCoords[lineCoords.length - 1];
                      var lastPoint2 = lineCoords[lineCoords.length - 2];

                      isSnapOnFirstPoint = (lastPoint[0] == firstPoint[0] &&
                          lastPoint[1] == firstPoint[1]);

                      isSnapOnLastPoint = (lastPoint[0] == lastPoint2[0] &&
                          lastPoint[1] == lastPoint2[1]);

                      if (isSnapOnLastPoint) {
                        lineCoords.pop();
                      }

                      sketchFeatDistance.getGeometry()
                          .setCoordinates(lineCoords);

                      updateMeasures();

                      if (!isSnapOnFirstPoint) {
                        if (lineCoords.length == 2) {
                          sketchFeatAzimuth.getGeometry()
                              .setRadius(scope.distance);
                        } else if (!isSnapOnLastPoint) {
                          sketchFeatAzimuth.getGeometry().setRadius(0);
                        }
                      }

                    } else {
                      // Update profile on each new point
                      updateProfileDebounced();
                      isClick = false;
                    }
                  }
                );
              }),

              drawArea.on('drawend', function(evt) {
                if (scope.options.isProfileActive) {
                  bodyEl.addClass(scope.options.waitClass);
                }

                // Update the layer
                updateLayer();

                // Clear the additional overlay
                featuresOverlay.getFeatures().clear();

                // Unregister the change event
                sketchFeatArea.unByKey(deregisterFeature);
              }),

              scope.map.on('click', function() {
                isClick = true;
              })
            ];
          };


          // Deactivate the component: remove listeners, features and draw
          // interaction.
          var deactivate = function() {
            featuresOverlay.getFeatures().clear();
            featuresOverlay.setMap(null);
            scope.map.removeInteraction(drawArea);
            scope.map.removeLayer(layer);

            // Remove events
            if (deregister) {
              for (var i = deregister.length - 1; i >= 0; i--) {
                deregister[i].src.unByKey(deregister[i]);
              }
            }
            bodyEl.removeClass(scope.options.waitClass);
          };


          // Add sketch features to the layer
          var updateLayer = function() {
            if (sketchFeatArea) {
              var lineCoords = sketchFeatDistance.getGeometry()
                  .getCoordinates();
              if (lineCoords.length == 2) {
                layer.getSource().addFeature(sketchFeatAzimuth);
              }
              layer.getSource().addFeature(isSnapOnFirstPoint ? sketchFeatArea :
                  sketchFeatDistance);
            }
          };

          // Update value of measures from the sketch features
          var updateMeasures = function() {
            scope.$apply(function() {
              var coords = sketchFeatDistance.getGeometry().getCoordinates();
              scope.distance = sketchFeatDistance.getGeometry().getLength();
              scope.azimuth = calculateAzimuth(coords[0], coords[1]);
              scope.surface = sketchFeatArea.getGeometry().getArea();
            });
          };

          // Calulate the azimuth from 2 points
          var calculateAzimuth = function(pt1, pt2) {
            if (!pt1 || !pt2) {
              return undefined;
            }

            var x = pt2[0] - pt1[0];
            var y = pt2[1] - pt1[1];
            var rad = Math.acos(y / Math.sqrt(x * x + y * y));
            var factor = x > 0 ? 1 : -1;
            return (360 + (factor * rad * 180 / Math.PI)) % 360;
          };

          // Update profile functions
          var updateProfile = function() {
            if (scope.options.isProfileActive &&
                 sketchFeatDistance &&
                 sketchFeatDistance.getGeometry() &&
                 sketchFeatDistance.getGeometry()
                     .getCoordinates().length >= 2) {
              scope.options.drawProfile(sketchFeatDistance);
            } else {
              bodyEl.removeClass(scope.options.waitClass);
            }
          };
          var updateProfileDebounced = gaDebounce.debounce(updateProfile, 500,
              false);


          // Watchers
          scope.$watch('isActive', function(active) {
            $rootScope.isMeasureActive = active;
            if (active) {
              activate();
            } else {
              deactivate();
            }
          });
          scope.$watch('options.isProfileActive', function(active) {
            if (active) {
              bodyEl.addClass(scope.options.waitClass);
              updateProfileDebounced();
            } else {
              bodyEl.removeClass(scope.options.waitClass);
            }
          });

          // Listen Profile directive events
          var sketchFeatPoint = new ol.Feature(new ol.geom.Point([0, 0]));
          $rootScope.$on('gaProfileMapPositionActivate',
            function(event, coords) {
              featuresOverlay.addFeature(sketchFeatPoint);
          });
          $rootScope.$on('gaProfileMapPositionUpdated',
            function(event, coords) {
              sketchFeatPoint.getGeometry().setCoordinates(coords);
          });
          $rootScope.$on('gaProfileMapPositionDeactivate', function(event) {
            featuresOverlay.removeFeature(sketchFeatPoint);
          });
          $rootScope.$on('gaProfileDataLoaded', function(ev, data) {
            bodyEl.removeClass(scope.options.waitClass);
          });
          $rootScope.$on('gaProfileDataUpdated', function(ev, data) {
            bodyEl.removeClass(scope.options.waitClass);
          });

        }
      };
    }
  );
})();
