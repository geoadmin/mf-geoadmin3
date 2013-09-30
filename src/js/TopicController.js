(function() {
  goog.provide('ga_topic_controller');

  var module = angular.module('ga_topic_controller', []);

  module.controller('GaTopicController',
      function($scope, gaGlobalOptions) {
          $scope.options = {
            defaultTopicId: 'ech',
            url: gaGlobalOptions.baseUrlPath + '/rest/services'
          };
      });
})();
