(function() {
  var mapModule = angular.module('app.map');

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

  }]);
})();
