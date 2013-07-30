(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      ['$scope', '$http', 'gaGlobalOptions', 
            function($scope, $http, gaGlobalOptions) {
        
        var topicUrlBase = gaGlobalOptions.serviceUrl + '/rest/services/';
        
        $scope.$on('gaTopicChange', function(event, topic) {
          //FIXME: we shouldn't use this topicToUse...sync topics with service
          var http = $http.jsonp(topicUrlBase + topic.id + '/CatalogServer?callback=JSON_CALLBACK', {
            params: {
              //FIXME: language should come from context!
              'lang': 'en'
            }
          }).success(function(data, status, header, config) {
            $scope.tree = data.results.root;
          }).error(function(data, status, headers, config) {
            $scope.tree = undefined;
          });
        });

      }]);

})();
