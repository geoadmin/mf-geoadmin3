goog.provide('ga_vector_feedback_directive');

(function() {
  var module = angular.module('ga_vector_feedback_directive', []);

  module.directive('gaVectorFeedback', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/vectorfeedback/partials/vectorfeedback.html',
      scope: {
        map: '=gaVectorFeedbackMap',
        options: '=gaVectorFeedbackOptions',
        submit: '=gaVectorFeedbackSubmit',
        applyColor: '=gaVectorFeedbackApplycolor'
      },
      link: function(scope, element, attrs) {}
    };
  });
})();
