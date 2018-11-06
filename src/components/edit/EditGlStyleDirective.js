goog.provide('ga_editglstyle_directive');

goog.require('ga_layers_service');

(function() {

  var module = angular.module('ga_editglstyle_directive', [
    'ga_layers_service'
  ]);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaEditGlStyle', function(gaLayers, $rootScope) {
    return {
      restrict: 'A',
      templateUrl: 'components/edit/partials/edit-glstyle.html',
      scope: {
        glStyle: '=gaEditGlStyle',
        config: '=gaEditGlStyleConfig',
        options: '=gaEditGlStyleOptions'
      },
      link: function(scope, element, attrs, controller) {

        scope.$watch('glStyle', function(newGlStyle) {
          if (!newGlStyle || !scope.config || !scope.config.selectableLayers) {
            return;
          }
          /*
          var config = gaLayers.getLayer(newGlStyle.id) ||
              gaLayers.getLayer(newGlStyle.id);
          if (!config.editConfig) {
            return;
          }
          scope.config = config.editConfig;
          */
          scope.selectableLayers = [];

          scope.glStyle.layers.forEach(function(layer) {
            if (scope.config.selectableLayers.indexOf(layer.id) !== -1) {
              scope.selectableLayers.push(layer);
            }
          });
          scope.selectedLayer = scope.selectableLayers[0];
        });

        scope.useColorSelector = function(e) {
          return /\{color\}/.test(e[2]);
        }

        scope.save = function() {
          $rootScope.$broadcast('gaGlStyleChanged', scope.glStyle);
        }

        scope.getTranslateId = function(e) {
          return 'edit_' + e[1].replace(/-/g, '_');
        }
      }
    };
  });
})();
