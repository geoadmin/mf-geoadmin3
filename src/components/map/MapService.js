(function() {
  goog.provide('ga_map_service');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_map_service', [
    'pascalprecht.translate',
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
              return (1 - this.getOpacity()) + '';
            },
            set: function(val) {
              this.setOpacity(1 - val);
            }
          },
          background: {
            writable: true,
            value: false
          },
          preview: {
            writable: true,
            value: false
          }
        });
      };
    };
  });

  module.provider('gaLayers', function() {

    this.$get = function($q, $http, $translate, $rootScope,
          gaUrlUtils, gaTileGrid, gaDefinePropertiesForLayer) {
      var attributions = {};
      var getAttribution = function(text) {
        var key = text;
        if (key in attributions) {
          return attributions[key];
        } else {
          var a = new ol.Attribution({html: text});
          attributions[key] = a;
          return a;
        }
      };

      var Layers = function(wmtsGetTileUrlTemplate,
          layersConfigUrlTemplate, legendUrlTemplate) {

        var currentTopic;
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
            layers = response.data.layers;
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
          var olSource = layer.olSource;
          if (layer.type == 'wmts') {
            if (!olSource) {
              olSource = layer.olSource = new ol.source.WMTS({
                attributions: [
                  getAttribution('<a href="' +
                    layer.attributionUrl +
                    '" target="new">' +
                    layer.attribution + '</a>')
                ],
                dimensions: {
                  'Time': layer.timestamps[0]
                },
                projection: 'EPSG:21781',
                requestEncoding: 'REST',
                tileGrid: gaTileGrid.get(layer.resolutions),
                url: getWmtsGetTileUrl(layer.serverLayerName,
                  layer.format)
              });
            }
            olLayer = new ol.layer.Tile({
              bodId: bodId,
              minResolution: layer.minResolution,
              maxResolution: layer.maxResolution,
              opacity: layer.opacity,
              source: olSource
            });
          } else if (layer.type == 'wms') {
            //TODO: add support for layer.timeEnabled?
            if (layer.singleTile === true) {
              if (!olSource) {
                olSource = layer.olSource = new ol.source.ImageWMS({
                  url: gaUrlUtils.remove(
                      layer.wmsUrl, ['request', 'service', 'version'], true),
                  params: {
                    LAYERS: layer.serverLayerName,
                    FORMAT: 'image/' + layer.format
                  },
                  attributions: [
                    getAttribution(layer.attribution)
                  ],
                  ratio: 1
                });
              }
              olLayer = new ol.layer.Image({
                bodId: bodId,
                minResolution: layer.minResolution,
                maxResolution: layer.maxResolution,
                opacity: layer.opacity,
                source: olSource
              });
            } else {
              if (!olSource) {
                olSource = layer.olSource = new ol.source.TileWMS({
                  url: gaUrlUtils.remove(
                      layer.wmsUrl, ['request', 'service', 'version'], true),
                  params: {
                    LAYERS: layer.serverLayerName,
                    FORMAT: 'image/' + layer.format
                  },
                  attributions: [
                    getAttribution(layer.attribution)
                  ]
                });
              }
              olLayer = new ol.layer.Tile({
                bodId: bodId,
                minResolution: layer.minResolution,
                maxResolution: layer.maxResolution,
                opacity: layer.opacity,
                source: olSource
              });
            }
          } else if (layer.type == 'aggregate') {
            var subLayerIds = layer.subLayerIds.split(',');
            var i, len = subLayerIds.length;
            var subLayers = new Array(len);
            for (i = 0; i < len; i++) {
              subLayers[i] = this.getOlLayerById(subLayerIds[i]);
            }
            olLayer = new ol.layer.Group({
              bodId: bodId,
              minResolution: layer.minResolution,
              maxResolution: layer.maxResolution,
              opacity: layer.opacity,
              layers: subLayers
            });
          }
          if (angular.isDefined(olLayer)) {
            gaDefinePropertiesForLayer(olLayer);
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
      };

      return new Layers(this.wmtsGetTileUrlTemplate,
          this.layersConfigUrlTemplate, this.legendUrlTemplate);
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

    this.$get = function($rootScope, gaLayers, gaPermalink) {

      var layersParamValue = gaPermalink.getParams().layers;
      var layersOpacityParamValue = gaPermalink.getParams().layers_opacity;
      var layersVisibilityParamValue =
          gaPermalink.getParams().layers_visibility;

      var layerSpecs = layersParamValue ? layersParamValue.split(',') : [];
      var layerOpacities = layersOpacityParamValue ?
          layersOpacityParamValue.split(',') : [];
      var layerVisibilities = layersVisibilityParamValue ?
          layersVisibilityParamValue.split(',') : [];

      function updateLayersParam(layers) {
        var bodIds = $.map(layers, function(layer) {
          return layer.get('bodId');
        });
        if (bodIds.length > 0) {
          gaPermalink.updateParams({layers: bodIds.join(',')});
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

        scope.layerFilter = function(layer) {
          return !layer.background && !layer.preview;
        };

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
          angular.forEach(layerSpecs, function(layerSpec, index) {
            var layer;
            if (gaLayers.getLayer(layerSpec)) {
              // BOD layer
              layer = gaLayers.getOlLayerById(layerSpec);
            }
            if (angular.isDefined(layer)) {
              if (index < layerOpacities.length) {
                layer.setOpacity(layerOpacities[index]);
              }
              if (index < layerVisibilities.length) {
                layer.visible = layerVisibilities[index] == 'false' ?
                    false : true;
              }
              map.addLayer(layer);
            }
          });
          deregister();
        });
      };
    };
  });

  module.provider('gaRecenterMapOnFeatures', function() {
    this.$get = function($q, $http) {
      var url = this.url;
      var getFeatures = function(layer, ids) {
        return $q.all($.map(ids, function(id) {
          return $http.get(url + layer + '/' + id);
        }));
      };
      return function(map, layer, ids) {
        getFeatures(layer, ids).then(function(results) {
          var extent = [Infinity, Infinity, -Infinity, -Infinity];
          angular.forEach(results, function(result) {
            var bbox = result.data.feature.bbox;
            ol.extent.extend(extent, bbox);
          });
          map.getView().fitExtent(extent, map.getSize());
        });
      };
    };
  });

  module.provider('gaHighlightFeaturePermalinkManager', function() {
    this.$get = function($rootScope, gaPermalink, gaLayers,
        gaRecenterMapOnFeatures) {
      var queryParams = gaPermalink.getParams();
      return function(map) {
        var deregister = $rootScope.$on('gaLayersChange', function() {
          var paramKey;
          for (paramKey in queryParams) {
            if (gaLayers.getLayer(paramKey)) {
              var bodId = paramKey;
              var bodIds = queryParams[bodId].split(',');
              map.addLayer(gaLayers.getOlLayerById(bodId));
              gaRecenterMapOnFeatures(map, bodId, bodIds);
            }
          }
          deregister();
        });
      };
    };
  });

})();
