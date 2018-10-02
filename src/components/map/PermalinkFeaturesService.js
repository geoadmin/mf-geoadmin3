goog.provide('ga_permalinkfeatures_service');

goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_permalink_service');
goog.require('ga_previewfeatures_service');

(function() {

  var module = angular.module('ga_permalinkfeatures_service', [
    'ga_layers_service',
    'ga_maputils_service',
    'ga_permalink_service',
    'ga_previewfeatures_service'
  ]);

  module.provider('gaPermalinkFeaturesManager', function() {
    this.$get = function($rootScope, gaPermalink, gaLayers, gaPreviewFeatures,
        gaMapUtils) {
      var queryParams = gaPermalink.getParams();

      return function(map) {
        gaLayers.loadConfig().then(function() {
          var featureIdsCount = 0;
          var featureIdsByBodId = {};
          var paramKey;
          var listenerKey;
          var forceZoom;

          if (queryParams.zoom !== undefined && isFinite(queryParams.zoom)) {
            forceZoom = parseInt(queryParams.zoom);
          }

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
                // Add the layer only if the 'layers' param doesn't contain the
                // layer's bodId.
                if ((!queryParams.layers ||
                    queryParams.layers.indexOf(bodId) === -1) &&
                    !gaMapUtils.getMapOverlayForBodId(map, bodId)) {
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

          // only use by SEO directive
          $rootScope.$broadcast('gaPermalinkFeaturesAdd', {
            featureIdsByBodId: featureIdsByBodId,
            count: featureIdsCount
          });

          if (featureIdsCount > 0) {
            var featuresShown = gaPreviewFeatures.addBodFeatures(map,
                featureIdsByBodId, removeParamsFromPL, forceZoom);

            if (queryParams.showTooltip === 'true') {
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
              if (featureIdsCount === 0 && listenerKey) {
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
