goog.provide('ga_background_service');

goog.require('ga_map_service');
goog.require('ga_permalink');

(function() {

  var module = angular.module('ga_background_service', [
    'ga_permalink',
    'ga_map_service'
  ]);

  /**
   * Backgrounds manager
   */
  module.provider('gaBackground', function() {
    this.$get = function($rootScope, $q, gaTopic, gaLayers, gaPermalink) {
      var isOfflineToOnline = false;
      var bg; // The current background
      var bgs = []; // The list of backgrounds available
      var voidLayer = {id: 'voidLayer', label: 'void_layer'};

      var getBgById = function(id) {
        for (var i = 0, ii = bgs.length; i < ii; i++) {
          if (bgs[i].id == id) {
            return bgs[i];
          }
        }
      };

      var getBgByTopic = function(topic) {
        var topicBgs = topic.backgroundLayers;
        var topicBg = (topicBgs.length) ? getBgById(topicBgs[0]) : bgs[0];
        if (topicBg && !isOfflineToOnline) {
           return topicBg;
        }
      };

      var broadcast = function() {
        if (gaPermalink.getParams().bgLayer != bg.id) {
          gaPermalink.updateParams({bgLayer: bg.id});
        }
        $rootScope.$broadcast('gaBgChange', bg);
      };

      var updateDefaultBgOrder = function(bgLayers) {
        bgLayers = bgLayers ? bgLayers : [];
        bgs.length = 0;
        bgLayers.forEach(function(bgLayerId) {
          bgs.push({
            id: bgLayerId,
            label: gaLayers.getLayerProperty(bgLayerId, 'label')
          });
        });
        bgs.push(voidLayer);
        // to be moved in defaultBgOrder once 3d is live
        if (gaGlobalOptions.dev3d) {
          bgs.splice(3, 0,
            {id: 'ch.swisstopo.terrain.3d', label: 'terrain_layer'});
        }
      };

      var Background = function() {

        this.init = function(map) {
          var that = this;
          // Initialize the service when topics and layers config are
          // loaded
          $q.all([gaTopic.loadConfig(), gaLayers.loadConfig()]).
              then(function() {
            updateDefaultBgOrder(gaTopic.get().backgroundLayers);
            var initBg = getBgById(gaPermalink.getParams().bgLayer);
            if (!initBg) {
              initBg = getBgByTopic(gaTopic.get());
            }
            that.set(map, initBg);
            $rootScope.$on('gaTopicChange', function(evt, newTopic) {
              updateDefaultBgOrder(gaTopic.get().backgroundLayers);
              that.set(map, getBgByTopic(newTopic));
              isOfflineToOnline = false;
            });
            // We must know when the app goes from offline to online.
            $rootScope.$on('gaNetworkStatusChange', function(evt, offline) {
              isOfflineToOnline = !offline;
            });
          });
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
          if (map && (!bg || newBgId != bg.id)) {
            var newBg = getBgById(newBgId, false);
            if (newBg) {
              bg = newBg;
              var layers = map.getLayers();
              if (bg.id == 'voidLayer') {
                if (layers.getLength() > 0 &&
                    layers.item(0).background === true) {
                  layers.removeAt(0);
                }
              } else {
                var layer = gaLayers.getOlLayerById(bg.id);
                layer.background = true;
                layer.displayInLayerManager = false;
                if (layers.item(0) && layers.item(0).background) {
                  layers.setAt(0, layer);
                } else {
                  layers.insertAt(0, layer);
                }
              }
              broadcast();
             }
          }
        };

        this.get = function() {
          return bg;
        };
      };
      return new Background();
    };
  });
})();
