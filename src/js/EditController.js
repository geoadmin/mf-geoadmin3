goog.provide('ga_edit_controller');

goog.require('ga_layers_service');
goog.require('ga_maputils_service');

(function() {

  var module = angular.module('ga_edit_controller', [
    'pascalprecht.translate',
    'ga_layers_service',
    'ga_maputils_service'
  ]);

  module.controller('GaEditController', function($scope, $translate,
      gaLayers, gaMapUtils) {

    var options = {
      translate: $translate, // For translation of ng-options
      glStyle: null,
      editConfig: null
    };

    $scope.layer = undefined;

    // We use options provided by parent controller.
    $scope.options = angular.extend(options, $scope.options || {});
    $scope.globals = $scope.globals || {};

    $scope.$on('gaToggleEdit', function(evt, layer, toggle) {
      if (toggle === undefined) {
        toggle = !!(!$scope.globals.isEditActive ||
          !$scope.layer ||
          (layer && layer.bodId !== $scope.layer.bodId));
      }
      $scope.layer = layer;
      $scope.globals.isEditActive = toggle;
      $scope.globals.pulldownShown = toggle;
    });

    var activate = function(active) {
      if (active && $scope.layer && $scope.layer.glStyle) {
        // set timeout to smooth the transition
        setTimeout(function() {
          gaMapUtils.applyGlStyleToOlLayer(
              $scope.layer, $scope.layer.glStyle)
        }, 600);
      }
    };

    $scope.$watch('globals.isEditActive', function(active) {
      activate(active);
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
