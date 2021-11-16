goog.provide('ga_feedback_controller');
(function() {

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController', function($scope, gaGlobalOptions) {

    $scope.options = {
      useTemporaryLayer: true,
      broadcastLayer: true,
      noMoreFunctions: true,
      feedbackUrl: gaGlobalOptions.feedbackUrl + '/api/feedback'
    };
  });
})();
