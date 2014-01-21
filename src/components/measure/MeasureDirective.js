(function() {
  goog.provide('ga_measure_directive');

  goog.require('ga_debounce_service');

  var module = angular.module('ga_measure_directive', [
    'ga_debounce_service'
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
       units = units || ['km', 'm'];
       floatInMeter = floatInMeter || 0;
       var measure = floatInMeter.toFixed(2);
       var km = Math.floor(measure / factor);

       if (km < 0) {
         return measure + '' + units[1];
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
    function($rootScope, gaDebounce) {
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
          var isDblClick = false;
          var sketchFeatDistance, sketchFeatArea;
          var deregister, deregisterMap, deregisterFeature;
          var styleFunction = scope.options.styleFunction;
          var drawArea = new ol.interaction.Draw({
            type: 'Polygon',
            styleFunction: scope.options.drawStyleFunction
          });

          var featuresOverlay = new ol.render.FeaturesOverlay();
          featuresOverlay.setStyleFunction(styleFunction);
          featuresOverlay.setMap(scope.map);

          var sketchFeatAzimuth = new ol.Feature(new ol.geom.Circle([0, 0], 0));
          var sketchFeatDistance = new ol.Feature(
              new ol.geom.LineString([[0, 0]]));

          // Activate the component: add listeners, last features drawn and draw
          // interaction.
          var activate = function() {
            updateFeaturesOverlay();
            scope.map.addInteraction(drawArea);

            // Add events
            deregister = [
              drawArea.on('drawstart', function(evt) {
                isDblClick = false;
                featuresOverlay.getFeatures().clear();
                sketchFeatArea = evt.getFeature();

                sketchFeatAzimuth.getGeometry().setCenter(
                    sketchFeatArea.getGeometry().getCoordinates()[0][0]);
                featuresOverlay.addFeature(sketchFeatAzimuth);
                deregisterFeature = sketchFeatArea.on('change',
                  function(evt) {
                    var feature = evt.target; //sketchFeatArea
                    var lineCoords = feature.getGeometry().getCoordinates()[0];
                    sketchFeatDistance.getGeometry().setCoordinates(lineCoords);

                    updateMeasures();

                    if (lineCoords.length == 2) {
                      sketchFeatAzimuth.getGeometry().setRadius(scope.distance);
                    } else {
                      featuresOverlay.removeFeature(sketchFeatAzimuth);
                    }
                  }
                );
              }),

              drawArea.on('drawend', function(evt) {
                // Unregister the change event
                sketchFeatArea.unByKey(deregisterFeature);

                // Remove the last coordinates of the polygon
                var lineCoords = sketchFeatArea.getGeometry()
                    .getCoordinates()[0];
                lineCoords.pop();
                sketchFeatDistance.getGeometry().setCoordinates(lineCoords);

                updateFeaturesOverlay();
              })
            ];

            deregisterMap = [
              scope.map.on('dblclick', function(evt) {
                isDblClick = true;
              }),
              scope.map.on('click', function(evt) {
                if (scope.options.isProfileActive) {
                   updateProfileDebounced();
                }
              })
            ];
          };


          // Deactivate the component: remove listeners, features and draw
          // interaction.
          var deactivate = function() {
            featuresOverlay.getFeatures().clear();
            scope.map.removeInteraction(drawArea);

            // Remove events
            if (deregister) {
              for (var i = deregister.length - 1; i >= 0; i--) {
                drawArea.unByKey(deregister[i]);
              }
            }
            if (deregisterMap) {
              for (var i = deregisterMap.length - 1; i >= 0; i--) {
                scope.map.unByKey(deregisterMap[i]);
              }
            }
          };


          // Add sketch feature to the featuresOverlay if possible
          var updateFeaturesOverlay = function() {
            if (sketchFeatArea) {
              var lineCoords = sketchFeatDistance.getGeometry()
                  .getCoordinates();
              if (lineCoords.length == 2) {
                featuresOverlay.addFeature(sketchFeatAzimuth);
              }
              featuresOverlay.addFeature(isDblClick ? sketchFeatDistance :
                  sketchFeatArea);
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
            var x = pt2[0] - pt1[0];
            var y = pt2[1] - pt1[1];
            var rad = Math.acos(y / Math.sqrt(x * x + y * y));
            var factor = x > 0 ? 1 : -1;
            return Math.round(360 + (factor * rad * 180 / Math.PI)) % 360;
          };

          // Update profile functions
          var updateProfile = function() {
            scope.options.drawProfile(sketchFeatDistance);
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
              updateProfileDebounced();
            }
          });

        }
      };
    }
  );
})();
