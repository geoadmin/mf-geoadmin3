goog.provide('ga_vector_feedback_directive');

goog.require('ga_background_service');
goog.require('ga_gl_style_service');
goog.require('ga_maputils_service');

(function() {
  var module = angular.module('ga_vector_feedback_directive', [
    'ga_background_service',
    'ga_gl_style_service',
    'ga_maputils_service'
  ]);

  module.directive('gaVectorFeedback', function(
      gaMapUtils,
      gaGLStyle,
      gaBackground
  ) {
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
        // Change background
        scope.$watch('options.backgroundLayer', function(newVal) {
          var olLayer = gaMapUtils.getMapBackgroundLayer(scope.map);
          // Dropdown interaction
          if (olLayer && olLayer.bodId !== newVal.id) {
            gaBackground.setById(scope.map, newVal.id);
          }
        });
        scope.$on('gaBgChange', function(evt, value) {
          var layer = scope.options.layers[value.id];
          if (layer) {
            // Sync the dropdown select
            scope.options.backgroundLayers.forEach(function(bg) {
              if (bg.id === value.id) {
                scope.options.backgroundLayer = bg;
              }
            });
            // Update the list of selectable layers according to the
            // current bg layer
            scope.options.selectedLayer = layer.selectableLayers[0];
          }
        });
        // Hide/Show labels
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
