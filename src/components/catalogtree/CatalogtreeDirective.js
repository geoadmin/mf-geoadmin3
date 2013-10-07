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

            // This function determines if the layers pre-selected in the
            // catalog tree should be added to the map.
            //
            // If the map already includes non-background layers then we do
            // not add the pre-selected layers to the map. In that case we
            // just visit the tree leaves and set "selectedOpen" as
            // appropriate.
            var handleTree = function(newTree, oldTree) {
              var i;
              var map = scope.map;
              var layers = scope.layers;

              var addDefaultLayersToMap = true;
              if (!angular.isDefined(oldTree)) {
                for (i = 0; i < layers.length; ++i) {
                  if (!layers[i].background) {
                    addDefaultLayersToMap = false;
                    break;
                  }
                }
              }

              if (addDefaultLayersToMap) {
                visitTreeLeaves(newTree, function(leaf) {
                  if (leaf.selectedOpen) {
                    gaCatalogtreeMapUtils.addLayer(map, leaf);
                  }
                });
              } else {
                var leaves = {};
                visitTreeLeaves(newTree, function(leaf) {
                  leaf.selectedOpen = false;
                  leaves[leaf.idBod] = leaf;
                });
                for (i = 0; i < layers.length; ++i) {
                  var layer = layers[i];
                  var bodId = layer.get('bodId');
                  if (!layer.background && leaves.hasOwnProperty(bodId)) {
                    leaves[bodId].selectedOpen = true;
                  }
                }
              }
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
              var layerBodIds;
              if (angular.isDefined(scope.root)) {
                layerBodIds = [];
                angular.forEach(layers, function(layer) {
                  var bodId = layer.get('bodId');
                  if (angular.isDefined(bodId)) {
                    layerBodIds.push(bodId);
                  }
                });
                updateSelectionInTree(scope.root, layerBodIds);
              }
            });
          }
        };

        function updateSelectionInTree(root, layerBodIds) {
          visitTreeLeaves(root, function(node) {
            node.selectedOpen = layerBodIds.indexOf(node.idBod) >= 0;
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

