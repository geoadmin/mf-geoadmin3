(function() {
  goog.provide('ga_catalogtree_directive');

  goog.require('ga_catalogtree_service');
  goog.require('ga_map_service');
  goog.require('ga_permalink');

  var module = angular.module('ga_catalogtree_directive', [
    'ga_catalogtree_service',
    'ga_map_service',
    'ga_permalink',
    'pascalprecht.translate'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogtree',
      function($http, $translate, gaPermalink, gaCatalogtreeMapUtils,
          gaLayers, gaLayerFilters) {

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/catalogtree/partials/catalogtree.html',
          scope: {
            options: '=gaCatalogtreeOptions',
            map: '=gaCatalogtreeMap'
          },
          controller: function($scope) {
            this.updatePermalink = function(id, selected) {
              var openIds = $scope.openIds;
              var index = openIds.indexOf(id);
              if (selected === true) {
                if (index < 0) {
                  openIds.push(id);
                }
              } else {
                if (index >= 0) {
                  openIds.splice(index, 1);
                }
              }
              if (openIds.length > 0) {
                gaPermalink.updateParams({catalogNodes: openIds.join(',')});
              } else {
                gaPermalink.deleteParam('catalogNodes');
              }
            };
          },
          link: function(scope, element, attrs) {
            var currentTopicId;
            scope.openIds = [];
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
                visitTree(newTree, function(leaf) {
                  if (leaf.selectedOpen) {
                    gaCatalogtreeMapUtils.addLayer(map, leaf);
                  }
                }, angular.noop);
              } else {
                var leaves = {};
                visitTree(newTree, function(leaf) {
                  leaf.selectedOpen = false;
                  leaves[leaf.idBod] = leaf;
                }, angular.noop);
                for (i = 0; i < layers.length; ++i) {
                  var layer = layers[i];
                  var bodId = layer.bodId;
                  if (!layer.background && leaves.hasOwnProperty(bodId)) {
                    leaves[bodId].selectedOpen = true;
                  }
                }
              }
            };

            // FIXME temporary only for testing! Not to land in master
            var assureTestLayersLoaded = function(tree) {
              var i;
              if (tree.idBod == 'ch.bafu.bundesinventare-jagdbanngebiete' ||
                  tree.idBod == 'ch.bafu.bundesinventare-bln' ||
                  tree.category == 'category_200' ||
                  tree.category == 'category_260' ||
                  tree.category == 'category_262' ||
                  tree.category == 'root') {
                tree.selectedOpen = true;
                if (tree.children) {
                  for (i = 0; i < tree.children.length; i++) {
                    assureTestLayersLoaded(tree.children[i]);
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
                // FIXME temporary only for testing. not to land in master!
                assureTestLayersLoaded(newTree);
                // End of temporary fix
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
                // Strategy to handle permalink on layers change:
                // - When first called (initial page load), we make
                //   sure that all categegories specified in the
                //   permalink are opened
                // - When not inital page load and it's not a language
                //   change (we assume topic change then), we
                //   remove/reset the permalink parameter
                if (!angular.isDefined(oldTree)) {
                  openCategoriesInPermalink(newTree);
                } else if (!data.labelsOnly) {
                  scope.openIds.length = 0;
                  gaPermalink.deleteParam('catalogNodes');
                }
                //update Tree
                if (data.labelsOnly) {
                  if (angular.isDefined(oldTree)) {
                    retainTreeState(newTree, oldTree);
                  }
                } else {
                  handleTree(newTree, oldTree);
                }
              });
            });

            scope.layerFilter = gaLayerFilters.selectedLayersFilter;

            scope.$watchCollection('layers | filter:layerFilter',
                function(layers) {
              var layerBodIds;
              if (angular.isDefined(scope.root)) {
                layerBodIds = [];
                angular.forEach(layers, function(layer) {
                  var bodId = layer.bodId;
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
          visitTree(root, function(node) {
            node.selectedOpen = layerBodIds.indexOf(node.idBod) >= 0;
          }, angular.noop);
        }

        function visitTree(node, leafFn, categoryFn) {
          var i, len;
          if (!angular.isDefined(node.children)) {
            // "node" is a leaf
            leafFn(node);
          } else {
            categoryFn(node);
            len = node.children.length;
            for (i = 0; i < len; ++i) {
              visitTree(node.children[i], leafFn, categoryFn);
            }
          }
        }

        function openCategoriesInPermalink(tree) {
          var ids = [];
          var params = gaPermalink.getParams();
          if (params.catalogNodes) {
            ids = $.map(params.catalogNodes.split(','), function(value) {
              return parseInt(value, 10);
            });
          }
          if (ids.length > 0) {
            visitTree(tree, angular.noop, function(ctg) {
              ctg.selectedOpen = (ids.indexOf(ctg.id) >= 0);
            });
          }
        }
      }
  );
})();

