goog.provide('ga_measure_directive');

goog.require('ga_measure_service');

(function() {

  var module = angular.module('ga_measure_directive', [
    'ga_measure_service'
  ]);

  module.directive('gaMeasure', function(gaMeasure, gaGlobalOptions) {
    return {
      restrict: 'A',
      templateUrl: 'components/measure/partials/measure.html',
      scope: {
        feature: '=gaMeasure',
        precision: '=gaCoordinatePrecision'
      },
      link: function(scope, elt) {
        var deregisterKey;
        var update = function(feature) {
          scope.coord = undefined;
          scope.distance = undefined;
          scope.surface = undefined;
          scope.azimuth = undefined;

          var geom = feature.getGeometry();
          if (geom instanceof ol.geom.Point) {
            scope.coord = gaMeasure.formatCoordinates(geom.getCoordinates(),
                scope.precision);
          } else {
            scope.distance = gaMeasure.getLength(geom);
            scope.surface = gaMeasure.getArea(geom);
            // scope.azimuth = gaMeasure.getAzimuth(geom);
          }
        };
        var useFeature = function(newFeature) {
          if (deregisterKey) {
            ol.Observable.unByKey(deregisterKey);
            deregisterKey = undefined;
          }
          if (newFeature) {
            deregisterKey = newFeature.on('change', function(evt) {
              scope.$applyAsync(function() {
                update(evt.target);
              });
            });
            update(newFeature);
          }
        };
        scope.$watch('feature', useFeature);
      }
    };
  });
})();
