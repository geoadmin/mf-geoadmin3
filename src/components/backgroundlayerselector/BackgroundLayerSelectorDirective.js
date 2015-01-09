(function() {
  goog.provide('ga_backgroundlayerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_backgroundlayerselector_directive', [
    'ga_map',
    'ga_permalink'
  ]);

  module.directive('gaBackgroundLayerSelector',
      function(gaPermalink, gaLayers, gaLayerFilters) {
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
              //
              // Specific use case when we go offline to online, in this use
              // case we want to keep the current bg layer.

              var currentLayer;
              if (firstLayerChangeEvent) {
                currentLayer = gaPermalink.getParams().bgLayer;
                firstLayerChangeEvent = false;
              }
              if (!currentLayer && !data.labelsOnly) {
                currentLayer = backgroundLayers[0].id;
              }
              if (currentLayer && !isOfflineToOnline) {
                scope.currentLayer = currentLayer;
              }
              isOfflineToOnline = false;
            });

            scope.$watch('currentLayer', function(newVal, oldVal) {
              if (oldVal !== newVal) {
                setCurrentLayer(newVal, oldVal);
              }
            });

            // If another omponent add a background layer, update the
            // selectbox.
            scope.layers = scope.map.getLayers().getArray();
            scope.layerFilter = gaLayerFilters.background;
            scope.$watchCollection('layers | filter:layerFilter',
              function(arr) {
                if (arr.length == 2 ||
                    (scope.currentLayer == 'voidLayer' && arr.length == 1)) {
                  scope.currentLayer = arr[arr.length - 1].id;
                  scope.map.removeLayer(arr[arr.length - 1]);
                }
              });

            // We must know when the app goes from offline to online.
            var isOfflineToOnline = false;
            scope.$on('gaNetworkStatusChange', function(evt, offline) {
              isOfflineToOnline = !offline;
            });

          }
        };
      });
})();
