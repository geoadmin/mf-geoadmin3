(function() {
  goog.provide('ga_layermanager_directive');

  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_layermanager_directive', [
    'pascalprecht.translate',
    'ga_layer_metadata_popup_service',
    'ga_map_service'
  ]);

  /**
   * Filter for the gaLayermanager directive's ngRepeat. The filter
   * reverses the array of layers so layers in the layer manager UI
   * have the same order as in the map.
   */
  module.filter('gaReverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

  module.directive('gaLayermanager',
      function(gaLayers, gaLayerMetadataPopup, gaBrowserSniffer) {
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
              return !layer.background && !layer.preview;
            };

            scope.getLayerLabel = function(layer) {
              var label;
              var bodId = layer.bodId;
              if (gaLayers.getLayer(bodId)) {
                // BOD layer
                label = gaLayers.getLayerProperty(bodId, 'label');
              } else {
                // Non-BOD layer
                label = layer.label;
              }
              return label;
            };

            scope.removeLayerFromMap = function(layer) {
              map.removeLayer(layer);
            };

            scope.moveLayer = function(layer, delta) {
              var index = scope.layers.indexOf(layer);
              var layersCollection = scope.map.getLayers();
              layersCollection.removeAt(index);
              layersCollection.insertAt(index + delta, layer);
            };

            scope.isBodLayer = function(layer) {
              return !!gaLayers.getLayer(layer.bodId);
            };

            scope.displayLayerMetadata = function(e, layer) {
              var bodId = layer.bodId;
              if (gaLayers.getLayer(bodId)) {
                gaLayerMetadataPopup(bodId);
              }
              e.preventDefault();
            };

            scope.rangeSupported = gaBrowserSniffer.msie !== 9;

            if (!scope.rangeSupported) {
              scope.opacityValues = [
                { key: '1' , value: '100%' },
                { key: '0.95' , value: '95%' }, { key: '0.9' , value: '90%' },
                { key: '0.85' , value: '85%' }, { key: '0.8' , value: '80%' },
                { key: '0.75' , value: '75%' }, { key: '0.7' , value: '70%' },
                { key: '0.65' , value: '65%' }, { key: '0.6' , value: '60%' },
                { key: '0.55' , value: '55%' }, { key: '0.5' , value: '50%' },
                { key: '0.45' , value: '45%' }, { key: '0.4' , value: '40%' },
                { key: '0.35' , value: '35%' }, { key: '0.3' , value: '30%' },
                { key: '0.25' , value: '25%' }, { key: '0.2' , value: '20%' },
                { key: '0.15' , value: '15%' }, { key: '0.1' , value: '10%' },
                { key: '5' , value: '5%' }, { key: '0', value: '0%' }
              ];
            }
            // Toggle layer tools for mobiles
            element.on('click', '.icon-gear', function() {
              var li = $(this).closest('li');
              li.toggleClass('folded');
              $(this).closest('ul').find('li').each(function(i, el) {
                if (el != li[0]) {
                  $(el).addClass('folded');
                }
              });
            });

          }
        };
      }
  );
})();

