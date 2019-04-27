goog.provide('ga_edit_controller');

goog.require('ga_layers_service');
goog.require('ga_vector_tile_layer_service');

(function() {

  var module = angular.module('ga_edit_controller', [
    'pascalprecht.translate',
    'ga_layers_service'
  ]);

  module.controller('GaEditController', function($scope, $translate,
      gaLayers, gaVectorTileLayerService) {

    var options = {
      translate: $translate, // For translation of ng-options
      editConfig: null
    };

    // We use options provided by parent controller.
    $scope.options = angular.extend(options, $scope.options || {});
    $scope.globals = $scope.globals || {};

    $scope.options.editConfig =
      gaVectorTileLayerService.vectortileLayerConfig.edits;

    $scope.$on('gaToggleEdit', function(evt, toggle) {
      if (toggle === undefined) {
        toggle = !$scope.globals.isEditActive;
      }
      $scope.style = gaVectorTileLayerService.getCurrentStyle();
      $scope.globals.isEditActive = toggle;
      $scope.globals.pulldownShown = toggle;
    });
  });
})();
