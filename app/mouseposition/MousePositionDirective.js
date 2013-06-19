(function() {
  goog.provide('ga_mouseposition_directive');

  var module = angular.module('ga_mouseposition_directive', []);

  module.directive('gaMousePosition',
      ['$parse', function($parse) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var map = $parse(attrs.gaMousePositionMap)(scope);
            var mousePositionProjectionFunction =
                $parse(attrs.gaMousePositionProjection);
            var mousePositionProjection =
                mousePositionProjectionFunction(scope);

            var control = new ol.control.MousePosition({
              coordinateFormat: ol.coordinate.createStringXY(2),
              projection: mousePositionProjection,
              target: element[0],
              undefinedHTML: '&nbsp;'
            });
            control.setMap(map);

            scope.$watch(mousePositionProjectionFunction, function(value) {
              control.setProjection(value);
            });
          }
        };
      }]);
})();


