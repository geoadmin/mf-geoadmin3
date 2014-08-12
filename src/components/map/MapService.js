(function() {
  goog.provide('ga_map_service');

  goog.require('ga_styles_service');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_map_service', [
    'pascalprecht.translate',
    'ga_styles_service',
    'ga_urlutils_service'
  ]);

  module.provider('gaTileGrid', function() {

    function createTileGrid(resolutions, type) {
      var origin = [420000, 350000];
      var matrixIds = $.map(resolutions, function(r, i) { return i + ''; });
      if (type === 'wms') {
        return new ol.tilegrid.TileGrid({
          tileSize: 512,
          origin: origin,
          resolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250,
                        2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250,
                        100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1]
        });
      } else {
        return new ol.tilegrid.WMTS({
          matrixIds: matrixIds,
          origin: origin,
          resolutions: resolutions
        });
      }
    }

    function defaultTileGrid(type) {
      return createTileGrid([4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250,
                             2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250,
                             100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5], type);
    };

    this.$get = function() {
      return {
        get: function(resolutions, type) {
          return resolutions ? createTileGrid(resolutions, type) :
                               defaultTileGrid(type);
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
        Object.defineProperties(olLayer, {
          attribution: {
            get: function() {
              return this.get('attribution');
            },
            set: function(val) {
              this.set('attribution', val);
            }
          },
          visible: {
            get: function() {
              return this.getVisible();
            },
            set: function(val) {
              this.setVisible(val);
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
              if (this instanceof ol.layer.Layer) {
                var src = this.getSource();
                if (src instanceof ol.source.WMTS) {
                  src.updateDimensions({'Time': val});
                } else if (src instanceof ol.source.ImageWMS ||
                    src instanceof ol.source.TileWMS) {
                  src.updateParams({'TIME': val});
                }
              }
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
          preview: {
            writable: true,
            value: false
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
            if (down && (evt.clientX != down.clientX ||
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
            return map.on('singleclick', callback);

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
    this.$get = function(gaDefinePropertiesForLayer, gaMapUtils, gaUrlUtils) {
      var Wms = function() {

        var createWmsLayer = function(params, options, index) {
          options = options || {};
          var attributions;

          if (options.attribution) {
            attributions = [
              gaMapUtils.getAttribution(options.attribution)
            ];
          }

          var source = new ol.source.ImageWMS({
            params: params,
            url: options.url,
            extent: options.extent,
            attributions: attributions,
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
            source: source
          });
          gaDefinePropertiesForLayer(layer);
          layer.preview = options.preview;
          layer.displayInLayerManager = !layer.preview;
          layer.label = options.label;
          return layer;
        };

        // Create an ol WMS layer from GetCapabilities informations
        this.getOlLayerFromGetCapLayer = function(getCapLayer) {
          var wmsParams = {LAYERS: getCapLayer.Name};
          var wmsOptions = {
            url: getCapLayer.wmsUrl,
            label: getCapLayer.Title,
            extent: getCapLayer.extent,
            attribution: gaUrlUtils.getHostname(getCapLayer.wmsUrl)
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
      };
      return new Wms();
    };
  });

  /**
   * Manage KML layers
   */
  module.provider('gaKml', function() {
    // Default style
    var fill = new ol.style.Fill({
      color: 'rgba(255,0,0,0.7)'
    });
    var stroke = new ol.style.Stroke({
      color: 'rgb(255,0,0)',
      width: 1.5
    });

    // Create the parser
    var kmlFormat = new ol.format.KML({
      extractStyles: true,
      extractAttributes: true,
      defaultStyle: [new ol.style.Style({
        fill: fill,
        stroke: stroke,
        image: new ol.style.Circle({
          radius: 7,
          fill: fill,
          stroke: stroke
        })
      })]
    });

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

    this.$get = function($http, gaDefinePropertiesForLayer, gaMapClick,
        gaMapUtils, gaGlobalOptions, $rootScope, $translate) {
      var Kml = function(proxyUrl) {
        /**
         * Create a KML layer from a KML string
         */
        var createKmlLayer = function(kml, options) {
          var olLayer;
          options = options || {};

          // Replace all hrefs to prevent errors if image doesn't have
          // CORS headers. Exception for google markers icons (lightblue.png,
          // ltblue-dot.png, ltblu-pushpin.png, ...) to keep the OL3 magic for
          // anchor origin.
          // Test regex here: http://regex101.com/r/tF3vM0
          // List of google icons: http://www.lass.it/Web/viewer.aspx?id=4
          kml = kml.replace(
            /<href>http(s?)(?!(s?):\/\/maps\.(?:google|gstatic)\.com.*(blue|green|orange|pink|purple|red|yellow|pushpin).*\.png)/g,
            '<href>' + proxyUrl + 'http'
          );

          // Create vector layer
          var features = kmlFormat.readFeatures(kml);
          for (var i = 0, ii = features.length; i < ii; i++) {
            var feature = features[i];
            // Ensure polygons are closed.
            // Reason: print server failed when polygons are not closed.
            var geometry = feature.getGeometry();
            closeGeometries((geometry instanceof ol.geom.GeometryCollection) ?
                geometry.getGeometries() : [geometry]);

            // Replace empty id by undefined.
            // Reason: If 2 features have their id empty, an assertion error
            // occurs when we add them to the source
            if (feature.getId() === '') {
              feature.setId(undefined);
            }
            if (feature.getGeometry()) {
              feature.getGeometry().transform('EPSG:4326', options.projection);
            }
          }
          var attributions;

          if (options.attribution) {
            attributions = [
              gaMapUtils.getAttribution(options.attribution)
            ];
          }
          var source = new ol.source.Vector({
            features: features,
            attributions: attributions
          });

          var layerOptions = {
            id: 'KML||' + options.url,
            url: options.url,
            type: 'KML',
            label: options.label || kmlFormat.readName(kml) || 'KML',
            opacity: options.opacity,
            visible: options.visible,
            source: source
          };

          var olLayer;
          if (options.useImageVector === true) {
            layerOptions.source = new ol.source.ImageVector({
              source: layerOptions.source,
              attributions: attributions
            });
            olLayer = new ol.layer.Image(layerOptions);
          } else {
            olLayer = new ol.layer.Vector(layerOptions);
          }
          gaDefinePropertiesForLayer(olLayer);
          return olLayer;
        };

        /**
         * Add an ol layer to the map and add specific event
         */
        var addKmlLayer = function(olMap, data, options, index) {
          options.projection = olMap.getView().getProjection();
          var olLayer = createKmlLayer(data, options);

          if (index) {
            olMap.getLayers().insertAt(index, olLayer);
          } else {
            olMap.addLayer(olLayer);
          }
        };

        this.addKmlToMap = function(map, data, layerOptions, index) {
          addKmlLayer(map, data, layerOptions, index);
        };

        this.addKmlToMapForUrl = function(map, url, layerOptions, index) {
          layerOptions.url = url;
          var that = this;
          $http.get(proxyUrl + encodeURIComponent(url)).success(function(data,
              status, headers, config) {
             var fileSize = headers('content-length');
             if (that.isValidFileContent(data) &&
                 that.isValidFileSize(fileSize)) {
               if (layerOptions &&
                   !angular.isDefined(layerOptions.useImageVector)) {
                 layerOptions.useImageVector = that.useImageVector(fileSize);
               }
               addKmlLayer(map, data, layerOptions, index);
             }
          });
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
            alert($translate('file_too_large'));
            return false;
          }
          return true;
        };

        // Test the validity of the file content
        this.isValidFileContent = function(fileContent) {
          if (!/<kml/.test(fileContent) || !/<\/kml>/.test(fileContent)) {
            alert($translate('file_is_not_kml'));
            return false;
          }
          return true;
        };

        this.proxyUrl = proxyUrl;
      };
      return new Kml(gaGlobalOptions.ogcproxyUrl);
    };
  });

  /**
   * Manage BOD layers
   */
  module.provider('gaLayers', function() {

    this.$get = function($q, $http, $translate, $rootScope, gaMapUtils,
          gaUrlUtils, gaTileGrid, gaDefinePropertiesForLayer) {

      var Layers = function(wmtsGetTileUrlTemplate,
          layersConfigUrlTemplate, legendUrlTemplate) {
        var currentTopic;
        var currentTime;
        var layers;

        var getWmtsGetTileUrl = function(layer, format) {
          return wmtsGetTileUrlTemplate
              .replace('{Layer}', layer)
              .replace('{Format}', format);
        };

        var getLayersConfigUrl = function(topic, lang) {
          return layersConfigUrlTemplate
              .replace('{Topic}', topic)
              .replace('{Lang}', lang);
        };

        var getMetaDataUrl = function(topic, layer, lang) {
          return legendUrlTemplate
              .replace('{Topic}', topic)
              .replace('{Layer}', layer)
              .replace('{Lang}', lang);
        };

        /**
         * Load layers for a given topic and language. Return a promise.
         */
        var loadForTopic = this.loadForTopic = function(topicId, lang) {
          var url = getLayersConfigUrl(topicId, lang);

          var promise = $http.get(url).then(function(response) {
            layers = response.data;
          }, function(response) {
            layers = undefined;
          });

          return promise;
        };

        /**
         * Reurn an array of pre-selected bodId from current topic
         */
        this.getSelectedLayers = function() {
          return currentTopic.selectedLayers;
        };

        /**
         * Return an array of ol.layer.Layer objects for the background
         * layers.
         */
        this.getBackgroundLayers = function() {
          var self = this;
          return $.map(currentTopic.backgroundLayers, function(bodId) {
            var retVal = {id: bodId,
                          label: self.getLayerProperty(bodId, 'label')};
            // In the background selector, we don't want the standard labels
            if (bodId == 'ch.swisstopo.swissimage') {
              retVal.label = $translate('bg_luftbild');
            } else if (bodId == 'ch.swisstopo.pixelkarte-farbe') {
              retVal.label = $translate('bg_pixel_color');
            } else if (bodId == 'ch.swisstopo.pixelkarte-grau') {
              retVal.label = $translate('bg_pixel_grey');
            }
            return retVal;
          });
        };

        /**
         * Return an ol.layer.Layer object for a layer id.
         */
        this.getOlLayerById = function(bodId) {
          var layer = layers[bodId];
          var olLayer;
          var timestamp = this.getLayerTimestampFromYear(bodId, currentTime);
          var attributions = [
            gaMapUtils.getAttribution('<a href="' +
              layer.attributionUrl +
              '" target="new">' +
              layer.attribution + '</a>')
          ];
          var olSource = layer.olSource;
          if (layer.type == 'wmts') {
            if (!olSource) {
              olSource = layer.olSource = new ol.source.WMTS({
                attributions: attributions,
                dimensions: {
                  'Time': timestamp
                },
                projection: 'EPSG:21781',
                requestEncoding: 'REST',
                tileGrid: gaTileGrid.get(layer.resolutions),
                url: getWmtsGetTileUrl(layer.serverLayerName,
                  layer.format)
              });
            }
            olLayer = new ol.layer.Tile({
              minResolution: layer.minResolution,
              maxResolution: layer.maxResolution,
              opacity: layer.opacity || 1,
              attribution: layer.attribution,
              source: olSource,
              useInterimTilesOnError: false
            });
          } else if (layer.type == 'wms') {
            var wmsUrl = gaUrlUtils.remove(
                layer.wmsUrl, ['request', 'service', 'version'], true);

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
                  url: wmsUrl,
                  params: wmsParams,
                  attributions: attributions,
                  ratio: 1
                });
              }
              olLayer = new ol.layer.Image({
                minResolution: layer.minResolution,
                maxResolution: layer.maxResolution,
                opacity: layer.opacity || 1,
                attribution: layer.attribution,
                source: olSource
              });
            } else {
              if (!olSource) {
                olSource = layer.olSource = new ol.source.TileWMS({
                  url: wmsUrl,
                  params: wmsParams,
                  attributions: attributions,
                  gutter: layer.gutter || 0,
                  tileGrid: gaTileGrid.get(layer.resolutions, 'wms')
                });
              }
              olLayer = new ol.layer.Tile({
                minResolution: layer.minResolution,
                maxResolution: layer.maxResolution,
                opacity: layer.opacity || 1,
                attribution: layer.attribution,
                source: olSource,
                useInterimTilesOnError: false
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
              attribution: layer.attribution,
              layers: subLayers
            });
          }
          if (angular.isDefined(olLayer)) {
            gaDefinePropertiesForLayer(olLayer);
            olLayer.bodId = bodId;
            olLayer.label = layer.label;
            olLayer.timeEnabled = layer.timeEnabled;
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
          var url = getMetaDataUrl(currentTopic.id, bodId, $translate.uses());
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
        this.getLayerTimestampFromYear = function(bodId, yearStr) {
          var layer = this.getLayer(bodId);
          var timestamps = layer.timestamps || [];

          if (!layer.timeEnabled) {
            // a WMTS layer has at least one timestamp
            return (layer.type == 'wmts') ? timestamps[0] : undefined;
          } else if (layer.type == 'wms') {
            // A time enabled WMS layer has no timestamps so we return the
            // yearsStr unchanged
            return yearStr;
          }

          if (!angular.isDefined(yearStr)) {
            var timeBehaviour = this.getLayerProperty(bodId,
                'timeBehaviour');
            yearStr = (timeBehaviour === 'all' || timestamps.length == 0) ?
                undefined : timestamps[0];
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

        $rootScope.$on('gaTopicChange', function(event, topic) {
          currentTopic = topic;
          // do nothing if there's no lang set
          var currentLang = $translate.uses();
          if (angular.isDefined(currentLang)) {
            var currentTopicId = topic.id;
            loadForTopic(currentTopicId, currentLang).then(function() {
              $rootScope.$broadcast('gaLayersChange',
                  {labelsOnly: false, topicId: currentTopicId});
            });
          }
        });

        $rootScope.$on('$translateChangeEnd', function(event) {
          // do nothing if there's no topic set
          if (angular.isDefined(currentTopic)) {
            var currentTopicId = currentTopic.id;
            // Do not set labelsOnly to true if initial load
            var labelsOnly = angular.isDefined(layers);
            loadForTopic(currentTopicId, $translate.uses()).then(function() {
              $rootScope.$broadcast('gaLayersChange',
                  {labelsOnly: labelsOnly, topicId: currentTopicId});
            });
          }
        });

        $rootScope.$on('gaTimeSelectorChange', function(event, time) {
          currentTime = time;
        });
      };

      return new Layers(this.wmtsGetTileUrlTemplate,
          this.layersConfigUrlTemplate, this.legendUrlTemplate);
    };

  });

  /**
   * Service provides map util functions.
   */
  module.provider('gaMapUtils', function() {
    this.$get = function() {
      var attributions = {};
      return {
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

        /**
         * Manage map attributions.
         */
        getAttribution: function(text) {
          var key = text;
          if (key in attributions) {
            return attributions[key];
          } else {
            var a = new ol.Attribution({html: text});
            attributions[key] = a;
            return a;
          }
        }
      };
    };
  });

  /**
   * Service provides different kinds of filter for
   * layers in the map
   */
  module.provider('gaLayerFilters', function() {
    this.$get = function(gaLayers) {
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
        /**
         * Keep only time enabled layer
         */
        timeEnabledLayersFilter: function(layer) {
          return !layer.background &&
                 layer.timeEnabled &&
                 layer.visible;
        }
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
        gaKml, gaMapUtils, gaWms, gaLayerFilters, gaUrlUtils) {

      var layersParamValue = gaPermalink.getParams().layers;
      var layersOpacityParamValue = gaPermalink.getParams().layers_opacity;
      var layersVisibilityParamValue =
          gaPermalink.getParams().layers_visibility;

      var layerSpecs = layersParamValue ? layersParamValue.split(',') : [];
      var layerOpacities = layersOpacityParamValue ?
          layersOpacityParamValue.split(',') : [];
      var layerVisibilities = layersVisibilityParamValue ?
          layersVisibilityParamValue.split(',') : [];

      function isKmlLayer(layerSpec) {
        return (layerSpec && layerSpec.indexOf('KML||') === 0);
      }

      function isWmsLayer(layerSpec) {
        return (layerSpec && layerSpec.indexOf('WMS||') === 0) &&
            layerSpec.split('||').length === 4;
      }

      function updateLayersParam(layers) {
        var layerSpecs = $.map(layers, function(layer) {
          if (layer.bodId) {
            return layer.bodId;
          } else if (layer.type === 'KML' && layer.url) {
            return layer.type + '||' + layer.url;
          } else if (layer.type === 'WMS') {
            return [layer.type, layer.label, layer.url,
                layer.getSource().getParams().LAYERS].join('||');
          }
        });
        if (layerSpecs.length > 0) {
          gaPermalink.updateParams({layers: layerSpecs.join(',')});
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
            layers_opacity: opacityValues.join(',')});
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
            layers_visibility: visibilityValues.join(',')});
        }
      }

      return function(map) {
        var scope = $rootScope.$new();
        var deregFns = [];

        scope.layers = map.getLayers().getArray();

        scope.layerFilter = gaLayerFilters.selected;

        scope.$watchCollection('layers | filter:layerFilter',
            function(layers) {

          updateLayersParam(layers);

          // deregister the listeners we have on each layer and register
          // new ones for the new set of layers.
          angular.forEach(deregFns, function(deregFn) { deregFn(); });
          deregFns.length = 0;

          angular.forEach(layers, function(layer) {
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
          });
        });

        var deregister = scope.$on('gaLayersChange', function() {

          var allowThirdData = false;
          var confirmedOnce = false;

          angular.forEach(layerSpecs, function(layerSpec, index) {
            var layer;
            var opacity = (index < layerOpacities.length) ?
                layerOpacities[index] : 1;
            var visible = (index < layerVisibilities.length &&
                layerVisibilities[index] == 'false') ?
                false : true;

            if (isKmlLayer(layerSpec) || isWmsLayer(layerSpec)) {
              var url = '';
              if (isKmlLayer(layerSpec)) {
                url = layerSpec.replace('KML||', '');
              }
              if (isWmsLayer(layerSpec)) {
                url = layerSpec.split('||')[2];
              }
              if (!confirmedOnce &&
                  !/(admin|bgdi)\.ch$/.test(gaUrlUtils.getHostname(url))) {
                allowThirdData =
                  confirm($translate('third_party_data_warning'));
                if (allowThirdData) {
                  confirmedOnce = true;
                }
              } else {
                allowThirdData = true;
              }
            }

            if (gaLayers.getLayer(layerSpec)) {
              // BOD layer.
              // Do not consider BOD layers that are already in the map.
              if (!gaMapUtils.getMapOverlayForBodId(map, layerSpec)) {
                layer = gaLayers.getOlLayerById(layerSpec);
              }
              if (angular.isDefined(layer)) {
                layer.setVisible(visible);
                if (index < layerOpacities.length) {
                  layer.setOpacity(opacity);
                }
                map.addLayer(layer);
              }

            } else if (allowThirdData && isKmlLayer(layerSpec)) {
              // KML layer
              try {
                gaKml.addKmlToMapForUrl(map, url,
                  {
                    opacity: opacity,
                    visible: visible,
                    attribution: gaUrlUtils.getHostname(url)
                  },
                  index + 1);
              } catch (e) {
                // Adding KML layer failed, native alert, log message?
              }

            } else if (allowThirdData && isWmsLayer(layerSpec)) {
              // External WMS layer
              var infos = layerSpec.split('||');
              try {
                gaWms.addWmsToMap(map,
                  {
                    LAYERS: infos[3]
                  },
                  {
                    url: url,
                    label: infos[1],
                    opacity: opacity,
                    visible: visible,
                    attribution: gaUrlUtils.getHostname(infos[2])
                  },
                  index + 1);
              } catch (e) {
                // Adding external WMS layer failed, native alert, log message?
              }
            }
          });
          deregister();
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
        gaStyleFactory) {
      var url = this.url;
      var selectStyle = gaStyleFactory.getStyle('select');
      var highlightStyle = gaStyleFactory.getStyle('highlight');

      // Define layer default properties
      gaDefinePropertiesForLayer(vector);
      vector.preview = true;
      vector.displayInLayerManager = false;

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

      // Move layer on top
      var moveToTop = function(map) {
        if (map.getLayers().getArray().indexOf(vector) != -1) {
          map.removeLayer(vector);
          map.addLayer(vector);
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
          map.getLayers().unByKey(listenerKeyRemove);
          map.getLayers().unByKey(listenerKeyAdd);
          map.removeLayer(vector);
        } else if (map.getLayers().getArray().indexOf(vector) == -1) {
          map.addLayer(vector);

          // Add event for automatically put the vector layer on top.
          listenerKeyAdd = map.getLayers().on('add', function(event) {
            if (event.element != vector) {
              moveToTop(map);
            }
          });

          // Add event for automatically removing the features when the
          // corresponding layer is removed.
          listenerKeyRemove = map.getLayers().on('remove', function(event) {
            removeFromLayer(event.element);
          });

        } else {
          moveToTop(map);
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
          this.clear(map);
          var that = this;
          getFeatures(featureIdsByBodId).then(function(results) {
            angular.forEach(results, function(result) {
              result.data.feature.properties.layerId =
                  result.data.feature.layerBodId;
              that.add(map, geojson.readFeature(result.data.feature));
            });
            that.zoom(map);
          });

          onClear = onNextClear;
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
        this.zoom = function(map, feature) {
          var extent = getMinimalExtent((feature) ?
              feature.getGeometry().getExtent() : source.getExtent());
          map.getView().fitExtent(extent, map.getSize());
        };
      };
      return new PreviewFeatures();
    };
  });

  module.provider('gaFeaturesPermalinkManager', function() {
    this.$get = function($rootScope, gaPermalink, gaLayers,
        gaPreviewFeatures, gaMapUtils) {
      var queryParams = gaPermalink.getParams();
      return function(map) {
        var deregister = $rootScope.$on('gaLayersChange', function() {
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
                if (!gaMapUtils.getMapOverlayForBodId(map, bodId)) {
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
            gaPreviewFeatures.addBodFeatures(map, featureIdsByBodId,
                removeParamsFromPL);

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
                map.getLayers().unByKey(listenerKey);
              }
            });
          }
          deregister();
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

    this.$get = function($rootScope, gaLayers, gaWms) {
      var olPreviewLayer;
      var time;

      $rootScope.$on('gaTimeSelectorChange', function(event, year) {
        time = year;
      });

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
                olPreviewLayer.bodId, time);
          }

          olPreviewLayer.preview = true;
          olPreviewLayer.displayInLayerManager = false;
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
          map.addLayer(olPreviewLayer);

          return olPreviewLayer;
        };

        // Remove all preview layers currently on the map, to be sure there is
        // one and only one preview layer at a time
        this.removeAll = function(map) {
          var layers = map.getLayers().getArray();
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].preview) {
              map.removeLayer(layers[i]);
              i--;
            }
          }
        };
      };

      return new PreviewLayers();
    };
  });


})();
