goog.provide('ga_layerfilters_service');

goog.require('ga_layers_service');
goog.require('ga_maputils_service');

(function() {

  var module = angular.module('ga_layerfilters_service', [
    'ga_layers_service',
    'ga_maputils_service'
  ]);

  /**
   * Service provides different kinds of filter for
   * layers in the map
   */
  module.provider('gaLayerFilters', function() {
    this.$get = function(gaLayers, gaMapUtils) {
      return {
        /**
         * Filters out background layers, preview
         * layers, draw, measure.
         * In other words, all layers that
         * were actively added by the user and that
         * appear in the layer manager
         */
        selected: function(layer) {
          return layer.displayInLayerManager;
        },
        selectedAndVisible: function(layer) {
          return layer.displayInLayerManager && layer.visible;
        },
        permalinked: function(layer) {
          return layer.displayInLayerManager && !!layer.id &&
                 !gaMapUtils.isLocalKmlLayer(layer) &&
                 !gaMapUtils.isLocalGpxLayer(layer);
        },
        /**
         * Keep only time enabled layer
         */
        timeEnabled: function(layer) {
          return layer.timeEnabled &&
                 layer.visible &&
                 !layer.background &&
                 !layer.preview;
        },
        /**
         * Keep layers with potential tooltip for query tool
         */
        potentialTooltip: function(layer) {
          return !!(layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.hasTooltipBodLayer(layer) &&
                 !gaMapUtils.isVectorLayer(layer));
        },
        /**
         * Searchable layers
         */
        searchable: function(layer) {
          return !!(layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.getLayerProperty(layer.bodId, 'searchable'));
        },
        /**
         * Queryable layers (layers with queryable attributes)
         */
        queryable: function(layer) {
          return !!(layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.getLayerProperty(layer.bodId,
                     'queryableAttributes') &&
                 gaLayers.getLayerProperty(layer.bodId,
                     'queryableAttributes').length);
        },
        /**
         * Keep only background layers
         */
        background: function(layer) {
          return layer.background;
        },
        /**
         * "Real-time" layers (only geojson layers for now)
         */
        realtime: function(layer) {
          return layer.updateDelay != null;
        }
      };
    };
  });
})();
