(function() {
  goog.provide('ga_rotate_directive');

  var module = angular.module('ga_rotate_directive', []);

  module.directive('gaRotate', function(gaMapUtils) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        map: '=gaRotateMap'
      },
      template: '<button></button>',
      link: function(scope, element, attrs) {
        var map = scope.map;
        var view = map.getView();
        var setButtonRotation = function(rotation) {
          var rotateString = 'rotate(' + rotation + 'deg)';
          element.css({
            'transform': rotateString,
            '-ms-transform': rotateString,
            '-webkit-transform': rotateString
          }).toggleClass('ga-rotate-enabled', !(rotation == 0));
        };

        // Button is rotated according to map rotation
        view.on('change:rotation', function(evt) {
          setButtonRotation(evt.target.getRotation() * 180 / Math.PI);
        });

        // Button event - map rotation is animated
        element.bind('click', function(e) {
          e.preventDefault();
          gaMapUtils.resetMapToNorth(map, view);
        });
      }
    };
  });
})();
