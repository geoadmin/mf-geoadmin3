goog.provide('ga_controls3d_directive');

goog.require('fps');
goog.require('ga_help_service');
goog.require('ga_maputils_service');

(function() {

  var cssRotate = function(element, angle) {
    var value = 'rotate(' + angle + 'rad)';
    element.css({
      '-ms-transform': value,
      '-webkit-transform': value,
      'transform': value
    });
  };

  var isElementEditable = function(element) {
    var tagName = element.tagName;
    return tagName === 'INPUT' || tagName === 'SELECT' ||
        tagName === 'TEXTAREA';
  };

  var module = angular.module('ga_controls3d_directive', [
    'ga_help_service',
    'ga_maputils_service'
  ]);

  module.directive('gaControls3d', function($document, gaMapUtils, gaHelp) {
    return {
      restrict: 'A',
      templateUrl: 'components/controls3d/partials/controls3d.html',
      scope: {
        ol3d: '=gaControls3dOl3d',
        isFpsActive: '=gaControls3dFpsActive'
      },
      link: function(scope, element, attrs) {
        var ol3d = scope.ol3d;
        if (!ol3d) {
          element.remove();
          return;
        }
        var scene = ol3d.getCesiumScene();
        var camera = scene.camera;
        scope.fps = new FPS(scene, scope);
        var pegman = $('.ga-pegman');
        var tiltIndicator = element.find('.ga-tilt .ga-indicator');
        var rotateIndicator = element.find('.ga-rotate .ga-indicator');
        var moving = false;

        var setTiltDisabled = function(angleDeg) {
          var angle = Cesium.Math.toRadians(Math.abs(angleDeg));
          scope.tiltUpDisabled = camera.pitch + angle >= 0;
          scope.tiltDownDisabled = camera.pitch - angle <=
              -Cesium.Math.PI_OVER_TWO;
        };

        camera.moveStart.addEventListener(function() {
          moving = true;
        });
        camera.moveEnd.addEventListener(function() {
          moving = false;
        });

        scope.onKey = function(event) {
          if (isElementEditable(event.target)) {
            return;
          }

          // If pegman active, we can only open the help
          if (scope.fps.active) {
            if (event.keyCode === 72) {
              gaHelp.open(28);
            }
            return;
          }

          var moveAmount = 200;
          var zoomAmount = 400;
          var lowPitch = camera.pitch < Cesium.Math.toRadians(-30);

          if (event.keyCode === 107) {
            // + key
            camera.moveForward(zoomAmount);
            return;
          } else if (event.keyCode === 109) {
            // - key
            camera.moveBackward(zoomAmount);
            return;
          } else if (event.keyCode === 37) {
            // left key
            if (lowPitch && !event.shiftKey) {
              camera.moveLeft(moveAmount);
            } else {
              scope.rotate(-5);
            }
          } else if (event.keyCode === 39) {
            // right key
            if (lowPitch && !event.shiftKey) {
              camera.moveRight(moveAmount);
            } else {
              scope.rotate(+5);
            }
          }
          if (event.shiftKey) {
            if (event.keyCode === 38) {
              // up key
              scope.tilt(+15);
            } else if (event.keyCode === 40) {
              // down key
              scope.tilt(-15);
            }
            return;
          }
          // Compute the "backward" vector to be used to
          // translate forward and backward
          var up = new Cesium.Cartesian3();
          Cesium.Cartesian3.normalize(camera.position, up);
          var backward = new Cesium.Cartesian3();
          Cesium.Cartesian3.cross(up, camera.right, backward);

          if (event.keyCode === 38) {
            // up key
            camera.move(backward, moveAmount);
          } else if (event.keyCode === 40) {
            // down key
            camera.move(backward, -moveAmount);
          }
        };
        $document.on('keydown', scope.onKey);

        scene.postRender.addEventListener(function() {
          if (moving) {
            var tiltOnGlobe = olcs.core.computeSignedTiltAngleOnGlobe(scene);
            cssRotate(tiltIndicator, -tiltOnGlobe - Cesium.Math.PI_OVER_TWO);
            cssRotate(rotateIndicator, -camera.heading);
            setTiltDisabled(5);
          }
        });

        var startDraggingPegman = function() {
          var body = $($document[0].body);
          var canvas = $(scene.canvas);
          body.addClass('ga-pegman-dragging');
          canvas.off('mouseup.pegman');
          canvas.one('mouseup.pegman', function(event) {
            var pixel = new Cesium.Cartesian2(event.clientX, event.clientY);
            var cartesian = olcs.core.pickOnTerrainOrEllipsoid(scene, pixel);
            scope.fps.setActive(true, cartesian);
            body.removeClass('ga-pegman-dragging');
          });
        };

        scope.tilt = function(angleDeg) {
          setTiltDisabled(angleDeg);
          if ((angleDeg >= 0 && scope.tiltUpDisabled) ||
              (angleDeg < 0 && scope.tiltDownDisabled)) {
            return;
          }
          var angle = Cesium.Math.toRadians(angleDeg);
          var pivot = olcs.core.pickBottomPoint(scene);
          if (pivot) {
            var transform = Cesium.Matrix4.fromTranslation(pivot);
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

        // listen FPS  activation/deactivation
        scope.$watch('fps.active', function(active) {
          scope.isFpsActive = active;
          if (!active) {
            pegman.on('mousedown', startDraggingPegman);
          } else {
            pegman.off('mousedown');
          }
        });

        // Remove html events
        scope.$on('destroy', function() {
          scope.fps.active = false;
          $document.off('keydown', scope.onKey);
        });
      }
    };
  });
})();
