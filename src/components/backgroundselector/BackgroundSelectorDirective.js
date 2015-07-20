goog.provide('ga_backgroundselector_directive');

goog.require('ga_map');
goog.require('ga_permalink');
goog.require('ga_topic_service');
(function() {

  var module = angular.module('ga_backgroundselector_directive', [
    'ga_map',
    'ga_permalink',
    'ga_topic_service'
  ]);

  module.directive('gaBackgroundSelector',
    function($document, gaPermalink, gaLayers, gaLayerFilters,
        gaBrowserSniffer) {
      return {
        restrict: 'A',
        templateUrl:
            'components/backgroundselector/partials/backgroundselector.html',
        scope: {
          map: '=gaBackgroundSelectorMap'
        },
        link: function(scope, elt, attrs) {
          scope.isBackgroundSelectorClosed = true;
          var mobile = gaBrowserSniffer.mobile;
          scope.desktop = !gaBrowserSniffer.embed && !mobile;

          if (mobile) {
            elt.addClass('ga-bg-mobile');
          } else if (scope.desktop) {
            elt.addClass('ga-bg-desktop');
          }

          var map = scope.map;
          var isOfflineToOnline = false;

          var defaultBgOrder = [
              {id: 'ch.swisstopo.swissimage', label: 'bg_luftbild'},
              {id: 'ch.swisstopo.pixelkarte-farbe', label: 'bg_pixel_color'},
              {id: 'ch.swisstopo.pixelkarte-grau', label: 'bg_pixel_grey'},
              {id: 'voidLayer', label: 'void_layer'}];

          scope.backgroundLayers = defaultBgOrder.slice(0);

          function setCurrentLayer(layerid) {
            if (layerid) {
              var layers = map.getLayers();
              if (layerid == 'voidLayer') {
                if (layers.getLength() > 0 &&
                    layers.item(0).background === true) {
                  layers.removeAt(0);
                }
              } else if (gaLayers.getLayer(layerid)) {
                var layer = gaLayers.getOlLayerById(layerid);
                layer.background = true;
                layer.displayInLayerManager = false;
                if (layers.item(0) && layers.item(0).background) {
                  layers.setAt(0, layer);
                } else {
                  layers.insertAt(0, layer);
                }
              }
              gaPermalink.updateParams({bgLayer: layerid});
            }
          }

          var updateBgLayer = function(topic) {
            // Determine the current background layer. Strategy:
            //
            // On gaLayersChange event we receive then
            // we look at the permalink. If there's a bgLayer parameter
            // in the permalink we use that as the initial background
            // layer.
            //
            // Specific use case when we go offline to online, in this use
            // case we want to keep the current bg layer.
            var bgLayer;
            if (!topic) {
              bgLayer = gaPermalink.getParams().bgLayer;
            }
            if ((!bgLayer && !scope.currentLayer) || topic) {
              bgLayer = gaLayers.getBackgroundLayers()[0].id;
              scope.backgroundLayers = defaultBgOrder.slice(0);
            }
            if (bgLayer && !isOfflineToOnline) {
              scope.currentLayer = bgLayer;
            }
            isOfflineToOnline = false;

          };

          var dereg = scope.$on('gaLayersChange', function(event, newLayers) {
            updateBgLayer();
            dereg();
          });

          scope.$on('gaTopicChange', function(event, newTopic) {
            // If the layers config is loaded
            if (gaLayers.getBackgroundLayers()) {
              updateBgLayer(newTopic);
            }
          });

          scope.$on('gaPermalinkChange', function(event) {
            scope.isBackgroundSelectorClosed = true;
          });

          scope.$watch('currentLayer', function(newVal, oldVal) {
            if (oldVal !== newVal) {
              setCurrentLayer(newVal);
            }
          });

          scope.activateBackgroundLayer = function(layerid) {
            if (scope.isBackgroundSelectorClosed) {
              scope.isBackgroundSelectorClosed = false;
              scope.backgroundLayers = defaultBgOrder.slice(0);
            } else {
              scope.isBackgroundSelectorClosed = true;
              if (scope.currentLayer != layerid) {
                scope.currentLayer = layerid;
              }
            }
          };

          scope.toggleMenu = function() {
            if (scope.isBackgroundSelectorClosed) {
              scope.isBackgroundSelectorClosed = false;
            } else {
              scope.isBackgroundSelectorClosed = true;
            }
          };

          // We must know when the app goes from offline to online.
          scope.$on('gaNetworkStatusChange', function(evt, offline) {
            isOfflineToOnline = !offline;
          });

          // If another omponent add a background layer, update the
          // selectbox.
          scope.layers = scope.map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.background;
          scope.$watchCollection('layers | filter:layerFilter',
            function(arr) {
              if (arr.length == 2 ||
                  (scope.currentLayer == 'voidLayer' && arr.length == 1)) {
                scope.currentLayer = arr[arr.length - 1].id;
                scope.map.removeLayer(arr[arr.length - 1]);
              }
            });

          scope.getClass = function(layer, index) {
            if (layer) {
              var splitLayer = layer.id.split('.');
              return 'ga-' + splitLayer[splitLayer.length - 1] +
                ' ' + ((!scope.isBackgroundSelectorClosed) ?
                'ga-bg-layer-' + index : '');
            }
          };
        }
      };
    }
  );
})();
