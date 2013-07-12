(function() {
  goog.provide('ga_scaleline_directive');

  var module = angular.module('ga_scaleline_directive', []);

  module.directive('gaScaleLine', function() {
    return {
      restrict: 'A',
      scope: {
        map: '=gaScaleLineMap'
      },
      link: function(scope, element, attrs) {
        var control = new ol.control.ScaleLine({
          target: element[0]
        });
        scope.map.addControl(control);
      }
    };
  });
})();
