goog.provide('ga_vector_feedback_directive');

goog.require('ga_background_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_layers_service');
goog.require('ga_mvt_service');
goog.require('ga_translation_service');

(function() {
  var module = angular.module('ga_vector_feedback_directive', [
    'ga_browsersniffer_service',
    'ga_background_service',
    'ga_translation_service',
    'ga_layers_service',
    'ga_mvt_service'
  ]);

  module.directive('gaVectorFeedback', function(
      $rootScope,
      gaBackground,
      gaBrowserSniffer,
      gaLang,
      gaLayers,
      gaMvt
  ) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/vectorfeedback/partials/vectorfeedback.html',
      scope: {
        map: '=gaVectorFeedbackMap',
        options: '=gaVectorFeedbackOptions',
        toggle: '=gaVectorFeedbackToggle'
      },
      link: function(scope, element) {
        var styleIdx;
        scope.olLayer = null;
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

        scope.applyVectorBackground = function() {
          var bg = gaBackground.get();
          if (bg && !bg.olLayer.glStyle) {
            gaBackground.setById(scope.map,
                'ch.swisstopo.leichte-basiskarte.vt');
          }
        };

        scope.$on('gaBgChange', function(evt, bg) {
          if (bg.disableEdit) {
            scope.olLayer = null;
            toggle(false);
          } else {
            toggle(true);
            scope.olLayer = bg.olLayer;
          }
        });

        scope.$watch('olLayer', function(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            scope.styles = gaLayers.getLayerProperty(scope.olLayer.id,
                'styles');
            styleIdx = scope.styles.findIndex(function(style) {
              return style.url === scope.olLayer.externalStyleUrl;
            });
            if (styleIdx === -1) {
              styleIdx = 0;
            }
          }
        });

        scope.applyNextStyle = function() {
          if (isNaN(styleIdx) || styleIdx === -1 ||
              styleIdx >= scope.styles.length - 1) {
            styleIdx = 0;
          } else {
            styleIdx++;
          }
          scope.olLayer.externalStyleUrl = (!styleIdx) ? undefined :
            scope.styles[styleIdx].url;
          gaMvt.reload(scope.olLayer);
        };
      }
    };
  });
})();
