(function() {
  goog.provide('ga_catalogtree_service');

  goog.require('ga_map_service');

  var module = angular.module('ga_catalogtree_service', [
    'ga_map_service'
  ]);

  /**
   * Service providing utility functions to work with map and layers in
   * the catalog tree directives.
   */
  module.provider('gaCatalogtreeMapUtils', function() {
    this.$get = function(gaLayers) {
      return {

        /**
         * Get the layer corresponding to the tree leaf "item" and add
         * it to the map.
         *
         * FIXME: we are super cautious here and display error messages
         * when either the layer identified by item.idBod doesn't exist
         * in the gaLayers service, or gaLayers cannot construct an ol
         * layer object for that layer.
         */
        addLayer: function(map, item) {
          var error = true;
          if (angular.isDefined(gaLayers.getLayer(item.idBod))) {
            var layer = gaLayers.getOlLayerById(item.idBod);
            if (angular.isDefined(layer)) {
              error = false;
              map.addLayer(layer);
            }
          }
          if (error) {
            alert('Layer not supported by gaLayers (' + item.idBod + ').');
            item.errorLoading = true;
          }
        }
      };
    };
  });

  module.provider('gaCatalogTreePermalinkManager', function() {

    this.$get = function($rootScope, gaPermalink) {
      return function() {
        var scope = $rootScope.$new();
        var openIds = [];

        scope.$on('catalogCategorySelectionChange', function(evt, el) {
          var index = openIds.indexOf(el.id);
          if (el.selected === true) {
            if (index < 0) {
              openIds.push(el.id);
            }
          } else {
            if (index >= 0) {
              openIds.splice(index, 1);
            }
          }
          if (openIds.length > 0) {
            gaPermalink.updateParams({catalognodes: openIds.join(',')});
          } else {
            gaPermalink.deleteParam('catalognodes');
          }
        });

      }
    };

  });

})();
