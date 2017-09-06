
goog.provide('ga_featureload_service');

goog.require('ga_map_service');
goog.require('ga_styles_service');

(function() {
  var module = angular.module('ga_featureload_service', [
    'ga_map_service',
    'ga_styles_service'
  ]);

  /*
   *This service checks if features are loaded.
   */

  module.provider('gaFeatureLoadManager', function() {
    this.$get = function($rootScope, $q, $http, gaDefinePropertiesForLayer,
        gaStyleFactory, gaLayerFilters, gaMapUtils, gaLayers) {

      var promises = {};
      var scope = $rootScope.$new();

      var FeatureLoadManager = function() {
        var map;

        var createWatcher = function(bodId) {
          scope.layers = map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.geojson;
          scope.$watchCollection('layers | filter:layerFilter',
              function(layers) {
                angular.forEach(layers, function(flayer) {
                  flayer.getSource().on('addfeature', function(event) {
                    layer_features = flayer.getSource().getFeatures();
                    window.console.log(layer_features.length);
                    promises[flayer.bodId].resolve(layer_features);
                  })
                });
              });
          return promises
        };

        this.init = function(inMap) {
          map = inMap;
          createWatcher();
        };

        /*
           * Function returns promises. Each promise checks if features of
           * layers are loaded.
           */
        this.getLoadPromise = function(bodId) {
          if (!promises[bodId]) {
            promises[bodId] = $q.defer();
          }
          return promises[bodId];
        };
      };

      return new FeatureLoadManager();
    };
  });
})();
