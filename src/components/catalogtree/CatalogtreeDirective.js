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
            // elements, categories are in the same order and
            // contain the same layers, but layers can have
            // a different order (sorted by language)
            // FIXME being aware that layers can have different
            // order can change in the back-end (remove relevant code)
            var retainTreeState = function(oldAndNewTrees) {
              var oldTree = oldAndNewTrees.oldTree;
              var newTree = oldAndNewTrees.newTree;
              var i, oldChild, newChild, oldMap = {}, newMap = {};
              newTree.selectedOpen = oldTree.selectedOpen;
              if (newTree.children) {
                for (i = 0; i < newTree.children.length; i++) {
                  oldChild = oldTree.children[i];
                  newChild = newTree.children[i];
                  // If no idBod, then it's a node (category)
                  if (!angular.isDefined(oldChild.idBod)) {
                    retainTreeState({
                      oldTree: oldChild,
                      newTree: newChild
                    });
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

      }
  );
})();

