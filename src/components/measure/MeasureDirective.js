(function() {
  goog.provide('ga_measure_directive');

  goog.require('ga_debounce_service');
  goog.require('ga_map_service');
  goog.require('ga_waitcursor_service');

  var module = angular.module('ga_measure_directive', [
    'ga_debounce_service',
    'ga_map_service',
    'ga_waitcursor_service'
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
    function($document, $rootScope, gaDebounce, gaDefinePropertiesForLayer,
        gaLayerFilters, gaWaitCursor) {
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
          var sketchFeatArea, sketchFeatDistance, sketchFeatAzimuth;
          var deregister, deregisterFeature;
          var styleFunction = scope.options.styleFunction;

          var layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: scope.options.styleFunction
          });
          gaDefinePropertiesForLayer(layer);
          layer.displayInLayerManager = false;
          scope.layers = scope.map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.selected;

          // Creates the additional overlay to display azimuth circle
          var featuresOverlay = new ol.FeatureOverlay({
            style: scope.options.styleFunction
          });

          var drawArea = new ol.interaction.Draw({
            type: 'Polygon',
            minPointsPerRing: 2,
            style: scope.options.drawStyleFunction
          });

          // Activate the component: add listeners, last features drawn and draw
          // interaction.
          var activate = function() {
            var isFinishOnFirstPoint;
            scope.map.addLayer(layer);
            scope.map.addInteraction(drawArea);
            featuresOverlay.setMap(scope.map);

            // Add events
            deregister = [
              // Move measure layer  on each changes in the list of layers
              // in the layer manager.
              scope.$watchCollection('layers | filter:layerFilter',
                  moveLayerOnTop),

              drawArea.on('drawstart', function(evt) {
                var nbPoint = 1;
                var isSnapOnLastPoint = false;

                // Clear the layer
                layer.getSource().clear();

                // Initialisation of the sketchFeatures
                sketchFeatArea = evt.feature;
                var firstPoint = sketchFeatArea.getGeometry()
                    .getCoordinates()[0][0];
                sketchFeatDistance = new ol.Feature(
                    new ol.geom.LineString([firstPoint]));
                sketchFeatAzimuth = new ol.Feature(
                    new ol.geom.Circle(firstPoint, 0));
                featuresOverlay.addFeature(sketchFeatAzimuth);

                // Update the profile
                if (scope.options.isProfileActive) {
                  updateProfileDebounced();
                }

                deregisterFeature = sketchFeatArea.on('change',
                  function(evt) {
                    var feature = evt.target; //sketchFeatArea
                    var lineCoords = feature.getGeometry()
                        .getCoordinates()[0];

                    if (nbPoint != lineCoords.length) {
                      // A point is added
                      nbPoint++;

                      // Update the profile
                      if (scope.options.isProfileActive) {
                        updateProfileDebounced();
                      }

                    } else {
                      // We update features and measures
                      var lastPoint = lineCoords[lineCoords.length - 1];
                      var lastPoint2 = lineCoords[lineCoords.length - 2];

                      var isSnapOnFirstPoint = (lastPoint[0] == firstPoint[0] &&
                          lastPoint[1] == firstPoint[1]);

                      // When the last change event is triggered the polygon is
                      // closed so isSnapOnFirstPoint is true. We need to know
                      // if on the change event just before, the snap on last
                      // point was active.
                      isFinishOnFirstPoint = (!isSnapOnLastPoint &&
                          isSnapOnFirstPoint);

                      isSnapOnLastPoint = (lastPoint[0] == lastPoint2[0] &&
                          lastPoint[1] == lastPoint2[1]);

                      if (isSnapOnLastPoint) {
                        // In that case the 2 last points of the coordinates
                        // array are identical, so we remove the useless one.
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
                    }
                  }
                );
              }),

              drawArea.on('drawend', function(evt) {

                if (!isFinishOnFirstPoint) {
                  // The sketchFeatureArea is automatically closed by the draw
                  // interaction even if the user has finished drawing on the
                  // last point. So we remove the useless coordinates.
                  var lineCoords = sketchFeatDistance.getGeometry()
                      .getCoordinates();
                  lineCoords.pop();
                  sketchFeatDistance.getGeometry().setCoordinates(lineCoords);
                }

                // Update the layer
                updateLayer(isFinishOnFirstPoint);

                // Update measures
                updateMeasures();

                // Clear the additional overlay
                featuresOverlay.getFeatures().clear();

                // Unregister the change event
                sketchFeatArea.unByKey(deregisterFeature);

                // Update the profile
                if (scope.options.isProfileActive) {
                  gaWaitCursor.add();
                  updateProfileDebounced();
                }

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
                var elt = deregister[i];
                if (elt instanceof Function) {
                  elt();
                } else {
                  elt.src.unByKey(elt);
                }
              }
            }
            gaWaitCursor.remove();
          };


          // Add sketch features to the layer
          var updateLayer = function(isFinishOnFirstPoint) {
            if (sketchFeatArea) {
              var lineCoords = sketchFeatDistance.getGeometry()
                  .getCoordinates();

              if (lineCoords.length == 2) {
                layer.getSource().addFeature(sketchFeatAzimuth);
              }
              layer.getSource().addFeature(isFinishOnFirstPoint ?
                  sketchFeatArea : sketchFeatDistance);
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
                     .getCoordinates().length >= 1) {
              scope.options.drawProfile(sketchFeatDistance);
            } else {
              gaWaitCursor.remove();
            }
          };
          var updateProfileDebounced = gaDebounce.debounce(updateProfile, 500,
              false);


          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              activate();
            } else {
              deactivate();
            }
          });
          scope.$watch('options.isProfileActive', function(active) {
            if (active) {
              gaWaitCursor.add();
              updateProfileDebounced();
            } else {
              gaWaitCursor.remove();
            }
          });

          // Move the draw layer on top
          var moveLayerOnTop = function() {
            var idx = scope.layers.indexOf(layer);
            if (idx != -1 && idx !== scope.layers.length - 1) {
              scope.map.removeLayer(layer);
              scope.map.addLayer(layer);
            }
          };

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
            gaWaitCursor.remove();
          });
          $rootScope.$on('gaProfileDataUpdated', function(ev, data) {
            gaWaitCursor.remove();
          });

        }
      };
    }
  );
})();
