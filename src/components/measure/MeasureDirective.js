goog.provide('ga_measure_directive');

goog.require('ga_debounce_service');
goog.require('ga_export_kml_service');
goog.require('ga_map_service');
goog.require('ga_measure_service');
(function() {

  var module = angular.module('ga_measure_directive', [
    'ga_debounce_service',
    'ga_export_kml_service',
    'ga_map_service',
    'ga_measure_service'
  ]);

  module.directive('gaMeasureInfos', function(gaDebounce, gaMeasure) {
    return {
      restrict: 'A',
      templateUrl: 'components/measure/partials/measure-infos.html',
      scope: {
        feature: '=gaMeasureInfos',
        options: '=gaMeasureInfosOptions'
      },
      link: function(scope, elt) {
        scope.options = scope.options || {};
        var deregisterKey;
        var update = function(feature) {
          var geom = feature.getGeometry();
          if (!(geom instanceof ol.geom.LineString) &&
              !(geom instanceof ol.geom.Polygon)) {
            return;
          }
          scope.distance = gaMeasure.getLength(geom);
          scope.surface = gaMeasure.getArea(geom,
              scope.options.showLineStringArea);
          scope.azimuth = gaMeasure.getAzimuth(geom);
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
            newFeature.changed();
          }
        };
        scope.$watch('feature', useFeature);
      }
    };
  });
})();
