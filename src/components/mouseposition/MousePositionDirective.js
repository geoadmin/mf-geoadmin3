goog.provide('ga_mouseposition_directive');
goog.require('ga_throttle_service');
(function() {

  var module = angular.module('ga_mouseposition_directive', [
    'ga_throttle_service'
  ]);

  module.directive('gaMousePosition', function(gaThrottle) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaMousePositionMap',
        ol3d: '=gaMousePositionOl3d',
        options: '=gaMousePositionOptions'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;

        var control = new ol.control.MousePosition({
          className: 'ol-mouse-position ga-hidden-3d',
          target: element[0],
          undefinedHTML: '&nbsp;'
        });
        map.addControl(control);

        scope.$watch('options.projection', function(projection) {
          control.setProjection(ol.proj.get(projection.value));
          control.setCoordinateFormat(projection.format);
        });

        scope.$watch('::ol3d', function(ol3d) {
          if (ol3d) {
            var target = document.createElement('div');
            target.classList.add('ga-visible-3d');
            element[0].appendChild(target);

            var scene = ol3d.getCesiumScene();
            var ellipsoid = scene.globe.ellipsoid;
            var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

            handler.setInputAction(gaThrottle.throttle(function(mouvement) {
              if (ol3d.getEnabled()) {
                var position = mouvement.endPosition;
                var cartesian =
                  olcs.core.pickOnTerrainOrEllipsoid(scene, position);
                if (cartesian) {
                  var cartographic =
                    ellipsoid.cartesianToCartographic(cartesian);
                  var formatCoordinate = control.getCoordinateFormat();
                  var coordinate = ol.proj.transform([
                    Cesium.Math.toDegrees(cartographic.longitude),
                    Cesium.Math.toDegrees(cartographic.latitude)
                  ], 'EPSG:4326', control.getProjection());

                  target.innerHTML = formatCoordinate(coordinate);
                } else {
                  target.innerHTML = '&nbsp;';
                }
              }
            }, 100, false, false), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          }
        });

      }
    };
  });
})();
