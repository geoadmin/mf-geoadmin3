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
            var retainTreeState = function(oldAndNewTrees) {
              var oldTree = oldAndNewTrees.oldTree;
              var newTree = oldAndNewTrees.newTree;
              var i;
              newTree.selectedOpen = oldTree.selectedOpen;
              if (newTree.children) {
                for (i = 0; i < newTree.children.length; i++) {
                  retainTreeState({
                    oldTree: oldTree.children[i],
                    newTree: newTree.children[i]
                  });
                }
              }
            };

            var updateCatalogTree = function() {
              var url = scope.options.catalogUrlTemplate
                  .replace('{Topic}', currentTopic);
              return $http.jsonp(url, {
                params: {
                  'lang': $translate.uses(),
                  'callback': 'JSON_CALLBACK'
                }
              }).then(function success(response) {
                var newTree = response.data.results.root;
                var oldTree = scope.root;
                scope.root = newTree;
                return {oldTree: oldTree, newTree: newTree};
              }, function error(response) {
                scope.root = undefined;
              });
            };

            scope.$on('translationChangeSuccess', function() {
              if (angular.isDefined(currentTopic)) {
                updateCatalogTree().then(retainTreeState);
              }
            });

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
              updateCatalogTree();
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
          // Note: This filter likely will be changed once
          // we address #342 as this will impact how we
          // determine backgound layers
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

