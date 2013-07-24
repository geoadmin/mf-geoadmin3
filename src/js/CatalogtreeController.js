(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      ['$scope', '$http', 'gaGlobalOptions', '$rootScope', 
            function($scope, $http, gaGlobalOptions, $rootScope) {
        
        var topicUrlBase = gaGlobalOptions.serviceUrl + '/rest/services/';
        
        $scope.$on('gaTopicChange', function(event, topic) {
          //FIXME: we shouldn't use this topicToUse...sync topics with service
          var topicToUse = topic.id;
          if (topicToUse == 'geoadmin') {
            topicToUse = 'inspire';
          }
          var http = $http.jsonp(topicUrlBase + topicToUse + '/CatalogServer?callback=JSON_CALLBACK', {
            params: {
              //FIXME: language should come from context!
              'lang': 'en'
            }
          });
          http.success(function(data, status, header, config) {
            $scope.tree = data.results.root;
          });
          http.error(function(data, status, headers, config) {
            $scope.tree = undefined;
          });
        });

      }]);

})();
