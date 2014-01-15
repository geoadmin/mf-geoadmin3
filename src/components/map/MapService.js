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

    function createTileGrid(resolutions) {
      var origin = [420000, 350000];
      var matrixIds = $.map(resolutions, function(r, i) { return i + ''; });
      return new ol.tilegrid.WMTS({
        matrixIds: matrixIds,
        origin: origin,
        resolutions: resolutions
      });
    }

    var defaultTileGrid = createTileGrid(
      [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
      1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5]);

    this.$get = function() {
      return {
        get: function(resolutions) {
          return resolutions ? createTileGrid(resolutions) : defaultTileGrid;
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
          preview: {
            writable: true,
            value: false
          },
          highlight: {
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
            var touchEvents = (gaBrowserSniffer.msie >= 10) ?
               ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'] :
               ['touchstart', 'touchmove', 'touchend'];

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
    this.$get = function(gaDefinePropertiesForLayer, gaMapUtils) {
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
            url: options.url,
            type: 'WMS',
            opacity: options.opacity,
            visible: options.visible,
            attribution: options.attribution,
            source: source
          });
          gaDefinePropertiesForLayer(layer);
          layer.preview = options.preview;
          layer.label = options.label;
          return layer;
        };

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

    this.$get = function($http, gaPopup, gaDefinePropertiesForLayer,
        gaMapClick, gaMapUtils) {
      var Kml = function(proxyUrl) {

        /**
         * Create a KML layer from a KML string
         */
        var createKmlLayer = function(kml, options) {
          var olLayer;
          options = options || {};

          // Create vector layer
          var features = kmlFormat.readFeatures(kml);
          var transformFn = ol.proj.getTransform('EPSG:4326',
              options.projection);
          for (var i = 0, ii = features.length; i < ii; i++) {
            var feature = features[i];
            feature.getGeometry().transform(transformFn);
          }
          var attributions;

          if (options.attribution) {
            attributions = [
              gaMapUtils.getAttribution(options.attribution)
            ];
          }
          var olLayer = new ol.layer.Vector({
            url: options.url,
            type: 'KML',
            label: options.label || kmlFormat.readName(kml) || 'KML',
            opacity: options.opacity,
            visible: options.visible,
            attribution: options.attribution,
            source: new ol.source.Vector({
              features: features,
              attributions: attributions
            })
          });
          gaDefinePropertiesForLayer(olLayer);
          return olLayer;
        };

        /**
         * Add an ol layer to the map and add specific event
         */
        var addKmlLayer = function(olMap, data, options, index) {
          options.projection = olMap.getView().getProjection();
          var olLayer = createKmlLayer(data, options);

          // Find features on a specific pixel
          var findFeatures = function(pixel) {
            var features = [];
            olMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
              if (layer === olLayer) {
                features.push(feature);
              }
            });
            return features;
          };

          // Change cursor style on mouse move
          // FIXME: It's nice but unusable when too much features are displayed
          /*var onMouseMove = function(evt) {
            var pixel = (evt.originalEvent) ?
                olMap.getEventPixel(evt.originalEvent) :
                evt.getPixel();

            var features = findFeatures(pixel);
            if (features.length > 0 && features[0].get('description')) {
              olMap.getTarget().style.cursor = 'pointer';
            } else {
              olMap.getTarget().style.cursor = '';
            }
          };*/

          // Display popup on mouse click
          var onMapClick = function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var pixel = (evt.originalEvent) ?
                olMap.getEventPixel(evt.originalEvent) :
                evt.getPixel();
            var features = findFeatures(pixel);
            if (features.length > 0) {
              var feature = features[0];
              if (feature.get('name') || feature.get('description')) {
                gaPopup.create({
                  title: feature.get('name'),
                  content: feature.get('description'),
                  x: pixel[0],
                  y: pixel[1]
                }).open();
              }
            }
          };

          var listenerKey;
          olMap.getLayers().on('add', function(layersEvent) {
            if (layersEvent.getElement() === olLayer) {
              listenerKey = gaMapClick.listen(olMap, onMapClick);
              //$(olMap.getViewport()).on('mousemove', onMouseMove);
            }
          });
          olMap.getLayers().on('remove', function(layersEvent) {
            if (layersEvent.getElement() === olLayer) {
              olMap.unByKey(listenerKey);
              //$(olMap.getViewport()).unbind('mousemove', onMouseMove);
            }
          });

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
          $http.get(proxyUrl + encodeURIComponent(url)).success(function(data) {
            addKmlLayer(map, data, layerOptions, index);
          });
        };
      };
      return new Kml(this.proxyUrl);
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
         * Return an array of ol.layer.Layer objects for the background
         * layers.
         */
        this.getBackgroundLayers = function() {
          var self = this;
          return $.map(currentTopic.backgroundLayers, function(bodId) {
            return {id: bodId, label: self.getLayerProperty(bodId, 'label')};
          });
        };

        /**
         * Return an ol.layer.Layer object for a layer id.
         */
        this.getOlLayerById = function(bodId) {
          var layer = layers[bodId];
          var olLayer;
          var time = (layer.timeEnabled) ?
              currentTime : false;
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
                  'Time': time || layer.timestamps[0]
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
              source: olSource
            });
          } else if (layer.type == 'wms') {
            var wmsUrl = gaUrlUtils.remove(
                layer.wmsUrl, ['request', 'service', 'version'], true);

            var wmsParams = {
              LAYERS: layer.wmsLayers,
              FORMAT: 'image/' + layer.format
            };

            if (layer.timeEnabled && angular.isDefined(time)) {
              wmsParams['TIME'] = time || layer.timestamps[0];
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
                  gutter: layer.gutter || 0
                });
              }
              olLayer = new ol.layer.Tile({
                minResolution: layer.minResolution,
                maxResolution: layer.maxResolution,
                opacity: layer.opacity || 1,
                attribution: layer.attribution,
                source: olSource
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
            if (l.bodId == bodId && !l.background) {
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
         * layers and highlight layers and drawing
         * layers. In other words, all layers that
         * were actively added by the user and that
         * appear in the layer manager
         */
        selected: function(layer) {
          return !layer.background &&
                 !layer.preview &&
                 !layer.highlight;
        },
        /**
         * Keep only time enabled layer
         */
        timeEnabledLayersFilter: function(layer) {
          return !layer.background &&
                 !layer.highlight &&
                 layer.timeEnabled;
        },
        /**
         * Filters out preview layers and highlight
         * layers and drawing layers.
         */
        permanentLayersFilter: function(layer) {
          return !layer.preview &&
                 !layer.highlight;
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
          var allowThirdData = (angular.isDefined(layersParamValue) &&
              layersParamValue.match(/(KML\|\||WMS\|\|)/g) &&
              confirm($translate('third_party_data_warning')));

          angular.forEach(layerSpecs, function(layerSpec, index) {
            var layer;
            var opacity = (index < layerOpacities.length) ?
                layerOpacities[index] : 1;
            var visible = (index < layerVisibilities.length &&
                layerVisibilities[index] == 'false') ?
                false : true;

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
              var url = layerSpec.replace('KML||', '');
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
                    url: infos[2],
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

  module.provider('gaRecenterMapOnFeatures', function() {
    this.$get = function($q, $http, gaDefinePropertiesForLayer,
                         gaStyleFunctionFactory) {
      var MINIMAL_EXTENT_SIZE = 1965;
      var url = this.url;
      var vector;
      var parser = new ol.format.GeoJSON();
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

      var getMinimalExtent = function(extent) {
        var center, minS;
        if (ol.extent.getHeight(extent) < MINIMAL_EXTENT_SIZE &&
            ol.extent.getWidth(extent) < MINIMAL_EXTENT_SIZE) {
          center = ol.extent.getCenter(extent);
          minS = MINIMAL_EXTENT_SIZE / 2;
          return ol.extent.boundingExtent([
            [center[0] - minS, center[1] - minS],
            [center[0] + minS, center[1] + minS]
          ]);

        } else {
          return extent;
        }
      };

      return function(map, featureIdsByBodId) {
        getFeatures(featureIdsByBodId).then(function(results) {
          var vectorSource;
          var extent = [Infinity, Infinity, -Infinity, -Infinity];
          var foundFeatures = [];
          angular.forEach(results, function(result) {
            var bbox = result.data.feature.bbox;
            ol.extent.extend(extent, bbox);
            foundFeatures.push(result.data.feature);
          });
          if (extent[2] >= extent[0] && extent[3] >= extent[1]) {
            map.getView().fitExtent(getMinimalExtent(extent),
                map.getSize());
          }
          map.removeLayer(vector);
          vectorSource = new ol.source.Vector({
            features: parser.readFeatures({
              type: 'FeatureCollection',
              features: foundFeatures
            })
          });
          vector = new ol.layer.Vector({
            source: vectorSource,
            styleFunction: gaStyleFunctionFactory('select')
          });
          gaDefinePropertiesForLayer(vector);
          vector.highlight = true;
          vector.invertedOpacity = 0.25;
          map.addLayer(vector);
        });
      };
    };
  });

  module.provider('gaHighlightFeaturePermalinkManager', function() {
    this.$get = function($rootScope, gaPermalink, gaLayers,
        gaRecenterMapOnFeatures, gaMapUtils) {
      var queryParams = gaPermalink.getParams();
      return function(map) {
        var deregister = $rootScope.$on('gaLayersChange', function() {
          var featureIdsCount = 0;
          var featureIdsByBodId = {};
          var paramKey;
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
          if (featureIdsCount > 0) {
            gaRecenterMapOnFeatures(map, featureIdsByBodId);
          }
          deregister();
        });
      };
    };
  });

})();
