goog.provide('ga_vector_feedback_controller');

goog.require('ga_background_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_layers_service');

(function() {
  var module = angular.module('ga_vector_feedback_controller', [
    'ga_browsersniffer_service',
    'ga_background_service',
    'ga_layers_service'
  ]);

  module.controller('GaVectorFeedbackController', function(
      $scope,
      gaGlobalOptions,
      gaBrowserSniffer,
      gaBackground,
      gaLayers
  ) {
    var apiUrl = gaGlobalOptions.apiUrl;
    var mobile = gaBrowserSniffer.mobile;
    var colors = [
      { value: 'lightgray', label: 'Light Gray' },
      { value: '#acc864', label: 'Light Green' },
      { value: '#3a8841', label: 'Green' },
      { value: '#40b5bc', label: 'Light Blue' },
      { value: '#483df6', label: 'Blue' },
      { value: '#ffff99', label: 'Light Yellow' },
      { value: '#ffca00', label: 'Yellow' },
      { value: '#f28500', label: 'Orange' },
      { value: '#dc0f0f', label: 'Red' },
      { value: '#80379c', label: 'Purple' },
      { value: 'black', label: 'Black' },
      { value: 'white', label: 'White' }
    ];
    $scope.options = {
      serviceDocUrl: apiUrl + '/services/sdiservices.html',
      mobile: mobile,
      colors: colors,
      activeColor: null,
      showLabels: [
        { value: true, label: 'Show' },
        { value: false, label: 'Hide' }
      ]
    };
    var layers = {};
    // Load the edit config from layersConfig
    var removeListener = $scope.$on('gaBgChange', function(evt, value) {
      $scope.options.backgroundLayers = gaBackground.getBackgrounds();
      $scope.options.backgroundLayers.forEach(function(bg) {
        var layerConfig = gaLayers.getLayer(bg.id);
        layers[bg.id] = layerConfig.editConfig;
      });
      $scope.options.layers = layers;
      $scope.options.backgroundLayer = value;
      var layer = $scope.options.layers[value.id];
      var selectableLayers = layer ? layer.selectableLayers : null;
      if (selectableLayers) {
        $scope.options.selectedLayer = selectableLayers[0];
      }
      $scope.options.showLabel = $scope.options.showLabels[0];
      removeListener();
      $scope.options.initialize = true;
    });
  });
})();
