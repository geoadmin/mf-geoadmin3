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

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/catalogtree/partials/catalogtree.html',
          scope: {
            options: '=gaCatalogtreeOptions',
            map: '=gaCatalogtreeMap'
          },
          link: function(scope, element, attrs) {
            var currentTopic;

            // This assumes that both trees contain the same
            // elements, but with different values
            var retainTreeState = function(oldTree, newTree) {
              newTree.selectedOpen = oldTree.selectedOpen;
              if (newTree.children) {
                for (var i = 0; i < newTree.children.length; i++) {
                  retainTreeState(oldTree.children[i], newTree.children[i]);
                }
              }
            };

            var updateCatalogTree = function(retainState) {
              if (angular.isDefined(currentTopic)) {
                var url = scope.options.catalogUrlTemplate
                    .replace('{Topic}', currentTopic);
                $http.jsonp(url, {
                  params: {
                    'lang': $translate.uses(),
                    'callback': 'JSON_CALLBACK'
                  }
                }).success(function(data, status, header, config) {
                  if (retainState) {
                    retainTreeState(scope.root, data.results.root);
                  }
                  scope.root = data.results.root;
                }).error(function(data, status, headers, config) {
                  scope.root = undefined;
                });
              }
            };

            scope.$on('translationChangeSuccess', function() {
              updateCatalogTree(true);
            });

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
              updateCatalogTree(false);
           });

            scope.map.getLayers().on('remove', function(evt) {
              var layer = evt.getElement();
              if (layerFilter(layer)) {
                deselectInTree(scope.root, layer.get('id'));
              }
            });
          }
        };

        function layerFilter(layer) {
          var id = layer.get('id');
          var isBackground = !!gaLayers.getLayer(id) &&
              gaLayers.getLayerProperty(id, 'background');
          var isPreview = layer.preview;
          return !isBackground && !isPreview;
        }

        function deselectInTree(node, id) {
          if (node.idBod == id) {
            node.selectedOpen = false;
          } else if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
              deselectInTree(node.children[i], id);
            }
          }
        }

      }]
  );
})();

