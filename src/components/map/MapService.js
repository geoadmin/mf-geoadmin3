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

  module.provider('gaLayers', function() {

    this.$get = ['$q', '$http', '$translate', '$rootScope', 'gaUrlUtils',
        'gaTileGrid',
        function($q, $http, $translate, $rootScope, gaUrlUtils, gaTileGrid) {
      var attributions = {};
      var getAttribution = function(text) {
        var key = text;
        if (key in attributions) {
          return attributions[key];
        } else {
          var a = new ol.Attribution(text);
          attributions[key] = a;
          return a;
        }
      };

      var Layers = function(wmtsGetTileUrlTemplate,
          layersConfigUrlTemplate, legendUrlTemplate) {
        var currentTopicId;
        var layers;

        var getWmtsGetTileUrl = function(layer, format) {
          return wmtsGetTileUrlTemplate
              .replace('{Layer}', layer)
              .replace('{Format}', format);
        };

        var getLayersConfigUrl = function(topic, lang) {
          var url = layersConfigUrlTemplate
              .replace('{Topic}', topic)
              .replace('{Lang}', lang);
          return gaUrlUtils.append(url, 'callback=JSON_CALLBACK');
        };

        var getMetaDataUrl = function(topic, layer, lang) {
          var url = legendUrlTemplate
              .replace('{Topic}', topic)
              .replace('{Layer}', layer)
              .replace('{Lang}', lang);
          return gaUrlUtils.append(url, 'callback=JSON_CALLBACK');
        };

        /**
         * Load layers for a given topic and language. Return a promise.
         */
        var loadForTopic = this.loadForTopic = function(topicId, lang) {
          currentTopicId = topicId;

          var url = getLayersConfigUrl(topicId, lang);

          var promise = $http.jsonp(url).then(function(response) {
            layers = response.data.layers;
            $rootScope.$broadcast('gaLayersChange');
          }, function(response) {
            layers = undefined;
            currentTopicId = undefined;
          });

          return promise;
        };

        /**
         * Return an ol.layer.Layer object for a layer id.
         */
        this.getOlLayerById = function(id) {
          var layer = layers[id];
          var olLayer = layer.olLayer;
          if (!angular.isDefined(olLayer)) {
            if (layer.type == 'wmts') {
              olLayer = new ol.layer.TileLayer({
                id: id,
                source: new ol.source.WMTS({
                  attributions: [
                    getAttribution(layer.attribution)
                  ],
                  dimensions: {
                    'Time': layer.timestamps[0]
                  },
                  projection: 'EPSG:21781',
                  requestEncoding: 'REST',
                  tileGrid: gaTileGrid.get(layer.resolutions),
                  url: getWmtsGetTileUrl(id, layer.format)
                })
              });
              layer.olLayer = olLayer;
            }
            if (angular.isDefined(olLayer)) {
              // ngModel requires the expression to be "assignable", and there
              // is currently no way to pass getter and setter functions to
              // ngModel. So to be able to control the states of layers through
              // ngModel we define accessor descriptors on the layer objects.
              Object.defineProperties(olLayer, {
                visible: {
                  get: function() {
                    return this.getVisible();
                  },
                  set: function(val) {
                    this.setVisible(val);
                  }
                },
                opacity: {
                  get: function() {
                    return this.getOpacity();
                  },
                  set: function(val) {
                    this.setOpacity(val);
                  }
                },
                preview: {
                  writable: true,
                  value: false
                }
              });
            }
          }
          return olLayer;
        };

        /**
         * Returns layers definition for given id. Returns
         * undefined if id does not exist
         */
        this.getLayer = function(id) {
          return layers[id];
        };

        /**
         * Returns a property of the layer with the given id.
         * Note: this throws an exception if the id does not
         * exist in currently loaded topic/layers
         */
        this.getLayerProperty = function(id, prop) {
          return layers[id][prop];
        };

        /**
         * Return the list of background layers. The returned
         * objects are object literals.
         */
        this.getBackgroundLayers = function() {
          var backgroundLayers = [];
          angular.forEach(layers, function(layer, id) {
            if (layer.background === true) {
              var backgroundLayer = angular.extend({
                id: id
              }, layer);
              backgroundLayers.push(backgroundLayer);
            }
          });
          return backgroundLayers;
        };

        $rootScope.$on('gaTopicChange', function(event, topic) {
          loadForTopic(topic.id, $translate.uses());
        });

        $rootScope.$on('translationChangeSuccess', function(event) {
          // do nothing if there's no topic set
          if (angular.isDefined(currentTopicId)) {
            loadForTopic(currentTopicId, $translate.uses());
          }
        });

        /**
         * Get Metadata of given layer id
         * Uses current topic and language
         * Returns a promise. Use accordingly
         */
        this.getMetaDataOfLayer = function(id) {
          var url = getMetaDataUrl(currentTopicId, id, $translate.uses());
          return $http.jsonp(url);
        };
      };

      return new Layers(this.wmtsGetTileUrlTemplate,
          this.layersConfigUrlTemplate, this.legendUrlTemplate);
    }];

  });

})();
