(function() {
  goog.provide('ga_draw_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_draw_directive', [
    'pascalprecht.translate'
  ]);

  module.directive('gaDraw',
    function($rootScope, gaDefinePropertiesForLayer, $translate) {
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
            source: source,
            visible: true,
            style: scope.options.styleFunction
          });
          gaDefinePropertiesForLayer(layer);
          layer.highlight = true;

          // Activate the component: add the vector layer and active a tool.
          var activate = function() {
            map.addLayer(layer);
            scope.activateTool(lastActiveTool || scope.options.tools[0]);
          };

          // Deactivate the component: remove layer and interactions.
          var deactivate = function() {

            // Remove layer
            if (layer) {
              map.removeLayer(layer);
            }

            // Remove events
            if (deregister) {
              for (var i = deregister.length - 1; i >= 0; i--) {
                deregister[i].src.unByKey(deregister[i]);
              }
            }

            // Deactivate the tool
            if (lastActiveTool) {
              scope.options[lastActiveTool.options] = false;
            }

            // Remove interactions
            deactivateDrawInteraction();
            deactivateSelectInteraction();
            deactivateModifyInteraction();
          };

          // Deactivate other tools
          scope.activateTool = function(tool) {
            if (tool.id == 'delete') {
              scope.options[tool.options] = true;
              return;
            }
            var tools = scope.options.tools;
            for (var i = 0, ii = tools.length; i < ii; i++) {
              scope.options[tools[i].options] = (tools[i].id == tool.id);
            }
            scope.options.instructions = tool.instructions;
            lastActiveTool = tool;
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

            // Focus on the important input
            $(elt).find(((scope.options.isTextActive) ? 'input' : 'select')).
                focus();

            if (scope.isActive) {
              map.addInteraction(draw);
            }
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
            }
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

          var deactivateDrawInteraction = function() {
            draw = deactivateInteraction(draw);
          };
          var deactivateModifyInteraction = function() {
            modify = deactivateInteraction(modify);
          };
          var deactivateSelectInteraction = function() {
            select = deactivateInteraction(select);
          };
          var deactivateInteraction = function(interaction) {
            if (interaction) {
              map.removeInteraction(interaction);
            }
            return undefined;
          };

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

          var deleteAllFeatures = function() {
            if (confirm($translate('confirm_remove_all_features'))) {
              if (select) {
                select.getFeatures().clear();
              }
              layer.getSource().clear();
            }
          };

          scope.deleteFeatures = function() {
            if (confirm($translate('confirm_remove_selected_features')) &&
                select) {
              var features = select.getFeatures();
              if (features) {
                features.forEach(function(feature) {
                  layer.getSource().removeFeature(feature);
                });
                features.clear();
              }
            }
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
