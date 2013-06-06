mapModule.directive('appMap', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var map = $parse(attrs.appMap)(scope);
      map.setTarget(element[0]);
    }
  };
}]);


