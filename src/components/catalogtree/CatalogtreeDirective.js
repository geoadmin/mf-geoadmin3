(function() {
  goog.provide('ga_catalogtree_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_catalogtree_directive', [
    'pascalprecht.translate',
    'ga_map_service'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogtree',
      ['$http', '$translate', 'gaLayers',
      function($http, $translate, gaLayers) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/catalogtree/partials/catalogtree.html',
          scope: {
            options: '=gaCatalogtreeOptions',
            map: '=gaCatalogtreeMap'
          },
          link: function(scope, element, attrs) {
            var currentTopic,
                map = scope.map;

            // FIXME: Filter has to be in sync with layermanager filter
            // It's maybe a good idea to centralize this...
            var layerFilter = function(layer) {
              var id = layer.get('id');
              var isBackground = !!gaLayers.getLayer(id) &&
                  gaLayers.getLayerProperty(id, 'background');
              var isPreview = layer.preview;
              return !isBackground && !isPreview;
            };

            var removeExistingLayers = function() {
              var layers = map.getLayers().getArray();
              for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layerFilter(layer)) {
                  map.removeLayer(layer);
                  i -= 1;
                }
              }
            };

            var updateCatalogTree = function() {
              if (angular.isDefined(currentTopic)) {
                var url = scope.options.catalogUrlTemplate
                    .replace('{Topic}', currentTopic);
                $http.jsonp(url, {
                  params: {
                    'lang': $translate.uses(),
                    'callback': 'JSON_CALLBACK'
                  }
                }).success(function(data, status, header, config) {
                  scope.root = data.results.root;
                }).error(function(data, status, headers, config) {
                  scope.root = undefined;
                });
              }
            };

            scope.$on('translationChangeSuccess', function() {
              updateCatalogTree();
            });

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
              removeExistingLayers();
              updateCatalogTree();
           });

          }
        };
      }]
  );
})();

