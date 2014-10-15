(function() {
  goog.provide('ga_search_controller');
  
  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_search_controller', [
    'ga_browsersniffer_service'
  ]);

  module.controller('GaSearchController',
      function($scope, gaBrowserSniffer, gaGlobalOptions) {
        var topicPlaceHolder = '--DUMMYTOPIC--';
        $scope.options = {
          searchUrl: gaGlobalOptions.apiUrl + '/rest/services/' +
              topicPlaceHolder + '/SearchServer?',
          featureUrl: gaGlobalOptions.cachedApiUrl +
              '/rest/services/{Topic}/MapServer/{Layer}/{Feature}',
          applyTopicToUrl: function (url, topic) {
            return url.replace(topicPlaceHolder, topic);
          },
          featuresMinLength: (gaBrowserSniffer.mobile) ? 2 : 1,
          locationsMinLength: (gaBrowserSniffer.mobile) ? 2 : 1,
          layersMinLength: (gaBrowserSniffer.mobile) ? 2 : 1,
          rateLimitWait: (gaBrowserSniffer.mobile) ? 500 : 300,
          renderWait: (gaBrowserSniffer.mobile) ? 500 : 0
        };
      });
})();

