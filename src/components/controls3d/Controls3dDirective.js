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
        ol3d: '=gaControls3dOl3d'
      },
      link: function(scope, element, attrs) {

        var ol3d = scope.ol3d;
        var scene = ol3d.getCesiumScene();
        var camera = scene.camera;
        var fps = new FPS(scene, scope);

        var tiltIndicator = element.find('.ga-tilt .ga-indicator');
        var rotateIndicator = element.find('.ga-rotate .ga-indicator');

        var moving = false;

        scope.isPegmanActive = false;

        scope.isFlyModeActive = false;

        scope.isJetModeActive = false;

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

        scope.$watch(function() {
          return fps.getActive();
        }, function(active) {
          scope.isPegmanActive = active;
        });

        scope.$watch(function() {
          return fps.getFlyMode();
        }, function(flyMode) {
          scope.isFlyModeActive = flyMode;
        });

        scope.$watch(function() {
          return fps.getJetMode();
        }, function(jetMode) {
          scope.isJetModeActive = jetMode;
        });

        scope.togglePegmanMode = function() {
          if (fps.getActive()) {
            if (fps.getFlyMode()) {
              // flyMode -> off
              fps.setActive(false);
            } else {
              // fpsMode -> flyMode
              fps.setFlyMode(true);
            }
          } else {
            // off -> fpsMode
            fps.setActive(true);
          }
        };

        scope.tilt = function(angle) {
          angle = Cesium.Math.toRadians(angle);
          var finalAngle = camera.pitch + angle;
          if (finalAngle > 0 || finalAngle < -Cesium.Math.PI_OVER_TWO) {
            return;
          }
          var bottom = olcs.core.pickBottomPoint(scene);
          if (bottom) {
            var transform = Cesium.Matrix4.fromTranslation(bottom);
            olcs.core.rotateAroundAxis(
                camera, -angle, camera.right, transform, {
                  duration: 100
                });
          }
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
