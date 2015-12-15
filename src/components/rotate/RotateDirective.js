goog.provide('ga_rotate_directive');

goog.require('ga_map_service');
(function() {

  var module = angular.module('ga_rotate_directive', [
    'ga_map_service'
  ]);

  module.directive('gaRotate', function(gaMapUtils) {
    return {
      restrict: 'A',
      templateUrl: 'components/rotate/partials/rotate.html',
      scope: {
        map: '=gaRotateMap'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;
        var view = map.getView();
        var bt = element.find('button');
        var setButtonRotation = function(rotation) {
          var rotateString = 'rotate(' + rotation + 'deg)';
          bt.css({
            'transform': rotateString,
            '-ms-transform': rotateString,
            '-webkit-transform': rotateString
          });
          element.toggleClass('ga-rotate-enabled', !(rotation == 0));
        };

        // Button is rotated according to map rotation
        view.on('change:rotation', function(evt) {
          setButtonRotation(evt.target.getRotation() * 180 / Math.PI);
        });

        // Button event - map rotation is animated
        bt.on('click', function(e) {
          gaMapUtils.resetMapToNorth(map);
        });
      }
    };
  });
})();
