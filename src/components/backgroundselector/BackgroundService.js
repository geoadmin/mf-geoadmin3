goog.provide('ga_background_service');

goog.require('ga_layerfilters_service');
goog.require('ga_layers_service');
goog.require('ga_permalink');
goog.require('ga_urlutils_service');
goog.require('ga_mapbox_style_storage_service');
goog.require('ga_vector_tile_layer_service');

(function() {

  var module = angular.module('ga_background_service', [
    'ga_permalink',
    'ga_layers_service',
    'ga_urlutils_service',
    'ga_layerfilters_service',
    'ga_mapbox_style_storage_service',
    'ga_vector_tile_layer_service',
    'ga_storage_service',
    'ga_maputils_service'
  ]);

  /**
   * Backgrounds manager
   */
  module.provider('gaBackground', function() {

    this.$get = function($rootScope, $q, gaTopic, gaLayers, gaPermalink,
        gaUrlUtils, gaLayerFilters, gaMapboxStyleStorage, gaStorage,
        gaMapUtils, gaVectorTileLayerService) {
      var bg; // The current background
      var bgs = []; // The list of backgrounds available
      // Promise resolved when the background service is initialized.
      var bgsP = $q.defer();

      // Bgs with vector tiles tileset.
      var vtBgs = {
        'ch.swisstopo.leichte-basiskarte.vt': {
          id: 'ch.swisstopo.leichte-basiskarte.vt',
          label: 'basis',
          disable3d: true,
          labels: false
        }
      };

      var predefinedBgs = {
        'ch.swisstopo.pixelkarte-farbe': {
          id: 'ch.swisstopo.pixelkarte-farbe',
          label: 'bg_pixel_color',
          disableEdit: true
        },
        'ch.swisstopo.swissimage': {
          id: 'ch.swisstopo.swissimage',
          label: 'bg_luftbild',
          disable3d: true,
          disableEdit: true
        }
      };

      var getBgById = function(id) {
        for (var i = 0, ii = bgs.length; i < ii; i++) {
          if (bgs[i].id === id) {
            return bgs[i];
          }
        }
      };

      var getBgByTopic = function(topic) {
        var topicBg = null;
        if (topic.plConfig) {
          var p = gaUrlUtils.parseKeyValue(topic.plConfig);
          topicBg = getBgById(p.bgLayer);
        } else {
          // Force vt
          topic.defaultBackground = bgs[0].id;
        }
        return topicBg || getBgById(topic.defaultBackground) || bgs[0];
      };

      var broadcast = function() {
        if (gaPermalink.getParams().bgLayer !== bg.id) {
          gaPermalink.updateParams({bgLayer: bg.id});
        }
        $rootScope.$broadcast('gaBgChange', bg);
      };

      var updateDefaultBgOrder = function(bgLayers) {
        bgLayers = bgLayers || [];
        bgs.length = 0;

        Object.keys(vtBgs).forEach(function(key) {
          if (bgs.indexOf(vtBgs[key]) === -1) {
            bgs.push(vtBgs[key]);
          }
        });

        bgLayers.forEach(function(bgLayerId) {
          var bgLayer = predefinedBgs[bgLayerId];
          if (bgLayer) {
            bgs.push(bgLayer);
          }
        });

        // auto add voidLayer
        if (bgs.indexOf('voidLayer') === -1) {
          bgs.push({
            id: 'voidLayer',
            label: 'void_layer',
            disableEdit: true
          });
        }
      };

      var updateBgLayerStyleUrlParam = function(olLayer) {
        if (olLayer.externalStyleUrl) {
          // Save the url in the bg config to get it
          // when we switch back.
          gaPermalink.updateParams({
            bgLayer_styleUrl: olLayer.externalStyleUrl
          });
        } else {
          gaPermalink.deleteParam('bgLayer_styleUrl');
        }
      };

      // Update permalink on bgLayer's modification
      var registerBgLayerStyleUrlPermalink = function(scope, map) {
        var deregFns = [];
        scope.layers = map.getLayers().getArray();
        scope.layerFilter = gaLayerFilters.background;
        scope.$watchCollection('layers | filter:layerFilter', function(layers) {

          // deregister the listeners we have on each layer and register
          // new ones for the new set of layers.
          angular.forEach(deregFns, function(deregFn) {
            deregFn();
          });
          deregFns.length = 0;

          angular.forEach(layers, function(layer) {
            deregFns.push(scope.$watch(function() {
              return layer.externalStyleUrl;
            }, function() {
              updateBgLayerStyleUrlParam(layer);
            }));
          });
        });
      };

      var createOlLayer = function(bg) {
        var externalStyleUrl = bg.externalStyleUrl ||
            (bg.olLayer && bg.olLayer.externalStyleUrl);
        bg.olLayer = gaLayers.getOlLayerById(bg.id, {
          externalStyleUrl: externalStyleUrl,
          glStyle: bg.olLayer && bg.olLayer.glStyle
        });
        bg.olLayer.adminId = bg.adminId;
        bg.olLayer.background = true;
        bg.olLayer.displayInLayerManager = false;
        return bg.olLayer;
      };

      var Background = function() {

        this.init = function(map) {
          var scope = $rootScope.$new();
          var that = this;
          // Initialize the service when topics and layers config are loaded
          $q.all([gaTopic.loadConfig(), gaLayers.loadConfig()]).
              then(function() {
                updateDefaultBgOrder(gaTopic.get().backgroundLayers);

                var params = gaPermalink.getParams();
                var initBg = getBgById(params.bgLayer);
                if (!initBg) {
                  initBg = getBgByTopic(gaTopic.get());
                }
                // We create the olLayer with the correct style from permalink
                var adminId = params.glStylesAdminId;
                if (adminId) {
                  gaMapboxStyleStorage.getFileUrlFromAdminId(adminId).then(
                      function(styleUrl) {
                        initBg.adminId = adminId;
                        initBg.externalStyleUrl = styleUrl;
                        that.set(map, initBg);
                        gaPermalink.deleteParam('glStylesAdminId');
                      }
                  );
                } else {
                  initBg.externalStyleUrl = params.bgLayer_styleUrl;
                }

                $rootScope.$on('gaTopicChange', function(evt, newTopic) {
                  updateDefaultBgOrder(newTopic.backgroundLayers);
                  that.set(map, getBgByTopic(newTopic));
                });

                registerBgLayerStyleUrlPermalink(scope, map);
                bgsP.resolve()
              });

          return bgsP.promise;
        };

        this.getBackgrounds = function() {
          return bgs;
        };

        this.set = function(map, newBg) {
          if (map && newBg) {
            this.setById(map, newBg.id);
          }
        };

        this.setById = function(map, newBgId) {
          if (map && (!bg || newBgId !== bg.id)) {
            var newBg = getBgById(newBgId);
            if (newBg) {
              bg = newBg;
              var layers = map.getLayers();
              if (bg.id === 'voidLayer') {
                // Remove the bg from the map
                if (layers.getLength() > 0 && layers.item(0).background) {
                  layers.removeAt(0);
                }
              } else if (
                bg.id === gaVectorTileLayerService.getVectorLayerBodId()) {
                if (layers.item(1) && layers.item(1).background) {
                  layers.removeAt(1);
                }
              } else {
                var layer = createOlLayer(bg);
                // Add the bg to the map
                if (layers.item(1) && layers.item(1).background) {
                  layers.setAt(1, layer);
                } else {
                  layers.insertAt(1, layer);
                }
              }
              broadcast();
            }
          }
        };

        this.loadConfig = function() {
          return bgsP.promise;
        };

        this.get = function() {
          return bg;
        };
      };
      return new Background();
    };
  });
})();
