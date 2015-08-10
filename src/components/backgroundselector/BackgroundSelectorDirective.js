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
        gaBrowserSniffer, $q, gaTopic, gaGlobalOptions) {
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
          scope.backgroundLayers = [];

          if (mobile) {
            elt.addClass('ga-bg-mobile');
          } else if (scope.desktop) {
            elt.addClass('ga-bg-desktop');
          }

          var map = scope.map;
          var isOfflineToOnline = false;

          var defaultBgOrder = [];
          var voidLayer = {id: 'voidLayer', label: 'void_layer'};

          function setCurrentLayer(layerid) {
            if (scope.currentLayer === layerid) {
              return;
            }

            if (layerid) {
              scope.currentLayer = layerid;
              var layers = map.getLayers();
              if (layerid == voidLayer.id) {
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
          };
          var isValidBgLayer = function(bgLayerId) {
            var isValid = false;
            angular.forEach(scope.backgroundLayers, function(bgLayer) {
              if (bgLayer.id == bgLayerId) {
                isValid = true;
              }
            });
            return isValid;
          };
          var updateDefaultBgOrder = function(bgLayers) {
            bgLayers = bgLayers ? bgLayers : [];
            defaultBgOrder = [];
            bgLayers.forEach(function(bgLayerId) {
              if (bgLayerId === voidLayer.id) {
                defaultBgOrder.push(voidLayer);
              } else {
                defaultBgOrder.push({
                  id: bgLayerId,
                  label: gaLayers.getLayerProperty(bgLayerId, 'label')
                });
              }
            });
            if (defaultBgOrder.indexOf(voidLayer) === -1) {
              defaultBgOrder.push(voidLayer);
            }
            // to be moved in defaultBgOrder once 3d is live
            if (gaGlobalOptions.dev3d) {
              defaultBgOrder.splice(3, 0,
                {id: 'ch.swisstopo.terrain.3d', label: 'terrain_layer'});
            }
            scope.backgroundLayers = defaultBgOrder.splice(0);
          };
          var updateBgLayer = function(topic) {
            // Determine the current background layer. Strategy:
            //
            // On application load (then on topic change) event
            // we look at the permalink. If there's a bgLayer parameter
            // in the permalink we use that as the initial background
            // layer.
            //
            // Specific use case when we go offline to online, in this use
            // case we want to keep the current bg layer.
            var bgLayer;
            if (!topic) {
              bgLayer = gaPermalink.getParams().bgLayer;
              if (!isValidBgLayer(bgLayer)) {
                bgLayer = undefined;
              }
            }
            if ((!bgLayer && !scope.currentLayer) || topic) {
              var bgLayers = gaTopic.get().backgroundLayers;
              bgLayer = (bgLayers.length) ?
                  bgLayers[0] : voidLayer.id;
              updateDefaultBgOrder(bgLayers);
            }
            if (bgLayer && !isOfflineToOnline) {
              setCurrentLayer(bgLayer);
            }
            isOfflineToOnline = false;

          };

          scope.activateBackgroundLayer = function(layerid) {
            if (scope.isBackgroundSelectorClosed) {
              scope.isBackgroundSelectorClosed = false;
            } else {
              scope.isBackgroundSelectorClosed = true;
              if (scope.currentLayer != layerid) {
                setCurrentLayer(layerid);
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
                  (scope.currentLayer == voidLayer.id && arr.length == 1)) {
                setCurrentLayer(arr[arr.length - 1].id);
                scope.map.removeLayer(arr[arr.length - 1]);
              }
            });

          scope.getClass = function(layer, index) {
            if (layer) {
              var layerClass;
              if (layer.id.indexOf('.') > -1) {
                var splitLayer = layer.id.split('.');
                layerClass = 'ga-' + splitLayer[splitLayer.length - 1];
              } else {
                layerClass = 'ga-' + layer.id + ' ';
              }
              return layerClass + ' ' + ((!scope.isBackgroundSelectorClosed) ?
                'ga-bg-layer-' + index : '');
            }
          };

          // Initialize the component when topics and layers config are
          // loaded
          $q.all([gaTopic.loadConfig(), gaLayers.loadConfig()]).
              then(function() {
            updateDefaultBgOrder(gaTopic.get().backgroundLayers);
            updateBgLayer();

            scope.$on('gaTopicChange', function(event, newTopic) {
              updateBgLayer(newTopic);
            });

            scope.$on('gaPermalinkChange', function(event) {
              scope.isBackgroundSelectorClosed = true;
            });
          });
        }
      };
    }
  );
})();
