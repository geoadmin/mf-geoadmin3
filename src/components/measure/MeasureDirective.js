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
            type: 'Polygon'
          });

          var featuresOverlay = new ol.render.FeaturesOverlay();
          featuresOverlay.setStyleFunction(styleFunction);
          featuresOverlay.setMap(scope.map);

          var activate = function() {
            scope.map.addInteraction(drawArea);

            // Add events
            deregister = [
              drawArea.on('drawstart', function(evt) {
                isDblClick = false;
                featuresOverlay.getFeatures().clear();
                sketchFeatArea = evt.getFeature();
                deregisterFeature = sketchFeatArea.on('change',
                  function(evt) {
                    updateMeasures();
                  }
                );
              }),
              drawArea.on('drawend', function(evt) {
                sketchFeatArea.unByKey(deregisterFeature);
                featuresOverlay.addFeature(isDblClick ? sketchFeatDistance :
                   sketchFeatArea);
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

          var updateMeasures = function() {
            scope.$apply(function() {
              var geom = sketchFeatArea.getGeometry();
              sketchFeatDistance = new ol.Feature(new ol.geom.LineString(
                  geom.getCoordinates()[0]));
              scope.distance = sketchFeatDistance.getGeometry().getLength();
              scope.surface = geom.getArea();
            });
          };


          var updateProfile = function() {
            scope.options.drawProfile(sketchFeatDistance);
          };
          var updateProfileDebounced = gaDebounce.debounce(updateProfile, 500,
              false);


          // Watchers
          scope.$watch('isActive', function(active) {
            $rootScope.isMeasureActive = active;
            scope.distance = 0;
            scope.surface = 0;
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
