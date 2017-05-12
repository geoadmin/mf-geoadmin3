goog.provide('ga_map_service');

goog.require('ga_event_service');
goog.require('ga_measure_service');
goog.require('ga_networkstatus_service');
goog.require('ga_stylesfromliterals_service');
goog.require('ga_time_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_map_service', [
    'ga_event_service',
    'ga_networkstatus_service',
    'ga_storage_service',
    'ga_stylesfromliterals_service',
    'ga_time_service',
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.provider('gaTileGrid', function() {
    var origin = [420000, 350000];

    function getDefaultResolutions() {
        return [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250,
                2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250,
                100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5];
    }

    function getWmsResolutions() {
        return getDefaultResolutions().concat([0.25, 0.1]);
    }

    function createTileGrid(resolutions, type) {
      if (type === 'wms') {
        return new ol.tilegrid.TileGrid({
          tileSize: 512,
          origin: origin,
          resolutions: resolutions
        });
      }
      return new ol.tilegrid.WMTS({
          matrixIds: $.map(resolutions, function(r, i) { return i + ''; }),
          origin: origin,
          resolutions: resolutions
      });
    }

    this.$get = function() {
      return {
        get: function(resolutions, minResolution, type) {
          if (!resolutions) {
            resolutions = (type == 'wms') ? getWmsResolutions() :
                getDefaultResolutions();
          }
          if (minResolution) { // we remove useless resolutions
            for (var i = 0, ii = resolutions.length; i < ii; i++) {
              if (resolutions[i] === minResolution) {
                resolutions = resolutions.splice(0, i + 1);
                break;
              }
            }
          }
          return createTileGrid(resolutions, type);
        }
      };
    };
  });

  /**
   * This service is a function that define properties (data and accessor
   * descriptors) for the OpenLayers layer passed as an argument.
   *
   * Adding descriptors to layers makes it possible to control the states
   * of layers (visibility, opacity, etc.) through ngModel. (ngModel indeed
   * requires the expression to be "assignable", and there's currently no
   * way pass to pass getter and setter functions to ngModel.)
   */
  module.provider('gaDefinePropertiesForLayer', function() {

    this.$get = function() {
      return function defineProperties(olLayer) {
        olLayer.set('altitudeMode', 'clampToGround');
        Object.defineProperties(olLayer, {
          visible: {
            get: function() {
              return this.userVisible;
            },
            set: function(val) {
              this.userVisible = val;
              var vis = this.userVisible && !this.hiddenByOther;
              // apply the value only if it has changed
              // otherwise the change:visible event is triggered when it's
              // useless
              if (vis != this.getVisible()) {
                this.setVisible(vis);
              }
            }
          },
          hiddenByOther: {
            get: function() {
              return this.get('hiddenByOther');
            },
            set: function(val) {
              this.set('hiddenByOther', val);
              if (val && this.userVisible) {
                this.setVisible(false);
              } else {
                this.visible = this.userVisible;
              }
            }
          },
          invertedOpacity: {
            get: function() {
              return Math.round((1 - this.getOpacity()) * 100) / 100;
            },
            set: function(val) {
              this.setOpacity(1 - val);
            }
          },
          id: {
            get: function() {
              return this.get('id') || this.bodId;
            },
            set: function(val) {
              this.set('id', val);
            }
          },
          bodId: {
            get: function() {
              return this.get('bodId');
            },
            set: function(val) {
              this.set('bodId', val);
            }
          },
          adminId: {
            get: function() {
              return this.get('adminId') || this.bodId;
            },
            set: function(val) {
              this.set('adminId', val);
            }
          },
          label: {
            get: function() {
              return this.get('label');
            },
            set: function(val) {
              this.set('label', val);
            }
          },
          url: {
            get: function() {
              return this.get('url');
            },
            set: function(val) {
              this.set('url', val);
            }
          },
          type: {
            get: function() {
              return this.get('type');
            },
            set: function(val) {
              this.set('type', val);
            }
          },
          timeEnabled: {
            get: function() {
              return this.get('timeEnabled');
            },
            set: function(val) {
              this.set('timeEnabled', val);
            }
          },
          timestamps: {
            get: function() {
              return this.get('timestamps');
            },
            set: function(val) {
              this.set('timestamps', val);
            }
          },
          time: {
            get: function() {
              if (this instanceof ol.layer.Layer) {
                var src = this.getSource();
                if (src instanceof ol.source.WMTS) {
                  return src.getDimensions().Time;
                } else if (src instanceof ol.source.ImageWMS ||
                    src instanceof ol.source.TileWMS) {
                  return src.getParams().TIME;
                }
                return this.get('time');
              }
              return undefined;
            },
            set: function(val) {
              if (this.time == val) {
                // This 'if' avoid triggering a useless layer's 'propertychange'
                // event.
                return;
              }
              if (this instanceof ol.layer.Layer) {
                var src = this.getSource();
                if (src instanceof ol.source.WMTS) {
                  src.updateDimensions({'Time': val});
                } else if (src instanceof ol.source.ImageWMS ||
                    src instanceof ol.source.TileWMS) {
                  if (angular.isDefined(val)) {
                    src.updateParams({'TIME': val});
                  } else {
                    delete src.getParams().TIME;
                    src.updateParams();
                  }
                }
                this.set('time', val);
              }
            }
          },
          getCesiumImageryProvider: {
            get: function() {
              return this.get('getCesiumImageryProvider') || angular.noop;
            },
            set: function(val) {
              this.set('getCesiumImageryProvider', val);
            }
          },
          getCesiumDataSource: {
            get: function() {
              return this.get('getCesiumDataSource') || angular.noop;
            },
            set: function(val) {
              this.set('getCesiumDataSource', val);
            }
          },
          altitudeMode: {
            get: function() {
              return this.get('altitudeMode');
            },
            set: function(val) {
              this.set('altitudeMode', val);
            }
          },
          background: {
            writable: true,
            value: false
          },
          displayInLayerManager: {
            writable: true,
            value: true
          },
          useThirdPartyData: {
            writable: true,
            value: false
          },
          preview: {
            writable: true,
            value: false
          },
          geojsonUrl: {
            writable: true,
            value: null
          },
          updateDelay: {
            writable: true,
            value: null
          },
          userVisible: {
            writable: true,
            value: olLayer.getVisible()
          }
        });
      };
    };
  });

  /**
   * This service is to be used to register a "click" listener
   * on a OpenLayer map.
   *
   * Notes:
   * - all desktop browsers except IE>=10, we add an ol3
   *   "singleclick" event on the map.
   * - IE>=10 on desktop and  browsers on touch devices, we simulate the
   *   "click" behavior to avoid conflict with long touch event.
   */
  module.provider('gaMapClick', function() {
    this.$get = function($timeout, gaBrowserSniffer, gaEvent) {
      return {
        listen: function(map, onClick) {
          var down = null;
          var touchstartTime;
          var callback = function(evt) {
            // if a draw or a select interaction is active, do
            // nothing.
            var cancel = false;
            var arr = map.getInteractions().getArray();
            arr.slice().reverse().forEach(function(item) {
              if (!cancel && (item instanceof ol.interaction.Select ||
                  item instanceof ol.interaction.Draw) && item.getActive()) {
               cancel = true;
              }
            });
            if (!cancel) {
              onClick(evt);
            }
          };

          var isMouseRightAction = function(evt) {
            return (evt.button === 2 || evt.which === 3);
          };

          var touchstartListener = function(evt) {
            if (gaEvent.isMouse(evt)) {
              return;
            }

            // This test only needed for IE10, to fix conflict between click
            // and contextmenu events on desktop
            if (!isMouseRightAction(evt)) {
              touchstartTime = (new Date()).getTime();
              down = evt;
            }
          };

          var touchmoveListener = function(evt) {
            if (gaEvent.isMouse(evt)) {
              return;
            }

            // We authorize a move of 5 pixels max for touch device.
            if (down &&
                (evt.clientX < down.clientX - 5 ||
                evt.clientX > down.clientX + 5 ||
                evt.clientY < down.clientY - 5 ||
                evt.clientY > down.clientY + 5)) {
              down = null;
            }
          };

          var touchendListener = function(evt) {
            if (gaEvent.isMouse(evt)) {
              return;
            }

            if (down && (new Date()).getTime() - touchstartTime < 300) {
              callback(down);
            }
            down = null;
          };

          var deregKey = map.on('singleclick', function(evt) {
            // We active singleclick only on mouse event to avoid confilct with
            // contextpopup.
            if (gaEvent.isMouse(evt)) {
              callback(evt);
            }
          });

          var touchEvents;
          if (gaBrowserSniffer.events.start != 'mousedown') {
            touchEvents = gaBrowserSniffer.events;
            var viewport = $(map.getViewport());
            viewport.on(touchEvents.start, touchstartListener);
            viewport.on(touchEvents.move, touchmoveListener);
            viewport.on(touchEvents.end, touchendListener);
          }
          return function() {
            ol.Observable.unByKey(deregKey);
            if (touchEvents) {
              viewport.unbind(touchEvents.start, touchstartListener);
              viewport.unbind(touchEvents.move, touchmoveListener);
              viewport.unbind(touchEvents.end, touchendListener);
            }
          };
        }
      };
    };
  });

  /**
   * Manage BOD layers
   */
  module.provider('gaLayers', function() {

    this.$get = function($http, $q, $rootScope, $translate, $window,
        gaBrowserSniffer, gaDefinePropertiesForLayer, gaMapUtils,
        gaNetworkStatus, gaStorage, gaTileGrid, gaUrlUtils,
        gaStylesFromLiterals, gaGlobalOptions, gaPermalink,
        gaLang, gaTime) {

      var Layers = function(dfltWmsSubdomains, dfltWmtsNativeSubdomains,
          dfltWmtsMapProxySubdomains, dfltVectorTilesSubdomains,
          wmsUrlTemplate, wmtsGetTileUrlTemplate,
          wmtsMapProxyGetTileUrlTemplate, terrainTileUrlTemplate,
          vectorTilesUrlTemplate, layersConfigUrlTemplate,
          legendUrlTemplate, imageryMetadataUrl) {
        var layers;

        // Returns a unique WMS template url (e.g. //wms{s}.geo.admin.ch)
        var getWmsTpl = function(wmsUrl, wmsParams) {
          var tpl = wmsUrl;
          if (/wms.geo/.test(wmsUrl)) {
            tpl = undefined;
          }
          if (tpl && /(request|service|version)/i.test(tpl)) {
            tpl = gaUrlUtils.remove(tpl, ['request', 'service', 'version'],
                true);
          }
          var url = (tpl || wmsUrlTemplate);
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

        var getWmtsGetTileTpl = function(layer, time, tileMatrixSet,
            format, useNativeTpl) {
          var tpl;
          if (useNativeTpl) {
              tpl = wmtsGetTileUrlTemplate;
          } else {
              tpl = wmtsMapProxyGetTileUrlTemplate;
          }
          var url = tpl.replace('{Layer}', layer).replace('{Format}', format);
          if (time) {
            url = url.replace('{Time}', time);
          }
          if (tileMatrixSet) {
            url = url.replace('{TileMatrixSet}', tileMatrixSet);
          }
          return url;
        };

        var getTerrainTileUrl = function(layer, time) {
          return terrainTileUrlTemplate
              .replace('{Layer}', layer)
              .replace('{Time}', time);
        };

        var cpt;
        var getVectorTilesUrl = function(layer, time, subdomains) {
          if (cpt === undefined || cpt >= subdomains.length) {
            cpt = 0;
          }
          return vectorTilesUrlTemplate
              .replace('{s}', subdomains[cpt++])
              .replace('{Layer}', layer)
              .replace('{Time}', time);
        };

        var getLayersConfigUrl = function(lang) {
          return layersConfigUrlTemplate
              .replace('{Lang}', lang);
        };

        var getMetaDataUrl = function(layer, lang) {
          return legendUrlTemplate
              .replace('{Layer}', layer)
              .replace('{Lang}', lang);
        };

        // Function to remove the blob url from memory.
        var revokeBlob = function() {
          $window.URL.revokeObjectURL(this.src);
          this.removeEventListener('load', revokeBlob);
        };

        // The tile load function which loads tiles from local
        // storage if they exist otherwise try to load the tiles normally.
        var tileLoadFunction = function(imageTile, src) {
          if (gaBrowserSniffer.mobile) {
            gaStorage.getTile(gaMapUtils.getTileKey(src)).then(
                function(content) {
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
                imageTile.getImage().src = (content) ? content : src;
              }
            });
          } else {
            imageTile.getImage().src = src;
          }
        };

        // Load layers config
        var lastLangUsed;
        var loadLayersConfig = function(lang) {
          if (lastLangUsed == lang) {
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
                'ch.swisstopo.pixelkarte-farbe',
                'ch.swisstopo.pixelkarte-grau',
                'ch.swisstopo.swisstlm3d-karte-farbe',
                'ch.swisstopo.swisstlm3d-karte-grau',
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
                'ch.swisstopo.lubis-bildstreifen'
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
                timestamps: ['20160115'],
                attribution: 'swisstopo',
                attributionUrl: 'https://www.swisstopo.admin.ch/' + lang +
                    '/home.html'
              };

              // 3D Tileset
              var tileset3d = [
                'ch.swisstopo.swisstlm3d.3d',
                'ch.swisstopo.bridgestest.3d',
                'ch.swisstopo.swissnames3d.3d'
              ];
              var tilesetTs = [
                '20161217',
                '20161121',
                '20160909'
              ];

              var params = gaPermalink.getParams();
              var pTileset3d = params['tileset3d'];
              var pTilesetTs = params['tilesetTs'];

              tileset3d = pTileset3d ? pTileset3d.split(',') : tileset3d;
              tilesetTs = pTilesetTs ? pTilesetTs.split(',') : tilesetTs;

              tileset3d.forEach(function(tileset3dId, idx) {
                if (tileset3dId) {
                  response.data[tileset3dId] = {
                    type: 'tileset3d',
                    serverLayerName: tileset3dId,
                    timestamps: [tilesetTs[idx]],
                    attribution: 'swisstopo',
                    attributionUrl: 'https://www.swisstopo.admin.ch/' + lang +
                        '/home.html'
                  };
                }
              });
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

        this.getConfig3d = function(config) {
          if (config.config3d) {
            return layers[config.config3d];
          }
          return config;
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
            url: getTerrainTileUrl(requestedLayer, timestamp),
            availableLevels: window.terrainAvailableLevels,
            rectangle: gaMapUtils.extentToRectangle(
              gaGlobalOptions.defaultExtent)
          });
          provider.bodId = bodId;
          return provider;
        };

        /**
         * Returns an Cesium 3D Tileset.
         */
        this.getCesiumTileset3DById = function(bodId) {
          var config3d = this.getConfig3d(layers[bodId]);
          if (!/^tileset3d$/.test(config3d.type)) {
            return;
          }
          var timestamp = this.getLayerTimestampFromYear(config3d,
              gaTime.get());
          var requestedLayer = config3d.serverLayerName || bodId;
          var tileset = new Cesium.Cesium3DTileset({
            url: getVectorTilesUrl(requestedLayer, timestamp,
                dfltVectorTilesSubdomains),
            maximumNumberOfLoadedTiles: 3
          });
          tileset.bodId = bodId;
          return tileset;
        };

        /**
         * Returns an Cesium imagery provider.
         */
        this.getCesiumImageryProviderById = function(bodId) {
          var config = layers[bodId];
          var config3d = this.getConfig3d(config);
          if (!/^(wms|wmts|aggregate)$/.test(config3d.type)) {
            return;
          }
          var params;
          bodId = config.config3d || bodId;
          var timestamp = this.getLayerTimestampFromYear(bodId, gaTime.get());
          var requestedLayer = config3d.wmsLayers || config3d.serverLayerName ||
              bodId;
          var format = config3d.format || 'png';
          // pngjpeg not supported by Cesium (zeitreihen)
          if (format == 'pngjpeg') {
              format = 'jpeg';
          }
          if (config3d.type == 'aggregate') {
            var providers = [];
            config3d.subLayersIds.forEach(function(item) {
              var subProvider = this.getCesiumImageryProviderById(item);
              if (Array.isArray(subProvider)) {
                providers.push.apply(providers, subProvider);
              } else {
                providers.push(subProvider);
              }
            }, this);
            return providers;
          }
          if (config3d.type == 'wmts') {
            var hasNativeTiles = !!config.config3d;
            params = {
              url: getWmtsGetTileTpl(requestedLayer, timestamp,
                  '4326', format, hasNativeTiles),
              tileSize: 256,
              subdomains: hasNativeTiles ? dfltWmtsNativeSubdomains :
                  dfltWmtsMapProxySubdomains
            };
          } else if (config3d.type == 'wms') {
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
            if (timestamp) {
              wmsParams.time = timestamp;
            }
            params = {
              url: getWmsTpl(gaGlobalOptions.wmsUrl, wmsParams),
              tileSize: tileSize,
              subdomains: dfltWmsSubdomains
            };
          }
          var extent = config3d.extent || gaMapUtils.defaultExtent;
          if (params) {
            var minRetLod = gaMapUtils.getLodFromRes(config3d.maxResolution) ||
                window.minimumRetrievingLevel;
            var maxRetLod = gaMapUtils.getLodFromRes(config3d.minResolution);
            // Set maxLod as undefined deactivate client zoom.
            var maxLod = (maxRetLod) ? undefined : 18;
            if (maxLod && config3d.resolutions) {
              maxLod = gaMapUtils.getLodFromRes(
                  config3d.resolutions[config3d.resolutions.length - 1]);
            }
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
              hasAlphaChannel: (format == 'png'),
              availableLevels: window.imageryAvailableLevels,
              // Experimental: restrict all rasters from 0 - 17 to terrain
              // availability and 18 to Swiss bbox
              metadataUrl: imageryMetadataUrl
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
          var dsP = Cesium.KmlDataSource.load(config3d.url, {
            camera: scene.camera,
            canvas: scene.canvas,
            proxy: gaUrlUtils.getCesiumProxy()
          });
          return dsP;
        };

        /**
         * Return an ol.layer.Layer object for a layer id.
         */
        this.getOlLayerById = function(bodId) {
          var layer = layers[bodId];
          var olLayer;
          var timestamp = this.getLayerTimestampFromYear(bodId, gaTime.get());
          var crossOrigin = 'anonymous';
          var extent = layer.extent || gaMapUtils.defaultExtent;

          // For some obscure reasons, on iOS, displaying a base 64 image
          // in a tile with an existing crossOrigin attribute generates
          // CORS errors.
          // Currently crossOrigin definition is only used for mouse cursor
          // detection on desktop in TooltipDirective.
          if (gaBrowserSniffer.ios) {
            crossOrigin = undefined;
          }

          // We allow duplication of source for time enabled layers
          var olSource = (layer.timeEnabled) ? null : layer.olSource;
          if (layer.type == 'wmts') {
            if (!olSource) {
              var wmtsTplUrl = getWmtsGetTileTpl(layer.serverLayerName, null,
                  '21781', layer.format, true)
                  .replace('{z}', '{TileMatrix}')
                  .replace('{x}', '{TileCol}')
                  .replace('{y}', '{TileRow}');
              olSource = layer.olSource = new ol.source.WMTS({
                dimensions: {
                  'Time': timestamp
                },
                // Workaround: Set a cache size of zero when layer is
                // timeEnabled see:
                // https://github.com/geoadmin/mf-geoadmin3/issues/3491
                cacheSize: layer.timeEnabled ? 0 : 2048,
                projection: gaGlobalOptions.defaultEpsg,
                requestEncoding: 'REST',
                tileGrid: gaTileGrid.get(layer.resolutions,
                    layer.minResolution),
                tileLoadFunction: tileLoadFunction,
                urls: getImageryUrls(wmtsTplUrl, dfltWmtsNativeSubdomains),
                crossOrigin: crossOrigin
              });
            }
            olLayer = new ol.layer.Tile({
              minResolution: gaNetworkStatus.offline ? null :
                  layer.minResolution,
              maxResolution: layer.maxResolution,
              opacity: layer.opacity || 1,
              source: olSource,
              extent: extent,
              preload: gaNetworkStatus.offline ? gaMapUtils.preload : 0,
              useInterimTilesOnError: gaNetworkStatus.offline
            });
          } else if (layer.type == 'wms') {
            var wmsParams = {
              LAYERS: layer.wmsLayers,
              FORMAT: 'image/' + layer.format,
              LANG: gaLang.get()
            };
            if (timestamp) {
              wmsParams['TIME'] = timestamp;
            }
            if (layer.singleTile === true) {
              if (!olSource) {
                olSource = layer.olSource = new ol.source.ImageWMS({
                  url: getImageryUrls(getWmsTpl(gaGlobalOptions.wmsUrl))[0],
                  params: wmsParams,
                  crossOrigin: crossOrigin,
                  ratio: 1
                });
              }
              olLayer = new ol.layer.Image({
                minResolution: layer.minResolution,
                maxResolution: layer.maxResolution,
                opacity: layer.opacity || 1,
                source: olSource,
                extent: extent
              });
            } else {
              if (!olSource) {
                var subdomains = dfltWmsSubdomains;
                olSource = layer.olSource = new ol.source.TileWMS({
                  urls: getImageryUrls(
                      getWmsTpl(gaGlobalOptions.wmsUrl), subdomains),
                  // Temporary until https://github.com/openlayers/ol3/pull/4964
                  // is merged upstream
                  cacheSize: 2048 * 3,
                  params: wmsParams,
                  gutter: layer.gutter || 0,
                  crossOrigin: crossOrigin,
                  tileGrid: gaTileGrid.get(layer.resolutions,
                      layer.minResolution, 'wms'),
                  tileLoadFunction: tileLoadFunction,
                  wrapX: false
                });
              }
              olLayer = new ol.layer.Tile({
                minResolution: layer.minResolution,
                maxResolution: layer.maxResolution,
                opacity: layer.opacity || 1,
                source: olSource,
                extent: extent,
                preload: gaNetworkStatus.offline ? gaMapUtils.preload : 0,
                useInterimTilesOnError: gaNetworkStatus.offline
              });
            }
          } else if (layer.type == 'aggregate') {
            var subLayersIds = layer.subLayersIds;
            var i, len = subLayersIds.length;
            var subLayers = new Array(len);
            for (i = 0; i < len; i++) {
              subLayers[i] = this.getOlLayerById(subLayersIds[i]);
            }
            olLayer = new ol.layer.Group({
              minResolution: layer.minResolution,
              maxResolution: layer.maxResolution,
              opacity: layer.opacity || 1,
              layers: subLayers
            });
          } else if (layer.type == 'geojson') {
            // cannot request resources over https in S3
            olSource = new ol.source.Vector();
            olLayer = new ol.layer.Vector({
              minResolution: layer.minResolution,
              maxResolution: layer.maxResolution,
              source: olSource,
              extent: extent
            });
            var setLayerSource = function() {
              var geojsonFormat = new ol.format.GeoJSON();
              gaUrlUtils.proxifyUrl(layer.geojsonUrl).then(function(proxyUrl) {
                $http.get(proxyUrl).then(function(response) {
                  olSource.clear();
                  olSource.addFeatures(
                    geojsonFormat.readFeatures(response.data)
                  );
                });
              });
            };

            // IE doesn't understand agnostic URLs
            $http.get(location.protocol + layer.styleUrl, {
              cache: true
            }).then(function(response) {
              var olStyleForVector = gaStylesFromLiterals(response.data);
              olLayer.setStyle(function(feature, resolution) {
                return [olStyleForVector.getFeatureStyle(
                    feature, resolution)];
              });
            });
            // TODO: Handle error

            if (!layer.updateDelay) {
              setLayerSource();
            }
          }
          if (angular.isDefined(olLayer)) {
            gaDefinePropertiesForLayer(olLayer);
            olLayer.bodId = bodId;
            olLayer.label = layer.label;
            olLayer.type = layer.type;
            olLayer.timeEnabled = layer.timeEnabled;
            olLayer.timestamps = layer.timestamps;
            olLayer.geojsonUrl = layer.geojsonUrl;
            olLayer.updateDelay = layer.updateDelay;
            var that = this;
            olLayer.getCesiumImageryProvider = function() {
              return that.getCesiumImageryProviderById(bodId);
            };
            olLayer.getCesiumDataSource = function(scene) {
              return that.getCesiumDataSourceById(bodId, scene);
            };
          }

          return olLayer;
        };

        /**
         * Returns layers definition for given bodId. Returns
         * undefined if bodId does not exist
         */
        this.getLayer = function(bodId) {
          return layers[bodId];
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
          var layer = angular.isString(configOrBodId) ?
              this.getLayer(configOrBodId) : configOrBodId;
          if (!layer.timeEnabled) {
            // a WMTS/Terrain/Tileset3D layer has at least one timestamp
            return (layer.type == 'wmts' || layer.type == 'terrain' ||
                layer.type == 'tileset3d') ? layer.timestamps[0] : undefined;
          }
          var timestamps = layer.timestamps || [];
          if (angular.isNumber(yearStr)) {
            yearStr = '' + yearStr;
          }
          if (!angular.isDefined(yearStr)) {
            var timeBehaviour = layer.timeBehaviour;
            //check if specific 4/6/8 digit timestamp is specified
            if (/^\d{4}$|^\d{6}$|^\d{8}$/.test(timeBehaviour)) {
                yearStr = timeBehaviour.substr(0, 4);
            } else if (timeBehaviour !== 'all' && timestamps.length) {
                yearStr = timestamps[0];
            }
          }

          for (var i = 0, ii = timestamps.length; i < ii; i++) {
            var ts = timestamps[i];
            //Strange if statement here because yearStr can either be
            //full timestamp string or year-only string...
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
         * Finds the parent layer bodid if the layer is a child.
         * @param {ol.layer.Base} an ol layer.
         *
         * Returns a bodId of the parent layer.
         * Returns undefined if no parent layer was found
         */
        this.getBodParentLayerId = function(olLayer) {
          if (this.isBodLayer(olLayer)) {
            var bodId = olLayer.bodId;
            return this.getLayerProperty(bodId,
                'parentLayerId');
          }
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
        this.hasTooltipBodLayer = function(olLayer) {
          if (!this.isBodLayer(olLayer)) {
            return false;
          }
          var parentLayerId = this.getBodParentLayerId(olLayer);
          var bodId = parentLayerId || olLayer.bodId;
          return this.getLayerProperty(bodId, 'tooltip');
        };
      };

      return new Layers(this.dfltWmsSubdomains, this.dfltWmtsNativeSubdomains,
          this.dfltWmtsMapProxySubdomains, this.dfltVectorTilesSubdomains,
          this.wmsUrlTemplate, this.wmtsGetTileUrlTemplate,
          this.wmtsMapProxyGetTileUrlTemplate, this.terrainTileUrlTemplate,
          this.vectorTilesUrlTemplate, this.layersConfigUrlTemplate,
          this.legendUrlTemplate, this.imageryMetadataUrl);
    };
  });

  /**
   * Service provides map util functions.
   */
  module.provider('gaMapUtils', function() {
    this.$get = function($window, gaGlobalOptions, gaUrlUtils, $q,
        gaDefinePropertiesForLayer, $http, $rootScope) {
      var resolutions = gaGlobalOptions.resolutions;
      var lodsForRes = gaGlobalOptions.lods;
      var isExtentEmpty = function(extent) {
        for (var i = 0, ii = extent.length; i < ii; i++) {
           if (!extent[i]) {
             return true;
           }
        }
        return extent[0] >= extent[2] || extent[1] >= extent[3];
      };
      // Level of detail for the default resolution
      var lodForDfltRes = gaGlobalOptions.defaultLod;
      var dfltResIdx = resolutions.indexOf(gaGlobalOptions.defaultResolution);
      var proj = ol.proj.get(gaGlobalOptions.defaultEpsg);
      var extent = gaGlobalOptions.defaultExtent || proj.getExtent();
      return {
        Z_PREVIEW_LAYER: 1000,
        Z_PREVIEW_FEATURE: 1100,
        Z_FEATURE_OVERLAY: 2000,
        preload: 6, //Number of upper zoom to preload when offline
        defaultExtent: extent,
        viewResolutions: resolutions,
        defaultResolution: gaGlobalOptions.defaultResolution,
        getViewResolutionForZoom: function(zoom) {
          return resolutions[zoom];
        },
        // Example of a dataURI: 'data:image/png;base64,sdsdfdfsdfdf...'
        dataURIToBlob: function(dataURI) {
          var BASE64_MARKER = ';base64,';
          var base64Index = dataURI.indexOf(BASE64_MARKER);
          var base64 = dataURI.substring(base64Index + BASE64_MARKER.length);
          var contentType = dataURI.substring(5, base64Index);
          var raw = $window.atob(base64);
          var rawLength = raw.length;
          var uInt8Array = new Uint8Array(rawLength);
          for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          return this.arrayBufferToBlob(uInt8Array.buffer, contentType);
        },

        // Advantage of the blob is we have easy access to the size and the
        // type of the image, moreover in the future we could store it
        // directly in indexedDB, no need of fileReader anymore.
        // We could request a 'blob' instead of 'arraybuffer' response type
        // but android browser needs arraybuffer.
        arrayBufferToBlob: function(buffer, contentType) {
          if ($window.WebKitBlobBuilder) {
            // BlobBuilder is deprecated, only used in Android Browser
            var builder = new WebKitBlobBuilder();
            builder.append(buffer);
            return builder.getBlob(contentType);
          } else {
            return new Blob([buffer], {type: contentType});
          }
        },

        // Convert an ol.extent to Cesium.Rectangle
        extentToRectangle: function(e, sourceProj) {
          sourceProj = sourceProj || ol.proj.get(gaGlobalOptions.defaultEpsg);
          e = ol.proj.transformExtent(e, sourceProj, 'EPSG:4326');
          return Cesium.Rectangle.fromDegrees(e[0], e[1], e[2], e[3]);
        },

        /**
         * Defines a unique identifier from a tileUrl.
         * Use by offline to store in local storage.
         */
        getTileKey: function(tileUrl) {
          return tileUrl.replace(/^\/\/wmts[0-9]{0,3}/, '');
        },

        /**
         * Search for a layer identified by bodId in the map and
         * return it. undefined is returned if the map does not have
         * such a layer.
         */
        getMapLayerForBodId: function(map, bodId) {
          var layer;
          map.getLayers().forEach(function(l) {
            if (l.bodId == bodId && !l.preview) {
              layer = l;
            }
          });
          return layer;
        },

        /**
         * Search for an overlay identified by bodId in the map and
         * return it. undefined is returned if the map does not have
         * such a layer.
         */
        getMapOverlayForBodId: function(map, bodId) {
          var layer;
          map.getLayers().forEach(function(l) {
            if (l.bodId == bodId && !l.background && !l.preview) {
              layer = l;
            }
          });
          return layer;
        },

        flyToAnimation: function(ol3d, center, extent) {
          var dest;
          var scene = ol3d.getCesiumScene();

          if (extent) {
            var rect = this.extentToRectangle(extent);
            dest = scene.camera.getRectangleCameraCoordinates(rect);
            center = ol.extent.getCenter(extent);
          }

          return $http.get(gaGlobalOptions.apiUrl + '/rest/services/height', {
            params: {
              easting: center[0],
              northing: center[1]
            }
          }).then(function(response) {
            var defer = $q.defer();
            var pitch = 50; // In degrees
            // Default camera field of view
            // https://cesiumjs.org/Cesium/Build/Documentation/Camera.html
            var cameraFieldOfView = 60;

            if (!dest) {
              pitch = 45; // In degrees
              var projection = ol3d.getOlMap().getView().getProjection();
              var deg = ol.proj.transform(center, projection, 'EPSG:4326');
              dest = Cesium.Cartesian3.fromDegrees(deg[0], deg[1],
                  parseFloat(response.data.height));
            }

            var carto = scene.globe.ellipsoid.cartesianToCartographic(dest);
            var height = carto.height;
            var magnitude = Math.tan(
                Cesium.Math.toRadians(pitch + cameraFieldOfView / 2)) * height;
            // Approx. direction on x and y (only valid for Swiss extent)
            dest.x += (7 / 8) * magnitude;
            dest.y += (1 / 8) * magnitude;

            scene.camera.flyTo({
              destination: dest,
              orientation: {
                pitch: Cesium.Math.toRadians(-pitch)
              },
              complete: function() {
                defer.resolve();
                $rootScope.$applyAsync();
              },
              cancel: function() {
                defer.resolve();
                $rootScope.$applyAsync();
              }
            });
            return defer.promise;
          });
        },

        moveTo: function(map, ol3d, zoom, center) {
          if (ol3d && ol3d.getEnabled()) {
            return this.flyToAnimation(ol3d, center, null);
          }
          var view = map.getView();
          view.setZoom(zoom);
          view.setCenter(center);
          return $q.when();
        },

        zoomToExtent: function(map, ol3d, extent) {
          if (ol3d && ol3d.getEnabled()) {
            return this.flyToAnimation(ol3d, null, extent);
          }
          map.getView().fit(extent, {
            size: map.getSize()
          });
          return $q.when();
        },

        // This function differs from moveTo because it adds panning effect in
        // 2d
        panTo: function(map, ol3d, dest) {
          if (ol3d && ol3d.getEnabled()) {
            return this.moveTo(null, ol3d, null, dest);
          }
          var defer = $q.defer();
          var view = map.getView();
          var source = view.getCenter();
          var dist = Math.sqrt(Math.pow(source[0] - dest[0], 2),
              Math.pow(source[1] - dest[1], 2));
          var duration = Math.min(Math.sqrt(300 + dist /
              view.getResolution() * 1000), 3000);
          view.animate({
            center: dest,
            duration: 0
          }, function(success) {
            defer.resolve();
            $rootScope.$applyAsync();
          });
          return defer.promise;
        },

        // This function differs from zoomToExtent because it adds flying effect
        // in 2d
        flyTo: function(map, ol3d, dest, extent) {
          if (ol3d && ol3d.getEnabled()) {
            return this.zoomToExtent(null, ol3d, extent);
          }
          var deferPan = $q.defer();
          var deferZoom = $q.defer();
          var size = map.getSize();
          var source = map.getView().getCenter();
          var sourceRes = map.getView().getResolution();
          var dist = Math.sqrt(Math.pow(source[0] - dest[0], 2),
              Math.pow(source[1] - dest[1], 2));
          var duration = Math.min(Math.sqrt(300 + dist / sourceRes * 1000),
              3000);
          var destRes = Math.max(
            (extent[2] - extent[0]) / size[0],
            (extent[3] - extent[1]) / size[1]);
          destRes = Math.max(map.getView().constrainResolution(destRes, 0, 0),
              2.5);
          var view = map.getView();
          view.animate({
            center: dest,
            duration: duration
          }, function() {
            deferPan.resolve();
            $rootScope.$applyAsync();
          });
          view.animate({
            // destRes * 1.2 needed to don't have up an down and up again
            // in zoom.
            resolution: Math.max(sourceRes, dist / 1000, destRes * 1.2),
            duration: duration / 2
          }, {
            resolution: destRes,
            duration: duration / 2,
          }, function(success) {
            deferZoom.resolve();
            $rootScope.$applyAsync();
          });
          return $q.all([deferPan.promise, deferZoom.promise]);
        },

        // Test if a layer is a KML layer added by the ImportKML tool or
        // permalink
        // @param olLayerOrId  An ol layer or an id of a layer
        isKmlLayer: function(olLayerOrId) {
          if (!olLayerOrId) {
            return false;
          }
          if (angular.isString(olLayerOrId)) {
            return /^KML\|\|/.test(olLayerOrId);
          }
          return olLayerOrId.type == 'KML';
        },

        // Test if a layer is a KML layer added by dnd
        // @param olLayer  An ol layer
        isLocalKmlLayer: function(olLayer) {
          return this.isKmlLayer(olLayer) && !/^https?:\/\//.test(olLayer.url);
        },

        // Test if a KML comes from our s3 storage
        // @param olLayer  An ol layer or an id of a layer
        isStoredKmlLayer: function(olLayerOrId) {
          if (!olLayerOrId) {
            return false;
          }
          // If the parameter is not a string we try to get the url property.
          var url = (!angular.isString(olLayerOrId)) ? olLayerOrId.url :
              olLayerOrId.replace('KML||', '');
          return this.isKmlLayer(olLayerOrId) &&
                  gaUrlUtils.isPublicValid(url);
        },

        // Test if a layer is an external WMS layer added by th ImportWMS tool
        // or permalink
        // @param olLayerOrId  An ol layer or an id of a layer
        isExternalWmsLayer: function(olLayerOrId) {
          if (angular.isString(olLayerOrId)) {
            return /^WMS\|\|/.test(olLayerOrId) &&
                olLayerOrId.split('||').length >= 4;
          }
          return !!(olLayerOrId && !olLayerOrId.bodId &&
              this.isWMSLayer(olLayerOrId));
        },

        // Test if a layer is an external WMTS layer added by the ImportWMTS
        // tool or permalink
        isExternalWmtsLayer: function(olLayerOrId) {
          if (!olLayerOrId) {
            return false;
          } else if (angular.isString(olLayerOrId)) {
            return /^WMTS\|\|/.test(olLayerOrId) &&
                olLayerOrId.split('||').length === 4;
          } else {
            return olLayerOrId.type === 'WMTS';
          }
        },

        // Test if a feature is a measure
        isMeasureFeature: function(olFeature) {
          var regex = /^measure/;
          return (olFeature && (regex.test(olFeature.get('type')) ||
            regex.test(olFeature.getId())));
        },

        moveLayerOnTop: function(map, olLayer) {
          var olLayers = map.getLayers().getArray();
          var idx = olLayers.indexOf(olLayer);
          if (idx != -1 && idx !== olLayers.length - 1) {
            map.removeLayer(olLayer);
            map.addLayer(olLayer);
          }
        },

        /**
         * Reset map rotation to North
         */
        resetMapToNorth: function(map, ol3d) {
          var defer = $q.defer();
          if (ol3d && ol3d.getEnabled()) {
            var scene = ol3d.getCesiumScene();
            var currentRotation = -scene.camera.heading;

            while (currentRotation < -Math.PI) {
              currentRotation += 2 * Math.PI;
            }

            while (currentRotation > Math.PI) {
              currentRotation -= 2 * Math.PI;
            }
            var bottom = olcs.core.pickBottomPoint(scene);
            if (bottom) {
              olcs.core.setHeadingUsingBottomCenter(scene, currentRotation,
                  bottom);
            }
            defer.resolve();
          } else {
            map.getView().animate({
              rotation: 0,
              easing: ol.easing.easeOut
            }, function() {
              defer.resolve();
              $rootScope.$applyAsync();
            });
          }
          return defer.promise;
        },

        intersectWithDefaultExtent: function(extent) {
          if (!extent || extent.length !== 4) {
            return gaGlobalOptions.defaultExtent;
          }
          extent = [
            Math.max(extent[0], gaGlobalOptions.defaultExtent[0]),
            Math.max(extent[1], gaGlobalOptions.defaultExtent[1]),
            Math.min(extent[2], gaGlobalOptions.defaultExtent[2]),
            Math.min(extent[3], gaGlobalOptions.defaultExtent[3])
          ];
          if (!isExtentEmpty(extent)) {
            return extent;
          } else {
            return undefined;
          }
        },

        getFeatureOverlay: function(features, style) {
          var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
              useSpatialIndex: false,
              features: features
            }),
            style: style,
            updateWhileAnimating: true,
            updateWhileInteracting: true,
            zIndex: this.Z_FEATURE_OVERLAY
          });
          gaDefinePropertiesForLayer(layer);
          layer.displayInLayerManager = false;
          return layer;
        },

        getLodFromRes: function(res) {
          if (!res) {
            return;
          }
          var idx = resolutions.indexOf(res);
          if (idx != -1) {
            return lodsForRes[idx];
          }
          // TODO: Implement the calculation of the closest level of detail
          // available if res is not in the resolutions array
        },

        // The ol.source.Vector.getExtent function doesn't exist when the
        // useSpatialIndex property is set to false
        getVectorSourceExtent: function(source) {
          try {
            return source.getExtent();
          } catch (e) {
            var sourceExtent;
            source.getFeatures().forEach(function(item) {
              var extent = item.getGeometry().getExtent();
              if (!sourceExtent) {
                sourceExtent = extent;
              } else {
                ol.extent.extend(sourceExtent, extent);
              }
            });
            return sourceExtent;
          }
        },

        /**
         * Tests if a layer is a vector layer or a vector tile layer.
         * @param {ol.layer.Base} an ol layer.
         *
         * Returns true if the layer is a Vector
         * Returns false if the layer is not a Vector
         */
        isVectorLayer: function(olLayer) {
          return !!(olLayer && !(olLayer instanceof ol.layer.Group) &&
              olLayer.getSource() &&
              (olLayer instanceof ol.layer.Vector ||
              (olLayer instanceof ol.layer.Image &&
              olLayer.getSource() instanceof ol.source.ImageVector)));
        },

        /**
         * Tests if a layer is a WMS layer.
         * @param {ol.layer.Base} an ol layer.
         *
         * Returns true if the layer is a WMS
         * Returns false if the layer is not a WMS
         */
        isWMSLayer: function(olLayer) {
          return !!(olLayer && !(olLayer instanceof ol.layer.Group) &&
              olLayer.getSource &&
              (olLayer.getSource() instanceof ol.source.ImageWMS ||
              olLayer.getSource() instanceof ol.source.TileWMS));
        }
      };
    };
  });

  /**
   * Service provides different kinds of filter for
   * layers in the map
   */
  module.provider('gaLayerFilters', function() {
    this.$get = function(gaLayers, gaMapUtils) {
      return {
        /**
         * Filters out background layers, preview
         * layers, draw, measure.
         * In other words, all layers that
         * were actively added by the user and that
         * appear in the layer manager
         */
        selected: function(layer) {
          return layer.displayInLayerManager;
        },
        selectedAndVisible: function(layer) {
          return layer.displayInLayerManager && layer.visible;
        },
        permalinked: function(layer) {
          return layer.displayInLayerManager &&
                 !gaMapUtils.isLocalKmlLayer(layer);
        },
        /**
         * Keep only time enabled layer
         */
        timeEnabled: function(layer) {
          return layer.timeEnabled &&
                 layer.visible &&
                 !layer.background &&
                 !layer.preview;
        },
        /**
         * Keep layers with potential tooltip for query tool
         */
        potentialTooltip: function(layer) {
          return !!(layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.hasTooltipBodLayer(layer) &&
                 !gaMapUtils.isVectorLayer(layer));
        },
        /**
         * Searchable layers
         */
        searchable: function(layer) {
          return !!(layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.getLayerProperty(layer.bodId, 'searchable'));
        },
        /**
         * Queryable layers (layers with queryable attributes)
         */
        queryable: function(layer) {
          return !!(layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.getLayerProperty(layer.bodId,
                                           'queryableAttributes') &&
                 gaLayers.getLayerProperty(layer.bodId,
                                           'queryableAttributes').length);
        },
        /**
         * Keep only background layers
         */
        background: function(layer) {
          return layer.background;
        },
        /**
         * "Real-time" layers (only geojson layers for now)
         */
        realtime: function(layer) {
          return layer.updateDelay != null;
        }
      };
    };
  });
})();
