(function() {
  goog.provide('ga_backgroundlayerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_backgroundlayerselector_directive', [
    'ga_map',
    'ga_permalink'
  ]);

  module.directive('gaBackgroundLayerSelector',
      function(gaPermalink, gaLayers) {
          return {
            restrict: 'A',
            replace: true,
            scope: {
              map: '=gaBackgroundLayerSelectorMap'
            },
            templateUrl: 'components/backgroundlayerselector/partials/' +
                'backgroundlayerselector.html',
            link: function(scope, element, attrs) {
              var map = scope.map;
              var firstLayerChangeEvent = true;

              function setCurrentLayer(newVal, oldVal) {
                var layers = map.getLayers();
                if (newVal == 'voidLayer') {
                  if (layers.getLength() > 0 &&
                      layers.item(0).background === true) {
                    layers.removeAt(0);
                  }
                } else if (gaLayers.getLayer(newVal)) {
                  var layer = gaLayers.getOlLayerById(newVal);
                  layer.background = true;
                  layer.displayInLayerManager = false;

                  if (!oldVal || oldVal == 'voidLayer') {
                    // we may have a non background layer at index 0
                    layers.insertAt(0, layer);
                  } else {
                    layers.setAt(0, layer);
                  }
                } else {
                  scope.currentLayer = scope.backgroundLayers[0].id;
                }
                gaPermalink.updateParams({bgLayer: newVal});
              }

              scope.$on('gaLayersChange', function(event, data) {

                var backgroundLayers = gaLayers.getBackgroundLayers();
                backgroundLayers.push({id: 'voidLayer', label: 'void_layer'});
                scope.backgroundLayers = backgroundLayers;

                // Determine the current background layer. Strategy:
                //
                // If this is the first gaLayersChange event we receive then
                // we look at the permalink. If there's a bgLayer parameter
                // in the permalink we use that as the initial background
                // layer.
                //
                // If it's not the first gaLayersChange event, or if there's
                // no bgLayer parameter in the permalink, then we use the
                // first background layer of the background layers array.
                //
                // Unless the gaLayersChange event has labelsOnly set to
                // true, in which case we don't change the current background
                // layer.

                var currentLayer;
                if (firstLayerChangeEvent) {
                  currentLayer = gaPermalink.getParams().bgLayer;
                  firstLayerChangeEvent = false;
                }
                if (!currentLayer && !data.labelsOnly) {
                  currentLayer = backgroundLayers[0].id;
                }
                if (currentLayer) {
                  scope.currentLayer = currentLayer;
                }
              });

              scope.$watch('currentLayer', function(newVal, oldVal) {
                if (oldVal !== newVal) {
                  setCurrentLayer(newVal, oldVal);
                }
              });
            }
          };
        });
})();
