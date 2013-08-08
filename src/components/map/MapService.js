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

      var Layers = function() {
        var promise;
        var me = this;
        var currentTopicId, currentLang;

        /**
         * Load layers for a given topic and a specific language.
         */
        this.loadForTopic = function(topicId, lang) {
          if (currentTopicId !== topicId || currentLang !== lang) {
            currentTopicId = angular.isDefined(topicId) ?
                topicId : currentTopicId;
            currentLang = angular.isDefined(lang) ? lang : $translate.uses();
            var deferred = $q.defer();
            var url = getTopicUrl(currentTopicId, currentLang);

            $http.jsonp(url).success(function(data, status) {
              deferred.resolve(data);
              $rootScope.$broadcast('gaLayersChange', data);
            }).error(function(data, status) {
              deferred.reject();
            });

            promise = deferred.promise;
          }
        };

        $rootScope.$on('gaTopicChange', function(event, topic) {
          me.loadForTopic(topic.id);
        });

        $rootScope.$on('translationChangeSuccess', function(event, lang) {
          me.loadForTopic(me.currentTopicId, lang);
        });

        /**
         * Return an ol.layer.Layer object for a layer id.
         */
        this.getOlLayerById = function(id) {
          return promise.then(function(data) {
            var layers = data.layers;
            var layer = layers[id];
            var olLayer = layer.olLayer;
            var attribution = '&copy; Data: ' + layer.attribution;
            if (!angular.isDefined(olLayer)) {
              if (layer.type == 'wmts') {
                var wmtsUrl = wmtsGetTileUrl.replace('{Layer}', id).
                              replace('{Format}', layer.format);

                olLayer = new ol.layer.TileLayer({
                  id: id,
                  source: new ol.source.WMTS({
                    attributions: [
                      new ol.Attribution(attribution)
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
            }
            return olLayer;
          });
        };

        /**
         * Return the list of background layers. The returned
         * objects are object literals.
         */
        this.getBackgroundLayers = function() {
          return promise.then(function(data) {
            var backgroundLayers = [];
            var layers = data.layers;
            angular.forEach(layers, function(layer, id) {
              if (layer.background === true) {
                var backgroundLayer = angular.extend({
                  id: id
                }, layer);
                backgroundLayers.push(backgroundLayer);
              }
            });
            return backgroundLayers;
          });
        };

      };

      var layers = new Layers();

      return layers;
    }];

  });

})();
