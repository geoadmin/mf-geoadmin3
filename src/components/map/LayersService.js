goog.provide('ga_layers_service');

goog.require('ga_definepropertiesforlayer_service');
goog.require('ga_maputils_service');
goog.require('ga_networkstatus_service');
goog.require('ga_permalink_service');
goog.require('ga_stylesfromliterals_service');
goog.require('ga_tilegrid_service');
goog.require('ga_time_service');
goog.require('ga_translation_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_layers_service', [
    'ga_maputils_service',
    'ga_networkstatus_service',
    'ga_storage_service',
    'ga_stylesfromliterals_service',
    'ga_tilegrid_service',
    'ga_definepropertiesforlayer_service',
    'ga_time_service',
    'ga_urlutils_service',
    'ga_permalink_service',
    'ga_translation_service',
    'pascalprecht.translate'
  ]);

  /**
   * Manage BOD layers
   */
  module.provider('gaLayers', function() {

    this.$get = function($http, $q, $rootScope, $window,
        gaBrowserSniffer, gaDefinePropertiesForLayer, gaMapUtils,
        gaNetworkStatus, gaStorage, gaTileGrid, gaUrlUtils,
        gaStylesFromLiterals, gaGlobalOptions, gaPermalink,
        gaLang, gaTime, gaStyleFactory) {

      var h2 = function(domainsArray) {
        if (gaBrowserSniffer.h2) {
          // Only Cloudfront supports h2, so only subs > 100
          for (var i = 0; i < domainsArray.length; i++) {
            if (parseInt(domainsArray[i]) > 99) {
              return [domainsArray[i]];
            }
          }
        }
        return domainsArray;
      };

      var geojsonPromises = {};

      var stylePromises = {};

      var Layers = function(
          wmsSubdomains,
          wmtsSubdomains,
          vectorTilesSubdomains,
          wmsUrl,
          wmtsUrl,
          wmtsLV03Url,
          terrainUrl,
          vectorTilesUrl,
          layersConfigUrl,
          legendUrl) {

        var layers;

        // Returns a unique WMS template url (e.g. //wms{s}.geo.admin.ch)
        var getWmsTpl = function(url, wmsParams) {
          if (url && /(request|service|version)/i.test(url)) {
            url = gaUrlUtils.remove(url, ['request', 'service', 'version'],
                true);
          }
          if (wmsParams) {
            url = gaUrlUtils.append(url, gaUrlUtils.toKeyValue(wmsParams));
          }
          return url;
        };

        // Returns a list of WMS or WMTS servers using a template
        // (e.g. //wms{s}.geo.admin.ch or wmts{s}.geo.admin.ch) and an array of
        // subdomains (e.g. ['', '1', ...]).
        var getImageryUrls = function(tpl, subdomains) {
          var urls = [];
          (subdomains || ['']).forEach(function(subdomain) {
            urls.push(tpl.replace('{s}', subdomain));
          });
          return urls;
        };

        var getWmtsGetTileTpl = function(layer, tileMatrixSet, format) {
          var tpl;
          if (tileMatrixSet === '21781') {
            tpl = wmtsLV03Url;
          } else {
            tpl = wmtsUrl;
          }
          var url = tpl.replace('{Layer}', layer).replace('{Format}', format);
          if (tileMatrixSet) {
            url = url.replace('{TileMatrixSet}', tileMatrixSet);
          }
          return url;
        };

        var cpt;
        var getVectorTilesUrl = function(layer, time, subdomains) {
          if (cpt === undefined || cpt >= subdomains.length) {
            cpt = 0;
          }
          return vectorTilesUrl.
              replace('{s}', subdomains[cpt++]).
              replace('{Layer}', layer).
              replace('{Time}', time);
        };

        var getLayersConfigUrl = function(lang) {
          return layersConfigUrl.
              replace('{Lang}', lang);
        };

        var getMetaDataUrl = function(layer, lang) {
          return legendUrl.
              replace('{Layer}', layer).
              replace('{Lang}', lang);
        };

        // Function to remove the blob url from memory.
        var revokeBlob = function() {
          $window.URL.revokeObjectURL(this.src);
          this.removeEventListener('load', revokeBlob);
        };

        // The tile load function which loads tiles from local
        // storage if they exist otherwise try to load the tiles normally.
        var tileLoadFunction = function(imageTile, src) {
          var onSuccess = function(content) {
            if (content && $window.URL && $window.atob) {
              try {
                var blob = gaMapUtils.dataURIToBlob(content);
                imageTile.getImage().addEventListener('load', revokeBlob);
                imageTile.getImage().src = $window.URL.createObjectURL(blob);
              } catch (e) {
                // INVALID_CHAR_ERROR on ie and ios(only jpeg), it's an
                // encoding problem.
                // TODO: fix it
                imageTile.getImage().src = content;
              }
            } else {
              imageTile.getImage().src = (content) || src;
            }
          };
          gaStorage.getTile(gaMapUtils.getTileKey(src)).then(onSuccess);
        };

        // Load layers config
        var lastLangUsed;
        var loadLayersConfig = function(lang) {
          if (lastLangUsed === lang) {
            return;
          }
          lastLangUsed = lang;
          var url = getLayersConfigUrl(lang);
          return $http.get(url, {
            cache: true
          }).then(function(response) {

            // Live modifications for 3d test
            if (response.data) {
              // Test layers opaque setting
              var ids = [
                'ch.swisstopo.swissimage-product',
                'ch.swisstopo.swissimage-product_3d',
                'ch.swisstopo.pixelkarte-farbe',
                'ch.swisstopo.pixelkarte-farbe_3d',
                'ch.swisstopo.pixelkarte-grau',
                'ch.swisstopo.pixelkarte-grau_3d',
                'ch.swisstopo.swisstlm3d-karte-farbe',
                'ch.swisstopo.swisstlm3d-karte-farbe_3d',
                'ch.swisstopo.swisstlm3d-karte-grau',
                'ch.swisstopo.swisstlm3d-karte-grau_3d',
                'ch.swisstopo.pixelkarte-farbe-pk25.noscale',
                'ch.swisstopo.pixelkarte-farbe-pk50.noscale',
                'ch.swisstopo.pixelkarte-farbe-pk100.noscale',
                'ch.swisstopo.pixelkarte-farbe-pk200.noscale',
                'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
                'ch.swisstopo.pixelkarte-farbe-pk1000.noscale'
              ];
              angular.forEach(ids, function(id) {
                if (response.data[id]) {
                  response.data[id].opaque = true;
                }
              });

              // Test shop layers allowing multiple results in tooltip.
              ids = [
                'ch.swisstopo.lubis-luftbilder_farbe',
                'ch.swisstopo.lubis-luftbilder_schwarzweiss',
                'ch.swisstopo.lubis-luftbilder_infrarot',
                'ch.swisstopo.lubis-terrestrische_aufnahmen',
                'ch.swisstopo.lubis-bildstreifen',
                'ch.swisstopo.lubis-luftbilder_schraegaufnahmen'
              ];
              angular.forEach(ids, function(id) {
                if (response.data[id]) {
                  response.data[id].shopMulti = true;
                }
              });

              // Terrain
              var lang = gaLang.getNoRm();
              response.data['ch.swisstopo.terrain.3d'] = {
                type: 'terrain',
                serverLayerName: 'ch.swisstopo.terrain.3d',
                timestamps: ['20180601'],
                attribution: 'swisstopo',
                attributionUrl: 'https://www.swisstopo.admin.ch/' + lang +
                    '/home.html'
              };

              // 3D Tileset
              var tileset3d = [
                'ch.swisstopo.swisstlm3d.3d',
                'ch.swisstopo.swissnames3d.3d',
                'ch.swisstopo.vegetation.3d'
              ];
              var tilesetTs = [
                '20180716',
                '20180716',
                '20180716'
              ];
              var tilesetStyle = [
                undefined,
                'labelEnhanced',
                undefined
              ];

              var params = gaPermalink.getParams();
              var pTileset3d = params['tileset3d'];
              var pTilesetTs = params['tilesetTs'];
              tileset3d = pTileset3d ? pTileset3d.split(',') : tileset3d;
              tilesetTs = pTilesetTs ? pTilesetTs.split(',') : tilesetTs;

              tileset3d.forEach(function(tileset3dId, idx) {
                if (tileset3dId) {
                  response.data[tileset3dId.replace('.3d', '_3d')] = {
                    type: 'tileset3d',
                    serverLayerName: tileset3dId,
                    timestamps: [tilesetTs[idx]],
                    attribution: 'swisstopo',
                    attributionUrl: 'https://www.swisstopo.admin.ch/' + lang +
                        '/home.html',
                    style: tilesetStyle[idx],
                    tooltip: false,
                    default3d: true
                  };
                }
              });
              if (response.data['ch.swisstopo.swissnames3d_3d'] &&
                 response.data['ch.swisstopo.swissnames3d']) {
                response.data['ch.swisstopo.swissnames3d'].config3d =
                    'ch.swisstopo.swissnames3d_3d';
              }

              // Set the config2d property
              for (var l in response.data) {
                var data = response.data[l];
                if (response.data.hasOwnProperty(l) && data.config3d) {
                  response.data[data.config3d].config2d = l;
                }
              }

              /* eslint-disable max-len */
              // VectorTile
              // Each object simulates a definition in LayersConfig file and
              // represents a source in a glStyle file.
              // Possible properties:
              //     type:            The type of the layer, always 'vectortile'.
              //     serverLayerName: The id of the layer in the layers config.
              //     sourceId:        The source's id  in the glStyle.
              //                      By default, it takes the serverLayername value.
              //     url:             Template of the url where to get the vectortiles.
              //                      Overrides the source's url property of the glStyle.
              //     styleUrl:        Url's a the glStyle to apply to this layer.
              //                      It will apply styles associated to the sourceId value.
              //                      Used only if the parent has no styleUrl defined (see background layers).
              var vts = [{
                serverLayerName: 'ch.swisstopo.swissnames3d.vt',
                sourceId: 'ch.swisstopo.swissnames3d'
              }, {
                serverLayerName: 'ch.bav.haltestellen-oev.vt',
                sourceId: 'ch.bav.haltestellen-oev'
              }, {
                serverLayerName: 'ch.swisstopo.vektorkarte.vt',
                opacity: 0.75 // Show swissalti
              }];
              /* eslint-enable max-len */

              vts.forEach(function(vt) {
                response.data[vt.serverLayerName] = angular.extend(vt, {
                  type: 'vectortile',
                  sourceId: vt.sourceId || vt.serverLayerName
                });
              });

              response.data['ch.swisstopo.leichte-basiskarte.vt'] = {
                type: 'aggregate',
                background: true,
                serverLayerName: 'ch.swisstopo.leichte-basiskarte.vt',
                attribution: '' +
                  '<a target="_blank" href="https://openmaptiles.org/">OpenMapTiles</a>, ' +
                  '<a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ' +
                  '<a target="_blank" href="https://www.swisstopo.admin.ch/' + lang + '/home.html">swisstopo</a>',
                styles: [{
                  id: 'default',
                  url: 'https://vectortiles.geo.admin.ch/gl-styles/ch.swisstopo.leichte-basiskarte.vt/v006/style.json'
                }, {
                  id: 'color',
                  url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-vintage.vt_v006.json'
                }, {
                  id: 'grey',
                  url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-grey.vt_v006.json'
                }, {
                  id: 'lsd',
                  url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-lsd.vt_v006.json'
                }],
                edits: [{
                  id: 'settlement',
                  regex: /settlement/,
                  props: [
                    ['paint', 'fill-color', '{color}']
                  ]

                }, {
                  id: 'landuse',
                  regex: /landuse/,
                  props: [
                    ['paint', 'fill-color', '{color}']
                  ]

                }, {
                  id: 'hydrology',
                  regex: /hydrology/,
                  props: [
                    ['paint', 'fill-color', '{color}']
                  ]

                }, {
                  id: 'roadtraffic',
                  regex: /roadtraffic/,
                  props: [
                    ['paint', 'line-color', '{color}'],
                    ['paint', 'line-width', '{size}']
                  ]

                }, {
                  id: 'labels',
                  regex: /labels/,
                  props: [
                    ['layout', 'visibility', '{toggle}', 'visible', 'none'],
                    ['paint', 'text-color', '{color}'],
                    ['layout', 'text-size', '{size}']
                  ]
                }, {
                  id: 'woodland',
                  regex: /woodland/,
                  props: [
                    ['paint', 'fill-color', '{color}']
                  ]
                }, {
                  id: 'territory',
                  regex: /territory|background/,
                  props: [
                    ['paint', 'background-color', '{color}']
                  ]
                }]
              };
            }

            if (!layers) { // First load
              layers = response.data;
              // We register events only when layers are loaded
              $rootScope.$on('$translateChangeEnd', function(event, newLang) {
                loadLayersConfig(newLang.language);
              });

            } else { // Only translations has changed
              layers = response.data;
              $rootScope.$broadcast('gaLayersTranslationChange', layers);
            }
            return layers;
          });
        };

        // Load layers configuration with value from permalink
        // gaLang.get() never returns an undefined value on page load.
        var configP = loadLayersConfig(gaLang.get());

        /**
         * Get the promise of the layers config requets
         */
        this.loadConfig = function() {
          return configP;
        };

        this._getTerrainUrl = function(layer, time) {
          return terrainUrl.
              replace('{Layer}', layer).
              replace('{Time}', time);
        };

        /**
         * Returns an Cesium terrain provider.
         */
        this.getCesiumTerrainProviderById = function(bodId) {
          var config3d = this.getConfig3d(layers[bodId]);
          if (!/^terrain$/.test(config3d.type)) {
            return;
          }
          var timestamp = this.getLayerTimestampFromYear(config3d,
              gaTime.get());
          var requestedLayer = config3d.serverLayerName || bodId;
          var provider = new Cesium.CesiumTerrainProvider({
            url: this._getTerrainUrl(requestedLayer, timestamp),
            availableLevels: gaGlobalOptions.terrainAvailableLevels,
            rectangle: gaMapUtils.extentToRectangle(
                gaGlobalOptions.swissExtent)
          });
          provider.bodId = bodId;
          return provider;
        };

        /**
         * Returns an Cesium 3D Tileset.
         */
        this.getCesiumTileset3dById = function(bodId) {
          var config3d = this.getConfig3d(layers[bodId]);
          if (!/^tileset3d$/.test(config3d.type)) {
            return;
          }
          var timestamp = this.getLayerTimestampFromYear(config3d,
              gaTime.get());
          var requestedLayer = config3d.serverLayerName || bodId;
          var url = getVectorTilesUrl(requestedLayer, timestamp,
              h2(vectorTilesSubdomains));
          url += 'tileset.json';
          var tileset = new Cesium.Cesium3DTileset({
            url: url,
            maximumNumberOfLoadedTiles: 3
          });
          tileset.bodId = bodId;
          if (config3d.style) {
            var style = gaStyleFactory.getStyle(config3d.style);
            tileset.style = new Cesium.Cesium3DTileStyle(style);
          }
          return tileset;
        };

        /**
         * Returns an Cesium imagery provider.
         */
        this.getCesiumImageryProviderById = function(bodId, olLayer) {
          var config = layers[bodId];
          var config3d = this.getConfig3d(config);
          if (!/^(wms|wmts|aggregate)$/.test(config3d.type)) {
            // In case, the 2d layer is a layer group we return an empty array
            // otherwise the GaRasterSynchroniser will go through the children
            // then display them in 3d. Another synchronizer will take care to
            // display the good cesium layer for this group.
            if (/^aggregate$/.test(config.type)) {
              return [];
            }
            return;
          }
          var params;
          bodId = config.config3d || bodId;
          var requestedLayer = config3d.wmsLayers || config3d.serverLayerName ||
              bodId;
          var format = config3d.format || 'png';
          // pngjpeg not supported by Cesium (zeitreihen)
          if (format === 'pngjpeg') {
            format = 'jpeg';
          }
          if (config3d.type === 'aggregate') {
            var providers = [];
            config3d.subLayersIds.forEach(function(item) {
              var subProvider = this.getCesiumImageryProviderById(item,
                  olLayer);
              if (Array.isArray(subProvider) && subProvider.length) {
                providers.push.apply(providers, subProvider);
              } else if (subProvider) {
                providers.push(subProvider);
              }
            }, this);
            return providers;
          }
          if (config3d.type === 'wmts') {
            params = {
              url: getWmtsGetTileTpl(requestedLayer, '4326', format),
              tileSize: 256,
              subdomains: h2(wmtsSubdomains)
            };
          } else if (config3d.type === 'wms') {
            var tileSize = 512;
            var wmsParams = {
              layers: requestedLayer,
              format: 'image/' + format,
              service: 'WMS',
              version: '1.3.0',
              request: 'GetMap',
              crs: 'CRS:84',
              bbox: '{westProjected},{southProjected},' +
                    '{eastProjected},{northProjected}',
              width: tileSize,
              height: tileSize,
              styles: ''
            };
            if (config3d.timeEnabled) {
              wmsParams.time = '{Time}';
            }
            params = {
              url: getWmsTpl(wmsUrl, wmsParams),
              tileSize: tileSize,
              subdomains: wmsSubdomains
            };
          }
          var extent = config3d.extent || gaGlobalOptions.swissExtent;
          if (params) {
            var minRetLod = gaMapUtils.getLodFromRes(config3d.maxResolution) ||
                gaGlobalOptions.minimumRetrievingLevel;
            var maxRetLod = gaMapUtils.getLodFromRes(config3d.minResolution);
            // Set maxLod as undefined deactivate client zoom.
            var maxLod = (maxRetLod) ? undefined : 18;
            if (maxLod && config3d.resolutions) {
              maxLod = gaMapUtils.getLodFromRes(
                  config3d.resolutions[config3d.resolutions.length - 1]);
            }
            params.customTags = {
              Time: function() {
                return olLayer.time || '';
              }
            };
            var provider = new Cesium.UrlTemplateImageryProvider({
              url: params.url,
              subdomains: params.subdomains,
              minimumLevel: minRetLod,
              maximumRetrievingLevel: maxRetLod,
              // This property active client zoom for next levels.
              maximumLevel: maxLod,
              rectangle: gaMapUtils.extentToRectangle(extent),
              tilingScheme: new Cesium.GeographicTilingScheme(),
              tileWidth: params.tileSize,
              tileHeight: params.tileSize,
              hasAlphaChannel: (format === 'png'),
              availableLevels: gaGlobalOptions.imageryAvailableLevels,
              // Experimental: restrict all rasters from 0 - 17 to terrain
              // availability and 18 to Swiss bbox
              metadataUrl: gaGlobalOptions.imageryMetadataUrl,
              customTags: params.customTags
            });
            provider.bodId = bodId;
            return provider;
          }
        };

        /**
         * Returns a promise of Cesium DataSource.
         */
        this.getCesiumDataSourceById = function(bodId, scene) {
          var config = layers[bodId];
          bodId = config.config3d;
          var config3d = this.getConfig3d(config);
          if (!/^kml$/.test(config3d.type)) {
            return;
          }
          var dsP = Cesium.KmlDataSource.load(new Cesium.Resource({
            url: config3d.url,
            proxy: gaUrlUtils.getCesiumProxy()
          }), {
            camera: scene.camera,
            canvas: scene.canvas
          });
          return dsP;
        };

        /**
         * Return an ol.layer.Layer object for a layer id.
         */
        this.getOlLayerById = function(bodId, opts) {
          opts = opts || {};
          var that = this;
          var olLayer;
          var config = layers[bodId];
          var timestamp = this.getLayerTimestampFromYear(bodId, gaTime.get());
          var crossOrigin = 'anonymous';
          var extent = config.extent || gaGlobalOptions.swissExtent;
          var styleUrl = gaUrlUtils.resolveStyleUrl(config.styleUrl ||
              (config.styles && config.styles[0].url), opts.externalStyleUrl);
          var glStyle = opts.glStyle;

          // Set dynamically the parentLayerId for aggregate layer
          if (opts.parentLayerId) {
            config.parentLayerId = opts.parentLayerId;
          }

          // The tileGridMinRes is the resolution at which the client
          // zoom is activated. It's different from the config.minResolution
          // value at which the layer stop being displayed.
          var tileGridMinRes = config.tileGridMinRes;
          if (config.resolutions) {
            tileGridMinRes = config.resolutions.slice(-1)[0];
          }

          // For some obscure reasons, on iOS, displaying a base 64 image
          // in a tile with an existing crossOrigin attribute generates
          // CORS errors.
          // Currently crossOrigin definition is only used for mouse cursor
          // detection on desktop in TooltipDirective.
          if (gaBrowserSniffer.ios) {
            crossOrigin = undefined;
          }

          // We allow duplication of source for time enabled layers
          var olSource = (config.timeEnabled) ? null : config.olSource;
          if (config.type === 'wmts') {
            if (!olSource) {
              if (!tileGridMinRes) {
                tileGridMinRes = gaGlobalOptions.tileGridWmtsDfltMinRes;
              }
              var tileMatrixSet = gaGlobalOptions.defaultEpsg.split(':')[1];
              var wmtsTplUrl = getWmtsGetTileTpl(config.serverLayerName,
                  tileMatrixSet, config.format).
                  replace('{z}', '{TileMatrix}').
                  replace('{x}', '{TileCol}').
                  replace('{y}', '{TileRow}');
              olSource = config.olSource = new ol.source.WMTS({
                dimensions: {
                  'Time': timestamp
                },
                // Workaround: Set a cache size of zero when layer is
                // timeEnabled see:
                // https://github.com/geoadmin/mf-geoadmin3/issues/3491
                cacheSize: config.timeEnabled ? 0 : 2048,
                layer: config.serverLayerName,
                format: config.format,
                projection: gaGlobalOptions.defaultEpsg,
                requestEncoding: 'REST',
                tileGrid: gaTileGrid.get(tileGridMinRes),
                tileLoadFunction: tileLoadFunction,
                urls: getImageryUrls(wmtsTplUrl, h2(wmtsSubdomains)),
                crossOrigin: crossOrigin,
                transition: 0
              });
            }
            olLayer = new ol.layer.Tile({
              minResolution: gaNetworkStatus.offline ? null :
                config.minResolution,
              maxResolution: config.maxResolution,
              opacity: config.opacity || 1,
              source: olSource,
              extent: extent,
              preload: gaNetworkStatus.offline ? gaMapUtils.preload : 0,
              useInterimTilesOnError: gaNetworkStatus.offline
            });
            gaDefinePropertiesForLayer(olLayer);
          } else if (config.type === 'wms') {
            var wmsParams = {
              LAYERS: config.wmsLayers,
              FORMAT: 'image/' + config.format,
              LANG: gaLang.get()
            };
            if (config.singleTile === true) {
              if (!olSource) {
                olSource = config.olSource = new ol.source.ImageWMS({
                  url: getImageryUrls(getWmsTpl(wmsUrl), wmsSubdomains)[0],
                  params: wmsParams,
                  crossOrigin: crossOrigin,
                  ratio: 1
                });
              }
              olLayer = new ol.layer.Image({
                minResolution: config.minResolution,
                maxResolution: config.maxResolution,
                opacity: config.opacity || 1,
                source: olSource,
                extent: extent
              });
              gaDefinePropertiesForLayer(olLayer);
            } else {
              if (!olSource) {
                olSource = config.olSource = new ol.source.TileWMS({
                  urls: getImageryUrls(getWmsTpl(wmsUrl), wmsSubdomains),
                  // Temporary until https://github.com/openlayers/ol3/pull/4964
                  // is merged upstream
                  cacheSize: 2048 * 3,
                  params: wmsParams,
                  gutter: config.gutter || 0,
                  crossOrigin: crossOrigin,
                  tileGrid: gaTileGrid.get(tileGridMinRes, config.type),
                  tileLoadFunction: tileLoadFunction,
                  wrapX: false,
                  transition: 0
                });
              }
              olLayer = new ol.layer.Tile({
                minResolution: config.minResolution,
                maxResolution: config.maxResolution,
                opacity: config.opacity || 1,
                source: olSource,
                extent: extent,
                preload: gaNetworkStatus.offline ? gaMapUtils.preload : 0,
                useInterimTilesOnError: gaNetworkStatus.offline
              });
              gaDefinePropertiesForLayer(olLayer);
            }
          } else if (config.type === 'aggregate') {
            var subLayersIds = config.subLayersIds || [];
            var createSubLayers = function(olLayer, glStyle) {
              if (!subLayersIds.length) {
                // No sublayerIds provided so we use directly what is available
                // in sources list of the glStyle.
                for (var s in glStyle.sources) {
                  subLayersIds.push(s);
                }
              }
              // Create sublayers.
              var subLayers = [];
              olLayer.glStyle = glStyle;
              for (var i = 0; i < subLayersIds.length; i++) {
                var id = subLayersIds[i];

                // If a raster config already exists,
                // we inform the developer.
                if (layers[id] &&
                    layers[id].type !== 'vectortile' &&
                    glStyle && glStyle.sources &&
                    glStyle.sources[id] &&
                    glStyle.sources[id].type === 'vector') {
                  $window.console.log('A raster config already exists ' +
                    'for the glStyle source ' + id + '. ' +
                    'Please change the source\'s ' +
                    'name in the glStyle to avoid conflicts.');
                  continue;
                }

                // If there is no config for this id, we assume it's
                // a vectortile so we create a default config.
                if (!layers[id]) {
                  layers[id] = {
                    serverLayerName: id,
                    type: 'vectortile',
                    sourceId: id
                  }
                }

                // If the sourceId doesn't correspond to a source in glStyle
                // object, we inform the developer.
                var sourceId = layers[id].sourceId;
                if (sourceId && glStyle && glStyle.sources &&
                    !glStyle.sources[sourceId]) {
                  $window.console.log('The glStyle has no source with ' +
                    'the name ' +
                    layers[id].sourceId + '. Please change the source\'s ' +
                    'name in the glStyle to avoid conflicts.');
                  continue;
                }

                subLayers.push(that.getOlLayerById(id, {
                  glStyle: glStyle,
                  parentLayerId: bodId
                }));
              }
              olLayer.setLayers(new ol.Collection(subLayers));
            };
            olLayer = new ol.layer.Group({
              minResolution: config.minResolution,
              maxResolution: config.maxResolution,
              opacity: config.opacity || 1
            });
            gaDefinePropertiesForLayer(olLayer);
            if (glStyle || styleUrl) {
              var p = (glStyle) ? $q.when(glStyle) : gaStorage.load(styleUrl);
              p.then(function(glStyle) {
                createSubLayers(olLayer, glStyle);
              });
            } else {
              createSubLayers(olLayer);
            }

          } else if (config.type === 'geojson') {
            // cannot request resources over https in S3
            olSource = new ol.source.Vector({
              format: new ol.format.GeoJSON()
            });
            olLayer = new ol.layer.Vector({
              minResolution: config.minResolution,
              maxResolution: config.maxResolution,
              opacity: config.opacity || 1,
              source: olSource,
              extent: extent
            });
            gaDefinePropertiesForLayer(olLayer);
            geojsonPromises[bodId] = gaUrlUtils.proxifyUrl(config.geojsonUrl).
                then(function(proxyUrl) {
                  return $http.get(proxyUrl).then(function(response) {
                    var data = response.data;
                    var features = olSource.getFormat().readFeatures(data, {
                      featureProjection: gaGlobalOptions.defaultEpsg
                    });
                    olSource.clear();
                    olSource.addFeatures(features);
                    if (data.timestamp) {
                      olLayer.timestamps = [data.timestamp];
                    }
                    return olSource.getFeatures();
                  });
                });

            // IE doesn't understand agnostic URLs
            stylePromises[bodId] = gaUrlUtils.proxifyUrl(styleUrl).
                then(function(proxyStyleUrl) {
                  return $http.get(proxyStyleUrl, {
                    cache: styleUrl === proxyStyleUrl
                  }).then(function(response) {
                    var olStyleForVector = gaStylesFromLiterals(response.data);
                    olLayer.setStyle(function(feature, res) {
                      return [olStyleForVector.getFeatureStyle(feature, res)];
                    });
                    return olStyleForVector;
                  });
                });
          } else if (config.type === 'vectortile') {
            olLayer = new ol.layer.VectorTile({
              declutter: true/*,
              Note: This part was removed by 'mvt offline',
              not sure if needed for v006?
              style: new ol.style.Style(),
              source: new ol.source.VectorTile({
                format: new ol.format.MVT(),
                maxZoom: config.maxZoom,
                url: config.url,
                loader: function (extent, resolution, projection) {
                  console.log('loader', config.url, extent,
                    resolution, projection);
                }
              }) */
            });
            gaDefinePropertiesForLayer(olLayer);
            olLayer.setOpacity(config.opacity || 1);
            olLayer.sourceId = config.sourceId;
            p = (glStyle) ? $q.when(glStyle) : gaStorage.load(styleUrl);
            p.then(function(glStyle) {
              if (!glStyle) {
                return;
              }
              gaMapUtils.applyGlStyleToOlLayer(olLayer, glStyle);
              // Load informations from tileset.json file of a source
              var sourceConfig = glStyle.sources[olLayer.sourceId];
              sourceConfig.minZoom = config.minZoom;
              sourceConfig.maxZoom = config.maxZoom;
              if (sourceConfig) {
                gaMapUtils.applyGlSourceToOlLayer(olLayer, sourceConfig);
              }
            });
          }
          if (angular.isDefined(olLayer)) {
            olLayer.bodId = bodId;
            olLayer.label = config.label;
            olLayer.time = timestamp;
            olLayer.timeEnabled = config.timeEnabled;
            olLayer.timeBehaviour = config.timeBehaviour;
            olLayer.timestamps = config.timestamps;
            olLayer.geojsonUrl = config.geojsonUrl;
            olLayer.updateDelay = config.updateDelay;
            olLayer.externalStyleUrl = opts.externalStyleUrl;
            olLayer.styles = config.styles;
            if (styleUrl) {
              olLayer.useThirdPartyData =
                  gaUrlUtils.isThirdPartyValid(styleUrl);
            }
            olLayer.background = config.background || false;
            olLayer.getCesiumImageryProvider = function() {
              return that.getCesiumImageryProviderById(bodId, olLayer);
            };
            olLayer.getCesiumDataSource = function(scene) {
              return that.getCesiumDataSourceById(bodId, scene);
            };
            olLayer.getCesiumTileset3d = function(scene) {
              return that.getCesiumTileset3dById(bodId, scene);
            };
          }
          return olLayer;
        };

        this.getLayerStylePromise = function(bodId) {
          return stylePromises[bodId];
        };

        // Returns promise of layer with its features when layers are added.
        this.getLayerPromise = function(bodId) {
          var p, config = this.getLayer(bodId);
          if (config && /geojson/.test(config.type)) {
            p = geojsonPromises[bodId];
            if (!p) {
              // Fill the geojsonPromises array
              // TODO: Not nice to create a layer and not using it.
              this.getOlLayerById(bodId);
              p = geojsonPromises[bodId];
            }
          }
          return p || $q.reject();
        };

        /**
         * Returns layers definition for given bodId. Returns
         * undefined if bodId does not exist
         */
        this.getLayer = function(bodId) {
          if (layers) {
            return layers[bodId];
          }
        };

        this.getConfig3d = function(config) {
          if (config.config3d) {
            return layers[config.config3d];
          }
          return config;
        };

        /**
         * Returns a property of the layer with the given bodId.
         * Note: this throws an exception if the bodId does not
         * exist in currently loaded topic/layers
         */
        this.getLayerProperty = function(bodId, prop) {
          return layers[bodId][prop];
        };

        /**
         * Get Metadata of given layer bodId
         * Uses current topic and language
         * Returns a promise. Use accordingly
         */
        this.getMetaDataOfLayer = function(bodId) {
          var url = getMetaDataUrl(bodId, gaLang.get());
          return $http.get(url);
        };

        /**
         * Find the correct timestamp of layer from a specific year string.
         *
         * Returns undefined if the layer has no timestamp.
         * Returns undefined if the layer has not a timestamp for this year.
         * If there is more than one timestamp for a year we choose the first
         * found.
         */
        this.getLayerTimestampFromYear = function(configOrBodId, yearStr) {
          var config = angular.isString(configOrBodId) ?
            this.getLayer(configOrBodId) : configOrBodId;
          if (!config.timeEnabled) {
            // a WMTS/Terrain/Tileset3d layer has at least one timestamp
            return (config.type === 'wmts' || config.type === 'terrain' ||
                config.type === 'tileset3d') ? config.timestamps[0] : undefined;
          }
          var timestamps = config.timestamps || [];
          if (angular.isNumber(yearStr)) {
            yearStr = '' + yearStr;
          }
          if (!angular.isDefined(yearStr)) {
            var timeBehaviour = config.timeBehaviour;
            // check if specific 4/6/8 digit timestamp is specified
            if (/^\d{4}$|^\d{6}$|^\d{8}$/.test(timeBehaviour)) {
              yearStr = timeBehaviour.substr(0, 4);
            } else if (timeBehaviour !== 'all' && timestamps.length) {
              yearStr = timestamps[0];
            }
          }

          for (var i = 0, ii = timestamps.length; i < ii; i++) {
            var ts = timestamps[i];
            // Strange if statement here because yearStr can either be
            // full timestamp string or year-only string...
            if (yearStr === ts ||
                parseInt(yearStr) === parseInt(ts.substr(0, 4))) {
              return ts;
            }
          }

          return undefined;
        };

        /**
         * Determines if the layer is a bod layer.
         * @param {ol.layer.Base} an ol layer.
         *
         * Returns true if the layer is a BOD layer.
         * Returns false if the layer is not a BOD layer.
         */
        this.isBodLayer = function(olLayer) {
          if (olLayer) {
            var bodId = olLayer.bodId;
            return layers.hasOwnProperty(bodId);
          }
          return false;
        };

        /**
         * Determines if the bod layer has a tooltip.
         * Note: the layer is considered to have a tooltip if the parent layer
         * has a tooltip.
         * @param {ol.layer.Base} an ol layer.
         *
         * Returns true if the layer has bod a tooltip.
         * Returns false if the layer doesn't have a bod tooltip.
         */
        this.hasTooltipBodLayer = function(olLayer, is3dActive) {
          if (!olLayer) {
            return false;
          }
          var config = this.getLayer(olLayer.bodId);
          if (!config) {
            return false;
          }
          // We test the config 3d when 3d is enabled
          if (is3dActive) {
            config = this.getConfig3d(config) || config;
          }
          // If the layer's config has no tooltip property we try to get the
          // value from the parent.
          if (!angular.isDefined(config.tooltip) && config.parentLayerId) {
            config = this.getLayer(config.parentLayerId);
          }
          return !!config.tooltip;
        };
      };

      return new Layers(
          this.wmsSubdomains,
          this.wmtsSubdomains,
          this.vectorTilesSubdomains,
          this.wmsUrl,
          this.wmtsUrl,
          this.wmtsLV03Url,
          this.terrainUrl,
          this.vectorTilesUrl,
          this.layersConfigUrl,
          this.legendUrl);
    };
  });
})();
