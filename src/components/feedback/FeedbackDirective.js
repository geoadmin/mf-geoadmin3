(function() {
  goog.provide('ga_feedback_directive');

  var module = angular.module('ga_feedback_directive', []);

  module.directive('gaFeedback',
      [
        function() {
          return {
            restrict: 'A',
            replace: true,
            templateUrl: 'components/feedback/partials/feedback.html'
          };
        }]);

})();
