goog.provide('ga_opaquelayers_service');

goog.require('ga_layerfilters_service');
goog.require('ga_layers_service');

(function() {

  var module = angular.module('ga_opaquelayers_service', [
    'ga_layerfilters_service',
    'ga_layers_service'
  ]);

  /**
   * Service to pseudo-hide layers behind fully opaque layers
   * to avoid loading tiles/data for such layers.
   */
  module.provider('gaOpaqueLayersManager', function() {
    this.$get = function(gaDebounce, gaLayers, gaLayerFilters) {
      var layers = [];
      var unregKeys = [];
      var is3dActive = false;

      var unreg = function() {
        var key;
        while ((key = unregKeys.pop())) {
          ol.Observable.unByKey(key);
        }
      };
      var updateHiddenState = gaDebounce.debounce(function() {
        unreg();

        if (!is3dActive) {
          return;
        }
        var hide = false;
        layers.slice().reverse().forEach(function(layer) {
          var config3d = gaLayers.getConfig3d(gaLayers.getLayer(layer.bodId));
          // In 3d, vector data are always on top so hide only wms and wmts
          // layers.
          layer.hiddenByOther = hide &&
              /(wms|wmts|aggregate)/.test(config3d.type);

          // First opaque layer
          if (config3d.opaque) {

            // Watch visibility property
            unregKeys = layer.on([
              'change:visible',
              'change:opacity'
            ], updateHiddenState);

            if (!hide && layer.visible && !layer.invertedOpacity) {
              hide = true;
            }
          }
        });
      }, 100, false, false);
      return function(parentScope) {
        var scope = parentScope.$new();
        scope.layers = scope.map.getLayers().getArray();
        scope.f = function(l) {
          return l.bodId && (gaLayerFilters.background(l) ||
              gaLayerFilters.selected(l));
        };
        scope.$watchCollection('layers | filter:f', function(l) {
          layers = l || [];
          updateHiddenState();
        });
        scope.$watch('globals.is3dActive', function(val) {
          is3dActive = val;
          updateHiddenState();
        });
      };
    };
  });
})();
