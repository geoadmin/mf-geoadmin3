goog.provide('ga_query_vector_directive');

goog.require('ga_layerfilters_service');

(function() {
  var module = angular.module('ga_query_vector_directive', [
    'ga_layerfilters_service'
  ]);

  var registerPointerMove = function(scope, map) {
    return map.on('pointermove', function(evt) {
      var featureFound;
      map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        if (feature && layer instanceof ol.layer.VectorTile) {
          var properties = feature.getProperties();
          if (
            !featureFound &&
            properties.layer === scope.options.propertySelected.id
          ) {
            featureFound = feature;
            scope.$apply(function() {
              scope.options.propertyValue =
                properties[scope.options.propertySelected.field];
            });
          } else if (!featureFound) {
            scope.$apply(function() {
              scope.options.propertyValue = '';
            });
          }
        }
      });
    });
  };

  module.directive('gaQueryVector', function(gaLayerFilters) {
    return {
      restrict: 'A',
      templateUrl: 'components/queryvector/partials/queryvector.html',
      replace: true,
      scope: {
        map: '=gaQueryVectorMap',
        options: '=gaQueryVectorOptions'
      },
      link: function(scope) {
        var pointerMoveListeners = [];
        var map = scope.map;

        scope.options.propertyValue = '';
        scope.options.properties = [];
        scope.options.propertySelected = null;
        scope.layers = map.getLayers().getArray();
        // TODO Must a background and a vector tile layer
        scope.layerFilter = gaLayerFilters.background;

        scope.$watchCollection('layers | filter:layerFilter', function(layers) {
          if (layers.length === 1 && pointerMoveListeners.length === 0) {
            scope.options.properties =
              scope.options.layers[layers[0].bodId].properties;
            scope.options.propertySelected = scope.options.properties[0];
            pointerMoveListeners.push(registerPointerMove(scope, map));
          } else if (layers.length === 0 && pointerMoveListeners.length === 1) {
            while (pointerMoveListeners.length > 0) {
              var l = pointerMoveListeners.pop();
              ol.Observable.unByKey(l);
            }
            scope.options.properties = [];
            scope.options.propertySelected = null;
            scope.options.propertyValue = '';
          }
        });
      }
    };
  });
})();
