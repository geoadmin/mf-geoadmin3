goog.provide('ga_layer_retry_service');

goog.require('ga_map_service');


(function() {

  var module = angular.module('ga_layer_retry_service', [
    'ga_map_service'
  ]);

 /**
   * This service provide functionality to enable layers on
   * an ol3 map to retry failed downloading attempts. This
   * functionality existed in ol2.
   */
  module.provider('gaLayerRetry', function() {

    var canObserve = function(l) {
      if ((l instanceof ol.layer.Tile ||
          l instanceof ol.layer.Image) &&
          (l.getSource() instanceof ol.source.WMTS ||
           l.getSource() instanceof ol.source.TileWMS ||
           l.getSource() instanceof ol.source.ImageWMS)) {
        return true;
      }
      return false;
    };

    var isRetryLayer = function(l) {
      if (l.type == 'aggregate') {
        var is = false;
        angular.forEach(l.getLayers(), function(subLayer) {
          is = is || isRetryLayer(subLayer);
        });
        return is;
      }
      return canObserve(l);
    };

    var reg = {};
    var MAX_RETRIES = 3;
    var RETRIES_INTERVAL = 5000;

    this.$get = function($timeout, gaLayerFilters) {

      var registerNewLayers = function(layers) {

        angular.forEach(layers, function(layer) {
          if (layer.type == 'aggregate') {
            registerNewLayers(layer.getLayers());
          } else if (canObserve(layer)) {
            var end = 'tileloadend';
            var error = 'tileloaderror';
            var el = 'tile';
            var src = layer.getSource();
            var unreg = [];
            if (!reg[layer.id]) {

              if (src instanceof ol.source.ImageWMS) {
                end = 'imageloadend';
                error = 'imageloaderror';
                el = 'image';
              }

              unreg.push(src.on(error, function(evt) {
                if (evt[el]._retries == undefined) {
                  evt[el]._retries = 0;
                }
                evt[el]._retries++;
                if (evt[el]._retries <= MAX_RETRIES) {
                  $timeout(function() {
                    evt[el].state = 0;
                    evt[el].load();
                  }, RETRIES_INTERVAL * evt[el]._retries, false);
                }
              }));

              unreg.push(src.on(end, function(evt) {
                if (evt[el]._retries) {
                  evt[el]._retries = 0;
                  this.changed();
                }
              }));

              reg[layer.id] = {
                unregs: unreg,
                src: src
              };
            }
          }
        });
      };

      var unregisterOldLayers = function(layers) {

        var layerActive = function(layerId, ls) {
          var hasIt = false;
          angular.forEach(ls, function(layer) {
            if (layer.type == 'aggregate') {
              hasIt = layerActive(layerId, layer.getLayers());
            } else if (layer.id == layerId) {
              hasIt = true;
            }
          });
          return hasIt;
        };

        angular.forEach(reg, function(r, layerId) {
          if (!layerActive(layerId, layers)) {
            angular.forEach(r.unregs, function(unreg) {
              r.src.unByKey(unreg);
            });
            delete reg[layerId];
          }
        });

      };

      var LayerRetry = function() {

        this.init = function(scope) {
          scope.maploadLayers = scope.map.getLayers().getArray();
          scope.maploadFilter = function(l) {
            return ((gaLayerFilters.selectedAndVisible(l) ||
                   gaLayerFilters.background(l)) &&
                   isRetryLayer(l));
          };

          //React on adding/removing layers
          scope.$watchCollection('maploadLayers | filter:maploadFilter',
                                 function(layers) {
            registerNewLayers(layers);
            unregisterOldLayers(layers);
          });

        };
      };

      return new LayerRetry();

    };
  });
})();

