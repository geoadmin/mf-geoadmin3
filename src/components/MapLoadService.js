goog.provide('ga_map_load_service');

goog.require('ga_map_service');

(function() {

  var module = angular.module('ga_map_load_service', [
    'ga_map_service'
  ]);

 /**
   * This service can be used to inspect loading of the map.
   * It times the loading of the map and emits messages about
   * it
   */
  module.provider('gaMapLoad', function() {

    this.$get = function($window, gaLayerFilters) {

      var layersPending = 0;
      var layersDone = 0;
      var mapStartTime;

      var updateMapLoading = function() {
        if (layersPending == layersDone) {
          var seconds = (new Date() - mapStartTime) / 1000;
          mapStartTime = undefined;
          $window.console.info('Map loaded in ' + seconds + 's');
        }
      };

      var addLayerPending = function() {
        if (mapStartTime == undefined) {
          $window.console.info('Start loading map.');
          mapStartTime = new Date();
        }
        layersPending++;
        updateMapLoading();
      };

      var addLayerLoaded = function() {
        layersDone++;
        updateMapLoading();
      };

      var LayerProgress = function(layer) {
        var src, startTime;
        var loading = 0;
        var loaded = 0;

        var update = function() {
          if (loading == loaded) {
            var seconds = (new Date() - startTime) / 1000;
            startTime = undefined;
            $window.console.log('Layer ' + layer.id +
                                ' finished loading in ' + seconds + 's.');
            addLayerLoaded();
          }
        };

        var addLoading = function() {
          if (startTime == undefined) {
            startTime = new Date();
            addLayerPending();
          }
          loading++;
          update();
        };
        var addLoaded = function() {
          loaded++;
          update();
        };

        if (layer instanceof ol.layer.Tile ||
            layer instanceof ol.layer.Image) {
          var start, error, end;
          src = layer.getSource();
          if (src instanceof ol.source.WMTS ||
              src instanceof ol.source.TileWMS) {
              start = 'tileloadstart';
              error = 'tileloaderror';
              end = 'tileloadend';
          } else if (src instanceof ol.source.ImageWMS) {
              start = 'imageloadstart';
              error = 'imageloaderror';
              end = 'imageloadend';
          }
          if (start) {
            src.on(start, addLoading);
            src.on([end, error], addLoaded);
          }
        }
      };

      var Mapload = function() {

        var progs = {};

        var createLayerProgress = function(layers) {
          angular.forEach(layers, function(layer) {
            if (layer.type == 'aggregate') {
              createLayerProgress(layer.getLayers());
            } else if (!progs[layer.id]) {
              progs[layer.id] = new LayerProgress(layer);
            }
          });
        };

        this.init = function(scope) {
          scope.maploadLayers = scope.map.getLayers().getArray();
          scope.maploadFilter = function(l) {
            return gaLayerFilters.selectedAndVisible(l) ||
                   gaLayerFilters.background(l);
          };

          //React on adding/removing layers
          scope.$watchCollection('maploadLayers | filter:maploadFilter',
                                 function(layers) {
            createLayerProgress(layers);
          });

        };
      };

      return new Mapload();

    };
  });
})();

