goog.provide('ga_wms_service');

goog.require('ga_map_service');
goog.require('ga_translation_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_wms_service', [
    'pascalprecht.translate',
    'ga_map_service',
    'ga_urlutils_service',
    'ga_translation_service'
  ]);

  /**
   * Manage external WMS layers
   */
  module.provider('gaWms', function() {
    this.$get = function(gaDefinePropertiesForLayer, gaMapUtils, gaUrlUtils,
        gaGlobalOptions, $q, gaLang) {
      var getCesiumImageryProvider = function(layer) {
        var params = layer.getSource().getParams();
        var proxy;
        if (!gaUrlUtils.isAdminValid(layer.url)) {
          proxy = {
            getURL: function(resource) {
               return gaGlobalOptions.ogcproxyUrl +
                   encodeURIComponent(resource);
            }
          };
        }
        var wmsParams = {
          layers: params.LAYERS,
          format: params.FORMAT || 'image/png',
          service: 'WMS',
          version: params.VERSION || '1.3.0',
          request: 'GetMap',
          crs: 'EPSG:4326',
          bbox: '{southProjected},{westProjected},' +
                '{northProjected},{eastProjected}',
          width: '256',
          height: '256',
          styles: params.STYLES || 'default',
          transparent: 'true'
        };

        if (wmsParams.version == '1.1.1') {
          wmsParams.srs = wmsParams.crs;
          delete wmsParams.crs;
          wmsParams.bbox = '{westProjected},{southProjected},' +
                           '{eastProjected},{northProjected}';
        }

        var extent = gaGlobalOptions.defaultExtent;
        return new Cesium.UrlTemplateImageryProvider({
          minimumRetrievingLevel: window.minimumRetrievingLevel,
          url: gaUrlUtils.append(layer.url, gaUrlUtils.toKeyValue(wmsParams)),
          rectangle: gaMapUtils.extentToRectangle(extent),
          proxy: proxy,
          tilingScheme: new Cesium.GeographicTilingScheme(),
          hasAlphaChannel: true,
          availableLevels: window.imageryAvailableLevels
        });

      };

      var Wms = function() {

        // Test WMS 1.1.1 with  https://wms.geo.bs.ch/wmsBS
        var createWmsLayer = function(params, options, index) {
          options = options || {};
          options.id = 'WMS||' + options.label + '||' + options.url + '||' +
              params.LAYERS;

          // If the WMS has a version specified, we add it in
          // the id. It's important that the layer keeps the same id as the
          // one in the url otherwise it breaks the asynchronous reordering of
          // layers.
          if (params.VERSION) {
            options.id += '||' + params.VERSION;

            if (options.useReprojection) {
              options.projection = 'EPSG:4326';
              options.id += '||true';
            }
          } else {
            params.VERSION = '1.3.0';
          }

          var source = new ol.source.ImageWMS({
            params: params,
            url: options.url,
            ratio: options.ratio || 1,
            projection: options.projection
          });

          var layer = new ol.layer.Image({
            id: options.id,
            url: options.url,
            type: 'WMS',
            opacity: options.opacity,
            visible: options.visible,
            attribution: options.attribution,
            extent: options.extent,
            source: source
          });
          gaDefinePropertiesForLayer(layer);
          layer.preview = options.preview;
          layer.displayInLayerManager = !layer.preview;
          layer.useThirdPartyData = gaUrlUtils.isThirdPartyValid(options.url);
          layer.label = options.label;
          layer.getCesiumImageryProvider = function() {
            return getCesiumImageryProvider(layer);
          };
          return layer;
        };

        // Create an ol WMS layer from GetCapabilities informations
        this.getOlLayerFromGetCapLayer = function(getCapLayer) {
          var wmsParams = {
            LAYERS: getCapLayer.Name,
            VERSION: getCapLayer.wmsVersion
          };
          var wmsOptions = {
            url: getCapLayer.wmsUrl,
            label: getCapLayer.Title,
            extent: gaMapUtils.intersectWithDefaultExtent(getCapLayer.extent),
            useReprojection: getCapLayer.useReprojection
          };
          return createWmsLayer(wmsParams, wmsOptions);
        };

        // Create a WMS layer and add it to the map
        this.addWmsToMap = function(map, layerParams, layerOptions, index) {
          var olLayer = createWmsLayer(layerParams, layerOptions);
          if (index) {
            map.getLayers().insertAt(index, olLayer);
          } else {
            map.addLayer(olLayer);
          }
          return olLayer;
        };

        // Make a GetLegendGraphic request
        this.getLegend = function(layer) {
          var defer = $q.defer();
          var params = layer.getSource().getParams();
          var html = '<img alt="No legend available" src="' +
              gaUrlUtils.append(layer.url, gaUrlUtils.toKeyValue({
            request: 'GetLegendGraphic',
            layer: params.LAYERS,
            style: params.STYLES || 'default',
            service: 'WMS',
            version: params.VERSION || '1.3.0',
            format: 'image/png',
            sld_version: '1.1.0',
            lang: gaLang.get()
          })) + '"></img>';
          defer.resolve({data: html});
          return defer.promise;
        };
      };
      return new Wms();
    };
  });
})();
