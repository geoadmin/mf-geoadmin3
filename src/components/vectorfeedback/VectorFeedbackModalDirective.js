goog.provide('ga_vector_feedback_modal_directive');

goog.require('ga_translation_service');

(function() {
  var module = angular.module('ga_vector_feedback_modal_directive', [
      'ga_translation_service'
  ]);

  module.directive('gaVectorFeedbackModal', function($rootScope, gaLang) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/vectorfeedback/partials' +
          '/vectorfeedbackmodal.html',
      scope: {},
      link: function(scope) {
        scope.lang = gaLang.getNoRm();
        $rootScope.$on('$translateChangeEnd', function() {
          scope.lang = gaLang.getNoRm();
        });
      }
    };
  });
})();
