(function() {
  goog.provide('ga_rotate_directive');

  goog.require('ga_permalink');
  goog.require('ga_styles_service');

  var module = angular.module('ga_rotate_directive', [
    'ga_permalink',
    'ga_styles_service'
  ]);

  module.directive('gaRotate', function($rootScope, $parse, $window,
      gaPermalink, gaStyleFactory) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaRotateMap'
      },
      templateUrl: 'components/rotate/partials/rotate.html',
      link: function(scope, element, attrs) {
        var btnElt = $(element.children()[0]);
        var map = scope.map;
        var view = map.getView().getView2D();
        var defaultTop = element.position().top;

        // Height needs to be set to 0 in order to avoid that the element
        // can be accessed when opacity is 0 (on hover, for example)
        var resetHeight = function(elt) {
            if (elt['style']['opacity'] == 0) {
              $(elt).css('height', '0px');
            }
        };

        btnElt[0].addEventListener('webkitTransitionEnd', function(event) {
            resetHeight(event['srcElement'] || event['target']);
          },
          false);

        btnElt[0].addEventListener('transitionend', function(event) {
            resetHeight(event['srcElement'] || event['target']);
          },
          false);

        var setButtonRotation = function(rotation) {
          var rotateString = 'rotate(' + rotation + 'deg)';
          if (rotation == 0) {
            btnElt[0]['style']['opacity'] = '0';
          } else {
            $(btnElt[0]).css('height', '44px');
            btnElt[0]['style']['opacity'] = '1';
          }
          btnElt[0]['style']['-webkit-transform'] =
            rotateString;
          btnElt[0]['style']['-moz-transform'] =
            rotateString;
          btnElt[0]['style']['-ms-transform'] =
            rotateString;
          btnElt[0]['style']['transform'] =
            rotateString;
        };

        // Button is rotated according to map rotation
        map.on('postrender', function(mapEvent) {
          var frameState = mapEvent.frameState;
          if (frameState && frameState.view2DState) {
            var rotation = frameState.view2DState.rotation;
            setButtonRotation(rotation * 180 / Math.PI);
          }
        });

        // Button event - map rotation is animated
        btnElt.bind('click', function(e) {
          e.preventDefault();
          map.beforeRender(ol.animation.rotate({
            rotation: view.getRotation(),
            duration: 1000,
            easing: ol.easing.easeOut
          }));
          view.setRotation(0);
        });
      }
    };
  });
})();
