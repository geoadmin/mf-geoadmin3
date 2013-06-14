(function() {
  var backgroundLayerSelectorModule = angular.module('ga-backgroundlayerselector');

  backgroundLayerSelectorModule.controller('GaBackgroundLayerSelectorController',
      ['$scope', function($scope) {

    $scope.wmtsUrl = 'http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml';
    $scope.wmtsLayers = [
      {label: 'Color Map', value: 'ch.swisstopo.pixelkarte-farbe'},
      {label: 'Aerial Imagery', value: 'ch.swisstopo.swissimage'},
      {label: 'Grey Map', value: 'ch.swisstopo.pixelkarte-grau'}
    ];

  }]);

})();
