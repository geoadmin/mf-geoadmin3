(function() {
  var mapModule = angular.module('app.map');

  mapModule.controller('MapController', ['$scope', function($scope) {

   var swissExtent = [485869.5728, 837076.5648, 76443.1884, 299941.7864];
   var swissProjection = ol.proj.configureProj4jsProjection({
     code: 'EPSG:21781',
     extent: swissExtent
   });

    var map = new ol.Map({
      renderer: ol.RendererHint.CANVAS,
      view: new ol.View2D({
        projection: swissProjection,
        center: ol.extent.getCenter(swissExtent),
        zoom: 2
      })
    });

    $scope.map = map;

  }]);

})();
