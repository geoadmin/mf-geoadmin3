(function() {
  goog.provide('ga_search_controller');

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController',
      ['$scope', 'gaGlobalOptions',
        function($scope, gaGlobalOptions) {
          var topicPlaceHolder = '--DUMMYTOPIC--';
         
          $scope.options = {
            serviceUrl: gaGlobalOptions.serviceUrl +  '/rest/services/' + 
                        topicPlaceHolder + '/SearchServer?searchText=%QUERY',
            applyTopicToUrl: function (url, topic) {
              return url.replace(topicPlaceHolder, topic);
            }
            };
        }]);

})();
