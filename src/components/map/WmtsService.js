goog.provide('ga_wmts_service');

goog.require('ga_definepropertiesforlayer_service');
goog.require('ga_maputils_service');
goog.require('ga_translation_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_wmts_service', [
    'ga_definepropertiesforlayer_service',
    'ga_maputils_service',
    'ga_urlutils_service'
  ]);

  /**
   * Manage external WMTS layers
   */
  module.provider('gaWmts', function() {
    this.$get = function(gaDefinePropertiesForLayer, gaMapUtils, gaUrlUtils,
        gaGlobalOptions, $window, $translate) {

      // Store getCapabilitites
      var store = {};

      var is4326 = function(matrixSet) {
        return /(4326|WGS.*84|CRS.*84)/gi.test(matrixSet)
      };

      var getCesiumImageryProvider = function(layer) {
        var source = layer.getSource();
        var matrixSet = source.getMatrixSet();
        // Display in 3d only layers with a matrixSet compatible
        if (!is4326(matrixSet) && store[layer.url]) {
          var opt = ol.source.WMTS.optionsFromCapabilities(store[layer.url], {
            layer: source.getLayer(),
            projection: 'EPSG:4326'
          });
          matrixSet = opt.matrixSet;
        }

        if (!is4326(matrixSet)) {
          $window.alert(
              $translate.instant('wmts_service_doesnt_support_4326') +
              layer.label);
          return;
        }
        var tpl = source.getUrls()[0];
        if (source.getRequestEncoding() == 'KVP') {
          tpl += 'service=WMTS&version=1.0.0&request=GetTile' +
              '&layer=' + source.getLayer() +
              '&format=' + source.getFormat() +
              '&style={Style}' +
              '&time={Time}' +
              '&tilematrixset={TileMatrixSet}' +
              '&tilematrix={TileMatrix}' +
              '&tilecol={TileCol}' +
              '&tilerow={TileRow}';
        }
        tpl = tpl.replace('{Style}', source.getStyle()).
            replace('{Time}', layer.time).
            replace('{TileMatrixSet}', matrixSet).
            replace('{TileMatrix}', '{z}').
            replace('{TileCol}', '{x}').
            replace('{TileRow}', '{y}');
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
        options.sourceConfig.transition = 0;
        var source = new ol.source.WMTS(options.sourceConfig);
        var layer = new ol.layer.Tile({
          id: 'WMTS||' + options.layer + '||' + options.capabilitiesUrl,
          source: source,
          extent: gaMapUtils.intersectWithDefaultExtent(options.extent),
          preload: gaMapUtils.preload,
          opacity: options.opacity,
          visible: options.visible,
          attribution: options.attribution
        });
        gaDefinePropertiesForLayer(layer);
        layer.useThirdPartyData =
            gaUrlUtils.isThirdPartyValid(options.sourceConfig.urls[0]);
        layer.label = options.label;
        layer.url = options.capabilitiesUrl;
        layer.timestamps = options.timestamps;
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
      var getLayerExtentFromGetCap = function(map, getCapLayer) {
        var wgs84Extent = getCapLayer.WGS84BoundingBox;
        var proj = map.getView().getProjection();
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

      var getLayerOptions = function(map, getCapLayer, getCapabilities,
          getCapUrl) {
        if (getCapabilities) {
          var layerOptions = {
            layer: getCapLayer.Identifier,
            projection: map.getView().getProjection()
          };
          getCapLayer.sourceConfig = ol.source.WMTS.optionsFromCapabilities(
              getCapabilities, layerOptions);
          getCapLayer.capabilitiesUrl = getCapUrl;
          store[getCapUrl] = getCapabilities;
          if (getCapabilities.ServiceProvider) {
            getCapLayer.attribution =
                getCapabilities.ServiceProvider.ProviderName;
            getCapLayer.attributionUrl =
                getCapabilities.ServiceProvider.ProviderSite;
          } else {
            getCapLayer.attribution =
                gaUrlUtils.getHostname(getCapLayer.capabilitiesUrl);
            getCapLayer.attributionUrl = getCapLayer.capabilitiesUrl;
          }
          getCapLayer.extent = getLayerExtentFromGetCap(map, getCapLayer);
        }

        var options = {
          capabilitiesUrl: getCapLayer.capabilitiesUrl,
          label: getCapLayer.Title,
          layer: getCapLayer.Identifier,
          timestamps: getTimestamps(getCapLayer),
          extent: getCapLayer.extent,
          sourceConfig: getCapLayer.sourceConfig
        };

        options.sourceConfig.attributions = [
          '<a href="' + getCapLayer.attributionUrl + '" target="new">' +
              getCapLayer.attribution + '</a>'
        ];

        return options;
      };

      var Wmts = function() {

        this.getLayerOptionsFromIdentifier = function(map, getCapabilities,
            identifier, getCapUrl) {
          var options;

          if (getCapabilities.Contents && getCapabilities.Contents.Layer) {
            getCapabilities.Contents.Layer.forEach(function(layer) {
              if (layer.Identifier === identifier) {
                options = getLayerOptions(map, layer, getCapabilities,
                    getCapUrl);
              }
            });
          }

          return options;
        };

        this.getOlLayerFromGetCapLayer = function(map, getCapLayer) {
          var layerOptions = getLayerOptions(map, getCapLayer);
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
