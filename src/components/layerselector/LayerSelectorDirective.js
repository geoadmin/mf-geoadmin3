(function() {
  goog.provide('ga_layerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_layerselector_directive', [
    'ga_map',
    'ga_permalink',
    'pascalprecht.translate'
  ]);

  module.directive('gaLayerSelector',
    function($document, gaPermalink, gaLayers, gaLayerFilters) {
      return {
        restrict: 'A',
        templateUrl: 'components/layerselector/partials/layerselector.html',
        scope: {
          map: '=gaLayerSelectorMap'
        },
        link: function(scope, elt, attrs) {
          scope.isLayerSelectorClosed = true;
          var map = scope.map;
          var firstLayerChangeEvent = true;
          var isOfflineToOnline = false;
          var currentLayer;
          scope.backgroundLayers = [
            {id: 'ch.swisstopo.swissimage', label: 'bg_luftbild'},
            {id: 'ch.swisstopo.pixelkarte-farbe', label: 'bg_pixel_color'},
            {id: 'ch.swisstopo.pixelkarte-grau', label: 'bg_pixel_grey'},
            {id: 'voidLayer', label: 'void_layer'}];

          function setCurrentLayer(layerid) {
            var layers = map.getLayers();
            if (layerid == 'voidLayer') {
              if (layers.getLength() > 0 &&
                  layers.item(0).background === true) {
                layers.removeAt(0);
              }
            } else if (gaLayers.getLayer(layerid)) {
              var layer = gaLayers.getOlLayerById(layerid);
              layer.background = true;
              layer.displayInLayerManager = false;
              if (layers[0] && layers[0].background) {
                layers.setAt(0, layer);
              } else {
                layers.insertAt(0, layer);
              }
            }
            gaPermalink.updateParams({bgLayer: layerid});
            currentLayer = layerid;
            scope.reorderBgLayer(layerid);
          }

          scope.$on('gaLayersChange', function(event, data) {

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
            // Specific use case when we go offline to online, in this use
            // case we want to keep the current bg layer.

            var bgLayer;
            if (firstLayerChangeEvent) {
              bgLayer = gaPermalink.getParams().bgLayer;
              firstLayerChangeEvent = false;
            }
            if (!bgLayer && !currentLayer) {
              bgLayer = gaLayers.getBackgroundLayers()[0].id;
            }
            if (bgLayer && !isOfflineToOnline) {
              setCurrentLayer(bgLayer);
            }
            isOfflineToOnline = false;
          });

          scope.onClick = function(layerId) {
            if (scope.isLayerSelectorClosed) {
              scope.isLayerSelectorClosed = false;
            } else {
              scope.isLayerSelectorClosed = true;
              setCurrentLayer(layerId);
            }
          };

          // If another component add a background layer,
          // update the layer selector
          scope.layers = scope.map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.background;
          scope.$watchCollection('layers | filter:layerFilter',
            function(arr) {
              if (arr.length == 2 ||
                  (currentLayer == 'voidLayer' && arr.length == 1)) {
                currentLayer = arr[arr.length - 1].id;
                scope.map.removeLayer(arr[arr.length - 1]);
              }
            });

          // We must know when the app goes from offline to online.
          scope.$on('gaNetworkStatusChange', function(evt, offline) {
            isOfflineToOnline = !offline;
          });

          scope.getClass = function(layerid) {
            var splitLayer = layerid.id.split('.');
            return 'ga-' + splitLayer[splitLayer.length - 1];
          };

          scope.reorderBgLayer = function(layerid) {
            var counter = 0;
            var provBackgroundLayers = new Array(4);
            for (var layer in scope.backgroundLayers) {
              if (layerid == scope.backgroundLayers[layer].id) {
                provBackgroundLayers[0] = scope.backgroundLayers[layer];
              } else {
                counter = counter + 1;
                if (scope.backgroundLayers[layer].id ==
                  'ch.swisstopo.swissimage') {
                  provBackgroundLayers[counter] = scope.backgroundLayers[layer];
                }
                if (scope.backgroundLayers[layer].id ==
                  'ch.swisstopo.pixelkarte-farbe') {
                  provBackgroundLayers[counter] = scope.backgroundLayers[layer];
                }
                if (scope.backgroundLayers[layer].id ==
                  'ch.swisstopo.pixelkarte-grau') {
                  provBackgroundLayers[counter] = scope.backgroundLayers[layer];
                }
                if (scope.backgroundLayers[layer].id == 'voidLayer') {
                  provBackgroundLayers[counter] = scope.backgroundLayers[layer];
                }
              }
            }
            for (var i = 0; i < provBackgroundLayers.length; i++) {
              scope.backgroundLayers[i] = provBackgroundLayers[i];
            }
          };
        }
      };
    }
  );
})();
