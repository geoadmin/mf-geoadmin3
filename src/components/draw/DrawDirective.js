(function() {
  goog.provide('ga_draw_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_draw_directive', [
    'pascalprecht.translate'
  ]);

  module.directive('gaDraw',
    function($rootScope, gaDefinePropertiesForLayer, $translate, $timeout) {
      return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
          return 'components/draw/partials/draw.html';
        },
        scope: {
          map: '=gaDrawMap',
          options: '=gaDrawOptions',
          isActive: '=gaDrawActive'
        },
        link: function(scope, elt, attrs, controller) {
          var draw, modify, select, deregister, sketchFeature, lastActiveTool;
          var map = scope.map;
          var source = new ol.source.Vector();
          var layer = new ol.layer.Vector({
            label: 'draw',
            source: source,
            visible: true,
            style: scope.options.styleFunction
          });
          gaDefinePropertiesForLayer(layer);
          layer.preview = true;

          // Focus on the first input.
          var setFocus = function() {
            $timeout(function() {
              $(elt).find('input, select')[0].focus();
            });
          };

          // Activate the component: active a tool if one was active when draw
          // has been deactivated.
          var activate = function() {
            if (lastActiveTool) {
              activateTool(lastActiveTool);
            }
          };

          // Deactivate the component: remove layer and interactions.
          var deactivate = function() {

            // Deactivate the tool
            if (lastActiveTool) {
              scope.options[lastActiveTool.activeKey] = false;
            }

            // Remove interactions
            deactivateDrawInteraction();
            deactivateSelectInteraction();
            deactivateModifyInteraction();
          };


          // Deactivate other tools
          var activateTool = function(tool) {
            layer.visible = true;

            if (map.getLayers().getArray().indexOf(layer) == -1) {
              map.addLayer(layer);
            }

            var tools = scope.options.tools;
            for (var i = 0, ii = tools.length; i < ii; i++) {
              scope.options[tools[i].activeKey] = (tools[i].id == tool.id);
            }

            if (tool.id == 'delete') {
             return;
            }

            scope.options.instructions = tool.instructions;
            lastActiveTool = tool;
            setFocus();
          };

          // Set the draw interaction with the good geometry
          var activateDrawInteraction = function(type) {
            deactivateDrawInteraction();
            deactivateSelectInteraction();
            deactivateModifyInteraction();

            draw = new ol.interaction.Draw({
              type: type,
              source: source,
              style: scope.options.drawStyleFunction
            });

            deregister = [
              draw.on('drawstart', function(evt) {
                sketchFeature = evt.feature;
              }),
              draw.on('drawend', function(evt) {
                // Set the definitve style of the feature
                var style = layer.getStyleFunction()(sketchFeature);
                sketchFeature.setStyle(style);
              })
            ];

            if (scope.isActive) {
              map.addInteraction(draw);
            }
          };

          var deactivateDrawInteraction = function() {

            // Remove events
            if (deregister) {
              for (var i = deregister.length - 1; i >= 0; i--) {
                deregister[i].src.unByKey(deregister[i]);
              }
              deregister = null;
            }

            draw = deactivateInteraction(draw);
          };


          // Set the select interaction
          var activateSelectInteraction = function() {
            deactivateDrawInteraction();
            deactivateSelectInteraction();
            deactivateModifyInteraction();

            select = new ol.interaction.Select({
              layer: layer,
              style: scope.options.selectStyleFunction
            });

            if (scope.isActive) {
              map.addInteraction(select);
              select.getFeatures().on('add', updateUseTextStyle);
              select.getFeatures().on('remove', updateUseTextStyle);
            }
          };

          var deactivateSelectInteraction = function() {
            scope.useTextStyle = false;
            select = deactivateInteraction(select);
          };

          // Set the select interaction
          var activateModifyInteraction = function() {
            activateSelectInteraction();

            modify = new ol.interaction.Modify({
              features: select.getFeatures(),
              style: scope.options.selectStyleFunction
            });

            if (scope.isActive) {
              map.addInteraction(modify);
            }
          };

          var deactivateModifyInteraction = function() {
            modify = deactivateInteraction(modify);
          };

          // Deactivate an interaction
          var deactivateInteraction = function(interaction) {
            if (interaction) {
              map.removeInteraction(interaction);
            }
            return undefined;
          };

          // Update selected feature with a new style
          var updateSelectedFeatures = function() {
            if (select) {
              var features = select.getFeatures();
              if (features) {
                features.forEach(function(feature) {
                  // Update the style function of the feature
                  feature.setStyle(function() {return null;});
                  var style = layer.getStyleFunction()(feature);
                  feature.setStyle(style);
                });
              }
            }
          };

          // Determines if at least one selected feature use a text style
          var updateUseTextStyle = function(evt) {
            var features = select.getFeatures().getArray();
            var useTextStyle = false;
            for (var i = 0, ii = features.length; i < ii; i++) {
              var styles = features[i].getStyleFunction()();
              var style = styles[0].getText();
              if (style) {
                useTextStyle = true;
                break;
              }
            }
            scope.$apply(function() {
              scope.useTextStyle = useTextStyle;
            });
          };

          // Delete all features of the layer
          var deleteAllFeatures = function() {
            if (confirm($translate('confirm_remove_all_features'))) {
              layer.getSource().clear();
            }

            // We reactivate the lastActiveTool
            if (lastActiveTool) {
              activateTool(lastActiveTool);
            }
          };


          // Activate/deactivate a tool
          scope.toggleTool = function(tool) {
            if (scope.options[tool.activeKey]) {
              // Deactivate all tools
              deactivate();
              lastActiveTool = undefined;

            } else {
              activateTool(tool);
            }
          };

          // Delete selected features by the edit tool
          scope.deleteFeatures = function() {
            if (confirm($translate('confirm_remove_selected_features')) &&
                select) {
              var features = select.getFeatures();
              if (features) {
                features.forEach(function(feature) {
                  layer.getSource().removeFeature(feature);
                });
                // We reactivate the select interaction instead of clearing
                // directly the selectd features array to avoid an digest cycle
                // error in updateUseTextStyle function
                activateSelectInteraction();
              }
            }
          };

          scope.aToolIsActive = function() {
            return !!lastActiveTool;
          };

          // Watchers
          scope.$watch('isActive', function(active) {
            $rootScope.isDrawActive = active;
            if (active) {
              activate();
            } else {
              deactivate();
            }
          });
          scope.$watch('options.color', function(active) {
            if (scope.options.isModifyActive) {
              updateSelectedFeatures();
            }
          });
          scope.$watch('options.text', function(active) {
            if (scope.options.isModifyActive) {
              updateSelectedFeatures();
            }
          });

          scope.$watch('options.isPointActive', function(active) {
            if (active) {
              activateDrawInteraction('Point');
            }
          });
          scope.$watch('options.isLineActive', function(active) {
            if (active) {
              activateDrawInteraction('LineString');
            }
          });
          scope.$watch('options.isPolygonActive', function(active) {
            if (active) {
              activateDrawInteraction('Polygon');
            }
          });
          scope.$watch('options.isTextActive', function(active) {
            if (active) {
              activateDrawInteraction('Point');
            }
          });
          scope.$watch('options.isModifyActive', function(active) {
            if (active) {
              activateModifyInteraction();
            }
          });
          scope.$watch('options.isDeleteActive', function(active) {
            if (active) {
              deleteAllFeatures();
              scope.options.isDeleteActive = false;
            }
          });

        }
      };
    }
  );
})();
