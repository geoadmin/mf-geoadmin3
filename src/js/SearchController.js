(function() {
  goog.provide('ga_search_controller');

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController',
      function($scope, gaGlobalOptions) {
          var topicPlaceHolder = '--DUMMYTOPIC--';

          $scope.options = {
            searchUrl: gaGlobalOptions.apiUrl + '/rest/services/' +
                        topicPlaceHolder + '/SearchServer?',
            featureUrl: gaGlobalOptions.cachedApiUrl +
                        '/rest/services/{Topic}/MapServer/{Layer}/{Feature}',
            applyTopicToUrl: function (url, topic) {
              return url.replace(topicPlaceHolder, topic);
            }
          };
        });

})();
