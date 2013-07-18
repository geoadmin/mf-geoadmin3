(function() {
  goog.provide('ga_feedback_controller');

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController',
      ['$scope', function($scope) {
        $scope.$on('gaFeedbackSuccess', function(event, response) {
          angular.element(
              document.getElementById('feedback')).modal('hide');
          angular.element(
              document.getElementById('feedback-success')).modal('show');
        });

        $scope.$on('gaFeedbackError', function(event, response) {
          angular.element(
              document.getElementById('feedback')).modal('hide');
          angular.element(
              document.getElementById('feedback-error')).modal('show');
        });

      }]);

})();
