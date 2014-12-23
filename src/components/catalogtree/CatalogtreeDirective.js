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
      function($http, $q, $translate, $rootScope, gaPermalink, gaMapUtils,
          gaCatalogtreeMapUtils, gaLayers, gaLayerFilters) {

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
                  // If no layerBodId, then it's a node (category)
                  if (!angular.isDefined(oldChild.layerBodId)) {
                    retainTreeState(newChild, oldChild);
                  } else {
                    oldMap[oldChild.layerBodId] = oldChild;
                    newMap[newChild.layerBodId] = newChild;
                  }
                }
                angular.forEach(oldMap, function(value, key) {
                  newMap[key].selectedOpen = value.selectedOpen;
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
            var assurePreselectedLayersLoaded = function(oldTree) {
              var i, olLayer, mapLayer, selectedLayers,
                  addDefaultLayersToMap = true,
                  map = scope.map,
                  layers = scope.layers;
              if (!angular.isDefined(oldTree)) {
                for (i = 0; i < layers.length; i++) {
                  if (!layers[i].background) {
                    addDefaultLayersToMap = false;
                  }
                }
              }
              if (addDefaultLayersToMap) {
                selectedLayers = gaLayers.getSelectedLayers();
                //Add in reverse order
                for (i = selectedLayers.length - 1; i >= 0; i--) {
                  olLayer = gaLayers.getOlLayerById(selectedLayers[i]);
                  if (angular.isDefined(olLayer)) {
                    //If it's already in the map, remove it and
                    //add it to assure it's on top.
                    mapLayer = gaMapUtils.getMapOverlayForBodId(map,
                        selectedLayers[i]);
                    if (angular.isDefined(mapLayer)) {
                      map.removeLayer(mapLayer);
                    }
                    map.addLayer(olLayer);
                  }
                }
              }
              return addDefaultLayersToMap;
            };

            // This function
            // - assures the preselected layers are loaded
            // - checks the currently active layers of the map
            //   and marks them selected in the catalog
            var handleTree = function(newTree, oldTree) {
              var i, layer, bodId,
                  layers = scope.layers,
                  leaves = {};

              if (!assurePreselectedLayersLoaded(oldTree)) {
                visitTree(newTree, function(leaf) {
                  leaf.selectedOpen = false;
                  leaves[leaf.layerBodId] = leaf;
                }, angular.noop);
                for (i = 0; i < layers.length; ++i) {
                  layer = layers[i];
                  bodId = layer.bodId;
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
                  'lang': $translate.use()
                }
              }).then(function(response) {
                var newTree = response.data.results.root;
                var oldTree = scope.root;
                scope.root = newTree;
                return {oldTree: oldTree, newTree: newTree};
              }, function(reason) {
                scope.root = undefined;
                return $q.reject(reason);
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
                $rootScope.$broadcast('gaCatalogChange');
              });
            });

            scope.layerFilter = gaLayerFilters.selected;

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

            scope.$on('gaTimeSelectorChange', function(event, newYear) {
              scope.options.currentYear = newYear;
            });
          }
        };

        function updateSelectionInTree(root, layerBodIds) {
          visitTree(root, function(node) {
            node.selectedOpen = layerBodIds.indexOf(node.layerBodId) >= 0;
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

