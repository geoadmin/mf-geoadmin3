goog.provide('ga_realtimelayers_service');

goog.require('ga_map_service');

(function() {

  var module = angular.module('ga_realtimelayers_service', [
    'ga_map_service'
  ]);

  module.provider('gaRealtimeLayersManager', function() {
    this.$get = function($rootScope, $http, $timeout,
        gaLayerFilters, gaMapUtils, gaGlobalOptions) {

      var timers = [];
      var realTimeLayersId = [];
      var geojsonFormat = new ol.format.GeoJSON();

      function setLayerSource(layer) {
        var fullUrl = gaGlobalOptions.ogcproxyUrl + layer.geojsonUrl;
        var olSource = layer.getSource();
        $http.get(fullUrl, {
          cache: false
        }).success(function(data) {
          olSource.clear();
          olSource.addFeatures(
            geojsonFormat.readFeatures(data)
          );
          var layerIdIndex = realTimeLayersId.indexOf(layer.bodId);
          if (layerIdIndex != -1 && !layer.preview) {
            $timeout.cancel(timers.splice(layerIdIndex, 1));
            timers.push(setLayerUpdateInterval(layer));
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
          for (var i = 0; i < oldLayers.length; i++) {
            var bodId = oldLayers[i].bodId;
            var oldLayerIdIndex = realTimeLayersId.indexOf(bodId);
            if (oldLayerIdIndex != -1 &&
                !gaMapUtils.getMapLayerForBodId(map, bodId)) {
              realTimeLayersId.splice(oldLayerIdIndex, 1);
              $timeout.cancel(timers.splice(oldLayerIdIndex, 1));
              if (realTimeLayersId.length == 0) {
                $rootScope.$broadcast('gaNewLayerTimestamp', '');
              }
            }
          }
          // Layer Added
          for (var i = 0; i < newLayers.length; i++) {
            var bodId = newLayers[i].bodId;
            var newLayerIdIndex = realTimeLayersId.indexOf(bodId);
            if (newLayerIdIndex == -1) {
              if (!newLayers[i].preview) {
                realTimeLayersId.push(bodId);
              }
              setLayerSource(newLayers[i]);
            }
          }
        });

        // Update geojson source on language change
        $rootScope.$on('$translateChangeEnd', function(evt) {
          for (var i = 0; i < realTimeLayersId.length; i++) {
            var bodId = realTimeLayersId[i];
            var olLayer = gaMapUtils.getMapLayerForBodId(map, bodId);
            var olSource = olLayer.getSource();
            var indexLayerId = realTimeLayersId.indexOf(bodId);
            $timeout.cancel(timers.splice(indexLayerId, 1));
            setLayerSource(olLayer);
          }
        });
      };
    };
  });
})();
