goog.provide('ga_offline_service');

goog.require('ga_background_service');
goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_storage_service');
goog.require('ga_styles_service');
goog.require('ga_window_service');
(function() {

  var module = angular.module('ga_offline_service', [
    'ga_debounce_service',
    'ga_storage_service',
    'ga_styles_service',
    'ga_background_service',
    'ga_window_service',
    'ga_maputils_service',
    'ga_layers_service'
  ]);

  /**
   * Service provides map offline functions.
   */
  module.provider('gaOffline', function() {
    var extentKey = 'ga-offline-extent';
    var layersKey = 'ga-offline-layers';
    var opacityKey = 'ga-offline-layers-opacity';
    var timestampKey = 'ga-offline-layers-timestamp';
    var bgKey = 'ga-offline-layers-bg';
    var promptKey = 'ga-offline-prompt-db';

    var minRes; // res for zoom 8
    var extentFeature = new ol.Feature(
        new ol.geom.Polygon([[[0, 0], [0, 0], [0, 0]]]));

    // Get the magnitude of 3D vector from an origin.
    // Used to order tiles by the distance from the map center.
    var getMagnitude = function(a, origin) {
      return Math.sqrt(
          Math.pow(a[1] + 0.5 - origin[1], 2) +
          Math.pow(a[2] + 0.5 - origin[2], 2) +
          Math.pow(a[0] - origin[0], 2));
    };

    var extent;
    var isDownloading;
    var isStorageFull;
    var nbTilesCached;
    var nbTilesFailed;
    var nbTilesTotal;
    var requests;
    var errorReport;

    var initDownloadStatus = function() {
      isDownloading = false;
      isStorageFull = false;
      nbTilesCached = 0;
      nbTilesFailed = 0;
      nbTilesTotal = 0;
      requests = [];
      errorReport = '';
    };
    initDownloadStatus();

    this.$get = function($http, $rootScope, $timeout, $translate, $window,
        gaBrowserSniffer, gaGlobalOptions, gaLayers, gaMapUtils,
        gaStorage, gaStyleFactory, gaUrlUtils, gaBackground, gaWindow) {

      // min zoom level cached (0 for swissproj ,8 for mercator proj)
      var minZoom = gaGlobalOptions.offlineMinZoom;
      var minZoomNonBgLayer = gaGlobalOptions.offlineMinZoomNonBgLayer;

      // max zoom level cached (8 for swiss proj, 16 for mercator proj)
      var maxZoom = gaGlobalOptions.offlineMaxZoom;
      var zOffset = gaGlobalOptions.offlineZOffset;

      // Defines if a layer is cacheable at a specific data zoom level.
      var isCacheableLayer = function(layer, z) {
        if ((layer.getSource() instanceof ol.source.VectorTile ||
              layer.getSource() instanceof ol.source.TileImage) &&
            layer.getSource().getTileGrid()) {
          var resolutions = layer.getSource().getTileGrid().getResolutions();
          var max = layer.getMaxResolution() || resolutions[0];
          if (!z && max > minRes) {
            return true;
          }
          var min = layer.getMinResolution() ||
              resolutions[resolutions.length - 1];
          var curr = resolutions[z];
          if (curr && max > curr && curr >= min) {
            return true;
          }
        } else if (gaMapUtils.isKmlLayer(layer)) {
          if (layer instanceof ol.layer.Image) {
            $window.alert($translate.instant('offline_kml_too_big') + ': ' +
                layer.label);
          } else {
            return true;
          }
        } else {
          // TODO: inform the user about which layer can't be saved in the help
        }
        return false;
      };

      // Get cacheable layers of a map.
      var getCacheableLayers = function(layers, onlyVisible) {
        var cache = [];
        for (var i = 0, ii = layers.length; i < ii; i++) {
          var layer = layers[i];
          if (onlyVisible && !layer.getVisible()) {
            continue;
          }

          if (layer instanceof ol.layer.Group) {
            cache = cache.concat(
                getCacheableLayers(layer.getLayers().getArray()));
          } else if (isCacheableLayer(layer)) {
            cache.push(layer);
          }
        }
        return cache;
      };

      minRes = gaMapUtils.getViewResolutionForZoom(maxZoom);
      var featureOverlay = gaMapUtils.getFeatureOverlay([extentFeature],
          gaStyleFactory.getStyle('offline'));

      // Update download status
      var progress;
      var onDlProgress = function() {
        if (isDownloading) {
          var nbTiles = nbTilesCached + nbTilesFailed;
          var percent = parseInt(nbTiles * 100 / nbTilesTotal, 10);

          // Trigger event only when needed
          if (percent !== progress) {
            progress = percent;
            $rootScope.$broadcast('gaOfflineProgress', progress);
          }
          // Download finished
          if (nbTilesCached + nbTilesFailed === nbTilesTotal) {
            isDownloading = false;
            var percentCached = parseInt(nbTilesCached * 100 / nbTilesTotal,
                10);

            if (percentCached <= 95) { // Download failed
              $rootScope.$broadcast('gaOfflineError');
              $window.alert($translate.instant('offline_less_than_95'));
              $window.console.log(errorReport);
            } else { // Download succeed
              gaStorage.setItem(extentKey, extent);
              $rootScope.$broadcast('gaOfflineSuccess', progress);
              $window.alert($translate.instant('offline_dl_succeed'));
            }
          }
        }
      };

      // Tile saving error
      var onTileError = function(tileUrl, msg) {

        if (isStorageFull) {
          return;
        }
        nbTilesFailed++;
        errorReport += '\nTile failed: ' + tileUrl + '\n Cause:' + msg;
        onDlProgress();
      };

      // Tile saving success
      var onTileSuccess = function(size) {
        if (isStorageFull) {
          return;
        }
        nbTilesCached++;
        onDlProgress();
      };

      // Read xhr response
      var readResponse = function(tileUrl, response, type) {
        if (isStorageFull) {
          return;
        }
        var blob = gaMapUtils.arrayBufferToBlob(response, type);
        // FileReader is strictly used to transform a blob to a base64 string
        var fileReader = new FileReader();
        fileReader.onload = function(evt) {
          gaStorage.setTile(gaMapUtils.getTileKey(tileUrl), evt.target.result).
              then(function() {
                onTileSuccess(blob.size);
              }, function(err) {
                if (isStorageFull) {
                  return;
                }
                // err.QUOTQ_ERR for websql
                // DOMException.QUOTA_EXCEEDED_ERR for localstorage
                if (err.code === err.QUOTA_ERR ||
                    err.code === DOMException.QUOTA_EXCEEDED_ERR) {
                  isStorageFull = true;
                  $window.alert($translate.instant('offline_space_warning'));
                  nbTilesFailed = nbTilesTotal - nbTilesCached;
                  onDlProgress();
                } else {
                  onTileError(tileUrl, 'Write db failed, code:' + err.code);
                }
              });
        };
        fileReader.onerror = function(evt) {
          onTileError(tileUrl, 'File read failed');
        };
        fileReader.onabort = function(evt) {
          onTileError(tileUrl, 'File read aborted');
        };
        fileReader.readAsDataURL(blob);
      };

      var Offline = function() {
        this.hasData = function() {
          return !!(gaStorage.getItem(extentKey));
        };
        this.isDataObsolete = function() {
          if (!this.hasData()) {
            return false;
          }
          var timestamp = gaStorage.getItem(timestampKey);
          // old version hasn't timestamps stored
          var isObsolete = (timestamp === undefined || timestamp === null);
          if (!isObsolete) {
            var ts = timestamp.split(',');
            // We go through all saved bod layers and test if the timestamp has
            // changed.
            gaStorage.getItem(layersKey).split(',').forEach(function(id, idx) {
              var layer = gaLayers.getLayer(id);
              if (layer && !layer.timeEnabled && layer.timestamps &&
                  layer.timestamps[0] !== ts[idx]) {
                isObsolete = true;
              }
            });
          }
          return isObsolete;
        };
        this.calculateExtentToSave = function(center) {
          return ol.extent.buffer(center.concat(center), 5000);
        };

        this.refreshLayers = function(layers, useClientZoom, force) {
          var layersIds = gaStorage.getItem(layersKey);
          for (var i = 0, ii = layers.length; i < ii; i++) {
            var layer = layers[i];
            if (gaMapUtils.isKmlLayer(layer)) {
              continue;
            }
            if (layer instanceof ol.layer.Group) {
              var hasCachedLayer = false;
              layer.getLayers().forEach(function(item) {
                if (!hasCachedLayer && layersIds &&
                   layersIds.indexOf(item.id) !== -1) {
                  hasCachedLayer = true;
                }
              });
              this.refreshLayers(layer.getLayers().getArray(), useClientZoom,
                  force || hasCachedLayer);

            } else if (force || (layersIds &&
                layersIds.indexOf(layer.id) !== -1)) {
              var source = layer.getSource();
              source.setTileLoadFunction(source.getTileLoadFunction());

              // WARN: from offline to online only!!! otherwise requests to pbf
              // tiles are made until it gets something.
              if (source instanceof ol.source.VectorTile) {
                layer.setUseInterimTilesOnError(useClientZoom);

                // Clear the internal tile cache of ol and the source tiles.
                if (!useClientZoom) {
                  source.clear();
                }

              } else {

                // Defined a new min resolution to allow client zoom on layer
                // with a min resolution between the max zoom level and the
                // max client zoom level
                var origMinRes = gaLayers.getLayer(layer.id).minResolution;
                if (!useClientZoom && origMinRes) {
                  layer.setMinResolution(origMinRes);
                } else if (useClientZoom && minRes >= origMinRes) {
                  layer.setMinResolution(0);
                }

                // Allow client zoom on all layer when offline
                layer.setUseInterimTilesOnError(useClientZoom);
                layer.setPreload(useClientZoom ? gaMapUtils.preload : 0);
              }

              // Clear the internal tile cache of ol
              source.setTileLoadFunction(source.getTileLoadFunction());
              source.refresh();
            }
          }
        };

        // Download status
        this.isDownloading = function() {
          return isDownloading;
        };

        // Offline selector stuff
        var isSelectorActive = false;
        this.isSelectorActive = function() {
          return isSelectorActive;
        };
        this.showSelector = function() {
          isSelectorActive = true;
        };
        this.hideSelector = function() {
          isSelectorActive = false;
        };
        this.toggleSelector = function() {
          isSelectorActive = !isSelectorActive;
        };

        // Offline menu stuff
        var isMenuActive = false;
        this.isMenuActive = function() {
          return isMenuActive;
        };
        this.showMenu = function() {
          isMenuActive = true;
        };
        this.hideMenu = function() {
          isMenuActive = false;
        };
        this.toggleMenu = function() {
          isMenuActive = !isMenuActive;
        };

        // Extent saved stuff
        var isExtentActive = false;
        this.isExtentActive = function() {
          return isExtentActive;
        };
        this.showExtent = function(map) {
          var extent = gaStorage.getItem(extentKey);
          if (extent) {
            extent = extent.split(',');
            extentFeature.getGeometry().setCoordinates([[
              [extent[0], extent[1]],
              [extent[0], extent[3]],
              [extent[2], extent[3]],
              [extent[2], extent[1]]
            ]]);
            featureOverlay.setMap(map);
            isExtentActive = true;
          }
        };
        this.hideExtent = function() {
          featureOverlay.setMap(null);
          isExtentActive = false;
        };
        this.toggleExtent = function(map) {
          if (isExtentActive) {
            this.hideExtent();
          } else {
            this.showExtent(map);
          }
        };
        this.displayData = function(map) {
          // Zoom on extent saved
          var extent = gaStorage.getItem(extentKey);
          if (extent) {
            extent = extent.split(',');
            map.getView().fit([
              parseInt(extent[0], 10),
              parseInt(extent[1], 10),
              parseInt(extent[2], 10),
              parseInt(extent[3], 10)
            ], {
              size: map.getSize()
            });
          }
          var layersIds = gaStorage.getItem(layersKey).split(',');
          var opacity = gaStorage.getItem(opacityKey).split(',');
          var timestamp = gaStorage.getItem(timestampKey).split(',');
          var bg = gaStorage.getItem(bgKey, String).split(',');

          for (var i = 0, ii = layersIds.length; i < ii; i++) {
            var bodLayer = gaLayers.getLayer(layersIds[i]);
            if (bodLayer) {
              var bodId = bodLayer.parentLayerId || layersIds[i];
              var olLayer = gaMapUtils.getMapLayerForBodId(map, bodId);
              if (!olLayer) {
                olLayer = gaLayers.getOlLayerById(bodId);
                if (olLayer) {
                  olLayer.background = (bg[i] === 'true');
                  if (olLayer.background) {
                    gaBackground.setById(map, bodId);
                  } else {
                    map.addLayer(olLayer);
                  }
                } else {
                  // TODO: The layer doesn't exist
                  continue;
                }
              }
              if (olLayer) {
                olLayer.visible = true;
                olLayer.invertedOpacity = opacity[i];
                // We apply the timestamp saved
                if (timestamp[i]) {
                  olLayer.time = timestamp[i];
                }
              }
            }
          }
        };

        // Download stuff
        this.abort = function() {
          isDownloading = false;
          // We abort the requests and clear the storage
          for (var j = 0, jj = requests.length; j < jj; j++) {
            requests[j].abort();
          }

          // Clear tiles database
          gaStorage.clearTiles().then(function() {
            initDownloadStatus();

            // Remove specific property of layers (currently only KML layers)
            var layersId = gaStorage.getItem(layersKey).split(',');
            for (var j = 0, jj = layersId.length; j < jj; j++) {
              gaStorage.removeItem(layersId[j]);
            }

            gaStorage.removeItem(extentKey);
            gaStorage.removeItem(layersKey);
            gaStorage.removeItem(opacityKey);
            gaStorage.removeItem(timestampKey);
            gaStorage.removeItem(bgKey);
            $rootScope.$broadcast('gaOfflineAbort');
          }, function() {
            $window.alert($translate.instant('offline_clear_db_error'));
          });
        };

        this.save = function(map) {

          // Get the cacheable layers
          var layers = getCacheableLayers(map.getLayers().getArray(), true);
          if (!layers.length) {
            $window.alert($translate.instant('offline_no_cacheable_layers'));
            return;
          }

          if (!$window.confirm($translate.instant('offline_save_warning'))) {
            return;
          }

          initDownloadStatus();
          gaStorage.removeItem(extentKey);

          if (isExtentActive) {
            this.hideExtent(map);
          }

          // Store the extent saved
          extent = this.calculateExtentToSave(map.getView().getCenter());

          // We go through all the cacheable layers.
          var projection = map.getView().getProjection();
          var queue = [];
          var layersIds = [];
          var layersOpacity = [];
          var layersTimestamp = [];
          var layersBg = [];
          for (var i = 0, ii = layers.length; i < ii; i++) {
            var layer = layers[i];
            layersIds.push(layer.id);
            layersOpacity.push(layer.invertedOpacity);
            var time = layer.time || '';
            if (!time && layer.timestamps) {
              time = layer.timestamps[0];
            }
            layersTimestamp.push(time);

            // if the layer is a vector layer
            if (gaMapUtils.isKmlLayer(layer) || gaMapUtils.isGpxLayer(layer)) {
              gaStorage.setItem(layer.id, layer.getSource().get('rawData'));
              layersBg.push(false);
              continue;
            }

            // if it's a tiled layer (WMTS or WMS or MVT) prepare the list of
            // tiles to download
            var isBgLayer = false;
            if (layer.bodId) {
              var parentLayerId = gaLayers.getLayerProperty(layer.bodId,
                  'parentLayerId');
              isBgLayer = (parentLayerId) ?
                gaMapUtils.getMapLayerForBodId(map, parentLayerId).background :
                layer.background;
            }
            layersBg.push(isBgLayer);
            var source = layer.getSource();
            var tileGrid = source.getTileGrid();
            var tileUrlFunction = source.getTileUrlFunction();

            // Mercator:
            // For each zoom level we generate the list of tiles to download:
            //
            //   - bg layer and vector tiles:
            //     zoom 0 to minZoom-1(7) => projection extent
            //     zoom minZoom(8) to maxZoom(16) => 15km2 extent
            //
            //   - other layers:
            //     zoom minZoomNonBgLayer(12), 14, maxZoom(16) => 15km2 extent

            // We load all the zoom for vector tiles from minZoomNonBgLayer to
            // maxZoom.
            var modulo2 = function(source, z) {
              if (source instanceof ol.source.VectorTile) {
                return true;
              }
              return (z % 2 !== 0)
            };
            for (var zoom = 0; zoom <= maxZoom; zoom++) {
              var z = zoom + zOffset; // data zoom level
              if (!isCacheableLayer(layer, z) || (!isBgLayer &&
                 (zoom < minZoomNonBgLayer || modulo2(source, z)))) {
                continue;
              }

              var queueByZ = [];
              var minX, minY, maxX, maxY;
              var tileExtent = (isBgLayer && zoom >= 0 && zoom < minZoom) ?
                gaGlobalOptions.swissExtent : extent;
              tileGrid.forEachTileCoord(tileExtent, z, function(tileCoord) {
                maxX = tileCoord[1];
                maxY = tileCoord[2];
                if (!angular.isDefined(minX)) {
                  minX = tileCoord[1];
                  minY = tileCoord[2];
                }
                var tile = {
                  coord: tileCoord,
                  url: tileUrlFunction(tileCoord, ol.has.DEVICE_PIXEL_RATIO,
                      projection)
                };
                queueByZ.push(tile);
              });

              // We sort tiles by distance from the center
              // The first must be dl in totality so no need to sort tiles,
              // the storage goes full only for the 2nd or 3rd layers.
              if (i > 0 && zoom > minZoom) {
                var centerTileCoord = [
                  z, (minX + maxX) / 2, (minY + maxY) / 2
                ];
                queueByZ.sort(function(a, b) {
                  return getMagnitude(a.coord, centerTileCoord) -
                      getMagnitude(b.coord, centerTileCoord);
                });
              }

              queue = queue.concat(queueByZ);
            }
          }

          // Nothing to save or only KML layers
          if (!queue.length) {
            $window.alert($translate.instant('offline_no_cacheable_layers'));
            this.abort();
            return;
          }

          // We store layers informations.
          gaStorage.setItem(layersKey, layersIds.join());
          gaStorage.setItem(opacityKey, layersOpacity.join());
          gaStorage.setItem(timestampKey, layersTimestamp.join());
          gaStorage.setItem(bgKey, layersBg.join());

          // On mobile we simulate synchronous tile downloading, because when
          // saving multilayers and/or layers with big size tile, browser is
          // crashing (mem or cpu).
          // TODO: Try using webworkers?
          var pool = gaWindow.isWidth('<l') ? 1 : 50;

          // We can't use xmlhttp2.onloadend event because it's doesn't work on
          // android browser
          var onLoadEnd = function(nbLoaded, nbTotal) {
            if (!isStorageFull && nbLoaded === pool) {
              // $timeout service with an interval doesn't work on android
              // browser.
              if (gaBrowserSniffer.ios && nbTotal % 200 === 0) {
                // We make a pause to don't break the safari browser (cpu).
                $timeout(runNextRequests, 5000);
              } else {
                runNextRequests();
              }
            }
          };

          // Start downloading tiles.
          isDownloading = true;
          nbTilesTotal = queue.length;
          var cursor = 0;
          var runNextRequests = function() {
            var requestsLoaded = 0;
            for (var j = cursor, jj = cursor + pool; j < jj &&
                j < nbTilesTotal; j++) {

              if (isStorageFull) {
                break;
              }

              var tile = queue[j];
              var tileUrl = gaUrlUtils.transformIfAgnostic(tile.url);
              var xhr = new XMLHttpRequest();
              xhr.tileUrl = tile.url;
              xhr.open('GET', tileUrl, true);
              xhr.responseType = 'arraybuffer';
              xhr.onload = function(e) {
                var response = e.target.response;
                if (!response || response.byteLength === 0) { // Tile empty
                  onTileSuccess(0);
                } else {
                  readResponse(e.target.tileUrl, response,
                      e.target.getResponseHeader('content-type'));
                }
                onLoadEnd(++requestsLoaded, j);
              };
              xhr.onerror = function(e) {
                onTileError(e.target.tileUrl, 'Request error');
                onLoadEnd(++requestsLoaded, j);
              };
              xhr.onabort = function(e) {
                onTileError(e.target.tileUrl, 'Request abort');
                onLoadEnd(++requestsLoaded, j);
              };
              xhr.ontimeout = function(e) {
                onTileError(e.target.tileUrl, 'Request timed out');
                onLoadEnd(++requestsLoaded, j);
              };
              xhr.send();
              requests.push(xhr);
              cursor++;
            }
          };

          var that = this;
          // ios: the prompt to increase the size of the db block all the ui.
          // When the prompt happens it's the first time we use the db so it'
          // empty so no need to clear the tiles.
          if (!gaBrowserSniffer.ios || gaStorage.getItem(promptKey)) {
            // We ensure the db is empty before saving tiles
            gaStorage.clearTiles().then(function() {
              runNextRequests();
            }, function() {
              that.abort();
            });
          } else {
            gaStorage.setItem(promptKey, true);
            runNextRequests();
          }
        };

        // If there is data in db we can initialize the store
        if (this.hasData()) {
          gaStorage.init();
        }
      };

      var off = new Offline();
      gaLayers.loadConfig().then(function() {
        if (off.isDataObsolete()) {
          $window.alert($translate.instant('offline_cache_obsolete'));
        }
      });
      return off;
    };
  });
})();
