goog.provide('ga_controls3d_directive');

(function() {

  var cssRotate = function(element, angle) {
    var value = 'rotate(' + angle + 'rad)';
    element.css({
      '-ms-transform': value,
      '-webkit-transform': value,
      'transform': value
    });
  };

  var module = angular.module('ga_controls3d_directive', []);

  module.directive('gaControls3d', function() {
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
            cssRotate(tiltIndicator, -tiltOnGlobe);
            cssRotate(rotateIndicator, -camera.heading);
          }
        });

        scope.tilt = function(angle) {
          angle = Cesium.Math.toRadians(angle);
          var bottom = olcs.core.pickBottomPoint(scene);
          if (bottom) {
            var transform = Cesium.Matrix4.fromTranslation(bottom);
            olcs.core.rotateAroundAxis(camera, -angle, camera.right, transform);
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
            olcs.core.setHeadingUsingBottomCenter(scene, angle, bottom);
          }
        };

        scope.resetRotation = function() {
          var angle = -camera.heading;
          while (angle < -Math.PI) {
            angle += Cesium.Math.TWO_PI;
          }
          while (angle > Math.PI) {
            angle -= Cesium.Math.TWO_PI;
          }
          scope.rotate(Cesium.Math.toDegrees(angle));
        };

      }
    };
  });
})();
