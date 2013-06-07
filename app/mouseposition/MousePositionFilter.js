(function() {
  var mousePositionModule = angular.module('app.mouseposition');

  mousePositionModule.filter('coordXY', function() {
    return function(input, precision) {
      if (input) {
        return ol.coordinate.toStringXY(input, precision);
      } else {
        return input;
      }
    };
  });

})();

