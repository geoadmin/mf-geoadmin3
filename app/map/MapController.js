(function() {
  var mapModule = angular.module('app.map');

  var swissExtent = [485869.5728, 837076.5648, 76443.1884, 299941.7864];
  var swissProjection = ol.proj.configureProj4jsProjection({
    code: 'EPSG:21781',
    extent: swissExtent
  });

  mapModule.filter('coordXY', function() {
    return function(input, precision) {
      if (input) {
        return ol.coordinate.toStringXY(input, precision);
      } else {
        return input;
      }
    };
  });

  mapModule.controller('MapController', ['$scope', function($scope) {

    var map = new ol.Map({
      renderer: ol.RendererHint.CANVAS,
      view: new ol.View2D({
        projection: swissProjection,
        center: ol.extent.getCenter(swissExtent),
        zoom: 2
      })
    });

    $scope.map = map;

    // mouse position
    var transform;
    $scope.$watch('mousePositionProjection', function(code) {
      transform = ol.proj.getTransform(swissProjection, ol.proj.get(code));
    });

    map.on(['mousemove', 'mouseout'], function(event) {
      // see http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
      $scope.$apply(function() {
        if (event.type === 'mouseout') {
          $scope.mousePositionValue = undefined;
        } else {
          $scope.mousePositionValue = transform(event.getCoordinate());
        }
      });
    });

    $scope.mousePositionProjection = swissProjection.getCode();
  }]);
})();
