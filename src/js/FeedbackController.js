(function() {
  goog.provide('ga_feedback_controller');

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController',
      ['$scope', function($scope) {
        $scope.$on('gaFeedbackSuccess', function(event, response) {
          angular.element(
              document.getElementById('feedback')).modal('hide');
        });

        $scope.$on('gaFeedbackError', function(event, response) {
          angular.element(
              document.getElementById('feedback')).modal('hide');
        });

      }]);

})();
