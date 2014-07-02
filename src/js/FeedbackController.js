(function() {
  goog.provide('ga_feedback_controller');

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController',
      function($scope, gaGlobalOptions) {
        $scope.options = {
          feedbackUrl: gaGlobalOptions.apiUrl + '/feedback'
        };

        // Feedback success and error modals are hidden by default.
        $scope.feedbackSuccessModalShown = false;
        $scope.feedbackErrorModalShown = false;

        // Hide/show success and error modals when feedback response received.
        $scope.$watch('response', function(newVal, oldVal) {
          if (newVal) {
            var success = $scope.response == 'success';
            $scope.feedbackSuccessModalShown = success;
            $scope.feedbackErrorModalShown = !success;
            $scope.feedbackModalShown = false;
          }
        });

        // We need to reset "response" to undefined when the modals are closed
        // by the user. This is to be notified again when the "response" state
        // changes again.
        $scope.$watch('feedbackSuccessModalShown', function(newVal, oldVal) {
          $scope.response = undefined;
        });
        $scope.$watch('feedbackErrorModalShown', function(newVal, oldVal) {
          $scope.response = undefined;
        });

      });

})();
