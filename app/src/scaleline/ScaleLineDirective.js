(function() {
  goog.provide('ga_scaleline_directive');

  var module = angular.module('ga_scaleline_directive', []);

  module.directive('gaScaleLine',
      ['$parse', function($parse) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var map = $parse(attrs.gaScaleLineMap)(scope);
            var control = new ol.control.ScaleLine({
              target: element[0]
            });
            map.addControl(control);
          }
        };
      }]);
})();
