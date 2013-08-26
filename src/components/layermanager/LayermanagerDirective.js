(function() {
  goog.provide('ga_layermanager_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_layermanager_directive', [
    'pascalprecht.translate',
    'ga_map_service'
  ]);

  module.directive('gaLayermanager',
      ['gaLayers', function(gaLayers) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/layermanager/partials/layermanager.html',
          scope: {
            map: '=gaLayermanagerMap'
          },
          link: function(scope, element, attrs) {
            var map = scope.map;

            // The ngRepeat collection is the map's array of layers. ngRepeat
            // uses $watchCollection internally. $watchCollection watches the
            // array, but does not shallow watch the array items! The array
            // items are OpenLayers layers, we don't want Angular to shallow
            // watch them.

            scope.layers = map.getLayers().getArray();

            // layerFilter is the ngRepeat filter. We filter out background
            // layers and preview layers.
            scope.layerFilter = function(layer) {
              var id = layer.get('id');
              var isBackground = !!gaLayers.getLayer(id) &&
                  gaLayers.getLayerProperty(id, 'background');
              var isPreview = layer.preview;
              return !isBackground && !isPreview;
            };

            scope.getLayerLabel = function(layer) {
              var id = layer.get('id');
              // FIXME labels for non-bod layers?
              return gaLayers.getLayer(id) ?
                  gaLayers.getLayerProperty(id, 'label') : '';
            };

            scope.removeLayerFromMap = function(layer) {
              map.removeLayer(layer);
            };

          }
        };
      }]
  );
})();

