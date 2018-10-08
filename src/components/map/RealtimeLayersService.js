goog.provide('ga_realtimelayers_service');

goog.require('ga_layerfilters_service');
goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_vector_service');

(function() {

  var module = angular.module('ga_realtimelayers_service', [
    'ga_layerfilters_service',
    'ga_layers_service',
    'ga_maputils_service',
    'ga_vector_service'
  ]);

  module.provider('gaRealtimeLayersManager', function() {
    this.$get = function($rootScope, $http, $timeout, gaLayerFilters,
        gaMapUtils, gaUrlUtils, gaLayers, gaVector) {

      var timers = [];
      var map;
      var realTimeLayersId = [];

      var handleTimer = function(layer) {
        if (!layer.preview) {
          var layerIdIndex = realTimeLayersId.indexOf(layer.id);
          timers[layerIdIndex] = setLayerUpdateInterval(layer);
          if (layer.timestamps && layer.timestamps[0]) {
            $rootScope.$broadcast('gaNewLayerTimestamp', layer.timestamps[0]);
          }
        }
      };

      function setLayerSource(layer) {
        var olSource = layer.getSource();
        var vec = gaMapUtils.isKmlLayer(layer) ||
            gaMapUtils.isGpxLayer(layer);
        var url = !vec ? layer.geojsonUrl : layer.url;
        var proj = map.getView().getProjection();
        gaUrlUtils.proxifyUrl(url).then(function(proxyUrl) {
          $http.get(proxyUrl).then(function(response) {
            var data = response.data;
            if (vec) {
              gaVector.readFeatures(data, proj).
                  then(function(resp) {
                    olSource.clear();
                    olSource.addFeatures(resp.features);
                    olSource.setProperties({
                      'rawData': resp.data
                    });
                  });
            } else {
              olSource.clear();
              olSource.addFeatures(olSource.getFormat().readFeatures(data, {
                featureProjection: proj
              }));
              layer.timestamps = [data.timestamp];
            }
            handleTimer(layer);
          }, function() {
            handleTimer(layer);
          });
        });
      }

      // updateDeplay should be higher than the time
      // needed to upload the geojson file
      function setLayerUpdateInterval(layer) {
        return $timeout(function() {
          setLayerSource(layer);
        }, layer.updateDelay);
      }

      return function(inMap) {
        map = inMap;
        var scope = $rootScope.$new();
        scope.layers = map.getLayers().getArray();
        scope.realtime = gaLayerFilters.realtime;
        scope.selectedAndVisible = gaLayerFilters.selectedAndVisible;

        scope.$watchCollection('layers | filter:realtime | filter:selectedAndVisible',
            function(newLayers, oldLayers) {

              // Layer Removed
              oldLayers.forEach(function(oldLayer) {
                var realTimeId = oldLayer.bodId || oldLayer.id;
                var oldLayerIdIndex = realTimeLayersId.indexOf(realTimeId);
                if (oldLayerIdIndex !== -1 &&
                    !gaMapUtils.getMapLayerForBodId(map, realTimeId)) {
                  realTimeLayersId.splice(oldLayerIdIndex, 1);
                  $timeout.cancel(timers.splice(oldLayerIdIndex, 1)[0]);
                  if (!realTimeLayersId.length) {
                    $rootScope.$broadcast('gaNewLayerTimestamp', '');
                  }
                }
              });

              // Layer Added
              newLayers.forEach(function(newLayer) {
                var realTimeId = newLayer.bodId || newLayer.id;
                if (realTimeLayersId.indexOf(realTimeId) === -1 &&
                    !newLayer.preview) {
                  realTimeLayersId.push(realTimeId);
                  if (newLayer.bodId) {
                    gaLayers.getLayerPromise(newLayer.bodId).then(function() {
                      handleTimer(newLayer);
                    });
                  } else {
                    handleTimer(newLayer);
                  }
                }
              });
            });

        // Update geojson source on language change
        // This event is triggered after the layersConfig is loaded
        $rootScope.$on('gaLayersTranslationChange', function(evt) {

          realTimeLayersId.forEach(function(bodId, i) {
            var olLayer = gaMapUtils.getMapLayerForBodId(map, bodId);
            if (olLayer) {
              olLayer.geojsonUrl =
                  gaLayers.getLayerProperty(olLayer.bodId, 'geojsonUrl');
              $timeout.cancel(timers[i]);
              setLayerSource(olLayer);
            }
          });
        });
      };
    };
  });
})();
