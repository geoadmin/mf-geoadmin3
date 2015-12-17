goog.provide('ga_map_service');

goog.require('ga_measure_service');
goog.require('ga_networkstatus_service');
goog.require('ga_storage_service');
goog.require('ga_styles_from_literals_service');
goog.require('ga_styles_service');
goog.require('ga_time_service');
goog.require('ga_topic_service');
goog.require('ga_urlutils_service');
(function() {

  var module = angular.module('ga_map_service', [
    'pascalprecht.translate',
    'ga_networkstatus_service',
    'ga_offline_service',
    'ga_storage_service',
    'ga_styles_from_literals_service',
    'ga_styles_service',
    'ga_urlutils_service',
    'ga_measure_service',
    'ga_topic_service',
    'ga_time_service'
  ]);

  module.provider('gaTileGrid', function() {
    var origin = [420000, 350000];
    var defaultResolutions = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250,
        2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5,
        2.5, 2, 1.5, 1, 0.5];
    var wmsResolutions = defaultResolutions.concat([0.25, 0.1]);

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
            resolutions = (type == 'wms') ? wmsResolutions : defaultResolutions;
          }
          if (minResolution) { // we remove useless resolutions
            for (var i = 0, ii = resolutions.length; i < ii; i++) {
              if (resolutions[i] === i) {
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
          userVisible: {
            writable: true,
            value: true
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
              return (Math.round((1 - this.getOpacity()) * 100) / 100) + '';
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
                  src.updateParams({'TIME': val});
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
    this.$get = function($timeout, gaBrowserSniffer) {
      return {
        listen: function(map, callback) {
          var down = null;
          var moving = false;
          var timeoutPromise = null;
          var touchstartTime;

          var isMouseRightAction = function(evt) {
            return (evt.button === 2 || evt.which === 3);
          };

          var touchstartListener = function(evt) {
            // This test only needed for IE10, to fix conflict between click
            // and contextmenu events on desktop
            if (!isMouseRightAction(evt)) {
              touchstartTime = (new Date()).getTime();
              down = evt;
            }
          };

          var touchmoveListener = function(evt) {
            // Fix ie10 on windows surface : when you tap the tablet, it
            // triggers multiple pointermove events between pointerdown and
            // pointerup with the exact same coordinates of the pointerdown
            // event. to avoid a 'false' touchmove event to be dispatched,
            // we test if the pointer effectively moved.
            if (down && (!gaBrowserSniffer.msie ||
                evt.clientX != down.clientX ||
                evt.clientY != down.clientY)) {
              moving = true;
            }
          };

          var touchendListener = function(evt) {
            var now = (new Date()).getTime();
            if (now - touchstartTime < 300) {
              if (down && !moving) {
                if (timeoutPromise) {
                  $timeout.cancel(timeoutPromise);
                  timeoutPromise = null;
                } else {
                  var clickEvent = down;
                  timeoutPromise = $timeout(function() {
                    callback(clickEvent);
                    timeoutPromise = null;
                  }, 350, false);
                }
              }
              moving = false;
              down = null;
            }
          };

          if (!gaBrowserSniffer.touchDevice) {
            var deregKey = map.on('singleclick', callback);
            return function() {
              ol.Observable.unByKey(deregKey);
            };

          } else {
            // We can't register 'singleclick' map event on touch devices
            // to avoid a conflict between the long press event used for context
            // popup
            var viewport = $(map.getViewport());
            var touchEvents = ['touchstart', 'touchmove', 'touchend'];
            if (gaBrowserSniffer.msie == 10) {
              touchEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
            } else if (gaBrowserSniffer.msie >= 11) {
              touchEvents = ['pointerdown', 'pointermove', 'pointerup'];
            }

            viewport.on(touchEvents[0], touchstartListener);
            viewport.on(touchEvents[1], touchmoveListener);
            viewport.on(touchEvents[2], touchendListener);
            return function() {
              viewport.unbind(touchEvents[0], touchstartListener);
              viewport.unbind(touchEvents[1], touchmoveListener);
              viewport.unbind(touchEvents[2], touchendListener);
            };
          }
        }
      };
    };
  });

  /**
   * Manage external WMS layers
   */
  module.provider('gaWms', function() {
    this.$get = function(gaDefinePropertiesForLayer, gaMapUtils, gaUrlUtils,
        gaGlobalOptions, $q) {
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
          format: 'image/png',
          service: 'WMS',
          version: '1.3.0',
          request: 'GetMap',
          crs: 'CRS:84',
          bbox: '{westProjected},{southProjected},' +
                '{eastProjected},{northProjected}',
          width: '256',
          height: '256',
          styles: 'default',
          transparent: 'true'
        };
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

        var createWmsLayer = function(params, options, index) {
          options = options || {};

          var source = new ol.source.ImageWMS({
            params: params,
            url: options.url,
            ratio: options.ratio || 1
          });

          var layer = new ol.layer.Image({
            id: 'WMS||' + options.label + '||' + options.url + '||' +
                params.LAYERS,
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
            extent: gaMapUtils.intersectWithDefaultExtent(getCapLayer.extent)
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
            style: params.style || 'default',
            service: 'WMS',
            version: params.version || '1.3.0',
            format: 'image/png',
            sld_version: '1.1.0'
          })) + '"></img>';
          defer.resolve({data: html});
          return defer.promise;
        };
      };
      return new Wms();
    };
  });

  /**
   * Manage KML layers
   */
  module.provider('gaKml', function() {

    // Ensure linear rings are closed
    var closeLinearRing = function(linearRing) {
      if (linearRing.getFirstCoordinate() != linearRing.getLastCoordinate()) {
        var coords = linearRing.getCoordinates();
        coords.push(linearRing.getFirstCoordinate());
        linearRing.setCoordinates(coords);
      }
    };
    var closePolygon = function(polygon) {
      var coords = [];
      var linearRings = polygon.getLinearRings();
      for (var i = 0, ii = linearRings.length; i < ii; i++) {
        closeLinearRing(linearRings[i]);
        coords.push(linearRings[i].getCoordinates());
      }
      polygon.setCoordinates(coords);
    };
    var closeMultiPolygon = function(multiPolygon) {
      var coords = [];
      var polygons = multiPolygon.getPolygons();
      for (var i = 0, ii = polygons.length; i < ii; i++) {
        closePolygon(polygons[i]);
        coords.push(polygons[i].getCoordinates());
      }
      multiPolygon.setCoordinates(coords);
    };
    var closeGeometries = function(geometries) {
      for (var i = 0, ii = geometries.length; i < ii; i++) {
        var geometry = geometries[i];
        if (geometry instanceof ol.geom.MultiPolygon) {
          closeMultiPolygon(geometry);
        } else if (geometry instanceof ol.geom.Polygon) {
          closePolygon(geometry);
        } else if (geometry instanceof ol.geom.LinearRing) {
          closeLinearRing(geometry);
        }
      }
    };

    this.$get = function($http, $q, $rootScope, $timeout, $translate,
        gaDefinePropertiesForLayer, gaGlobalOptions, gaMapClick, gaMapUtils,
        gaNetworkStatus, gaStorage, gaStyleFactory, gaUrlUtils, gaMeasure) {

      // Create the parser
      var kmlFormat = new ol.format.KML({
        extractStyles: true,
        extractAttributes: true,
        defaultStyle: [gaStyleFactory.getStyle('kml')]
      });

      // Read a kml string then return a list of features.
      var readFeatures = function(kml) {
        // Replace all hrefs to prevent errors if image doesn't have
        // CORS headers. Exception for *.geo.admin.ch, *.bgdi.ch and google
        // markers icons (lightblue.png, ltblue-dot.png, ltblu-pushpin.png, ...)
        // to keep the OL3 magic for anchor origin.
        // Test regex here: http://regex101.com/r/tF3vM0/3
        // List of google icons: http://www.lass.it/Web/viewer.aspx?id=4
        kml = kml.replace(
          /<href>http(?!(s?):\/\/(maps\.(?:google|gstatic)\.com.*(blue|green|orange|pink|purple|red|yellow|pushpin).*\.png|.*(bgdi|geo.admin)\.ch))/g,
          '<href>' + gaGlobalOptions.ogcproxyUrl + 'http'
        );

        // Replace all http hrefs from *.geo.admin.ch or *.bgdi.ch by https
        // Test regex here: http://regex101.com/r/fY7wB3/3
        kml = kml.replace(
          /<href>http(?!(s))(?=:\/\/(.*(bgdi|geo.admin)\.ch))/g,
          '<href>https'
        );

        var all = [];
        var features = kmlFormat.readFeatures(kml);
        var networkLinks = kmlFormat.readNetworkLinks(kml);
        if (networkLinks.length) {
          angular.forEach(networkLinks, function(networkLink) {
            if (gaUrlUtils.isValid(networkLink.href)) {
              all.push($http.get(networkLink.href).success(function(data) {
                return readFeatures(data).then(function(newFeatures) {
                  features = features.concat(newFeatures);
                });
              }));
            }
          });
        }
        return $q.all(all).then(function() {
          return features;
        });
      };

      // Sanitize the feature's properties (id, geometry, style).
      var sanitizeFeature = function(feature, projection) {
        var geometry = feature.getGeometry();
        // Remove feature without geometry.
        if (!geometry) {
          return;
        }
        // Ensure polygons are closed.
        // Reason: print server failed when polygons are not closed.
        closeGeometries((geometry instanceof ol.geom.GeometryCollection) ?
            geometry.getGeometries() : [geometry]);

        // Replace empty id by undefined.
        // Reason: If 2 features have their id empty, an assertion error
        // occurs when we add them to the source
        if (feature.getId() === '') {
          feature.setId(undefined);
        }
        if (feature.getGeometry()) {
          feature.getGeometry().transform('EPSG:4326', projection);
        }
        var geom = feature.getGeometry();
        var styles = feature.getStyleFunction().call(feature);
        var style = styles[0];

        // if the feature is a Point and we are offline, we use default kml
        // style.
        // if the feature is a Point and has a name with a text style, we
        // create a correct text style.
        // TODO Handle GeometryCollection displaying name on the first Point
        // geometry.
        if (style && (geom instanceof ol.geom.Point ||
            geom instanceof ol.geom.MultiPoint)) {
          var image = style.getImage();
          var text = null;

          if (gaNetworkStatus.offline) {
            image = gaStyleFactory.getStyle('kml').getImage();
          }

          // If the feature has name we display it on the map as Google does
          if (feature.get('name') && style.getText() &&
              style.getText().getScale() != 0) {
            if (image && image.getScale() == 0) {
              // transparentCircle is used to allow selection
              image = gaStyleFactory.getStyle('transparentCircle');
            }
            text = new ol.style.Text({
              font: gaStyleFactory.FONT,
              text: feature.get('name'),
              fill: style.getText().getFill(),
              stroke: gaStyleFactory.getTextStroke(
                  style.getText().getFill().getColor()),
              scale: style.getText().getScale()
            });
          }

          styles = [new ol.style.Style({
            fill: style.getFill(),
            stroke: style.getStroke(),
            image: image,
            text: text,
            zIndex: style.getZIndex()
          })];
          feature.setStyle(styles);
        }
        if (feature.getId()) {
          var split = feature.getId().split('_');
          if (split.length == 2) {
            feature.set('type', split[0]);
          }
        }

        // Apply the good style (with azimuth drawn) for measure feature
        if (style && gaMapUtils.isMeasureFeature(feature)) {
          feature.set('type', 'measure');
          feature.setStyle(gaStyleFactory.getFeatureStyleFunction('measure'));
        // Remove image and text styles for polygons and lines
        } else if (!(geom instanceof ol.geom.Point ||
            geom instanceof ol.geom.MultiPoint ||
            geom instanceof ol.geom.GeometryCollection)) {
          styles = [new ol.style.Style({
            fill: style.getFill(),
            stroke: style.getStroke(),
            image: null,
            text: null,
            zIndex: style.getZIndex()
          })];
          feature.setStyle(styles);
        }
        return feature;
      };

      var Kml = function() {

        // Create a vector layer from a kml string.
        var createKmlLayer = function(kml, options) {
          options = options || {};
          options.id = 'KML||' + options.url;

          // Update data stored for offline or use it if kml is null
          var offlineData = gaStorage.getItem(options.id);
          if (offlineData) {
            if (kml) {
              gaStorage.setItem(options.id, kml);
            } else {
              kml = offlineData;
            }
          } else if (!kml) {
            var deferred = $q.defer();
            deferred.reject('No KML data found');
            return deferred.promise;
          }

          // Read features available in a kml string, then create an ol layer.
          return readFeatures(kml).then(function(features) {
            var sanitizedFeatures = [];
            for (var i = 0, ii = features.length; i < ii; i++) {
              var feat = sanitizeFeature(features[i], options.projection);
              if (feat) {
                sanitizedFeatures.push(feat);
              }
            }
            var source = new ol.source.Vector({
              features: sanitizedFeatures
            });
            var layerOptions = {
              id: options.id,
              adminId: options.adminId,
              url: options.url,
              type: 'KML',
              label: options.label || kmlFormat.readName(kml) || 'KML',
              opacity: options.opacity,
              visible: options.visible,
              source: source,
              extent: gaMapUtils.intersectWithDefaultExtent(
                  source.getExtent()),
              attribution: options.attribution
            };

            // Be sure to remove all html tags
            layerOptions.label = $('<p>' + layerOptions.label + '<p>').text();

            var olLayer;
            if (options.useImageVector === true) {
              layerOptions.source = new ol.source.ImageVector({
                source: layerOptions.source
              });

              olLayer = new ol.layer.Image(layerOptions);
            } else {
              olLayer = new ol.layer.Vector(layerOptions);
            }
            gaDefinePropertiesForLayer(olLayer);
            olLayer.useThirdPartyData = true;

            return olLayer;
          });
        };

        // Add an ol layer to the map
        var addKmlLayer = function(olMap, data, options, index) {
          options.projection = olMap.getView().getProjection();
          createKmlLayer(data, options).then(function(olLayer) {
            if (olLayer) {
              if (index) {
                olMap.getLayers().insertAt(index, olLayer);
              } else {
                olMap.addLayer(olLayer);
              }

              // If the layer can contain measure features, we register some
              // events to add/remove correctly the overlays
              if (gaMapUtils.isStoredKmlLayer(olLayer)) {
                if (olLayer.getVisible()) {
                  angular.forEach(olLayer.getSource().getFeatures(),
                      function(feature) {
                    if (gaMapUtils.isMeasureFeature(feature)) {
                      gaMeasure.addOverlays(olMap, olLayer, feature);
                    }
                  });
                }
                gaMeasure.registerOverlaysEvents(olMap, olLayer);
              }

              if (options.zoomToExtent) {
                var extent = olLayer.getExtent();
                if (extent) {
                  olMap.getView().fit(extent, olMap.getSize());
                }
              }
            }
          });
        };

        this.addKmlToMap = function(map, data, layerOptions, index) {
          addKmlLayer(map, data, layerOptions, index);
        };

        this.addKmlToMapForUrl = function(map, url, layerOptions, index) {
          var that = this;
          layerOptions = layerOptions || {};
          layerOptions.url = url;
          if (gaNetworkStatus.offline) {
            addKmlLayer(map, null, layerOptions, index);
          } else {
            $http.get(gaGlobalOptions.ogcproxyUrl + encodeURIComponent(url), {
              cache: true
            }).success(function(data, status, headers, config) {
              var fileSize = headers('content-length');
              if (that.isValidFileContent(data) &&
                  that.isValidFileSize(fileSize)) {
                layerOptions.useImageVector = that.useImageVector(fileSize);
                addKmlLayer(map, data, layerOptions, index);
              }
            }).error(function() {
              // Try to get offline data if exist
              addKmlLayer(map, null, layerOptions, index);
            });
          }
        };

        // Defines if we should use a ol.layer.Image instead of a
        // ol.layer.Vector. Currently we define this, only testing the
        // file size but it could be another condition.
        this.useImageVector = function(fileSize) {
          return (!!fileSize && parseInt(fileSize) >= 1000000); // < 1mo
        };

        // Test the validity of the file size
        this.isValidFileSize = function(fileSize) {
          if (fileSize > 20000000) { // 20mo
            alert($translate.instant('file_too_large'));
            return false;
          }
          return true;
        };

        // Test the validity of the file content
        this.isValidFileContent = function(fileContent) {
          if (!/<kml/.test(fileContent) || !/<\/kml>/.test(fileContent)) {
            alert($translate.instant('file_is_not_kml'));
            return false;
          }
          return true;
        };
      };
      return new Kml();
    };
  });

  /**
   * Manage BOD layers
   */
  module.provider('gaLayers', function() {

    this.$get = function($http, $q, $rootScope, $translate, $window,
        gaBrowserSniffer, gaDefinePropertiesForLayer, gaMapUtils,
        gaNetworkStatus, gaStorage, gaTileGrid, gaUrlUtils,
        gaStylesFromLiterals, gaGlobalOptions, gaPermalink, gaTopic,
        gaLang, gaTime) {

      var Layers = function(dfltWmsSubdomains,
          dfltWmtsNativeSubdomains, dfltWmtsMapProxySubdomains,
          wmsUrlTemplate, wmtsGetTileUrlTemplate,
          wmtsMapProxyGetTileUrlTemplate, terrainTileUrlTemplate,
          layersConfigUrlTemplate, legendUrlTemplate) {
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
            gaStorage.getTile(gaMapUtils.getTileKey(src), function(err,
                content) {
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
          return $http.get(url).then(function(response) {
            // Live modifications for 3d test
            if (response.data) {
              // Imagery layers with metadata
              var ids = [
                'ch.swisstopo.swisstlm3d-wanderwege',
                'ch.bafu.wrz-wildruhezonen_portal',
                'ch.swisstopo.fixpunkte-agnes',
                'ch.swisstopo.swissimage-product_3d',
                'ch.swisstopo.swisstlm3d-karte-farbe_3d',
                'ch.swisstopo.swisstlm3d-karte-grau_3d'
              ];
              angular.forEach(ids, function(id) {
                if (response.data[id]) {
                  response.data[id].has3dMetadata = true;
                }
              });

              // Test layers opaque setting
              ids = [
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
                'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
                'ch.swisstopo.pixelkarte-farbe-pk1000.noscale'
              ];
              angular.forEach(ids, function(id) {
                if (response.data[id]) {
                  response.data[id].opaque = true;
                }
              });

              // Terrain
              var lang = gaLang.get();
              if (lang == 'rm') {
                lang = 'de';
              }
              response.data['ch.swisstopo.terrain.3d'] = {
                type: 'terrain',
                serverLayerName: 'ch.swisstopo.terrain.3d',
                timestamps: ['20151231'],
                attribution: 'swisstopo',
                attributionUrl: 'http://www.swisstopo.admin.ch/internet/' +
                    'swisstopo/' + lang + '/home.html'
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
          var provider, config = layers[bodId];
          var config3d = this.getConfig3d(config);
          var timestamp = this.getLayerTimestampFromYear(bodId, gaTime.get());
          var requestedLayer = config3d.serverLayerName || bodId;
          if (config3d.type == 'terrain') {
            provider = new Cesium.CesiumTerrainProvider({
              url: getTerrainTileUrl(requestedLayer, timestamp),
              availableLevels: window.terrainAvailableLevels,
              rectangle: gaMapUtils.extentToRectangle(
                gaGlobalOptions.defaultExtent)
            });
            provider.bodId = bodId;
          }
          return provider;
        };

        /**
         * Returns an Cesium imagery provider.
         */
        this.getCesiumImageryProviderById = function(bodId) {
          var provider, params, config = layers[bodId];
          bodId = config.config3d || bodId;
          var config3d = this.getConfig3d(config);
          // Only native tiles have a 3d config
          var hasNativeTiles = !!config.config3d;
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
              styles: 'default'
            };
            if (timestamp) {
              wmsParams.time = timestamp;
            }
            params = {
              url: getWmsTpl(config3d.wmsUrl, wmsParams),
              tileSize: tileSize,
              subdomains: dfltWmsSubdomains
            };
          }
          var extent = gaMapUtils.intersectWithDefaultExtent(config3d.extent ||
              ol.proj.get(gaGlobalOptions.defaultEpsg).getExtent());
          if (params) {
            var minRetLod = gaMapUtils.getLodFromRes(config3d.maxResolution) ||
                window.minimumRetrievingLevel;
            var maxRetLod = gaMapUtils.getLodFromRes(config3d.minResolution);
            var maxLod = 17;// 17 is the last terrain level
            if (config3d.resolutions) {
              maxLod = gaMapUtils.getLodFromRes(
                  config3d.resolutions[config3d.resolutions.length - 1]);
            }
            provider = new Cesium.UrlTemplateImageryProvider({
              url: params.url,
              subdomains: params.subdomains,
              minimumRetrievingLevel: minRetLod,
              maximumRetrievingLevel: maxRetLod,
              // This property active client zoom for next levels.
              maximumLevel: maxLod,
              rectangle: gaMapUtils.extentToRectangle(extent),
              tilingScheme: new Cesium.GeographicTilingScheme(),
              tileWidth: params.tileSize,
              tileHeight: params.tileSize,
              hasAlphaChannel: (format == 'png'),
              availableLevels: window.imageryAvailableLevels,
              // Experimental
              metadataUrl: config3d.has3dMetadata ?
                  getTerrainTileUrl(requestedLayer, timestamp) + '/' :
                  undefined
            });
          }
          if (provider) {
            provider.bodId = bodId;
          }
          return provider;
        };


        /**
         * Return an ol.layer.Layer object for a layer id.
         */
        this.getOlLayerById = function(bodId) {
          var layer = layers[bodId];
          var olLayer;
          var timestamp = this.getLayerTimestampFromYear(bodId, gaTime.get());
          var crossOrigin = 'anonymous';
          var extent = gaMapUtils.intersectWithDefaultExtent(layer.extent ||
              ol.proj.get(gaGlobalOptions.defaultEpsg).getExtent());

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
              var subdomains = dfltWmtsNativeSubdomains;
              olSource = layer.olSource = new ol.source.WMTS({
                dimensions: {
                  'Time': timestamp
                },
                projection: gaGlobalOptions.defaultEpsg,
                requestEncoding: 'REST',
                tileGrid: gaTileGrid.get(layer.resolutions,
                    layer.minResolution),
                tileLoadFunction: tileLoadFunction,
                urls: getImageryUrls(wmtsTplUrl, subdomains),
                crossOrigin: crossOrigin
              });
            }
            olLayer = new ol.layer.Tile({
              extent: extent,
              minResolution: gaNetworkStatus.offline ? null :
                  layer.minResolution,
              preload: gaNetworkStatus.offline ? gaMapUtils.preload : 0,
              maxResolution: layer.maxResolution,
              opacity: layer.opacity || 1,
              source: olSource,
              useInterimTilesOnError: gaNetworkStatus.offline
            });
          } else if (layer.type == 'wms') {
            var wmsParams = {
              LAYERS: layer.wmsLayers,
              FORMAT: 'image/' + layer.format
            };
            if (timestamp) {
              wmsParams['TIME'] = timestamp;
            }
            if (layer.singleTile === true) {
              if (!olSource) {
                olSource = layer.olSource = new ol.source.ImageWMS({
                  url: getImageryUrls(getWmsTpl(layer.wmsUrl))[0],
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
                  urls: getImageryUrls(getWmsTpl(layer.wmsUrl), subdomains),
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
                preload: gaNetworkStatus.offline ? gaMapUtils.preload : 0,
                useInterimTilesOnError: gaNetworkStatus.offline,
                extent: extent
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
            var fullUrl = gaGlobalOptions.ogcproxyUrl + layer.geojsonUrl;
            olSource = new ol.source.Vector();
            olLayer = new ol.layer.Vector({
              minResolution: layer.minResolution,
              maxResolution: layer.maxResolution,
              source: olSource,
              extent: extent
            });
            var setLayerSource = function() {
              var geojsonFormat = new ol.format.GeoJSON();
              $http.get(fullUrl, {
                cache: false
              }).success(function(data) {
                olSource.clear();
                olSource.addFeatures(
                  geojsonFormat.readFeatures(data)
                );
              });
            };
            var setLayerStyle = function() {
              // IE doesn't understand agnostic URLs
              $http.get(location.protocol + layer.styleUrl, {
                cache: true
              }).success(function(data) {
                var olStyleForVector = gaStylesFromLiterals(data);
                olLayer.setStyle(function(feature) {
                  return [olStyleForVector.getFeatureStyle(feature)];
                });
              });
              // Handle error
            };
            setLayerStyle();
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
          var timestamps = layer.timestamps || [];
          if (angular.isNumber(yearStr)) {
            yearStr = '' + yearStr;
          }
          if (!layer.timeEnabled) {
            // a WMTS/Terrain layer has at least one timestamp
            return (layer.type == 'wmts' || layer.type == 'terrain') ?
                timestamps[0] : undefined;
          }
          if (!angular.isDefined(yearStr)) {
            var timeBehaviour = layer.timeBehaviour;
            //check if specific 4/6/8 digit timestamp is specified
            if (/^\d{4}$|^\d{6}$|^\d{8}$/.test(timeBehaviour)) {
                yearStr = timeBehaviour;
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
      };

      return new Layers(this.dfltWmsSubdomains,
          this.dfltWmtsNativeSubdomains, this.dfltWmtsMapProxySubdomains,
          this.wmsUrlTemplate, this.wmtsGetTileUrlTemplate,
          this.wmtsMapProxyGetTileUrlTemplate, this.terrainTileUrlTemplate,
          this.layersConfigUrlTemplate, this.legendUrlTemplate);
    };

  });

  /**
   * Service provides map util functions.
   */
  module.provider('gaMapUtils', function() {
    this.$get = function($window, gaGlobalOptions, gaUrlUtils, $q,
        gaDefinePropertiesForLayer, $http) {
      var resolutions = gaGlobalOptions.resolutions;
      var lodsForRes = gaGlobalOptions.lods;
      var isExtentEmpty = function(extent) {
        return extent[0] >= extent[2] || extent[1] >= extent[3];
      };
      // Level of detail for the default resolution
      var lodForDfltRes = gaGlobalOptions.defaultLod;
      var dfltResIdx = resolutions.indexOf(gaGlobalOptions.defaultResolution);

      return {
        Z_PREVIEW_LAYER: 1000,
        Z_PREVIEW_FEATURE: 1100,
        Z_FEATURE_OVERLAY: 2000,
        preload: 6, //Number of upper zoom to preload when offline
        defaultExtent: gaGlobalOptions.defaultExtent,
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
        // Convert an extent to Cesium
        extentToRectangle: function(e, sourceProj) {
          sourceProj = sourceProj || ol.proj.get(gaGlobalOptions.defaultEpsg);
          e = ol.proj.transformExtent(e, sourceProj, 'EPSG:4326');
          return Cesium.Rectangle.fromDegrees(e[0], e[1], e[2], e[3]);
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

        /**
         * Defines a unique identifier from a tileUrl.
         * Use by offline to store in local storage.
         */
        getTileKey: function(tileUrl) {
          return tileUrl.replace(/^\/\/wmts[0-9]/, '');
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

        flyToAnimation: function(ol3d, center, destination, defer) {
          var scene = ol3d.getCesiumScene();
          var camera = scene.camera;
          var globe = scene.globe;
          var carto = globe.ellipsoid.cartesianToCartographic(destination);
          $http.get(gaGlobalOptions.apiUrl + '/rest/services/height', {
            params: {
              easting: center[0],
              northing: center[1]
            }
          }).then(function(response) {
            var height = carto.height - response.data.height;
            var offset = Math.tan(Cesium.Math.toRadians(50)) * (height + 50);
            destination.x += offset * 2;
            camera.flyTo({
              destination: destination,
              orientation: {
                pitch: Cesium.Math.toRadians(-50)
              },
              complete: defer.resolve,
              cancel: defer.resolve
            });
          });
        },

        moveTo: function(map, ol3d, zoom, center) {
          var defer = $q.defer();
          if (ol3d && ol3d.getEnabled()) {
            var projection = ol3d.getOlMap().getView().getProjection();
            var deg = ol.proj.transform(center, projection, 'EPSG:4326');
            var destination = Cesium.Cartesian3.fromDegrees(
                deg[0], deg[1], 3000);
            this.flyToAnimation(ol3d, center, destination, defer);
          } else {
            var view = map.getView();
            view.setZoom(zoom);
            view.setCenter(center);
            defer.resolve();
          }
          return defer.promise;
        },
        zoomToExtent: function(map, ol3d, extent) {
          var defer = $q.defer();
          if (ol3d && ol3d.getEnabled()) {
            var camera = ol3d.getCesiumScene().camera;
            var rectangle = this.extentToRectangle(extent);
            var destination = camera.getRectangleCameraCoordinates(rectangle);
            var center = ol.extent.getCenter(extent);
            this.flyToAnimation(ol3d, center, destination, defer);
          } else {
            map.getView().fit(extent, map.getSize());
            defer.resolve();
          }
          return defer.promise;
        },

        // This function differs from moveTo because it adds panning effect in
        // 2d
        panTo: function(map, ol3d, dest) {
          var defer = $q.defer();
          if (ol3d && ol3d.getEnabled()) {
            return this.moveTo(null, ol3d, null, dest);
          } else {
            var source = map.getView().getCenter();
            var dist = Math.sqrt(Math.pow(source[0] - dest[0], 2),
                Math.pow(source[1] - dest[1], 2));
            var duration = Math.min(Math.sqrt(300 + dist /
                map.getView().getResolution() * 1000), 3000);
            var start = +new Date();
            var pan = ol.animation.pan({
              duration: duration,
              source: map.getView().getCenter(),
              start: start
            });
            map.beforeRender(pan);
            map.getView().setCenter(dest);
            defer.resolve();
          }
          return defer.promise;
        },

        // This function differs from zoomToExtent because it adds flying effect
        // in 2d
        flyTo: function(map, ol3d, dest, extent) {
          var defer = $q.defer();
          if (ol3d && ol3d.getEnabled()) {
            return this.zoomToExtent(null, ol3d, extent);
          } else {
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
            var start = +new Date();
            var pan = ol.animation.pan({
              duration: duration,
              source: source,
              start: start
            });
            var bounce = ol.animation.bounce({
              duration: duration,
              resolution: Math.max(sourceRes, dist / 1000,
                  // needed to don't have up an down and up again in zoom
                  destRes * 1.2),
              start: start
            });
            var zoom = ol.animation.zoom({
              resolution: sourceRes,
              duration: duration,
              start: start
            });
            map.beforeRender(pan, zoom, bounce);
            map.getView().setCenter(dest);
            map.getView().setResolution(destRes);
            defer.resolve();
          }
          return defer.promise;
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
          if (!olLayerOrId) {
            return false;
          }
          if (angular.isString(olLayerOrId)) {
            return /^WMS\|\|/.test(olLayerOrId) &&
                olLayerOrId.split('||').length == 4;
          }
          return olLayerOrId.type == 'WMS';
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
          var currentRotation, scene;
          if (ol3d && ol3d.getEnabled()) {
            scene = ol3d.getCesiumScene();
            currentRotation = -scene.camera.heading;
          } else {
            currentRotation = map.getView().getRotation();
          }
          while (currentRotation < -Math.PI) {
            currentRotation += 2 * Math.PI;
          }
          while (currentRotation > Math.PI) {
            currentRotation -= 2 * Math.PI;
          }

          if (scene) {
            var bottom = olcs.core.pickBottomPoint(scene);
            if (bottom) {
              olcs.core.setHeadingUsingBottomCenter(scene, currentRotation,
                  bottom);
            }
          } else {
            map.beforeRender(ol.animation.rotate({
              rotation: currentRotation,
              duration: 1000,
              easing: ol.easing.easeOut
            }));
            map.getView().setRotation(0);
          }
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
          layer.set('altitudeMode', 'clampToGround');
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
        timeEnabledLayersFilter: function(layer) {
          return !layer.background &&
                 layer.timeEnabled &&
                 layer.visible &&
                 !layer.preview;
        },
        /**
         * Keep layers with potential tooltip
         */
        potentialTooltip: function(layer) {
          return layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.getLayerProperty(layer.bodId, 'tooltip');
        },
        /**
         * Searchable layers
         */
        searchable: function(layer) {
          return layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.getLayerProperty(layer.bodId, 'searchable');
        },
        /**
         * Queryable layers (layers with queryable attributes)
         */
        queryable: function(layer) {
          return layer.displayInLayerManager &&
                 layer.visible &&
                 layer.bodId &&
                 gaLayers.getLayerProperty(layer.bodId,
                                           'queryableAttributes') &&
                 gaLayers.getLayerProperty(layer.bodId,
                                           'queryableAttributes').length > 0;
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

  module.provider('gaRealtimeLayersManager', function() {
    this.$get = function($rootScope, $http, $timeout,
        gaLayerFilters, gaMapUtils, gaGlobalOptions) {

      var timers = [];
      var realTimeLayersId = [];
      var geojsonFormat = new ol.format.GeoJSON();

      function setLayerSource(layer) {
        var fullUrl = gaGlobalOptions.ogcproxyUrl + layer.geojsonUrl;
        var olSource = layer.getSource();
        $http.get(fullUrl, {
          cache: false
        }).success(function(data) {
          olSource.clear();
          olSource.addFeatures(
            geojsonFormat.readFeatures(data)
          );
          var layerIdIndex = realTimeLayersId.indexOf(layer.bodId);
          if (layerIdIndex != -1 && !layer.preview) {
            $timeout.cancel(timers.splice(layerIdIndex, 1));
            timers.push(setLayerUpdateInterval(layer));
            if (data.timestamp) {
              $rootScope.$broadcast('gaNewLayerTimestamp', data.timestamp);
            }
          }
        });
      }
      // updateDeplay should be higher than the time
      // needed to upload the geojson file
      function setLayerUpdateInterval(layer) {
        return $timeout(function() {
          setLayerSource(layer);
        }, layer.updateDelay);
      }

      return function(map) {
        var scope = $rootScope.$new();
        scope.layers = map.getLayers().getArray();
        scope.layerFilter = gaLayerFilters.realtime;

        scope.$watchCollection('layers | filter:layerFilter',
            function(newLayers, oldLayers) {
          // Layer Removed
          for (var i = 0; i < oldLayers.length; i++) {
            var bodId = oldLayers[i].bodId;
            var oldLayerIdIndex = realTimeLayersId.indexOf(bodId);
            if (oldLayerIdIndex != -1 &&
                !gaMapUtils.getMapLayerForBodId(map, bodId)) {
              realTimeLayersId.splice(oldLayerIdIndex, 1);
              $timeout.cancel(timers.splice(oldLayerIdIndex, 1));
              if (realTimeLayersId.length == 0) {
                $rootScope.$broadcast('gaNewLayerTimestamp', '');
              }
            }
          }
          // Layer Added
          for (var i = 0; i < newLayers.length; i++) {
            var bodId = newLayers[i].bodId;
            var newLayerIdIndex = realTimeLayersId.indexOf(bodId);
            if (newLayerIdIndex == -1) {
              if (!newLayers[i].preview) {
                realTimeLayersId.push(bodId);
              }
              setLayerSource(newLayers[i]);
            }
          }
        });

        // Update geojson source on language change
        $rootScope.$on('$translateChangeEnd', function(evt) {
          for (var i = 0; i < realTimeLayersId.length; i++) {
            var bodId = realTimeLayersId[i];
            var olLayer = gaMapUtils.getMapLayerForBodId(map, bodId);
            var olSource = olLayer.getSource();
            var indexLayerId = realTimeLayersId.indexOf(bodId);
            $timeout.cancel(timers.splice(indexLayerId, 1));
            setLayerSource(olLayer);
          }
        });
      };
    };
  });

  /**
   * Service that manages the "layers", "layers_opacity", and
   * "layers_visibility" permalink parameter.
   *
   * The manager works with a "layers" array. It watches the array (using
   * $watchCollection) and updates the "layers" parameter in the permalink
   * when the array changes. It also watches "opacity" and "visibility" on
   * each layer and updates the "layers_opacity" and "layers_visibility"
   * parameters as appropriate.
   *
   * And, at application init time, it adds to the map the layers specified
   * in the permalink, and the opacity and visibility of layers.
   */
  module.provider('gaLayersPermalinkManager', function() {

    this.$get = function($rootScope, gaLayers, gaPermalink, $translate, $http,
        gaKml, gaMapUtils, gaWms, gaLayerFilters, gaUrlUtils, gaFileStorage,
        gaTopic, gaGlobalOptions, $q, gaTime) {

      var layersParamValue = gaPermalink.getParams().layers;
      var layersOpacityParamValue = gaPermalink.getParams().layers_opacity;
      var layersVisibilityParamValue =
          gaPermalink.getParams().layers_visibility;
      var layersTimestampParamValue =
          gaPermalink.getParams().layers_timestamp;


      var layerSpecs = layersParamValue ? layersParamValue.split(',') : [];
      var layerOpacities = layersOpacityParamValue ?
          layersOpacityParamValue.split(',') : [];
      var layerVisibilities = layersVisibilityParamValue ?
          layersVisibilityParamValue.split(',') : [];
      var layerTimestamps = layersTimestampParamValue ?
          layersTimestampParamValue.split(',') : [];

      function updateLayersParam(layers) {
        if (layers.length) {
          var layerSpecs = $.map(layers, function(layer) {
            return layer.bodId || layer.id;
          });
          gaPermalink.updateParams({
            layers: layerSpecs.join(',')
          });
        } else {
          gaPermalink.deleteParam('layers');
        }
      }

      function updateLayersOpacityParam(layers) {
        var opacityTotal = 0;
        var opacityValues = $.map(layers, function(layer) {
          var opacity = Math.round(layer.getOpacity() * 100) / 100;
          opacityTotal += opacity;
          return opacity;
        });
        if (opacityTotal === layers.length) {
          gaPermalink.deleteParam('layers_opacity');
        } else {
          gaPermalink.updateParams({
            layers_opacity: opacityValues.join(',')
          });
        }
      }

      function updateLayersVisibilityParam(layers) {
        var visibilityTotal = true;
        var visibilityValues = $.map(layers, function(layer) {
          var visibility = layer.visible;
          visibilityTotal = visibilityTotal && visibility;
          return visibility;
        });
        if (visibilityTotal === true) {
          gaPermalink.deleteParam('layers_visibility');
        } else {
          gaPermalink.updateParams({
            layers_visibility: visibilityValues.join(',')
          });
        }
      }

      function updateLayersTimestampsParam(layers) {
        var timestampTotal = false;
        var timestampValues = $.map(layers, function(layer) {
          if (layer.timeEnabled) {
            timestampTotal = true;
            if (layer.time) {
              return layer.time;
            }
          }
          return '';
        });
        if (timestampTotal) {
          gaPermalink.updateParams({
            layers_timestamp: timestampValues.join(',')
          });
        } else {
          gaPermalink.deleteParam('layers_timestamp');
        }
      }

      // Update permalink on layer's modification
      var registerLayersPermalink = function(scope, map) {
        var deregFns = [];
        scope.layers = map.getLayers().getArray();
        scope.layerFilter = gaLayerFilters.permalinked;
        scope.$watchCollection('layers | filter:layerFilter',
            function(layers) {

          updateLayersParam(layers);

          // deregister the listeners we have on each layer and register
          // new ones for the new set of layers.
          angular.forEach(deregFns, function(deregFn) { deregFn(); });
          deregFns.length = 0;

          angular.forEach(layers, function(layer) {
            if (gaMapUtils.isStoredKmlLayer(layer)) {
              deregFns.push(scope.$watch(function() {
                return layer.id;
              }, function() {
                updateLayersParam(layers);
              }));
            }
            deregFns.push(scope.$watch(function() {
              return layer.getOpacity();
            }, function() {
              updateLayersOpacityParam(layers);
            }));
            deregFns.push(scope.$watch(function() {
              return layer.visible;
            }, function() {
              updateLayersVisibilityParam(layers);
            }));
            deregFns.push(scope.$watch(function() {
              return layer.time;
            }, function() {
              updateLayersTimestampsParam(layers);
            }));

          });
        });
      };
      return function(map) {
        var scope = $rootScope.$new();
        var dupId = 0; // Use for duplicate layer
        // We must reorder layer when async layer are added
        var mustReorder = false;

        var addTopicSelectedLayers = function() {
          addLayers(gaTopic.get().selectedLayers.slice(0).reverse());
          var activatedLayers = gaTopic.get().activatedLayers;
          if (activatedLayers.length) {
            addLayers(activatedLayers.slice(0).reverse(), null, false);
          }
        };

        var addLayers = function(layerSpecs, opacities, visibilities,
            timestamps) {
          var nbLayersToAdd = layerSpecs.length;
          angular.forEach(layerSpecs, function(layerSpec, index) {
            var layer;
            var opacity = (opacities && index < opacities.length) ?
                opacities[index] : undefined;
            var visible = (visibilities === false ||
                (angular.isArray(visibilities) &&
                visibilities[index] == 'false')) ?
                false : true;
            var timestamp = (timestamps && index < timestamps.length &&
                timestamps != '') ? timestamps[index] : '';

            var bodLayer = gaLayers.getLayer(layerSpec);
            if (bodLayer) {
              // BOD layer.
              // Do not consider BOD layers that are already in the map,
              // except for timeEnabled layers
              var isOverlay = gaMapUtils.getMapOverlayForBodId(map, layerSpec);
              // We test if timestamps exist to differentiate between topic
              // selected layers and topic activated layers (no timestamps
              // parameter defined).
              if ((bodLayer.timeEnabled && isOverlay && timestamps) ||
                  !isOverlay) {
                layer = gaLayers.getOlLayerById(layerSpec);

                // If the layer is already on the map when need to increment
                // the id.
                if (isOverlay) {
                  layer.id += '_' + dupId++;
                }
              }
              if (angular.isDefined(layer)) {
                layer.visible = visible;
                // if there is no opacity defined in the permalink, we keep
                // the default opacity of the layers
                if (opacity) {
                  layer.setOpacity(opacity);
                }
                if (layer.timeEnabled && timestamp) {
                  // If a time permalink exist we use it instead of the
                  // timestamp, only if the layer is visible.
                  if (gaTime.get() && layer.visible) {
                    timestamp = gaLayers.getLayerTimestampFromYear(layer.bodId,
                        gaTime.get());
                  }
                  layer.time = timestamp;
                }
                map.addLayer(layer);
              }

            } else if (gaMapUtils.isKmlLayer(layerSpec)) {

              // KML layer
              var url = layerSpec.replace('KML||', '');
              try {
                gaKml.addKmlToMapForUrl(map, url,
                  {
                    opacity: opacity || 1,
                    visible: visible
                  },
                  index + 1);
                mustReorder = true;
              } catch (e) {
                // Adding KML layer failed, native alert, log message?
              }

            } else if (gaMapUtils.isExternalWmsLayer(layerSpec)) {

              // External WMS layer
              var infos = layerSpec.split('||');
              try {
                gaWms.addWmsToMap(map,
                  {
                    LAYERS: infos[3]
                  },
                  {
                    url: infos[2],
                    label: infos[1],
                    opacity: opacity || 1,
                    visible: visible,
                    extent: gaGlobalOptions.defaultExtent
                  },
                  index + 1);
              } catch (e) {
                // Adding external WMS layer failed, native alert, log message?
              }
            }
          });

          // When an async layer is added we must reorder correctly the layers.
          if (mustReorder) {
            var deregister2 = scope.$watchCollection(
                'layers | filter:layerFilter', function(layers) {
              if (layers.length == nbLayersToAdd) {
                deregister2();
                var hasBg = false;
                for (var i = 0, ii = map.getLayers().getLength(); i < ii; i++) {
                  var layer = map.getLayers().item(i);
                  var idx = layerSpecs.indexOf(layer.id);
                  if (i == 0 && layer.background == true) {
                    hasBg = true;
                  }
                  if (hasBg) {
                    idx = idx + 1;
                  }
                  if (i != idx) {
                    map.getLayers().remove(layer);
                    map.getLayers().insertAt(idx, layer);
                    i = (i < idx) ? i : idx;
                  }
                }
              }
            });
          }

          // Add a modifiable KML layer
          var adminId = gaPermalink.getParams().adminId;
          if (adminId) {
            gaFileStorage.getFileUrlFromAdminId(adminId).then(function(url) {
              try {
                gaKml.addKmlToMapForUrl(map, url, {
                  adminId: adminId
                });
                gaPermalink.deleteParam('adminId');
              } catch (e) {
                // Adding KML layer failed, native alert, log message?
              }
            });
          }
        };

        // Add permalink layers when topics and layers config are loaded
        $q.all([gaTopic.loadConfig(), gaLayers.loadConfig()]).then(function() {
          if (!layerSpecs.length) {
            // We add topic selected layers if no layers parameters provided
            addTopicSelectedLayers();
          } else {
            // We add layers from 'layers' parameter
            addLayers(layerSpecs, layerOpacities, layerVisibilities,
                layerTimestamps);
          }

          gaTime.allowStatusUpdate = true;
          registerLayersPermalink(scope, map);
          // Listen for next topic change events
          $rootScope.$on('gaTopicChange', addTopicSelectedLayers);
        });
      };
    };
  });


  /**
   * This service manage features on vector preview layer.
   * This preview layer is used to display temporary features.
   * Used by Tooltip, FeatureTree, Search and Permalink.
   */
  module.provider('gaPreviewFeatures', function() {
    var MINIMAL_EXTENT_SIZE = 1965;
    var highlightedFeature, onClear, listenerKeyRemove, listenerKeyAdd;
    var geojson = new ol.format.GeoJSON();
    var source = new ol.source.Vector();
    var vector = new ol.layer.Vector({
      source: source
    });

    this.$get = function($rootScope, $q, $http, gaDefinePropertiesForLayer,
        gaStyleFactory, gaMapUtils) {
      var url = this.url;
      var selectStyle = gaStyleFactory.getStyle('select');
      var highlightStyle = gaStyleFactory.getStyle('highlight');

      // Define layer default properties
      gaDefinePropertiesForLayer(vector);
      vector.preview = true;
      vector.displayInLayerManager = false;
      vector.setZIndex(gaMapUtils.Z_PREVIEW_FEATURE);

      // TO DO: May be this method should be elsewher?
      var getFeatures = function(featureIdsByBodId) {
        var promises = [];
        angular.forEach(featureIdsByBodId, function(featureIds, bodId) {
          Array.prototype.push.apply(promises, $.map(featureIds,
              function(featureId) {
                return $http.get(url + bodId + '/' +
                  featureId + '?geometryFormat=geojson');
              }
          ));
        });
        return $q.all(promises);
      };

      // Get a buffered extent if necessary
      var getMinimalExtent = function(extent) {
        if (ol.extent.getHeight(extent) < MINIMAL_EXTENT_SIZE &&
            ol.extent.getWidth(extent) < MINIMAL_EXTENT_SIZE) {
          var center = ol.extent.getCenter(extent);
          return ol.extent.buffer(center.concat(center),
              MINIMAL_EXTENT_SIZE / 2);
        } else {
          return extent;
        }
      };

      // Remove features associated with a layer.
      var removeFromLayer = function(layer) {
        var features = source.getFeatures();
        for (var i = 0, ii = features.length; i < ii; i++) {
          var layerId = features[i].get('layerId');
          if (angular.isDefined(layerId) && layerId == layer.id) {
            source.removeFeature(features[i]);
          }
        }
      };

      // Add/remove/move to top the vector layer.
      var updateLayer = function(map) {
        if (source.getFeatures().length == 0) {
          ol.Observable.unByKey(listenerKeyRemove);
          ol.Observable.unByKey(listenerKeyAdd);
          map.removeLayer(vector);
        } else if (map.getLayers().getArray().indexOf(vector) == -1) {
          map.addLayer(vector);

          // Add event for automatically removing the features when the
          // corresponding layer is removed.
          listenerKeyRemove = map.getLayers().on('remove', function(event) {
            removeFromLayer(event.element);
          });
        }
      };

      var PreviewFeatures = function() {

        // Add a feature.
        this.add = function(map, feature) {
          feature.setStyle(selectStyle);
          source.addFeature(feature);
          updateLayer(map);
        };

        // Add features from an array<layerBodId,array<featureIds>>.
        // Param onNextClear is a function to call on the next execution of
        // clear function.
        this.addBodFeatures = function(map, featureIdsByBodId, onNextClear) {
          var defer = $q.defer();
          var features = [];
          this.clear(map);
          var that = this;
          getFeatures(featureIdsByBodId).then(function(results) {
            angular.forEach(results, function(result) {
              result.data.feature.properties.layerId =
                  result.data.feature.layerBodId;
              features.push(result.data.feature);
              that.add(map, geojson.readFeature(result.data.feature));
            });
            that.zoom(map);
            defer.resolve(features);
          });

          onClear = onNextClear;
          return defer.promise;
        };

        // Remove all.
        this.clear = function(map) {
          source.clear();
          if (map) {
            updateLayer(map);
          }
          highlightedFeature = undefined;

          if (onClear) {
            onClear();
            onClear = undefined;
          }
        };

        // Remove only the highlighted feature.
        this.clearHighlight = function(map) {
          if (highlightedFeature) {
            source.removeFeature(highlightedFeature);
            highlightedFeature = undefined;
          }
        };

        // Remove the precedent feature highlighted then add the new one.
        this.highlight = function(map, feature) {
          this.clearHighlight();
          // We clone the feature to avoid duplicate features with same ids
          highlightedFeature = new ol.Feature(feature.getGeometry());
          highlightedFeature.setStyle(highlightStyle);
          source.addFeature(highlightedFeature);
          updateLayer(map);
        };

        // Zoom on a feature (if defined) or zoom on the entire source
        // extent.
        this.zoom = function(map, ol3d, feature) {
          var extent = getMinimalExtent((feature) ?
              feature.getGeometry().getExtent() : source.getExtent());
          gaMapUtils.zoomToExtent(map, ol3d, extent);
        };
      };
      return new PreviewFeatures();
    };
  });

  module.provider('gaFeaturesPermalinkManager', function() {
    this.$get = function($rootScope, gaPermalink, gaLayers,
        gaPreviewFeatures, gaMapUtils) {
      var queryParams = gaPermalink.getParams();
      var layersParamValue = queryParams.layers;
      var layerSpecs = layersParamValue ? layersParamValue.split(',') : [];

      return function(map) {
        gaLayers.loadConfig().then(function() {
          var featureIdsCount = 0;
          var featureIdsByBodId = {};
          var paramKey;
          var listenerKey;
          for (paramKey in queryParams) {
            if (gaLayers.getLayer(paramKey)) {
              var bodId = paramKey;
              if (!(bodId in featureIdsByBodId)) {
                featureIdsByBodId[bodId] = [];
              }
              var featureIds = queryParams[bodId].split(',');
              if (featureIds.length > 0) {
                featureIdsCount += featureIds.length;
                Array.prototype.push.apply(featureIdsByBodId[bodId],
                    featureIds);
                if (!gaMapUtils.getMapOverlayForBodId(map, bodId) &&
                    layerSpecs.indexOf(bodId) == -1) {
                  map.addLayer(gaLayers.getOlLayerById(bodId));
                }
              }
            }
          }

          var removeParamsFromPL = function() {
            var bodId;
            for (bodId in featureIdsByBodId) {
              gaPermalink.deleteParam(bodId);
            }
            featureIdsCount = 0;
          };

          $rootScope.$broadcast('gaPermalinkFeaturesAdd', {
            featureIdsByBodId: featureIdsByBodId,
            count: featureIdsCount
          });

          if (featureIdsCount > 0) {
            var featuresShown = gaPreviewFeatures.addBodFeatures(map,
                featureIdsByBodId, removeParamsFromPL);

            if (queryParams.showTooltip == 'true') {
              featuresShown.then(function(features) {
                $rootScope.$broadcast('gaTriggerTooltipRequest', {
                  features: features,
                  onCloseCB: function() {
                    gaPermalink.deleteParam('showTooltip');
                  },
                  nohighlight: true
                });
              });
            }

            // When a layer is removed, we need to update the permalink
            listenerKey = map.getLayers().on('remove', function(event) {
              var layerBodId = event.element.bodId;
              if (featureIdsCount > 0 && (layerBodId in featureIdsByBodId)) {
                featureIdsCount -= featureIdsByBodId[layerBodId].length;
                gaPermalink.deleteParam(layerBodId);
              }
              if (featureIdsCount == 0 && listenerKey) {
                // Unlisten the remove event when there is no more features
                // (from permalink) displayed.
                ol.Observable.unByKey(listenerKey);
              }
            });
          }
        });
      };
    };
  });

  /**
   * Service manages preview layers on map, used by CatalogTree,
   * Search, ImportWMS
   */
  module.provider('gaPreviewLayers', function() {
    // We store all review layers we add
    var olPreviewLayers = {};

    this.$get = function($rootScope, gaLayers, gaWms, gaTime, gaMapUtils) {
      var olPreviewLayer;

      var PreviewLayers = function() {

        this.addBodLayer = function(map, bodId) {

          // Remove all preview layers
          this.removeAll(map);

          // Search or create the preview layer
          var olPreviewLayer = olPreviewLayers[bodId];

          if (!olPreviewLayer) {
            olPreviewLayer = gaLayers.getOlLayerById(bodId);
          }

          // Something failed, layer doesn't exist
          if (!olPreviewLayer) {
            return undefined;
          }

          // Apply the current time
          if (olPreviewLayer.bodId && olPreviewLayer.timeEnabled) {
            olPreviewLayer.time = gaLayers.getLayerTimestampFromYear(
                olPreviewLayer.bodId, gaTime.get());
          }

          olPreviewLayer.preview = true;
          olPreviewLayer.displayInLayerManager = false;
          olPreviewLayer.setZIndex(gaMapUtils.Z_PREVIEW_LAYER);
          olPreviewLayers[bodId] = olPreviewLayer;
          map.addLayer(olPreviewLayer);

          return olPreviewLayer;
        };

        this.addGetCapWMSLayer = function(map, getCapLayer) {
          // Remove all preview layers
          this.removeAll(map);

          // Search or create the preview layer
          var olPreviewLayer = olPreviewLayers[getCapLayer.id];

          if (!olPreviewLayer) {
            olPreviewLayer = gaWms.getOlLayerFromGetCapLayer(getCapLayer);
          }

          // Something failed, layer doesn't exist
          if (!olPreviewLayer) {
            return undefined;
          }

          olPreviewLayer.preview = true;
          olPreviewLayer.displayInLayerManager = false;
          olPreviewLayers[getCapLayer.id] = olPreviewLayer;
          olPreviewLayer.setZIndex(gaMapUtils.Z_PREVIEW_LAYER);
          map.addLayer(olPreviewLayer);

          return olPreviewLayer;
        };

        // Remove all preview layers currently on the map, to be sure there is
        // one and only one preview layer at a time
        this.removeAll = function(map) {
          var layers = map.getLayers().getArray();
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].preview && !(layers[i] instanceof ol.layer.Vector)) {
              map.removeLayer(layers[i]);
              i--;
            } else if (layers[i].preview && layers[i].type == 'geojson') {
              map.removeLayer(layers[i]);
              i--;
            }
          }
        };
      };

      return new PreviewLayers();
    };
  });

  /**
   * Service to pseudo-hide layers behind fully opaque layers
   * to avoid loading tiles/data for such layers.
   */
  module.provider('gaLayerHideManager', function() {
    this.$get = function(gaDebounce, gaLayers, gaLayerFilters) {
      var layers = [];
      var unregKeys = [];
      var is3DActive = false;

      var unreg = function() {
        angular.forEach(unregKeys, function(key) {
          if (key) {
            ol.Observable.unByKey(key);
          }
        });
        unregKeys = [];
      };

      var updateHiddenState = gaDebounce.debounce(function() {
        var sortedLayers = layers.slice().reverse();
        var hide = false;

        unreg();

        angular.forEach(sortedLayers, function(layer) {
          layer.hiddenByOther = hide;

          if (is3DActive) {
            // Register all layers for changes
            unregKeys.push(layer.on('change:visible', function(evt) {
              updateHiddenState();
            }));
            unregKeys.push(layer.on('change:opacity', function(evt) {
              updateHiddenState();
            }));

            // First opaque layer
            if (!hide &&
                gaLayers.getLayer(layer.id) &&
                gaLayers.getLayer(layer.id).opaque &&
                layer.visible &&
                layer.invertedOpacity == '0') {
              hide = true;
            }
          }
        });
      }, 100, false, false);
      return function(parentScope) {
        var scope = parentScope.$new();
        scope.layers = scope.map.getLayers().getArray();
        scope.f = function(l) {
          return (gaLayerFilters.background(l) ||
                  gaLayerFilters.selected(l));
        };
        scope.$watchCollection('layers | filter:f', function(l) {
          layers = (l) ? l : [];
          updateHiddenState();
        });

        scope.$watch('globals.is3dActive', function(val) {
          is3DActive = val;
          updateHiddenState();
        });
      };
    };
  });


})();

