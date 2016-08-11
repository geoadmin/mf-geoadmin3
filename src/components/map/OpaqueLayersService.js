goog.provide('ga_opaquelayers_service');

goog.require('ga_map_service');

(function() {

  var module = angular.module('ga_opaquelayers_service', [
    'ga_map_service'
  ]);

  /**
   * Service to pseudo-hide layers behind fully opaque layers
   * to avoid loading tiles/data for such layers.
   */
  module.provider('gaOpaqueLayersManager', function() {
    this.$get = function(gaDebounce, gaLayers, gaLayerFilters) {
      var layers = [];
      var unregKeys = [];
      var is3DActive = false;

      var unreg = function() {
        var key;
        while (key = unregKeys.pop()) {
          ol.Observable.unByKey(key);
        }
      };
      var updateHiddenState = gaDebounce.debounce(function() {
        var sortedLayers = layers.slice().reverse();
        var hide = false;

        unreg();

        sortedLayers.forEach(function(layer) {
          layer.hiddenByOther = hide;

          if (is3DActive) {

            var isOpaque = gaLayers.getLayer(layer.id) &&
              gaLayers.getLayer(layer.id).opaque;

            // First opaque layer
            if (isOpaque) {

              // Watch visibility property
              unregKeys = layer.on([
                'change:visible',
                'change:opacity'
              ], updateHiddenState);

              if (!hide && layer.visible && layer.invertedOpacity == '0') {
                hide = true;
              }
            }
          }
        });
      }, 100, false, false);
      return function(parentScope) {
        var scope = parentScope.$new();
        scope.layers = scope.map.getLayers().getArray();
        scope.f = function(l) {
          return gaLayerFilters.background(l) ||
                 gaLayerFilters.selected(l);
        };
        scope.$watchCollection('layers | filter:f', function(l) {
          layers = l || [];
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
