goog.provide('ga_backgroundselector_directive');

goog.require('ga_background_service');

(function() {

  var module = angular.module('ga_backgroundselector_directive', [
    'ga_background_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaBackgroundSelector',
      function($window, $translate, gaBackground) {
        return {
          restrict: 'A',
          templateUrl:
            'components/backgroundselector/partials/backgroundselector.html',
          scope: {
            map: '=gaBackgroundSelectorMap',
            ol3d: '=gaBackgroundSelectorOl3d'
          },
          link: function(scope, elt, attrs) {
            scope.isBackgroundSelectorClosed = true;
            scope.backgroundLayers = [];
            scope.styleUrl = false;

            scope.$watch('currentLayer', function(newVal, oldVal) {
              if (oldVal !== newVal) {
                gaBackground.set(scope.map, newVal);
              }
            });

            scope.activateBackgroundLayer = function(bgLayer) {
              if (scope.currentLayer !== bgLayer) {
                var ol3dEnabled = scope.ol3d && scope.ol3d.getEnabled();
                if (!(bgLayer.disable3d && ol3dEnabled)) {
                  scope.currentLayer = bgLayer;
                  scope.styleUrl = !!scope.currentLayer.styleUrl;
                }
              }
              scope.toggleMenu();
            };

            scope.toggleMenu = function() {
              elt.toggleClass('ga-open');
            };

            scope.getClass = function(layer) {
              if (layer) {
                var selected = (scope.currentLayer &&
                  layer.id === scope.currentLayer.id);
                var splitLayer = layer.id.split('.');
                return (selected ? 'ga-bg-highlight ' : '') +
                'ga-' + splitLayer[splitLayer.length - 2] +
                ' ' + (layer.disable3d ? 'ga-disable3d' : '');
              }
            };

            // Get the first background with the loadConfig promise: this
            // directive may not be listening to the first broadcast.
            gaBackground.loadConfig().then(function() {
              scope.backgroundLayers = gaBackground.getBackgrounds();
              scope.currentLayer = gaBackground.get();
              scope.styleUrl = !!scope.currentLayer.styleUrl;
            });
            scope.$on('gaBgChange', function(evt, newBg) {
              if (!scope.currentLayer || newBg.id !== scope.currentLayer.id) {
                scope.currentLayer = newBg;
              }
            });

            scope.showWarning = function() {
              $window.alert($translate.instant('custom_style'));
            };

            elt.find('.ga-bg-layer-bt').on('click', scope.toggleMenu);
          }
        };
      }
  );
})();
