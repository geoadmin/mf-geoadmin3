(function() {
  goog.provide('ga_catalogtree_directive');

  var module = angular.module('ga_catalogtree_directive', [
    'pascalprecht.translate'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogtree',
      ['$http', '$translate',
      function($http, $translate) {
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

            var updateCatalogTree = function(opt) {
              if (angular.isDefined(currentTopic)) {
                var url = scope.options.catalogUrlTemplate
                    .replace('{Topic}', currentTopic);
                $http.jsonp(url, {
                  params: {
                    'lang': $translate.uses(),
                    'callback': 'JSON_CALLBACK'
                  }
                }).success(function(data, status, header, config) {
                  if (opt.retainTreeState) {
                    retainTreeState(scope.root, data.results.root);
                  }
                  scope.root = data.results.root;
                }).error(function(data, status, headers, config) {
                  scope.root = undefined;
                });
              }
            };

            scope.$on('translationChangeSuccess', function() {
              updateCatalogTree({retainTreeState: true});
            });

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
              updateCatalogTree({retainTreeState: false});
           });

          }
        };
      }]
  );
})();

