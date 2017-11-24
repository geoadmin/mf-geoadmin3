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
        gaGlobalOptions, $window, $translate, $http) {

      // Store getCapabilitites
      var store = {};
      var epsg4326 = ol.proj.get('EPSG:4326');
      var epsg3857 = ol.proj.get('EPSG:3857');
      var projSupported = [epsg4326, epsg3857];

      var getCesiumImageryProvider = function(layer) {
        if (!layer.displayIn3d) {
          return;
        }
        var source = layer.getSource();
        var proj = source.getProjection();
        var matrixSet = source.getMatrixSet();
        var matrixSetFound = false;
        var tilingScheme;

        var isGoodMatrixSet = function(sourceMatrixSet, sourceProj, proj3d) {
          if (ol.proj.equivalent(sourceProj, proj3d)) {
            matrixSet = sourceMatrixSet;
            tilingScheme = proj3d.getCode() === 'EPSG:4326' ?
              new Cesium.GeographicTilingScheme() :
              new Cesium.WebMercatorTilingScheme();
            return true;
          }
        };

        // Display in 3d only layers with a matrixSet compatible
        if (proj) {
          matrixSetFound = projSupported.some(function(p) {
            return isGoodMatrixSet(matrixSet, proj, p);
          });
        }
        if (!matrixSetFound && store[layer.url]) {
          matrixSetFound = projSupported.some(function(p) {
            var opt = ol.source.WMTS.optionsFromCapabilities(store[layer.url], {
              layer: source.getLayer(),
              projection: p
            });
            return isGoodMatrixSet(opt.matrixSet, opt.projection, p);
          });
        }

        if (!matrixSetFound) {
          layer.displayIn3d = false;
          return;
        }

        var tpl = source.getUrls()[0];
        if (source.getRequestEncoding() === 'KVP') {
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
          minimumRetrievingLevel: gaGlobalOptions.minimumRetrievingLevel,
          url: tpl,
          rectangle: gaMapUtils.extentToRectangle(layer.getExtent()),
          proxy: gaUrlUtils.getCesiumProxy(),
          tilingScheme: tilingScheme,
          hasAlphaChannel: !/jp/i.test(source.getFormat()),
          availableLevels: gaGlobalOptions.imageryAvailableLevels
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

      var getLayerOptions = function(map, getCapLayer, getCap, getCapUrl) {

        var attribution, attributionUrl;
        var extent = getLayerExtentFromGetCap(map, getCapLayer);
        var sourceConfig = ol.source.WMTS.optionsFromCapabilities(getCap, {
          layer: getCapLayer.Identifier,
          projection: map.getView().getProjection()
        });

        if (getCap.ServiceProvider) {
          attribution = getCap.ServiceProvider.ProviderName;
          attributionUrl = getCap.ServiceProvider.ProviderSite;
        } else {
          attribution = gaUrlUtils.getHostname(getCapLayer.capabilitiesUrl);
          attributionUrl = getCapLayer.capabilitiesUrl;
        }

        var options = {
          capabilitiesUrl: getCapUrl,
          label: getCapLayer.Title,
          layer: getCapLayer.Identifier,
          timestamps: getTimestamps(getCapLayer),
          extent: extent,
          sourceConfig: sourceConfig
        };

        options.sourceConfig.attributions = [
          '<a href="' + attributionUrl + '" target="new">' + attribution +
            '</a>'
        ];

        return options;
      };

      var getLayerOptionsFromIdentifier = function(map, getCap, identifier,
          getCapUrl) {
        store[getCapUrl] = getCap;
        var options;

        if (getCap.Contents && getCap.Contents.Layer) {
          getCap.Contents.Layer.forEach(function(layer) {
            if (layer.Identifier === identifier) {
              options = getLayerOptions(map, layer, getCap, getCapUrl);
            }
          });
        }

        return options;
      };

      var Wmts = function() {

        this.getOlLayerFromGetCap = function(map, getCap, layerIdentifier,
            options) {
          if (angular.isString(getCap)) {
            getCap = new ol.format.WMTSCapabilities().read(getCap);
          }
          var layerOptions = getLayerOptionsFromIdentifier(map, getCap,
              layerIdentifier, options.capabilitiesUrl);
          layerOptions.opacity = options.opacity || 1;
          layerOptions.visible = options.visible || true;
          layerOptions.time = options.timestamp;
          return createWmtsLayer(layerOptions);
        };

        // Create a WMTS layer from a GetCapabilities string or an ol object
        // and a layer's identifier.
        // This fction is not used outside gaWmts but it's convenient for test.
        this.addWmtsToMapFromGetCap = function(map, getCap, layerIdentifier,
            options) {
          var olLayer = this.getOlLayerFromGetCap(map, getCap, layerIdentifier,
              options);
          if (options.index) {
            map.getLayers().insertAt(options.index, olLayer);
          } else {
            map.addLayer(olLayer);
          }
          return olLayer;
        };

        // Create a WMTS layer from a GetCapabiltiies url and a layer's
        // identifier.
        this.addWmtsToMapFromGetCapUrl = function(map, getCapUrl,
            layerIdentifier, layerOptions) {
          var that = this;
          var url = gaUrlUtils.buildProxyUrl(getCapUrl);
          return $http.get(url, {
            cache: true

          }).then(function(response) {
            var data = response.data;
            layerOptions.capabilitiesUrl = getCapUrl;
            return that.addWmtsToMapFromGetCap(map, data, layerIdentifier,
                layerOptions);

          }, function(reason) {
            $window.console.error('Loading of external WMTS layer ' +
                layerIdentifier +
                ' failed. Failed to get capabilities from server.' +
                'Reason : ' + reason);
          });
        };
      };
      return new Wmts();
    };
  });
})();
