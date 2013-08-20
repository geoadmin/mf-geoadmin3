(function() {
  goog.provide('ga_map_service');

  goog.require('ga_translation');

  var module = angular.module('ga_map_service', [
    'ga_translation'
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

    this.$get = ['$q', '$http', '$translate', '$rootScope', 'gaTileGrid',
     function($q, $http, $translate, $rootScope, gaTileGrid) {

      var wmtsGetTileUrl = 'http://wmts.geo.admin.ch/1.0.0/{Layer}/default/' +
          '{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.{Format}';

      var getTopicUrl = function(topicId, lang) {
        return 'http://mf-chsdi30t.bgdi.admin.ch/rest/services/' +
               topicId + '/MapServer/layersconfig?lang=' +
               lang + '&callback=JSON_CALLBACK';
      };

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

      var getMetaDataUrl = function(topicId, lang, layerId) {
        return 'http://mf-chsdi30t.bgdi.admin.ch/rest/services/' +
               topicId + '/MapServer/' +
               layerId + '/getlegend?lang=' +
               lang + '&callback=JSON_CALLBACK';
      };

      var Layers = function() {
        var currentTopicId;
        var layers;

        /**
         * Load layers for a given topic and language. Return a promise.
         */
        var loadForTopic = this.loadForTopic = function(topicId, lang) {
          currentTopicId = topicId;

          var url = getTopicUrl(topicId, lang);

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
              var wmtsUrl = wmtsGetTileUrl.replace('{Layer}', id).
                            replace('{Format}', layer.format);

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
                  url: wmtsUrl
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
                }
              });
            }
          }
          return olLayer;
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
          var url = getMetaDataUrl(currentTopicId, $translate.uses(), id);
          return $http.jsonp(url);
        };
      };

      return new Layers();
    }];

  });

})();
