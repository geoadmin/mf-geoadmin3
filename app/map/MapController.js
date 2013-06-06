(function() {
  var mapModule = angular.module('app.map');

  mapModule.filter('coordXY', function() {
    return function(input, precision) {
      return ol.coordinate.toStringXY(input, precision);
    }
  });

  mapModule.controller('MapController', ['$scope', function($scope) {

    var map = new ol.Map({
      layers: [
        new ol.layer.TileLayer({
          source: new ol.source.Stamen({
            layer: 'watercolor'
          })
        }),
        new ol.layer.TileLayer({
          source: new ol.source.Stamen({
            layer: 'terrain-labels'
          })
        })
      ],
      view: new ol.View2D({
        center: [0, 0],
        zoom: 2
      })
    });

    $scope.map = map;

    // mouse position:
    var mapProjection = map.getView().getProjection();
    var transform;
    $scope.$watch('mousePositionProjection', function(code) {
      transform = ol.proj.getTransform(mapProjection, ol.proj.get(code))
    });

    map.on('mousemove', function(event) {
      // see http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
      $scope.$apply(function() {
        $scope.mousePositionValue = transform(event.getCoordinate());
      });
    });

    $scope.mousePositionProjection = mapProjection.getCode();
  }]);
})();
