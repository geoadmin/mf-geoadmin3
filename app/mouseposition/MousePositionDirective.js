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
              target: element[0],
              undefinedHTML: '&nbsp;'
            });
            map.addControl(control);

            scope.$watch(mousePositionProjectionFunction, function(projection) {
              control.setProjection(ol.proj.get(projection.value));
              control.setCoordinateFormat(projection.format);
            });
          }
        };
      }]);
})();


