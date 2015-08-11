goog.provide('ga_layerselector_directive');

(function() {

  var module = angular.module('ga_layerselector_directive', [
    'pascalprecht.translate'
  ]);

  module.directive('gaLayerselector', function($translate,
      gaContextProposalService, gaTopic, gaLayers, gaMapUtils, gaPreviewLayers,
      gaLayerFilters, gaLayerMetadataPopup) {
    return {
      restrict: 'A',
      templateUrl: 'components/layerselector/partials/layerselector.html',
      scope: {
        map: '=gaLayerselectorMap',
        options: '=gaLayerselectorOptions'
      },
      link: function(scope, element, attrs) {
        scope.options.layersOnly = true;
        scope.layers = scope.map.getLayers().getArray();
        var ids = []; // We keep ids of items to facilitate the search
        var getItemsFromIds = function(newIds) {
          var items = [];
          angular.forEach(newIds, function(id) {
            items.push({
              selected: !!(gaMapUtils.getMapOverlayForBodId(scope.map, id)),
              id: id,
              label: gaLayers.getLayerProperty(id, 'label')
            });
          });
          return items;
        };

        var updateLabels = function() {
          angular.forEach(scope.items, function(item) {
            item.label = gaLayers.getLayerProperty(item.id, 'label');
          });
        };

        // We get the top layers list from a topic
        var loadTopLayersFromTopic = function(topic, nb) {
          if (topic) {
            gaContextProposalService.topLayersForTopic(topic, 10).then(
                function(topLayersIds) {
              ids = topLayersIds || [];
              scope.items = getItemsFromIds(ids);
            });
          }
        };

        // Don't add preview layer if the layer is already on the map
        scope.addPreview = function(map, item) {
          if (!item.selected) {
            gaPreviewLayers.addBodLayer(map, item.id);
          }
        };

        // Remove all preview layers
        scope.removePreview = function(map) {
          gaPreviewLayers.removeAll(map);
        };

        scope.toggleLayer = function(map, item) {
          scope.removePreview(map);
          if (item.selected) {
            var layer = gaLayers.getLayer(item.id);
            if (layer) {
              var olLayer = gaLayers.getOlLayerById(item.id);
              map.addLayer(olLayer);
            }
          } else {
             var olLayer = gaMapUtils.getMapOverlayForBodId(scope.map, item.id);
             map.removeLayer(olLayer);
          }
        };

        scope.getLegend = function(evt, item) {
          gaLayerMetadataPopup.toggle(item.id);
        };

        scope.layerFilter = gaLayerFilters.selected;
        scope.$watchCollection('layers | filter:layerFilter',
            function(newArr, oldArr, currScope) {
          var layerIds = [];
          angular.forEach(newArr, function(layer) {
            layerIds.push(layer.id);
          });
          angular.forEach(currScope.items, function(item) {
            var idx = layerIds.indexOf(item.id);
            item.selected = (idx > -1);
          });
        });

        scope.$on('gaTopicChange', function(evt, newTopic) {
          loadTopLayersFromTopic(newTopic);
        });

        var deregister = scope.$on('gaLayersChange', function(evt, newLayers) {
          loadTopLayersFromTopic(gaTopic.get());
          deregister();
        });
        scope.$on('gaLayersTranslationChange', function(evt, newLayers) {
          updateLabels();
        });

        // Initialize the component
        loadTopLayersFromTopic(gaTopic.get());
      }
    };
  });
})();

