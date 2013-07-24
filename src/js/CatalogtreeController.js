(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      ['$scope', '$http', 'gaGlobalOptions', '$rootScope', 
            function($scope, $http, gaGlobalOptions, $rootScope) {
        
        var topicUrlBase = gaGlobalOptions.serviceUrl + '/rest/services/';
        
        $scope.$on('gaTopicChange', function(event, topic) {
          $scope.topic = topic;
          //FIXME: we shouldn't use this topicToUse...sync topics with service
          var topicToUse = topic;
          if (topic == 'geoadmin') {
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
            //FIXME: what do we do on error?
          });
        });

        //FIXME: this is temporary only! Emulate topic change...
        //Remove $rootScope when removing this
        $scope.switchCatalog = function() {
          if ($scope.topic == 'geoadmin') {
            $rootScope.$broadcast('gaTopicChange', 'ech');
          } else {
            $rootScope.$broadcast('gaTopicChange', 'geoadmin');
          }
        };
        //FIXME: initialisation, to make sure we have something on startup
        //once in master, this will be done by topicChooser Service
        $rootScope.$broadcast('gaTopicChange', 'geoadmin');

      }]);

})();
