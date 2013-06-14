(function() {
  goog.provide('ga_mouseposition_filter');

  var module = angular.module('ga_mouseposition_filter', []);

  module.filter('coordXY', function() {
    return function(input, precision) {
      if (input) {
        return ol.coordinate.toStringXY(input, precision);
      } else {
        return input;
      }
    };
  });

})();

