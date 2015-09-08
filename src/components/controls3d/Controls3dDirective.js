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

        camera.moveEnd.addEventListener(function() {
          var tiltOnGlobe = olcs.core.computeSignedTiltAngleOnGlobe(scene);
          cssRotate(tiltIndicator, -tiltOnGlobe);
          cssRotate(rotateIndicator, -camera.heading);
        });

        scope.tilt = function(angle) {
          angle = Cesium.Math.toRadians(angle);
          var pivot = olcs.core.pickBottomPoint(scene);
          if (pivot) {
            var transform = Cesium.Matrix4.fromTranslation(pivot);
            olcs.core.rotateAroundAxis(camera, -angle, camera.right, transform);
          }
        };

        scope.rotate = function(angle) {
          angle = Cesium.Math.toRadians(angle);
          var bottom = olcs.core.pickBottomPoint(scene);
          if (bottom) {
            olcs.core.setHeadingUsingBottomCenter(scene, angle, bottom);
          }
        };

      }
    };
  });
})();
