(function() {
  goog.provide('ga_catalogtree_service');

  goog.require('ga_map_service');

  var module = angular.module('ga_catalogtree_service', [
    'ga_map_service'
  ]);

  /**
   * Service providing utility functions to work with map and layers in
   * the catalog tree directives.
   */
  module.provider('gaCatalogtreeMapUtils', function() {
    this.$get = function(gaLayers) {
      return {

        /**
         * Get the layer corresponding to the tree leaf "item" and add
         * it to the map.
         *
         * FIXME: we are super cautious here and display error messages
         * when either the layer identified by item.layerBodId doesn't exist
         * in the gaLayers service, or gaLayers cannot construct an ol
         * layer object for that layer.
         */
        addLayer: function(map, item) {
          var error = true;
          if (angular.isDefined(gaLayers.getLayer(item.layerBodId))) {
            var layer = gaLayers.getOlLayerById(item.layerBodId);
            if (angular.isDefined(layer)) {
              error = false;
              map.addLayer(layer);
            }
          }
          if (error) {
            alert('Layer not supported by gaLayers (' + item.layerBodId + ').');
            item.errorLoading = true;
          }
        }
      };
    };
  });
})();
