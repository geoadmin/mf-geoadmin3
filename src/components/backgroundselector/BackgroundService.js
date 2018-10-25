goog.provide('ga_background_service');

goog.require('ga_layerfilters_service');
goog.require('ga_layers_service');
goog.require('ga_permalink');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_background_service', [
    'ga_permalink',
    'ga_layers_service',
    'ga_urlutils_service',
    'ga_layerfilters_service'
  ]);

  /**
   * Backgrounds manager
   */
  module.provider('gaBackground', function() {
    this.$get = function($rootScope, $q, gaTopic, gaLayers, gaPermalink,
        gaUrlUtils, gaLayerFilters) {
      var bg; // The current background
      var bgs = []; // The list of backgrounds available
      var bgsP; // Promise resolved when the background service is initialized.
      var labels; // , voidLayer = {id: 'voidLayer', label: 'void_layer'};

      // Bgs with vector tiles tileset.
      var vtBgs = {
        'omt.vt': {
          id: 'omt.vt',
          label: 'OpenMapTiles',
          disable3d: true,
          labels: false
        },
        'ch.swisstopo.wandern.vt': {
          id: 'ch.swisstopo.wandern.vt',
          label: 'wandern',
          disable3d: true,
          labels: false
        },
        'ch.swisstopo.leichte-basiskarte.vt': {
          id: 'ch.swisstopo.leichte-basiskarte.vt',
          label: 'basis',
          disable3d: true,
          labels: false
        },
        'ch.swisstopo.hybridkarte.vt': {
          id: 'ch.swisstopo.hybridkarte.vt',
          label: 'hybrid',
          disable3d: true,
          labels: false
        }
      };

      var predefinedBgs = {
        /* 'voidLayer': voidLayer,
        'ch.swisstopo.swissimage': {
          id: 'ch.swisstopo.swissimage',
          label: 'bg_luftbild',
          disable3d: true,
          labels: false// 'SWISSNAMES-LV03-mbtiles'
        },
        'ch.swisstopo.pixelkarte-farbe': {
          id: 'ch.swisstopo.pixelkarte-farbe',
          label: 'bg_pixel_color'
        } ,
        'ch.swisstopo.pixelkarte-grau': {
          id: 'ch.swisstopo.pixelkarte-grau',
          label: 'bg_pixel_grey'
        } */
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
        bgLayers.forEach(function(bgLayerId) {
          var bgLayer = predefinedBgs[bgLayerId];
          if (bgLayer) {
            bgs.push(bgLayer);
          }
        });

        Object.keys(vtBgs).forEach(function(key) {
          if (bgs.indexOf(vtBgs[key]) === -1) {
            bgs.push(vtBgs[key]);
          }
        });

        // Deactivate auto-add of voidLayer
        /* if (bgs.indexOf(voidLayer) === -1) {
          bgs.push(voidLayer);
        } */
      };

      function updateBgLayerStyleUrlParam(bgLayer) {
        var styleUrlValue = bgLayer.externalStyleUrl;
        if (bgLayer.id) {
          getBgById(bgLayer.id).styleUrl = styleUrlValue;
        }
        if (styleUrlValue) {
          // Save the url in the bg config to get it
          // when we switch back.
          gaPermalink.updateParams({
            bgLayer_styleUrl: styleUrlValue
          });
        } else {
          gaPermalink.deleteParam('bgLayer_styleUrl');
        }
      }

      // Update permalink on bgLayer's modification
      var registerBgLayerStyleUrlPermalink = function(scope, map) {
        var deregFns = [];
        scope.layers = map.getLayers().getArray();
        scope.layerFilter = gaLayerFilters.background;
        scope.$watchCollection('layers | filter:layerFilter',
            function(layers) {

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
      }

      var Background = function() {

        this.init = function(map) {
          var scope = $rootScope.$new();
          var that = this;
          // Initialize the service when topics and layers config are
          // loaded
          bgsP = $q.all([gaTopic.loadConfig(), gaLayers.loadConfig()]).
              then(function() {
                updateDefaultBgOrder(gaTopic.get().backgroundLayers);
                var initBg = getBgById(gaPermalink.getParams().bgLayer);
                if (!initBg) {
                  initBg = getBgByTopic(gaTopic.get());
                }
                var styleUrl = gaPermalink.getParams().bgLayer_styleUrl;
                initBg.styleUrl = styleUrl;
                that.set(map, initBg);
                $rootScope.$on('gaTopicChange', function(evt, newTopic) {
                  updateDefaultBgOrder(newTopic.backgroundLayers);
                  that.set(map, getBgByTopic(newTopic));
                });
                registerBgLayerStyleUrlPermalink(scope, map);
              });

          return bgsP;
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
                if (layers.getLength() > 0 &&
                    layers.item(0).background === true) {
                  layers.removeAt(0);
                }
              } else {
                var layer = gaLayers.getOlLayerById(bg.id, {
                  externalStyleUrl: gaPermalink.getParams().bgLayer_styleUrl
                });
                layer.background = true;
                layer.displayInLayerManager = false;
                if (layers.item(0) && layers.item(0).background) {
                  layers.setAt(0, layer);
                } else {
                  layers.insertAt(0, layer);
                }
                bg.olLayer = layer;
              }

              // Add a vectortile layer with labels on top of all layers
              if (labels) {
                layers.remove(labels);
              }
              if (bg.labels) {
                labels = labels || gaLayers.getOlLayerById(bg.labels);
                labels.displayInLayerManager = false;
                labels.tooltip = false;
                labels.setZIndex(1000);
                layers.push(labels);
              }
              broadcast();
            }
          }
        };

        this.loadConfig = function() {
          return bgsP;
        };

        this.get = function() {
          return bg;
        };
      };
      return new Background();
    };
  });
})();
