(function() {
  goog.provide('ga_rotate_directive');

  goog.require('ga_permalink');
  goog.require('ga_styles_service');

  var module = angular.module('ga_rotate_directive', [
    'ga_permalink',
    'ga_styles_service'
  ]);

  module.directive('gaRotate', function() {
    return {
      restrict: 'A',
      scope: {
        map: '=gaRotateMap'
      },
      template: '<button ng-class="stateClass">' +
          '</button>',
      link: function(scope, element, attrs) {
        var btnElt = $(element.children()[0]);
        var map = scope.map;
        var view = map.getView().getView2D();

        var setButtonRotation = function(rotation) {
          var rotateString = 'rotate(' + rotation + 'deg)';
          scope.$apply(function() {
            scope.stateClass = (rotation == 0) ? '' : 'ga-rotate-enabled';
          });
          btnElt.css('-webkit-transform', rotateString);
          btnElt.css('-moz-transform', rotateString);
          btnElt.css('-ms-transform', rotateString);
          btnElt.css('transform', rotateString);
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
