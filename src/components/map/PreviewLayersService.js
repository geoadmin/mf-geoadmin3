goog.provide('ga_previewlayers_service');

goog.require('ga_map_service');
goog.require('ga_time_service');
goog.require('ga_wms_service');
(function() {

  var module = angular.module('ga_previewlayers_service', [
    'ga_map_service',
    'ga_time_service',
    'ga_wms_service'
  ]);

  /**
   * Service manages preview layers on map, used by CatalogTree,
   * Search, ImportWMS
   */
  module.provider('gaPreviewLayers', function() {
    // We store all review layers we add
    var olPreviewLayers = {};

    this.$get = function($rootScope, gaLayers, gaWms, gaTime, gaMapUtils) {
      var olPreviewLayer;

      var PreviewLayers = function() {

        this.addBodLayer = function(map, bodId) {

          // Remove all preview layers
          this.removeAll(map);

          // Search or create the preview layer
          var olPreviewLayer = olPreviewLayers[bodId];

          if (!olPreviewLayer) {
            olPreviewLayer = gaLayers.getOlLayerById(bodId);
          }

          // Something failed, layer doesn't exist
          if (!olPreviewLayer) {
            return undefined;
          }

          // Apply the current time
          if (olPreviewLayer.bodId && olPreviewLayer.timeEnabled) {
            olPreviewLayer.time = gaLayers.getLayerTimestampFromYear(
                olPreviewLayer.bodId, gaTime.get());
          }

          olPreviewLayer.preview = true;
          olPreviewLayer.displayInLayerManager = false;
          olPreviewLayer.setZIndex(gaMapUtils.Z_PREVIEW_LAYER);
          olPreviewLayers[bodId] = olPreviewLayer;
          map.addLayer(olPreviewLayer);

          return olPreviewLayer;
        };

        this.addGetCapWMSLayer = function(map, getCapLayer) {
          // Remove all preview layers
          this.removeAll(map);

          // Search or create the preview layer
          var olPreviewLayer = olPreviewLayers[getCapLayer.id];

          if (!olPreviewLayer) {
            olPreviewLayer = gaWms.getOlLayerFromGetCapLayer(getCapLayer);
          }

          // Something failed, layer doesn't exist
          if (!olPreviewLayer) {
            return undefined;
          }

          olPreviewLayer.preview = true;
          olPreviewLayer.displayInLayerManager = false;
          olPreviewLayers[getCapLayer.id] = olPreviewLayer;
          olPreviewLayer.setZIndex(gaMapUtils.Z_PREVIEW_LAYER);
          map.addLayer(olPreviewLayer);

          return olPreviewLayer;
        };

        // Remove all preview layers currently on the map, to be sure there is
        // one and only one preview layer at a time
        this.removeAll = function(map) {
          var layers = map.getLayers().getArray();
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].preview && !(layers[i] instanceof ol.layer.Vector)) {
              map.removeLayer(layers[i]);
              i--;
            } else if (layers[i].preview && layers[i].type == 'geojson') {
              map.removeLayer(layers[i]);
              i--;
            }
          }
        };
      };

      return new PreviewLayers();
    };
  });

  /**
   * Service to pseudo-hide layers behind fully opaque layers
   * to avoid loading tiles/data for such layers.
   */
  module.provider('gaLayerHideManager', function() {
    this.$get = function(gaDebounce, gaLayers, gaLayerFilters) {
      var layers = [];
      var unregKeys = [];
      var is3DActive = false;

      var unreg = function() {
        angular.forEach(unregKeys, function(key) {
          if (key) {
            ol.Observable.unByKey(key);
          }
        });
        unregKeys = [];
      };

      var updateHiddenState = gaDebounce.debounce(function() {
        var sortedLayers = layers.slice().reverse();
        var hide = false;

        unreg();

        angular.forEach(sortedLayers, function(layer) {
          layer.hiddenByOther = hide;

          if (is3DActive) {
            // Register all layers for changes
            unregKeys.push(layer.on('change:visible', function(evt) {
              updateHiddenState();
            }));
            unregKeys.push(layer.on('change:opacity', function(evt) {
              updateHiddenState();
            }));

            // First opaque layer
            if (!hide &&
                gaLayers.getLayer(layer.id) &&
                gaLayers.getLayer(layer.id).opaque &&
                layer.visible &&
                layer.invertedOpacity == '0') {
              hide = true;
            }
          }
        });
      }, 100, false, false);
      return function(parentScope) {
        var scope = parentScope.$new();
        scope.layers = scope.map.getLayers().getArray();
        scope.f = function(l) {
          return (gaLayerFilters.background(l) ||
                  gaLayerFilters.selected(l));
        };
        scope.$watchCollection('layers | filter:f', function(l) {
          layers = (l) ? l : [];
          updateHiddenState();
        });

        scope.$watch('globals.is3dActive', function(val) {
          is3DActive = val;
          updateHiddenState();
        });
      };
    };
  });
})();
