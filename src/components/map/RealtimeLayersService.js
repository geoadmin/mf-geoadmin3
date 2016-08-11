goog.provide('ga_realtimelayers_service');

goog.require('ga_map_service');

(function() {

  var module = angular.module('ga_realtimelayers_service', [
    'ga_map_service'
  ]);

  module.provider('gaRealtimeLayersManager', function() {
    this.$get = function($rootScope, $http, $timeout, gaLayerFilters,
        gaMapUtils, gaUrlUtils) {

      var timers = [];
      var realTimeLayersId = [];
      var geojsonFormat = new ol.format.GeoJSON();

      function setLayerSource(layer) {
        var fullUrl = gaUrlUtils.proxifyUrl(layer.geojsonUrl);
        var olSource = layer.getSource();
        $http.get(fullUrl).then(function(response) {
          var data = response.data;
          olSource.clear();
          olSource.addFeatures(
            geojsonFormat.readFeatures(data)
          );
          if (!layer.preview) {
            var layerIdIndex = realTimeLayersId.indexOf(layer.bodId);
            timers[layerIdIndex] = setLayerUpdateInterval(layer);
            if (data.timestamp) {
              $rootScope.$broadcast('gaNewLayerTimestamp', data.timestamp);
            }
          }
        });
      }

      // updateDeplay should be higher than the time
      // needed to upload the geojson file
      function setLayerUpdateInterval(layer) {
        return $timeout(function() {
          setLayerSource(layer);
        }, layer.updateDelay);
      }

      return function(map) {
        var scope = $rootScope.$new();
        scope.layers = map.getLayers().getArray();
        scope.layerFilter = gaLayerFilters.realtime;

        scope.$watchCollection('layers | filter:layerFilter',
            function(newLayers, oldLayers) {

          // Layer Removed
          oldLayers.forEach(function(oldLayer) {
            var bodId = oldLayer.bodId;
            var oldLayerIdIndex = realTimeLayersId.indexOf(bodId);
            if (oldLayerIdIndex != -1 &&
                !gaMapUtils.getMapLayerForBodId(map, bodId)) {
              realTimeLayersId.splice(oldLayerIdIndex, 1);
              $timeout.cancel(timers.splice(oldLayerIdIndex, 1)[0]);
              if (realTimeLayersId.length == 0) {
                $rootScope.$broadcast('gaNewLayerTimestamp', '');
              }
            }
          });

          // Layer Added
          newLayers.forEach(function(newLayer) {
            var bodId = newLayer.bodId;
            if (realTimeLayersId.indexOf(bodId) == -1) {
              if (!newLayer.preview) {
                realTimeLayersId.push(bodId);
              }
              setLayerSource(newLayer);
            }
          });
        });

        // Update geojson source on language change
        $rootScope.$on('$translateChangeEnd', function(evt) {

          realTimeLayersId.forEach(function(bodId, i) {
            var olLayer = gaMapUtils.getMapLayerForBodId(map, bodId);
            $timeout.cancel(timers[i]);
            setLayerSource(olLayer);
          });
        });
      };
    };
  });
})();
