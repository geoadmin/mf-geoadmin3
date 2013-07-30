(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      ['$scope', '$http', '$translate', 'gaGlobalOptions', 
            function($scope, $http, $translate, gaGlobalOptions) {
        
        var topicUrlBase = gaGlobalOptions.serviceUrl + '/rest/services/',
            currentTopic;

        var updateCatalogTree = function () {
          if (angular.isDefined(currentTopic)) {
            var http = $http.jsonp(topicUrlBase + currentTopic + '/CatalogServer?callback=JSON_CALLBACK', {
              params: {
                'lang': $translate.uses()
              }
            }).success(function(data, status, header, config) {
              $scope.tree = data.results.root;
            }).error(function(data, status, headers, config) {
              $scope.tree = undefined;
            });
          }
        };

        $scope.$on('translationChangeSuccess', function () {
          updateCatalogTree();
        });
        
        $scope.$on('gaTopicChange', function(event, topic) {
          currentTopic = topic.id;
          updateCatalogTree();
       });

      }]);

})();
