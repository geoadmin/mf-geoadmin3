goog.provide('ga_vector_feedback_directive');

goog.require('ga_background_service');
goog.require('ga_glstyle_service');
goog.require('ga_maputils_service');

(function() {
  var module = angular.module('ga_vector_feedback_directive', [
    'ga_background_service',
    'ga_glstyle_service',
    'ga_maputils_service'
  ]);

  module.directive('gaVectorFeedback', function(
      gaMapUtils,
      gaGlStyle,
      gaBackground
  ) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/vectorfeedback/partials/vectorfeedback.html',
      scope: {
        map: '=gaVectorFeedbackMap',
        options: '=gaVectorFeedbackOptions'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;
        var mobile = scope.options.mobile;

        // Change the color
        var applyColor = function(color) {
          if (!mobile) {
            scope.options.activeColor = color;
          }
          var edit = scope.options.selectedLayer.edit;
          if (edit) {
            edit = edit.slice();
            edit[2] = edit[2].replace('{color}', color);
            var glStyle = gaGlStyle.edit([edit]);
            gaMapUtils.applyGlStyleToOlLayer(
                gaMapUtils.getMapBackgroundLayer(map),
                glStyle
            );
          }
        };

        var registerSelectedLayerWatcher = function() {
          return scope.$watch('options.selectedLayer',
              function(newVal, oldVal) {
                if (newVal && oldVal && newVal.value !== oldVal.value) {
                  scope.options.activeColor = '';
                  var glStyle = gaGlStyle.resetEdits();
                  gaMapUtils.applyGlStyleToOlLayer(
                      gaMapUtils.getMapBackgroundLayer(map),
                      glStyle
                  );
                }
              });
        };

        var registerBackgroundLayerWatcher = function() {
          return scope.$watch('options.backgroundLayer', function(newVal) {
            var olLayer = gaMapUtils.getMapBackgroundLayer(map);
            // Dropdown interaction
            if (olLayer && olLayer.bodId !== newVal.id) {
              gaBackground.setById(map, newVal.id);
            }
          });
        };

        var registerShowLabelWatcher = function() {
          return scope.$watch('options.showLabel', function(newVal, oldVal) {
            if (newVal && oldVal && newVal.value !== oldVal.value) {
              var glStyle;
              if (newVal.value) {
                glStyle = gaGlStyle.resetFilters();
              } else {
                var bodId = scope.options.backgroundLayer.id;
                var filters =
                  scope.options.layers[bodId].labelsFilters;
                if (filters) {
                  glStyle = gaGlStyle.filter(filters);
                }
              }
              gaMapUtils.applyGlStyleToOlLayer(
                  gaMapUtils.getMapBackgroundLayer(map),
                  glStyle
              );
            }
          });
        };

        var registerSelectColorChange = function() {
          return scope.$watch('options.activeColor', function(newVal) {
            if (newVal && newVal.value) {
              applyColor(newVal.value);
            }
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
          if (mobile) {
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
            // Reset any color that was applied
            scope.options.activeColor = null;
            reg();
          }
        });

        if (!mobile) {
          scope.applyColor = applyColor;
        }
      }
    };
  });
})();
