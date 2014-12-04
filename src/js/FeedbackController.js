(function() {
  goog.provide('ga_feedback_controller');

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController',
      function($scope, $timeout, gaGlobalOptions) {
        $scope.options = {
          showExport: false,
          broadcastLayer: true,
          feedbackUrl: gaGlobalOptions.apiUrl + '/feedback'
        };
      });

})();
