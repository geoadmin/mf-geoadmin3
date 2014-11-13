(function() {
  goog.provide('ga_feedback_controller');

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController',
      function($scope, $timeout, gaGlobalOptions) {
        $scope.options = {
          feedbackUrl: gaGlobalOptions.apiUrl + '/feedback',
          activateDrawingDialog: function() {
            if ($scope.globals.isDrawActive) {
              //As a triggered click on the drawing
              //popup triggers a digest cycle, we can't
              //call it directly or with evalAsync because
              //we are in a digest cycle already. Timeout
              //to the rescue.
              $timeout(function() {
                $('#draw-popup h4').click();
              }, 0, false);
            } else {
              $scope.globals.isDrawActive = true;
            }
          }
        };
      });

})();
