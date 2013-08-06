(function() {
  goog.provide('ga_search_controller');

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController',
      ['$scope', 'gaGlobalOptions',
        function($scope, gaGlobalOptions) {
         
         $scope.options = {
           currentTopicId: 'ech',
           serviceUrl: gaGlobalOptions.serviceUrl +  '/rest/services/' + 
              'ech/SearchServer?searchText=%QUERY',
           setCurrentTopic: function(topicId) {
            this.previousTopicId = this.currentTopicId;
            this.currentTopicId = topicId;
           }
         };

       }]);

})();
