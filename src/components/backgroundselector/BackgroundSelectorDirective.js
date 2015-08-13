goog.provide('ga_backgroundselector_directive');

goog.require('ga_background_service');
goog.require('ga_map');
goog.require('ga_permalink');
goog.require('ga_topic_service');

(function() {

  var module = angular.module('ga_backgroundselector_directive', [
    'ga_map',
    'ga_background_service'
  ]);

  module.directive('gaBackgroundSelector',
    function($document, $rootScope, gaBrowserSniffer, gaBackground) {
      return {
        restrict: 'A',
        templateUrl:
            'components/backgroundselector/partials/backgroundselector.html',
        scope: {
          map: '=gaBackgroundSelectorMap'
        },
        link: function(scope, elt, attrs) {
          scope.isBackgroundSelectorClosed = true;
          var mobile = gaBrowserSniffer.mobile;
          scope.desktop = !gaBrowserSniffer.embed && !mobile;
          scope.backgroundLayers = gaBackground.getBackgrounds();

          if (mobile) {
            elt.addClass('ga-bg-mobile');
          } else if (scope.desktop) {
            elt.addClass('ga-bg-desktop');
          }

          scope.$watch('currentLayer', function(newVal, oldVal) {
            if (oldVal !== newVal) {
              gaBackground.set(scope.map, newVal);
            }
          });

          scope.activateBackgroundLayer = function(bgLayer) {
            if (scope.isBackgroundSelectorClosed) {
              scope.isBackgroundSelectorClosed = false;
            } else {
              scope.isBackgroundSelectorClosed = true;
              if (scope.currentLayer != bgLayer) {
                scope.currentLayer = bgLayer;
              }
            }
          };

          scope.toggleMenu = function() {
            scope.isBackgroundSelectorClosed =
                !scope.isBackgroundSelectorClosed;
          };

          scope.getClass = function(layer, index) {
            if (layer) {
              var selected = (scope.currentLayer &&
                  layer.id == scope.currentLayer.id);
              var splitLayer = layer.id.split('.');
              return (selected ? 'ga-bg-highlight ' : '') +
                'ga-' + splitLayer[splitLayer.length - 1] +
                ' ' + ((!scope.isBackgroundSelectorClosed) ?
                'ga-bg-layer-' + index : '');
            }
          };

          scope.$on('gaBgChange', function(evt, newBg) {
            if (!scope.currentLayer || newBg.id != scope.currentLayer.id) {
              scope.currentLayer = newBg;
            }
          });

          scope.$on('gaPermalinkChange', function(evt, newBg) {
            if (!scope.isBackgroundSelectorClosed) {
              scope.isBackgroundSelectorClosed = true;
            }
          });
        }
      };
    }
  );
})();
