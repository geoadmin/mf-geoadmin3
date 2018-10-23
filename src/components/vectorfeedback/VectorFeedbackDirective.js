goog.provide('ga_vector_feedback_directive');

goog.require('ga_gl_style_service');
goog.require('ga_maputils_service');

(function() {
  var module = angular.module('ga_vector_feedback_directive', [
    'ga_gl_style_service',
    'ga_maputils_service'
  ]);

  module.directive('gaVectorFeedback', function(gaMapUtils, gaGLStyle) {
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
      link: function(scope, element, attrs) {
        scope.$watch('options.showLabel', function(newVal) {
          var layers, glStyle;
          var olLayer = gaMapUtils.getMapBackgroundLayer(scope.map);
          if (olLayer instanceof ol.layer.Group) {
            layers = olLayer.getLayers().getArray();
          } else {
            layers = [olLayer];
          }
          if (olLayer) {
            if (newVal.value) {
              glStyle = gaGLStyle.reset();
            } else {
              var filters = scope.options.layers[olLayer.id].labelsFilters;
              if (filters) {
                glStyle = gaGLStyle.filter(filters);
              }
            }
            if (glStyle) {
              for (var i = 0; i < layers.length; i++) {
                if (layers[i].sourceId) {
                  gaMapUtils.applyGLStyleToOlLayer(
                    layers[i],
                    glStyle.style,
                    glStyle.sprite
                  );
                }
              }
            }
          }
        });
      }
    };
  });
})();
