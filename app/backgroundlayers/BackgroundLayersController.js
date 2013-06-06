(function() {
  var backgroundLayersModule = angular.module('app.backgroundlayers');

  backgroundLayersModule.controller('BackgroundLayersController',
      ['$scope', '$http', function($scope, $http) {

    $scope.backgroundLayers = [
      {label: 'Color Map', value: 'ch.swisstopo.pixelkarte-farbe'},
      {label: 'Aerial Imagery', value: 'ch.swisstopo.swissimage'},
      {label: 'Grey Map', value: 'ch.swisstopo.pixelkarte-grau'}
    ];
    $scope.currentBackgroundLayer = $scope.backgroundLayers[1].value;

    var backgroundLayers = [];

    var http = $http.get('http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml');
    http.success(function(data, status, header, config) {
      var parser = new ol.parser.ogc.WMTSCapabilities();
      var capabilities = parser.read(data);
      var i, ii = $scope.backgroundLayers.length;
      for (i = 0; i < ii; ++i) {
        var wmtsSourceOptions = ol.source.WMTS.optionsFromCapabilities(
            capabilities, $scope.backgroundLayers[i].value);
        var wmtsSource = new ol.source.WMTS(wmtsSourceOptions);
        var wmtsLayer = new ol.layer.TileLayer({source: wmtsSource});
        backgroundLayers.push(wmtsLayer);
        if ($scope.currentBackgroundLayer === $scope.backgroundLayers[i].value) {
          $scope.map.addLayer(wmtsLayer);
        }
      }
    });

    $scope.$watch('currentBackgroundLayer', function(newVal, oldVal) {
      if (oldVal !== newVal) {
        var i, ii = $scope.backgroundLayers.length;
        for (i = 0; i < ii; ++i) {
          if ($scope.backgroundLayers[i].value === newVal) {
            break;
          }
        }
        if (i < $scope.backgroundLayers.length) {
          $scope.map.getLayers().setAt(0, backgroundLayers[i]);
        }
      }
    });

  }]);

})();
