goog.provide('ga_wmts_service');

goog.require('ga_map_service');
goog.require('ga_translation_service');
goog.require('ga_urlutils_service');

(function() {
  var module = angular.module('ga_wmts_service', [
    'ga_map_service',
    'ga_urlutils_service'
  ]);

  /**
   * Manage external WMTS layers
   */
  module.provider('gaWmts', function() {
    this.$get = function(gaDefinePropertiesForLayer, gaMapUtils, gaUrlUtils,
        gaGlobalOptions) {
      var Wmts = function() {

        var getTimestamps = function(getCapLayer) {
          if (getCapLayer.Dimension) {
            // Enable time selector if layer has multiple values for the time
            // dimension if the layers has dimensions.
            for (var i = 0; i < getCapLayer.Dimension.length; i++) {
              var dimension = getCapLayer.Dimension[i];
              if (dimension.Identifier === 'Time') {
                return dimension.Value;
              }
            }
          }

          return undefined;
        };

        var getLayerConfig = function(getCapabilities, layer) {
          var requestEncoding = getCapabilities.OperationsMetadata
              .GetTile
              .DCP
              .HTTP
              .Get[0]
              .Constraint[0]
              .AllowedValues
              .Value[0];

          var layerOptions = {
            layer: layer.Identifier,
            requestEncoding: requestEncoding
          };
          layer.sourceConfig = ol.source.WMTS.optionsFromCapabilities(
              getCapabilities, layerOptions);
          layer.attribution = getCapabilities.ServiceProvider.ProviderName;
          layer['attributionUrl'] =
              getCapabilities.ServiceProvider.ProviderSite;
          layer['capabilitiesUrl'] = getCapabilities.OperationsMetadata
              .GetCapabilities
              .DCP
              .HTTP
              .Get[0]
              .href;

          return layer;
        };

        this.getLayerConfigFromIdentifier = function(getCapabilities,
            identifier) {
          var layerConfig;
          if (getCapabilities.Contents && getCapabilities.Contents.Layer) {
            getCapabilities.Contents.Layer.forEach(function(layer) {
              if (layer.Identifier === identifier) {
                layerConfig = getLayerConfig(getCapabilities, layer);
              }
            });
          }

          return layerConfig;
        };

        // Create an ol WMTS layer from GetCapabilities informations
        this.getOlLayerFromGetCapLayer = function(getCapLayer) {
          getCapLayer.sourceConfig.attributions = [
            '<a href="' +
                getCapLayer.attributionUrl +
                '" target="new">' +
                getCapLayer.attribution + '</a>'
          ];
          var source = new ol.source.WMTS(getCapLayer.sourceConfig);
          var projection = source.getProjection();
          var extent;
          if (projection) {
            extent = projection.getExtent();
          } else {
            extent = gaGlobalOptions.defaultExtent;
          }
          var layer = new ol.layer.Tile({
            id: 'WMTS||' + getCapLayer.Identifier + '||' +
              getCapLayer.capabilitiesUrl,
            source: source,
            extent: gaMapUtils.intersectWithDefaultExtent(extent),
            preload: gaMapUtils.preload,
            attribution: getCapLayer.sourceConfig.attribution
          });
          gaDefinePropertiesForLayer(layer);
          layer.useThirdPartyData =
              gaUrlUtils.isThirdPartyValid(getCapLayer.sourceConfig.urls[0]);
          layer.label = getCapLayer.Title;
          layer.url = getCapLayer.attributionUrl;
          layer.attributions = getCapLayer.attributions;
          layer.timestamps = getTimestamps(getCapLayer);
          layer.timeEnabled = layer.timestamps ? layer.timestamps.length > 1 : false;

          return layer;
        };

        // Create a WMTS layer and add it to the map
        this.addWmtsToMap = function(map, layerOptions, index) {
          var olLayer = this.getOlLayerFromGetCapLayer(layerOptions);
          if (index) {
            map.getLayers().insertAt(index, olLayer);
          } else {
            map.addLayer(olLayer);
          }
          return olLayer;
        };
      };
      return new Wmts();
    };
  });
})();
