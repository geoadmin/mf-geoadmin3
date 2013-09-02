(function() {
  goog.provide('ga_catalogtree_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_catalogtree_directive', [
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogtree',
      ['$http', '$translate', 'gaLayers',
      function($http, $translate, gaLayers) {

        var deselectInTree = function(node, id) {
          if (angular.isDefined(node.idBod) &&
              node.idBod === id) {
            node.selectedOpen = false;
          }
          if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
              deselectInTree(node.children[i], id);
            }
          }
        };


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
                layerFilter = gaLayers.getLayerFilterFunction(),
                updateCatalogTree = function() {
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
              updateCatalogTree();
           });

            scope.map.getLayers().on('remove', function(evt) {
              var layer = evt.elem;
              if (layerFilter(layer)) {
                deselectInTree(scope.root, layer.get('id'));
              }
            });

          }
        };
      }]
  );
})();

