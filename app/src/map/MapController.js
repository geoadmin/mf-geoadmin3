(function() {
  goog.provide('ga_map_controller');

  var module = angular.module('ga_map_controller', []);

  module.controller('GaMapController', ['$scope', function($scope) {

    var swissExtent = [485869.5728, 837076.5648, 76443.1884, 299941.7864];
    var swissProjection = ol.proj.configureProj4jsProjection({
      code: 'EPSG:21781',
      extent: swissExtent
    });

    var resolutions = [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5,
      2.0, 1.0, 0.5, 0.25, 0.1];

    var map = new ol.Map({
      controls: ol.control.defaults({
        attribution: false
      }),
      renderer: ol.RendererHint.CANVAS,
      view: new ol.View2D({
        projection: swissProjection,
        center: ol.extent.getCenter(swissExtent),
        resolution: 500.0,
        resolutions: resolutions
      })
    });

    $scope.map = map;
    $scope.options = {
      resolutions: resolutions
    };

  }]);

})();
