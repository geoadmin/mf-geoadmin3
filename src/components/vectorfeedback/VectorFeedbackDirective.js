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
        submit: '=gaVectorFeedbackSubmit'
      },
      link: function(scope, element, attrs) {
        var registerSelectedLayerWatcher = function() {
          return scope.$watch('options.selectedLayer',
              function(newVal, oldVal) {
                if (newVal && oldVal && newVal.value !== oldVal.value) {
                  scope.options.activeColor = '';
                  var olLayers = gaMapUtils.getMapBackgroundLayersArray(
                      scope.map);
                  var glStyle = gaGLStyle.resetEdits();
                  gaMapUtils.applyGLStyleToOlLayers(
                      olLayers,
                      glStyle.style,
                      glStyle.sprite
                  );
                }
              });
        };

        var registerBackgroundLayerWatcher = function() {
          return scope.$watch('options.backgroundLayer', function(newVal) {
            var olLayer = gaMapUtils.getMapBackgroundLayer(scope.map);
            // Dropdown interaction
            if (olLayer && olLayer.bodId !== newVal.id) {
              gaBackground.setById(scope.map, newVal.id);
            }
          });
        };

        var registerShowLabelWatcher = function() {
          return scope.$watch('options.showLabel', function(newVal, oldVal) {
            if (newVal.value !== oldVal.value) {
              var glStyle;
              var olLayers = gaMapUtils.getMapBackgroundLayersArray(scope.map);
              if (olLayers) {
                if (newVal.value) {
                  glStyle = gaGLStyle.resetFilters();
                } else {
                  var bodId = scope.options.backgroundLayer.id;
                  var filters =
                    scope.options.layers[bodId].labelsFilters;
                  if (filters) {
                    glStyle = gaGLStyle.filter(filters);
                  }
                }
                if (glStyle && glStyle.style) {
                  gaMapUtils.applyGLStyleToOlLayers(
                      olLayers,
                      glStyle.style,
                      glStyle.sprite
                  );
                }
              }
            }
          });
        };

        var registerSelectColorChange = function() {
          return scope.$watch('options.color', function(newVal) {
            scope.applyColor(newVal);
          });
        };

        var listeners = [];

        var dereg = function() {
          while (listeners.length > 0) {
            var l = listeners.pop();
            l();
          }
        };

        var reg = function() {
          listeners.push(registerSelectedLayerWatcher());
          listeners.push(registerBackgroundLayerWatcher());
          listeners.push(registerShowLabelWatcher());
          if (scope.options.mobile) {
            listeners.push(registerSelectColorChange());
          }
        };

        // Syncronize both background selectors
        scope.$on('gaBgChange', function(evt, value) {
          var layer = scope.options.layers[value.id];
          if (layer) {
            dereg();
            // Sync the dropdown select
            scope.options.backgroundLayers.forEach(function(bg) {
              if (bg.id === value.id) {
                scope.options.backgroundLayer = bg;
              }
            });
            // Update the list of selectable layers according to the
            // current bg layer
            scope.options.selectedLayer = layer.selectableLayers[0];
            // Reset labels filters
            scope.options.showLabel = scope.options.showLabels[0];
            // Rest any color that was applied
            scope.options.activeColor = '';
            reg();
          }
        });

        // Change the color
        scope.applyColor = function(color) {
          scope.options.activeColor = color;
          var olLayers = gaMapUtils.getMapBackgroundLayersArray(scope.map);
          var edit = scope.options.selectedLayer.edit.slice();
          edit[2] = edit[2].replace('{color}', color);
          var glStyle = gaGLStyle.edit([edit]);
          gaMapUtils.applyGLStyleToOlLayers(
              olLayers,
              glStyle.style,
              glStyle.sprite
          );
        };
      }
    };
  });
})();
