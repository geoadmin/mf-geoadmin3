(function() {
  goog.provide('ga_catalogtree_directive');

  var module = angular.module('ga_catalogtree_directive', [
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
            var currentTopic,
                updateCatalogTree = function() {
              if (angular.isDefined(currentTopic)) {
                $http.jsonp(scope.options.getUrlForTopic(currentTopic), {
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


          }
        };
      }]
  );
})();

