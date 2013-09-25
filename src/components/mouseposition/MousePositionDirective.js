(function() {
  goog.provide('ga_mouseposition_directive');

  var module = angular.module('ga_mouseposition_directive', []);

  module.directive('gaMousePosition', function() {
    return {
      restrict: 'A',
      scope: {
        map: '=gaMousePositionMap',
        options: '=gaMousePositionOptions'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;

        var control = new ol.control.MousePosition({
          target: element[0],
          undefinedHTML: '&nbsp;'
        });
        map.addControl(control);

        scope.$watch('options.projection', function(projection) {
          control.setProjection(ol.proj.get(projection.value));
          control.setCoordinateFormat(projection.format);
        });
      }
    };
  });
})();
