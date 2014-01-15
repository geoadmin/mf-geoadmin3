(function() {
  goog.provide('ga_measure_directive');

  var module = angular.module('ga_measure_directive', []);

  module.filter('measure', function() {
    return function(floatInMeter, units) {
       floatInMeter = floatInMeter || 0;
       var distance = floatInMeter.toFixed(2);
       var km = Math.floor(distance / 1000);
       var m = (km < 0) ? distance : Math.floor(distance) % 1000;
       return ((km > 0) ? km + '.' + m + ' ' + units[0] : m + ' ' + units[1]);
    };
  });

  module.directive('gaMeasure',
    function($rootScope) {
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
          var sketchFeatDistance, sketchFeatArea;
          var sketchFeatDeregister, deregister;
          var styleFunction = (function() {
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
          })();

          var drawArea = new ol.interaction.Draw({
            type: 'Polygon'
          });

          var featuresOverlay = new ol.render.FeaturesOverlay();
          featuresOverlay.setStyleFunction(styleFunction);
          featuresOverlay.setMap(scope.map);

          var isDblClick = false;
          scope.map.on('dblclick', function(evt) {
            isDblClick = true;
          });

          var activate = function() {
            scope.map.addInteraction(drawArea);

            // Add events
            deregister = [
              drawArea.on('drawstart', function(evt) {
                isDblClick = false;
                featuresOverlay.getFeatures().clear();
                sketchFeatArea = evt.getFeature();
                sketchFeatDeregister = sketchFeatArea.on('change',
                  function(evt) {
                    updateMeasures();
                  }
                );
              }),
              drawArea.on('drawend', function(evt) {
                sketchFeatArea.unByKey(sketchFeatDeregister);
                featuresOverlay.addFeature(isDblClick ? sketchFeatDistance :
                   sketchFeatArea);
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
        }
      };
    }
  );
})();
