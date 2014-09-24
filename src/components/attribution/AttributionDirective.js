(function() {
  goog.provide('ga_attribution_directive');

  var module = angular.module('ga_attribution_directive', []);

  module.directive('gaAttribution', function() {
    return {
      restrict: 'A',
      scope: {
        map: '=gaAttributionMap'
      },
      link: function(scope, element, attrs) {
        var control = new ol.control.Attribution({
          label: '',
          target: element[0],
          tipLabel: ''
        });
        scope.map.addControl(control);
      }
    };
  });

})();
