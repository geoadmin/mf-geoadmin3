goog.provide('ga_catalogtree_directive');

goog.require('ga_catalogtree_service');
goog.require('ga_map_service');
goog.require('ga_permalink');
goog.require('ga_topic_service');
goog.require('ga_translation_service');
(function() {

  var module = angular.module('ga_catalogtree_directive', [
    'ga_catalogtree_service',
    'ga_map_service',
    'ga_permalink',
    'pascalprecht.translate',
    'ga_topic_service',
    'ga_translation_service'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogtree',
      function($http, $q, $translate, $rootScope, gaPermalink, gaMapUtils,
          gaCatalogtreeMapUtils, gaLayers, gaLayerFilters, gaTopic, gaLang) {

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

            // This function
            // - checks the currently active layers of the map
            //   and marks them selected in the catalog
            var handleTree = function(newTree, oldTree) {
              var i, layer, bodId,
                  layers = scope.layers,
                  leaves = {};

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
            };
            var lastUrlUsed, lastLangUsed;
            var canceller;
            var updateCatalogTree = function(topic, lang) {
              // If topics are not yet loaded, we do nothing
              if (!topic) {
                return;
              }
              var labelsOnly = false;
              var url = scope.options.catalogUrlTemplate
                  .replace('{Topic}', topic.id);
              // If the topic has not changed that means we need to update only
              // labels
              if (lastUrlUsed == url) {
                labelsOnly = true;
                // We forbid the send of 2 identical requests (needed for IE9);
                // See http://github.com/geoadmin/mf-geoadmin3/issues/2531/
                if (lastLangUsed == lang) {
                  return;
                }
              }
              if (canceller) {
                canceller.resolve();
              }
              canceller = $q.defer();
              lastUrlUsed = url;
              lastLangUsed = lang;
              $http.get(url, {
                timeout: canceller.promise,
                cache: true,
                params: {
                  'lang': lang
                }
              }).then(function(response) {
                var newTree = response.data.results.root;
                var oldTree = scope.root;
                scope.root = newTree;
                // Strategy to handle permalink on layers change:
                // - When first called (initial page load), we make
                //   sure that all categegories specified in the
                //   permalink are opened
                // - When not inital page load and it's not a language
                //   change (we assume topic change then), we
                //   remove/reset the permalink parameter
                if (!angular.isDefined(oldTree)) {
                  openCategoriesInPermalink(newTree);
                } else if (!labelsOnly) {
                  scope.openIds.length = 0;
                  gaPermalink.deleteParam('catalogNodes');
                }
                //update Tree
                if (labelsOnly) {
                  if (angular.isDefined(oldTree)) {
                    retainTreeState(newTree, oldTree);
                  }
                } else {
                  handleTree(newTree, oldTree);
                }
                $rootScope.$broadcast('gaCatalogChange');

              }, function(reason) {
                scope.root = undefined;
              });
            };

            scope.$on('gaTopicChange', function(evt, newTopic) {
              updateCatalogTree(newTopic, gaLang.get());
            });
            $rootScope.$on('$translateChangeEnd', function(evt, newLang) {
              updateCatalogTree(gaTopic.get(), newLang.language);
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

            // Initializer the component if possible
            updateCatalogTree(gaTopic.get(), gaLang.get());
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

