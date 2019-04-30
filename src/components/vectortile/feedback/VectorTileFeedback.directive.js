goog.provide('ga_vector_tile_feedback_directive');

goog.require('ga_background_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_layers_service');
goog.require('ga_mvt_service');
goog.require('ga_translation_service');

(function() {
  var module = angular.module('ga_vector_tile_feedback_directive', [
    'ga_browsersniffer_service',
    'ga_background_service',
    'ga_translation_service',
    'ga_layers_service',
    'ga_mvt_service',
    'ga_vector_tile_layer_service'
  ]);

  module.directive('gaVectorTileFeedback', function(
      $rootScope,
      gaBackground,
      gaBrowserSniffer,
      gaLang,
      gaLayers,
      gaMvt,
      gaVectorTileLayerService
  ) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/vectortile/feedback/partials/' +
        'vectorfeedback.html',
      scope: {
        map: '=gaVectorTileFeedbackMap',
        options: '=gaVectorTileFeedbackOptions',
        toggle: '=gaVectorTileFeedbackToggle',
        ol3d: '=gaVectorTileFeedbackOl3d'
      },
      link: function(scope, element) {
        scope.olLayer = null;
        scope.msie = gaBrowserSniffer.msie;
        scope.styles = gaVectorTileLayerService.getStyles();

        element.find('#ga-feedback-vector-body').on('show.bs.collapse',
            function() {
              element.removeClass('in');
            })

        element.find('#ga-feedback-vector-body').on('hide.bs.collapse',
            function() {
              element.addClass('in');
            })

        var toggle = function(show) {
          // Do not open menu feedback panel if edit menu is active
          element.find('#ga-feedback-vector-body').collapse(
              show && scope.toggle ? 'show' : 'hide');
        }

        scope.$watch('toggle', toggle);

        scope.openAdvanceEdit = function() {
          toggle(false);
          var bg = gaBackground.get();
          if (bg && bg.id === gaVectorTileLayerService.getVectorLayerBodId()) {
            $rootScope.$broadcast('gaToggleEdit',
                gaVectorTileLayerService.getCurrentStyle(), true);
          }
        };

        scope.getSurveyUrl = function() {
          return scope.options.surveyUrl.replace('{lang}', gaLang.getNoRm());
        };

        scope.isVectorTileLayer = function() {
          var bg = gaBackground.get();
          return !!(bg && bg.olLayer && bg.olLayer.glStyle);
        };

        scope.applyVectorBackground = function() {
          if (!scope.isVectorTileLayer()) {
            gaBackground.setById(scope.map,
                gaVectorTileLayerService.getVectorLayerBodId());
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

        scope.currentStyleUrl = gaVectorTileLayerService.getCurrentStyleUrl();

        scope.applyNextStyle = function(style, idx) {
          gaVectorTileLayerService.switchToStyleAtIndex(idx);
          scope.currentStyleUrl = gaVectorTileLayerService.getCurrentStyleUrl();
        };
      }
    };
  });
})();
