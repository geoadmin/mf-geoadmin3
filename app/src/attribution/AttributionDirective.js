(function() {
  goog.provide('ga_attribution_directive');

  var module = angular.module('ga_attribution_directive', []);

  module.directive('gaAttribution',
      ['$parse', function($parse) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var map = $parse(attrs.gaAttributionMap)(scope);
            var control = new ol.control.Attribution({
              target: element[0]
            });
            map.addControl(control);
          }
        };
      }]);
})();
