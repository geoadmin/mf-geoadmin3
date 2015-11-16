goog.provide('ga_controls3d_directive');

goog.require('fps');
goog.require('ga_map_service');
(function() {

  var cssRotate = function(element, angle) {
    var value = 'rotate(' + angle + 'rad)';
    element.css({
      '-ms-transform': value,
      '-webkit-transform': value,
      'transform': value
    });
  };

  var module = angular.module('ga_controls3d_directive', [
    'ga_map_service'
  ]);

  module.directive('gaControls3d', function(gaMapUtils) {
    return {
      restrict: 'A',
      templateUrl: 'components/controls3d/partials/controls3d.html',
      scope: {
        pegman: '=gaControls3dPegman',
        ol3d: '=gaControls3dOl3d'
      },
      link: function(scope, element, attrs) {

        var ol3d = scope.ol3d;
        var scene = ol3d.getCesiumScene();
        var camera = scene.camera;
        scope.fps = new FPS(scene, scope);

        var tiltIndicator = element.find('.ga-tilt .ga-indicator');
        var rotateIndicator = element.find('.ga-rotate .ga-indicator');

        var moving = false;

        camera.moveStart.addEventListener(function() {
          moving = true;
        });
        camera.moveEnd.addEventListener(function() {
          moving = false;
        });

        scene.postRender.addEventListener(function() {
          if (moving) {
            var tiltOnGlobe = olcs.core.computeSignedTiltAngleOnGlobe(scene);
            cssRotate(tiltIndicator, -tiltOnGlobe - Cesium.Math.PI_OVER_TWO);
            cssRotate(rotateIndicator, -camera.heading);
          }
        });

        scope.startDraggingPegman = function() {
          if (!scope.fps.active) {
            var body = $(document.body);
            var canvas = angular.element(scene.canvas);
            body.addClass('ga-pegman-dragging');
            canvas.off('mouseup.pegman');
            canvas.one('mouseup.pegman', function(event) {
              var pixel = new Cesium.Cartesian2(event.clientX, event.clientY);
              var cartesian = olcs.core.pickOnTerrainOrEllipsoid(scene, pixel);
              scope.fps.setActive(true, cartesian);
              body.removeClass('ga-pegman-dragging');
            });
          }
        };

        scope.tilt = function(angle) {
          angle = Cesium.Math.toRadians(angle);
          var finalAngle = camera.pitch + angle;
          if (finalAngle > 0 || finalAngle < -Cesium.Math.PI_OVER_TWO) {
            return;
          }
          gaMapUtils.animatePitch(scene, -angle, 100);
        };

        scope.resetTilt = function() {
          // reset the tilt to 50 degrees
          var angle = -camera.pitch - Cesium.Math.toRadians(50);
          scope.tilt(Cesium.Math.toDegrees(angle));
        };

        scope.rotate = function(angle) {
          angle = Cesium.Math.toRadians(angle);
          var bottom = olcs.core.pickBottomPoint(scene);
          if (bottom) {
            olcs.core.setHeadingUsingBottomCenter(scene, angle, bottom, {
              duration: 100
            });
          }
        };

        scope.resetRotation = function() {
          gaMapUtils.resetMapToNorth(undefined, scope.ol3d);
        };

      }
    };
  });
})();
