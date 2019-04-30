goog.provide('ga_trackbt_directive');

goog.require('ga_geomutils_service');

(function() {

  var module = angular.module('ga_trackbt_directive', [
    'ga_geomutils_service'
  ]);

  module.directive('gaTrackBt', function($rootScope, gaGeomUtils, $window,
      gaStyleFactory, gaMapUtils, $timeout, gaHeight) {
    var time = 540000; // 30sec
    var timeStep = 100; // 100ms
    var pt = new ol.geom.Point([0, 0]);
    var ptFeature = new ol.Feature(pt);
    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [ptFeature]
      }),
      style: gaStyleFactory.getStyle('marker')
    });
    return {
      restrict: 'A',
      templateUrl: 'components/profile/partials/track-bt.html',
      scope: {
        map: '=gaTrackBtMap',
        ol3d: '=gaTrackBtOl3d',
        feature: '=gaTrackBt'
      },
      link: function(scope, element, attrs) {
        scope.isActive = false;
        var canceller;

        var activate = function(feature) {
          var length = feature.getGeometry().getLength();
          var lengthStep = length / (time / timeStep);
          var lengthCurr = 0;

          pt.setCoordinates(feature.getGeometry().getFirstCoordinate());
          ptFeature.set('altitudeMode',
              feature.getGeometry().get('altitudeMode') || 'clampToGround');

          scope.map.addLayer(layer);
          var update = function() {
            lengthCurr += lengthStep;
            if (lengthCurr <= length && scope.isValid(feature)) {
              var neww = feature.getGeometry().getCoordinateAt(lengthCurr /
                  length);
              neww = feature.getGeometry().getClosestPoint(neww);
              if (ptFeature.get('altitudeMode') === 'clampToGround' ||
                    neww.length === 2) {
                gaHeight.get(scope.map, neww).then(function(height) {
                  neww[2] = height;
                  pt.setCoordinates(neww);
                  canceller = $timeout(update, timeStep, false);
                });
              } else {
                pt.setCoordinates(neww);
                canceller = $timeout(update, timeStep, false);
              }
              if (!scope.isActive) {
                $timeout.cancel(canceller);
              }
            } else {
              $timeout.cancel(canceller);
            }
          };

          gaMapUtils.moveTo(scope.map, scope.ol3d, 5, pt.getCoordinates()).
              then(function(coord) {
                if (!coord) {
                  return;
                }
                pt.setCoordinates(coord); // Coord initial with height
                scope.ol3d.trackedFeature = ptFeature;
                canceller = $timeout(update, timeStep, false);
              });
        };

        var deactivate = function() {
          $timeout.cancel(canceller);
          if (scope.ol3d) {
            scope.ol3d.trackedFeature = null;
          }
          scope.map.removeLayer(layer);
        };

        scope.$on('$destroy', function() {
          deactivate();
        });

        scope.toggleTracking = function(feature) {
          // $rootScope.$broadcast('gaTrackActive', feature);
          scope.isActive = !scope.isActive;
          if (scope.isActive) {
            activate(feature);
          } else {
            deactivate();
          }
        };

        scope.isValid = function(feature) {
          var geom = feature.getGeometry();
          geom = gaGeomUtils.multiGeomToSingleGeom(geom);
          return !(geom instanceof ol.geom.Point ||
              geom instanceof ol.geom.MultiLineString ||
              geom instanceof ol.geom.MultiPolygon ||
              geom instanceof ol.geom.MultiPoint ||
              geom instanceof ol.geom.GeometryCollection);
        };
      }
    };
  });
})();
