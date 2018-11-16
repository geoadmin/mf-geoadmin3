goog.provide('ga_vector_feedback_directive');

goog.require('ga_background_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_translation_service');

(function() {
  var module = angular.module('ga_vector_feedback_directive', [
    'ga_browsersniffer_service',
    'ga_background_service',
    'ga_translation_service'
  ]);

  module.directive('gaVectorFeedback', function(
      $rootScope,
      gaBackground,
      gaBrowserSniffer,
      gaLang
  ) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/vectorfeedback/partials/vectorfeedback.html',
      scope: {
        options: '=gaVectorFeedbackOptions',
        toggle: '=gaVectorFeedbackToggle'
      },
      link: function(scope, element) {
        scope.msie = gaBrowserSniffer.msie;

        element.find('#ga-feedback-vector-body').on('show.bs.collapse',
            function() {
              element.removeClass('in');
            })

        element.find('#ga-feedback-vector-body').on('hide.bs.collapse',
            function() {
              element.addClass('in');
            })

        var toggle = function(show) {
          element.find('#ga-feedback-vector-body').collapse(
              show ? 'show' : 'hide');
        }

        scope.$watch('toggle', toggle);

        scope.openAdvanceEdit = function() {
          toggle(false);
          var bg = gaBackground.get();
          if (bg && bg.olLayer) {
            $rootScope.$broadcast(
              'gaToggleEdit', bg.olLayer, true);
          }
        };

        scope.getSurveyUrl = function() {
          return scope.options.surveyUrl.replace('{lang}', gaLang.getNoRm());
        };

        scope.$on('gaBgChange', function(evt, bg) {
          if (bg.disableEdit) {
            toggle(false);
          }
        });
      }
    };
  });
})();
