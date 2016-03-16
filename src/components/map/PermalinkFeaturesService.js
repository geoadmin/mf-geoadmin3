goog.provide('ga_permalinkfeatures_service');

goog.require('ga_map_service');
goog.require('ga_permalink_service');
goog.require('ga_previewfeatures_service');

(function() {

  var module = angular.module('ga_permalinkfeatures_service', [
    'ga_map_service',
    'ga_permalink_service',
    'ga_previewfeatures_service'
  ]);

  module.provider('gaPermalinkFeaturesManager', function() {
    this.$get = function($rootScope, gaPermalink, gaLayers,
        gaPreviewFeatures, gaMapUtils) {
      var queryParams = gaPermalink.getParams();
      var layersParamValue = queryParams.layers;
      var layerSpecs = layersParamValue ? layersParamValue.split(',') : [];

      return function(map) {
        gaLayers.loadConfig().then(function() {
          var featureIdsCount = 0;
          var featureIdsByBodId = {};
          var paramKey;
          var listenerKey;
          for (paramKey in queryParams) {
            if (gaLayers.getLayer(paramKey)) {
              var bodId = paramKey;
              if (!(bodId in featureIdsByBodId)) {
                featureIdsByBodId[bodId] = [];
              }
              var featureIds = queryParams[bodId].split(',');
              if (featureIds.length > 0) {
                featureIdsCount += featureIds.length;
                Array.prototype.push.apply(featureIdsByBodId[bodId],
                    featureIds);
                if (!gaMapUtils.getMapOverlayForBodId(map, bodId) &&
                    layerSpecs.indexOf(bodId) == -1) {
                  map.addLayer(gaLayers.getOlLayerById(bodId));
                }
              }
            }
          }

          var removeParamsFromPL = function() {
            var bodId;
            for (bodId in featureIdsByBodId) {
              gaPermalink.deleteParam(bodId);
            }
            featureIdsCount = 0;
          };

          $rootScope.$broadcast('gaPermalinkFeaturesAdd', {
            featureIdsByBodId: featureIdsByBodId,
            count: featureIdsCount
          });

          if (featureIdsCount > 0) {
            var featuresShown = gaPreviewFeatures.addBodFeatures(map,
                featureIdsByBodId, removeParamsFromPL);

            if (queryParams.showTooltip == 'true') {
              featuresShown.then(function(features) {
                $rootScope.$broadcast('gaTriggerTooltipRequest', {
                  features: features,
                  onCloseCB: function() {
                    gaPermalink.deleteParam('showTooltip');
                  },
                  nohighlight: true
                });
              });
            }

            // When a layer is removed, we need to update the permalink
            listenerKey = map.getLayers().on('remove', function(event) {
              var layerBodId = event.element.bodId;
              if (featureIdsCount > 0 && (layerBodId in featureIdsByBodId)) {
                featureIdsCount -= featureIdsByBodId[layerBodId].length;
                gaPermalink.deleteParam(layerBodId);
              }
              if (featureIdsCount == 0 && listenerKey) {
                // Unlisten the remove event when there is no more features
                // (from permalink) displayed.
                ol.Observable.unByKey(listenerKey);
              }
            });
          }
        });
      };
    };
  });
})();
