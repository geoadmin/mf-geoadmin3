(function() {
  var module = angular.module('ga-mouseposition-filter', []);

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

