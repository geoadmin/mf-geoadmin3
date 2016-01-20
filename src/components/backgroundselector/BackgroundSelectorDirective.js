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
    function(gaBrowserSniffer, gaBackground) {
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
          var mobile = gaBrowserSniffer.mobile;
          scope.desktop = !gaBrowserSniffer.embed && !mobile;
          scope.backgroundLayers = [];

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
            if (scope.currentLayer != bgLayer) {
              var ol3dEnabled = scope.ol3d && scope.ol3d.getEnabled();
              if (!(bgLayer.disable3d && ol3dEnabled)) {
                scope.currentLayer = bgLayer;
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
                  layer.id == scope.currentLayer.id);
              var splitLayer = layer.id.split('.');
              return (selected ? 'ga-bg-highlight ' : '') +
                'ga-' + splitLayer[splitLayer.length - 1] +
                ' ' + (layer.disable3d ? 'ga-disable3d' : '');
            }
          };

          // Get the first background with the loadConfig promise: this
          // directive may not be listening to the first broadcast.
          gaBackground.loadConfig().then(function() {
            scope.backgroundLayers = gaBackground.getBackgrounds();
            scope.currentLayer = gaBackground.get();
          });
          scope.$on('gaBgChange', function(evt, newBg) {
            if (!scope.currentLayer || newBg.id != scope.currentLayer.id) {
              scope.currentLayer = newBg;
            }
          });

          elt.find('.ga-bg-layer-bt').click(scope.toggleMenu);
        }
      };
    }
  );
})();
