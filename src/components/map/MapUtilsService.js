goog.provide('ga_maputils_service');

goog.require('ga_definepropertiesforlayer_service');
goog.require('ga_height_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_maputils_service', [
    'ga_definepropertiesforlayer_service',
    'ga_urlutils_service',
    'ga_height_service',
    'ga_storage_service'
  ]);

  /**
   * Service provides map util functions.
   */
  module.provider('gaMapUtils', function() {
    this.$get = function($window, gaGlobalOptions, gaUrlUtils, $q, gaStorage,
        gaDefinePropertiesForLayer, $http, $rootScope, gaHeight) {
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
      var proj = ol.proj.get(gaGlobalOptions.defaultEpsg);
      var extent = gaGlobalOptions.defaultExtent || proj.getExtent();
      var BASE64_MARKER = ';base64,';

      return {
        Z_PREVIEW_LAYER: 1000,
        Z_PREVIEW_FEATURE: 1100,
        Z_FEATURE_OVERLAY: 2000,
        preload: 6, // Number of upper zoom to preload when offline
        defaultExtent: extent,
        viewResolutions: resolutions,
        defaultResolution: gaGlobalOptions.defaultResolution,
        getViewResolutionForZoom: function(zoom) {
          return resolutions[zoom];
        },

        // Example of a dataURI: 'data:image/png;base64,sdsdfdfsdfdf...'
        dataURIToBlob: function(dataURI) {
          var base64Index = dataURI.indexOf(BASE64_MARKER);
          var contentType = dataURI.substring(5, base64Index);
          var arrayBuffer = this.dataURIToArrayBuffer(dataURI);
          return this.arrayBufferToBlob(arrayBuffer, contentType);
        },

        dataURIToArrayBuffer: function(dataURI) {
          var base64Index = dataURI.indexOf(BASE64_MARKER);
          var base64 = dataURI.substring(base64Index + BASE64_MARKER.length);
          var raw = $window.atob(base64);
          var rawLength = raw.length;
          var uInt8Array = new Uint8Array(rawLength);
          for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          return uInt8Array.buffer;
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
          return tileUrl.replace(/^\/\/(vectortiles|wmts|tod)[0-9]{0,3}/, '').
              replace('prod.bgdi', 'geo.admin');
        },

        /**
         * Search for a layer identified by bodId in the map and
         * return it. undefined is returned if the map does not have
         * such a layer.
         */
        getMapLayerForBodId: function(map, bodId) {
          var layer;
          map.getLayers().forEach(function(l) {
            if (l.bodId === bodId && !l.preview) {
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
            if (l.bodId === bodId && !l.background && !l.preview) {
              layer = l;
            }
          });
          return layer;
        },

        /**
         * Search for a background layer in the map. If not found (voidLayer),
         * it returns undefined.
         */
        getMapBackgroundLayer: function(map) {
          var layer;
          map.getLayers().forEach(function(l) {
            if (!layer && l.background) {
              layer = l;
            }
          });
          return layer;
        },

        flyToAnimation: function(ol3d, center, extent) {
          var dest;
          var scene = ol3d.getCesiumScene();
          var proj = ol3d.getOlMap().getView().getProjection();

          if (extent) {
            var rect = this.extentToRectangle(extent);
            dest = scene.camera.getRectangleCameraCoordinates(rect);
            center = ol.extent.getCenter(extent);
          }

          return gaHeight.get(ol3d.getOlMap(), center).then(function(height) {
            var defer = $q.defer();
            var pitch = 50; // In degrees
            // Default camera field of view
            // https://cesiumjs.org/Cesium/Build/Documentation/Camera.html
            var cameraFieldOfView = 60;
            center[2] = height;

            if (!dest) {
              pitch = 45; // In degrees
              var deg = ol.proj.transform(center, proj, 'EPSG:4326');
              dest = Cesium.Cartesian3.fromDegrees(deg[0], deg[1], height);
            }

            var carto = scene.globe.ellipsoid.cartesianToCartographic(dest);
            var magnitude = Math.tan(Cesium.Math.toRadians(pitch +
                cameraFieldOfView / 2)) * carto.height;

            // Approx. direction on x and y (only valid for Swiss extent)
            dest.x += (7 / 8) * magnitude;
            dest.y += (1 / 8) * magnitude;

            scene.camera.flyTo({
              destination: dest,
              orientation: {
                pitch: Cesium.Math.toRadians(-pitch)
              },
              complete: function() {
                defer.resolve(center);
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
        },

        zoomToExtent: function(map, ol3d, extent) {
          if (ol3d && ol3d.getEnabled()) {
            return this.flyToAnimation(ol3d, null, extent);
          }
          map.getView().fit(extent, {
            size: map.getSize()
          });
        },

        // This function differs from moveTo because it adds panning effect in
        // 2d
        panTo: function(map, ol3d, dest) {
          if (ol3d && ol3d.getEnabled()) {
            return this.moveTo(null, ol3d, null, dest);
          }
          var defer = $q.defer();
          var view = map.getView();
          view.animate({
            center: dest,
            duration: 0
          }, function(success) {
            defer.resolve();
            $rootScope.$apply();
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
            duration: duration / 2
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
          if (olLayerOrId instanceof ol.layer.Tile ||
              olLayerOrId instanceof ol.layer.Image ||
              olLayerOrId instanceof ol.layer.Vector) {
            olLayerOrId = olLayerOrId.id;
          }
          if (angular.isString(olLayerOrId)) {
            return /^KML\|\|/.test(olLayerOrId);
          }
          return false;
        },

        // Test if a layer is a KML layer added by dnd
        // @param olLayer  An ol layer
        isLocalKmlLayer: function(olLayer) {
          return this.isKmlLayer(olLayer) && !/^https?:\/\//.test(olLayer.url);
        },

        // Test if a layer is a GPX layer added by the Import tool or
        // permalink
        // @param olLayerOrId  An ol layer or an id of a layer
        isGpxLayer: function(olLayerOrId) {
          if (!olLayerOrId) {
            return false;
          }
          if (olLayerOrId instanceof ol.layer.Tile ||
              olLayerOrId instanceof ol.layer.Image ||
              olLayerOrId instanceof ol.layer.Vector) {
            olLayerOrId = olLayerOrId.id;
          }
          if (angular.isString(olLayerOrId)) {
            return /^GPX\|\|/.test(olLayerOrId);
          }
          return false;
        },

        // Test if a layer is a GPX layer added by dnd
        // @param olLayer  An ol layer
        isLocalGpxLayer: function(olLayer) {
          return this.isGpxLayer(olLayer) && !/^https?:\/\//.test(olLayer.url);
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
          }
          if (olLayerOrId instanceof ol.layer.Tile ||
              olLayerOrId instanceof ol.layer.Image ||
              olLayerOrId instanceof ol.layer.Vector) {
            olLayerOrId = olLayerOrId.id;
          }
          if (angular.isString(olLayerOrId)) {
            return /^WMTS\|\|/.test(olLayerOrId) &&
                olLayerOrId.split('||').length === 3;
          }
          return false;
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
          if (idx !== -1 && idx !== olLayers.length - 1) {
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
          if (idx !== -1) {
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
              olLayer.getSource() && olLayer instanceof ol.layer.Vector);
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
        },

        /**
         * Applies a gl style to an ol layer
         */
        applyGlStyleToOlLayer: function(olLayer, glStyle) {
          if (!olLayer || !glStyle) {
            return;
          }

          if (olLayer instanceof ol.layer.Group) {
            var that = this;
            var layers = olLayer.getLayers();
            layers.forEach(function(subOlLayer) {
              that.applyGlStyleToOlLayer(subOlLayer, glStyle);
            })
            olLayer.glStyle = glStyle;
            return;
          }

          if (!olLayer.sourceId) {
            return;
          }
          gaStorage.load(glStyle.sprite + '.json').then(function(spriteData) {
            $window.olms.stylefunction(
                olLayer,
                glStyle,
                olLayer.sourceId,
                undefined,
                spriteData,
                glStyle.sprite + '.png'
            );
            olLayer.glStyle = glStyle;
          });
        },

        // This function creates  an ol source and set it to the layer from the
        // sourceConfig of a glStyle.
        // This function set also the extent and minZoom, maxZoom infos.
        // ex: https://vectortiles.geo.admin.ch/mbtiles/ch.astra.wanderland_1539077150.json
        applyGlSourceToOlLayer: function(olLayer, sourceConfig) {
          var that = this;
          return gaStorage.load(sourceConfig.url).then(function(data) {
            var olSource;
            var sourceOpts = {
              minZoom: sourceConfig.minZoom || data.minzoom,
              maxZoom: sourceConfig.maxZoom || data.maxzoom,
              urls: data.tiles,
              tileLoadFunction: function(tile, url) {
                tile.setLoader(function(extent, resolution, projection) {
                  gaStorage.getTile(that.getTileKey(url)
                  ).then(function(base64) {
                    if (!base64) {
                      return $http.get(url, {
                        responseType: 'arraybuffer'
                      }).then(function(resp) {
                        return resp.data;
                      });
                    }
                    // Content from cache is a base64 string
                    return $q.when(that.dataURIToArrayBuffer(base64));
                  }).then(function(arrayBuffer) {
                    return $q.when(arrayBuffer || new ArrayBuffer(0));
                  }, function() {
                    // Very important otherwise failed requests breaks rendering
                    // of all tiles.
                    return $q.when(new ArrayBuffer(0));
                  }).then(function(arrayBuffer) {
                    var format = tile.getFormat();
                    tile.setFeatures(format.readFeatures(data, {
                      // extent is only required for ol/format/MVT
                      extent: extent,
                      featureProjection: projection
                    }));
                  });
                });
              }
            };

            if (sourceConfig.type === 'raster') {
              olSource = new ol.source.XYZ(sourceOpts);

            } else { // vector
              sourceOpts.format = new ol.format.MVT();
              // Setting it to 0 makes tiles disappear on each zoom.
              sourceOpts.cacheSize = 20;
              olSource = new ol.source.VectorTile(sourceOpts);
            }
            olLayer.setSource(olSource);

            if (data.bounds) {
              // Extent in epsg:4326
              olLayer.setExtent(ol.proj.transformExtent(data.bounds,
                  ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857')));
            }

          }, function(reason) {
            $window.console.error('Loading source config failed. Reason: ',
                reason);
          });
        },

        setGlBackground: function(map, glLayer) {
          $window.olms.applyBackground(map, glLayer);
        },

        /**
         * Transform a geometry in swissprojection.
         * Used to have a better measurement.
         */
        transform: function(geom) {
          return geom.clone().transform(
              ol.proj.get(gaGlobalOptions.defaultEpsg),
              ol.proj.get('EPSG:2056')
          );
        },

        /**
         * Transform a geometry from swissprojection to map's proj.
         * Used to have a better measurement.
         */
        transformBack: function(geom) {
          return geom.clone().transform(
              ol.proj.get('EPSG:2056'),
              ol.proj.get(gaGlobalOptions.defaultEpsg)
          );
        },

        /**
         * Mapping between Swiss map zooms and Web Mercator zooms.
        */
        swissZoomToMercator: function(zoom) {
          var gridZoom = zoom + 14;
          var wmtsMaxZoom = gaGlobalOptions.tileGridResolutions.length;
          var mapMaxZoom = gaGlobalOptions.resolutions.length;
          var zoomOffset = wmtsMaxZoom - mapMaxZoom;
          var mapping = {
            14: 7.35,
            15: 7.75,
            16: 8.75,
            17: 10,
            18: 11,
            19: 12.5,
            20: 13.5,
            21: 14.5,
            22: 15.5,
            23: 15.75,
            24: 16.7,
            25: 17.75,
            26: 18.75,
            27: 20,
            28: 21 // not defined at the moment
          };
          return mapping[gridZoom] - zoomOffset;
        }
      };
    };
  });
})();
