(function() {
  goog.provide('ga_rotate_directive');

  var module = angular.module('ga_rotate_directive', []);

  module.directive('gaRotate', function() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        map: '=gaRotateMap'
      },
      template: '<button ng-class="stateClass"></button>',
      link: function(scope, element, attrs) {
        var map = scope.map;
        var view = map.getView();

        var setButtonRotation = function(rotation) {
          if (rotation != scope.rotation) {
            scope.$apply(function() {
              scope.stateClass = (rotation == 0) ? '' : 'ga-rotate-enabled';
            });
          }
          var rotateString = 'rotate(' + rotation + 'deg)';
          element.css({
            'transform': rotateString,
            '-ms-transform': rotateString,
            '-webkit-transform': rotateString
          });
        };

        // Button is rotated according to map rotation
        view.on('change:rotation', function(evt) {
          setButtonRotation(evt.target.getRotation() * 180 / Math.PI);
        });

        // Button event - map rotation is animated
        element.bind('click', function(e) {
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
