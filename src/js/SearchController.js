(function() {
  goog.provide('ga_search_controller');

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController',
      function($scope, gaGlobalOptions) {
          var topicPlaceHolder = '--DUMMYTOPIC--';

          $scope.options = {
            searchUrl: gaGlobalOptions.mapUrl + '/rest/services/' +
                        topicPlaceHolder + '/SearchServer?',
            applyTopicToUrl: function (url, topic) {
              return url.replace(topicPlaceHolder, topic);
            }
          };
        });

})();
