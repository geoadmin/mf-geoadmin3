(function() {
  goog.provide('ga_backgroundlayerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_backgroundlayerselector_directive', [
    'ga_map',
    'ga_permalink'
  ]);

  module.directive('gaBackgroundLayerSelector',
      ['gaPermalink', 'gaLayers',
        function(gaPermalink, gaLayers) {
          return {
            restrict: 'A',
            replace: true,
            scope: {
              map: '=gaBackgroundLayerSelectorMap'
            },
            templateUrl: 'components/backgroundlayerselector/partials/' +
                'backgroundlayerselector.html',
            link: function(scope, element, attrs) {
              var map = scope.map;
              var topicLayerId;

              function setCurrentLayer() {
                if (scope.currentLayer == 'voidLayer') {
                  map.getLayers().removeAt(0);
                } else {
                  var layer = gaLayers.getOlLayerById(scope.currentLayer);
                  map.getLayers().setAt(0, layer);
                }
                gaPermalink.updateParams({bgLayer: scope.currentLayer});
              }

              scope.$on('gaLayersChange', function(event, data) {
                scope.backgroundLayers = gaLayers.getBackgroundLayers();
                scope.backgroundLayers.push({
                  id: 'voidLayer',
                  label: 'void_layer'
                });
                var queryParams = gaPermalink.getParams();
                scope.currentLayer = topicLayerId || queryParams.bgLayer ||
                    scope.backgroundLayers[0].id;
              });

              scope.$on('gaTopicChange', function(event, topic) {
                topicLayerId = topic.bgLayer;
              });

              scope.$watch('currentLayer', function(newVal, oldVal) {
                if (oldVal !== newVal) {
                  setCurrentLayer();
                }
              });
            }
          };
        }]);
})();
