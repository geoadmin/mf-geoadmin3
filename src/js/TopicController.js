goog.provide('ga_topic_controller');
(function() {

  var module = angular.module('ga_topic_controller', []);

  module.controller('GaTopicController',
      function($scope, gaGlobalOptions) {
          $scope.options = {
            defaultTopicId: gaGlobalOptions.defaultTopicId,
            url: gaGlobalOptions.cachedApiUrl + '/rest/services'
          };
      });
})();
