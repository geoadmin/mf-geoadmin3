(function() {
  goog.provide('ga_catalogtree_directive');

  goog.require('ga_catalogtree_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_catalogtree_directive', [
    'ga_catalogtree_service',
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogtree',
      function($http, $translate, gaCatalogtreeMapUtils, gaLayers) {

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/catalogtree/partials/catalogtree.html',
          scope: {
            options: '=gaCatalogtreeOptions',
            map: '=gaCatalogtreeMap'
          },
          link: function(scope, element, attrs) {
            var currentTopicId;
            var handlingTree = false;
            scope.layers = scope.map.getLayers().getArray();

            // This assumes that both trees contain the same
            // elements, categories are in the same order and
            // contain the same layers, but layers can have
            // a different order (sorted by language)
            // FIXME being aware that layers can have different
            // order can change in the back-end (remove relevant code)
            var retainTreeState = function(newTree, oldTree) {
              var i, oldChild, newChild, oldMap = {}, newMap = {};
              newTree.selectedOpen = oldTree.selectedOpen;
              if (newTree.children) {
                for (i = 0; i < newTree.children.length; i++) {
                  oldChild = oldTree.children[i];
                  newChild = newTree.children[i];
                  // If no idBod, then it's a node (category)
                  if (!angular.isDefined(oldChild.idBod)) {
                    retainTreeState(newChild, oldChild);
                  } else {
                    oldMap[oldChild.idBod] = oldChild;
                    newMap[newChild.idBod] = newChild;
                  }
                }
                angular.forEach(oldMap, function(value, key) {
                  newMap[key].selectedOpen = value.selectedOpen;
                  newMap[key].errorLoading = value.errorLoading;
                });
              }
            };

            var handleTree = function(newTree, oldTree) {
              var i;
              var id;
              var map = scope.map;
              var layers = scope.layers;
              var leaves;

              handlingTree = true;

              var addDefaultLayersToMap = true;
              if (!angular.isDefined(oldTree)) {
                for (i = 0; i < layers.length; ++i) {
                  id = layers[i].get('id');
                  if (!gaLayers.getLayer(id) ||
                      !gaLayers.getLayerProperty(id, 'background')) {
                    addDefaultLayersToMap = false;
                    break;
                  }
                }
              }

              if (addDefaultLayersToMap) {
                visitTreeLeaves(newTree, function(leaf) {
                  if (leaf.selectedOpen && !angular.isDefined(
                      gaCatalogtreeMapUtils.getMapLayer(map, leaf.idBod))) {
                    gaCatalogtreeMapUtils.addLayer(map, leaf);
                  }
                });
              } else {
                leaves = {};
                visitTreeLeaves(newTree, function(leaf) {
                  leaf.selectedOpen = false;
                  leaves[leaf.idBod] = leaf;
                });
                for (i = 0; i < layers.length; ++i) {
                  id = layers[i].get('id');
                  if (leaves.hasOwnProperty(id)) {
                    leaves[id].selectedOpen = true;
                  }
                }
              }

              handlingTree = false;
            };

            var updateCatalogTree = function() {
              var url = scope.options.catalogUrlTemplate
                  .replace('{Topic}', currentTopicId);
              return $http.get(url, {
                params: {
                  'lang': $translate.uses()
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

            scope.$on('gaLayersChange', function(event, data) {
              currentTopicId = data.topicId;
              updateCatalogTree().then(function(trees) {
                var oldTree = trees.oldTree;
                var newTree = trees.newTree;
                if (data.labelsOnly) {
                  if (angular.isDefined(oldTree)) {
                    retainTreeState(newTree, oldTree);
                  }
                } else {
                  handleTree(newTree, oldTree);
                }
              });
            });

            scope.layerFilter = function(layer) {
              return !layer.background && !layer.preview;
            };

            scope.$watchCollection('layers | filter:layerFilter',
                function(layers) {
              var layerIds = [];
              if (!handlingTree && angular.isDefined(scope.root)) {
                angular.forEach(layers, function(layer) {
                  var id = layer.get('id');
                  if (angular.isDefined(id)) {
                    layerIds.push(id);
                  }
                });
                updateSelectionInTree(scope.root, layerIds);
              }
            });
          }
        };

        function updateSelectionInTree(root, layerIds) {
          visitTreeLeaves(root, function(node) {
            if (layerIds.indexOf(node.idBod) == -1) {
              node.selectedOpen = false;
            } else {
              node.selectedOpen = true;
            }
          });
        }

        function visitTreeLeaves(node, fn) {
          if (!angular.isDefined(node.children)) {
            // "node" is a leaf
            fn(node);
          } else {
            var i;
            var len = node.children.length;
            for (i = 0; i < len; ++i) {
              visitTreeLeaves(node.children[i], fn);
            }
          }
        }

      }
  );
})();

