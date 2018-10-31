goog.provide('ga_edit_controller');

goog.require('ga_layers_service');
goog.require('ga_mvt_service');

(function() {

  var module = angular.module('ga_edit_controller', [
    'pascalprecht.translate',
    'ga_mvt_service',
    'ga_layers_service'
  ]);

  module.controller('GaEditController', function($scope, $translate, gaMvt,
      gaLayers) {

    var options = {
      translate: $translate, // For translation of ng-options
      glStyle: null,
      editConfig: null,
      colors: [
        { value: 'lightgray', label: 'light_gray' },
        { value: '#acc864', label: 'light_green' },
        { value: '#3a8841', label: 'green' },
        { value: '#40b5bc', label: 'light blue' },
        { value: '#0000ff', label: 'blue' },
        { value: '#ffff99', label: 'light_yellow' },
        { value: '#ffca00', label: 'yellow' },
        { value: '#f28500', label: 'orange' },
        { value: '#dc0f0f', label: 'red' },
        { value: '#80379c', label: 'purple' },
        { value: 'black', label: 'black' },
        { value: 'white', label: 'white' }
      ]
    };

    $scope.layer = undefined;

    // We use options provided by parent controller.
    $scope.options = angular.extend(options, $scope.options || {});
    $scope.globals = $scope.globals || {};

    $scope.$on('gaToggleEdit', function(evt, layer) {
      var toggle = !!(!$scope.globals.isEditActive ||
        !$scope.layer ||
        (layer && layer.bodId !== $scope.layer.bodId));
      $scope.layer = layer;
      $scope.globals.isEditActive = toggle;
      $scope.globals.pulldownShown = toggle;
    });

    $scope.$on('gaBgChange', function(evt, bg) {
      if (bg) {
        $scope.layer = bg.olLayer;
      } else {
        $scope.layer = undefined;
      }
    });

    $scope.$watch('layer', function(newLayer) {
      if (!newLayer) {
        $scope.options.editConfig = null;
        return;
      }

      var config = gaLayers.getLayer(newLayer.id);
      if (!config) {
        return;
      }

      // This config defines which properties of the glStyle are modifiable
      $scope.options.editConfig = config.editConfig;
    });
  });
})();
