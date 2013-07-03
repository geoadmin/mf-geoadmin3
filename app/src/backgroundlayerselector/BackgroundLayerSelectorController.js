(function() {
  goog.provide('ga_backgroundlayerselector_controller');

  var module = angular.module('ga_backgroundlayerselector_controller', []);

  module.controller('GaBackgroundLayerSelectorController',
      ['$scope', function($scope) {

        $scope.options = {
          wmtsUrl: 'WMTSCapabilities.xml',
          wmtsLayers: [
            {label: 'Color Map', value: 'ch.swisstopo.pixelkarte-farbe'},
            {label: 'Aerial Imagery', value: 'ch.swisstopo.swissimage'},
            {label: 'Grey Map', value: 'ch.swisstopo.pixelkarte-grau'}
          ]
        };

      }]);

})();
