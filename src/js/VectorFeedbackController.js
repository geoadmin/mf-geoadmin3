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
      { value: 'lightgray', label: 'light_gray' },
      { value: '#acc864', label: 'light_green' },
      { value: '#3a8841', label: 'green' },
      { value: '#40b5bc', label: 'light_blue' },
      { value: '#483df6', label: 'blue' },
      { value: '#ffff99', label: 'light_yellow' },
      { value: '#ffca00', label: 'yellow' },
      { value: '#f28500', label: 'orange' },
      { value: '#dc0f0f', label: 'red' },
      { value: '#80379c', label: 'purple' },
      { value: 'black', label: 'black' },
      { value: 'white', label: 'white' }
    ];
    $scope.options = {
      serviceDocUrl: apiUrl + '/services/sdiservices.html',
      mobile: mobile,
      colors: colors,
      activeColor: null,
      showLabels: [
        { value: true, label: 'show' },
        { value: false, label: 'hide' }
      ]
    };
    var layers = {};
    // Load the edit config from layersConfig
    var removeListener = $scope.$on('gaBgChange', function(evt, value) {
      $scope.options.backgroundLayers = gaBackground.getBackgrounds();
      $scope.options.backgroundLayers.forEach(function(bg) {
        var layerConfig = gaLayers.getLayer(bg.id);
        if (layerConfig) {
          layers[bg.id] = layerConfig.editConfig;
        }
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
