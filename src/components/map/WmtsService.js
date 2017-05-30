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

      var getCesiumImageryProvider = function(layer) {
        // Display in 3d only layers with a matrixSet compatible
        if (!/4326/g.test(layer.getSource().getMatrixSet())) {
          return;
        }
        var source = layer.getSource();
        var tpl = source.getUrls()[0]
            .replace('{Style}', source.getStyle())
            .replace('{Time}', layer.time)
            .replace('{TileMatrixSet}', '4326')
            .replace('{TileMatrix}', '{z}')
            .replace('{TileCol}', '{x}')
            .replace('{TileRow}', '{y}');
        return new Cesium.UrlTemplateImageryProvider({
          minimumRetrievingLevel: window.minimumRetrievingLevel,
          url: tpl,
          rectangle: gaMapUtils.extentToRectangle(layer.getExtent()),
          proxy: gaUrlUtils.getCesiumProxy(),
          tilingScheme: new Cesium.GeographicTilingScheme(),
          hasAlphaChannel: true,
          availableLevels: window.imageryAvailableLevels
        });
      };

      // Create an WMTS layer
      var createWmtsLayer = function(options) {
        var source = new ol.source.WMTS(options.sourceConfig);
        var layer = new ol.layer.Tile({
          id: 'WMTS||' + options.layer + '||' + options.capabilitiesUrl,
          source: source,
          extent: gaMapUtils.intersectWithDefaultExtent(options.extent),
          preload: gaMapUtils.preload
        });
        gaDefinePropertiesForLayer(layer);
        layer.useThirdPartyData =
            gaUrlUtils.isThirdPartyValid(options.sourceConfig.urls[0]);
        layer.label = options.label;
        layer.url = options.capabilitiesUrl;
        layer.timestamps = options.timestamps;
        layer.type = 'WMTS';
        layer.timeEnabled = (layer.timestamps && layer.timestamps.length > 1);
        if (options.time) {
          layer.time = options.time;
        }
        layer.getCesiumImageryProvider = function() {
          return getCesiumImageryProvider(layer);
        };
        return layer;
      };

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
      };

      // Get the layer extent defines in the GetCapabilities
      var getLayerExtentFromGetCap = function(getCapLayer, proj) {
        var wgs84Extent = getCapLayer.WGS84BoundingBox;
        if (wgs84Extent) {
          var wgs84 = 'EPSG:4326';
          var projCode = proj.getCode();
          // If only an extent in wgs 84 is available, we use the
          // intersection between proj extent and layer extent as the new
          // layer extent. We compare extients in wgs 84 to avoid
          // transformations errors of large wgs 84 extent like
          // (-180,-90,180,90)
          var projWgs84Extent = ol.proj.transformExtent(proj.getExtent(),
              projCode, wgs84);
          var layerWgs84Extent = ol.extent.getIntersection(projWgs84Extent,
              wgs84Extent);
          if (layerWgs84Extent) {
            return ol.proj.transformExtent(layerWgs84Extent, wgs84, projCode);
          }
        }
      };

      var getLayerOptions = function(getCapLayer, getCapabilities) {
        if (getCapabilities) {
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
          getCapLayer.attributionUrl =
              getCapabilities.ServiceProvider.ProviderSite;
          getCapLayer.capabilitiesUrl = getCapabilities.OperationsMetadata
              .GetCapabilities
              .DCP
              .HTTP
              .Get[0]
              .href;
          getCapLayer.extent = getLayerExtentFromGetCap(getCapLayer,
              new ol.proj(gaGlobalOptions.defaultEpsg));
        }

        var options = {
          capabilitiesUrl: getCapLayer.capabilitiesUrl,
          label: getCapLayer.Title,
          layer: getCapLayer.Identifier,
          timestamps: getTimestamps(getCapLayer),
          extent: getCapLayer.extent,
          sourceConfig: getCapLayer.sourceConfig,
        };

        options.sourceConfig.attributions = [
          '<a href="' + getCapLayer.attributionUrl + '" target="new">' +
              getCapLayer.attribution + '</a>'
        ];

        return options;
      };

      var Wmts = function() {

        this.getLayerOptionsFromIdentifier = function(getCapabilities,
            identifier) {
          if (getCapabilities.Contents && getCapabilities.Contents.Layer) {
            getCapabilities.Contents.Layer.forEach(function(layer) {
              if (layer.Identifier === identifier) {
                return getLayerOptions(layer, getCapabilities);
              }
            });
          }
        };

        this.getOlLayerFromGetCapLayer = function(getCapLayer) {
          var layerOptions = getLayerOptions(getCapLayer);
          return createWmtsLayer(layerOptions);
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
