goog.provide('ga_realtimelayers_service');

goog.require('ga_map_service');

(function() {

  var module = angular.module('ga_realtimelayers_service', [
    'ga_map_service'
  ]);

  module.provider('gaRealtimeLayersManager', function() {
    this.$get = function($rootScope, $http, $timeout, gaLayerFilters,
        gaMapUtils, gaUrlUtils, gaLayers, gaKml) {

      var timers = [];
      var map;
      var realTimeLayersId = [];
      var geojsonFormat = new ol.format.GeoJSON();

      var handleTimer = function(layer, data) {
        if (!layer.preview) {
          var layerIdIndex = realTimeLayersId.indexOf(layer.bodId);
          timers[layerIdIndex] = setLayerUpdateInterval(layer);
          if (data && data.timestamp) {
            $rootScope.$broadcast('gaNewLayerTimestamp', data.timestamp);
          }
        }
      };

      function setLayerSource(layer) {
        var olSource = layer.getSource();
        var kml = gaMapUtils.isKmlLayer(layer);
        var url = !kml ? layer.geojsonUrl : layer.url;
        gaUrlUtils.proxifyUrl(url).then(function(proxyUrl) {
          $http.get(proxyUrl).then(function(response) {
            var data = response.data;
            if (kml) {
              gaKml.readFeatures(data, map.getView().getProjection()).
                  then(function(features) {
                    olSource.clear();
                    olSource.addFeatures(features);
                    olSource.setProperties({
                      'kmlString': data
                    });
                  });
            } else {
              olSource.clear();
              olSource.addFeatures(
                  geojsonFormat.readFeatures(data)
              );
            }
            handleTimer(layer, data);
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
        scope.layerFilter = gaLayerFilters.realtime;

        scope.$watchCollection('layers | filter:layerFilter',
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
                if (realTimeLayersId.indexOf(realTimeId) === -1) {
                  if (!newLayer.preview) {
                    realTimeLayersId.push(realTimeId);
                  }
                  setLayerSource(newLayer);
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
