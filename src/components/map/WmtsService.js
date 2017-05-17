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

        var getLayerConfig = function(getCapabilities, getCapLayer) {
          var requestEncoding = getCapabilities.OperationsMetadata
              .GetTile
              .DCP
              .HTTP
              .Get[0]
              .Constraint[0]
              .AllowedValues
              .Value[0];

          var layerOptions = {
            layer: getCapLayer.Identifier,
            requestEncoding: requestEncoding
          };
          getCapLayer.sourceConfig = ol.source.WMTS.optionsFromCapabilities(
              getCapabilities, layerOptions);
          getCapLayer.attribution =
              getCapabilities.ServiceProvider.ProviderName;
          getCapLayer['attributionUrl'] =
              getCapabilities.ServiceProvider.ProviderSite;
          getCapLayer['capabilitiesUrl'] = getCapabilities.OperationsMetadata
              .GetCapabilities
              .DCP
              .HTTP
              .Get[0]
              .href;

          return {
            capabilitiesUrl: getCapLayer.capabilitiesUrl,
            label: getCapLayer.Title,
            layer: getCapLayer.Identifier,
            timestamps: getTimestamps(getCapLayer),
            sourceConfig: getCapLayer.sourceConfig,
          };
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
        var createWmtsLayer = function(options) {
          var source = new ol.source.WMTS(options.sourceConfig);
          var projection = source.getProjection();
          var extent;
          if (projection) {
            extent = projection.getExtent();
          } else {
            extent = gaGlobalOptions.defaultExtent;
          }
          var layer = new ol.layer.Tile({
            id: 'WMTS||' + options.layer + '||' + options.capabilitiesUrl,
            source: source,
            extent: gaMapUtils.intersectWithDefaultExtent(extent),
            preload: gaMapUtils.preload
          });
          gaDefinePropertiesForLayer(layer);
          layer.useThirdPartyData =
              gaUrlUtils.isThirdPartyValid(options.sourceConfig.urls[0]);
          layer.label = options.label;
          layer.url = options.capabilitiesUrl;
          layer.timestamps = options.timestamps;
          layer.timeEnabled = (layer.timestamps && layer.timestamps.length > 1);
          layer.time = options.timestamp;

          return layer;
        };

        this.getOlLayerFromGetCapLayer = function(getCapLayer) {
          var options = {
            capabilitiesUrl: getCapLayer.capabilitiesUrl,
            label: getCapLayer.Title,
            layer: getCapLayer.Identifier,
            timestamps: getTimestamps(getCapLayer),
            sourceConfig: getCapLayer.sourceConfig,
          };
          options.sourceConfig.attributions = [
            '<a href="' +
                getCapLayer.attributionUrl +
                '" target="new">' +
                getCapLayer.attribution + '</a>'
          ];

          return createWmtsLayer(options);
        };

        // Create a WMTS layer and add it to the map
        this.addWmtsToMap = function(map, layerOptions, index) {
          var olLayer = createWmtsLayer(layerOptions);
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
