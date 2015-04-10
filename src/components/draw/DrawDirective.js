(function() {
  goog.provide('ga_draw_directive');

  goog.require('ga_export_kml_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_draw_directive', [
    'ga_export_kml_service',
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaDraw',
    function($timeout, $translate, $window, $rootScope, gaBrowserSniffer,
        gaDefinePropertiesForLayer, gaDebounce, gaLayerFilters, gaExportKml,
        gaMapUtils) {
      return {
        restrict: 'A',
        templateUrl: 'components/draw/partials/draw.html',
        scope: {
          map: '=gaDrawMap',
          options: '=gaDrawOptions',
          isActive: '=gaDrawActive'
        },
        link: function(scope, element, attrs, controller) {
          var draw, deregister, lastActiveTool;
          var map = scope.map;
          var viewport = $(map.getViewport());
          var source = new ol.source.Vector();
          var layer = new ol.layer.Vector({
            source: source,
            visible: true
          });
          gaDefinePropertiesForLayer(layer);
          layer.displayInLayerManager = false;
          scope.layers = scope.map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.selected;

          if (scope.options.broadcastLayer) {
            $rootScope.$broadcast('gaDrawingLayer', layer);
          }

          // Add select interaction
          var select = new ol.interaction.Select({
            layers: [layer],
            style: scope.options.selectStyleFunction
          });
          select.getFeatures().on('add', function(evt) {
            // Apply the select style
            var styles = scope.options.selectStyleFunction(evt.element);
            evt.element.setStyle(styles);
            updateUseStyles(evt);
          });
          select.getFeatures().on('remove', function(evt) {
            // Remove the select style
            var styles = evt.element.getStyle();
            styles.pop();
            evt.element.setStyle(styles);
            updateUseStyles(evt);
          });
          select.setActive(false);
          map.addInteraction(select);

          // Add modify interaction
          var modify = new ol.interaction.Modify({
            features: select.getFeatures(),
            style: scope.options.selectStyleFunction
          });
          modify.setActive(false);
          map.addInteraction(modify);

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
              // Move draw layer on each changes in the list of layers
              // in the layer manager.
              scope.$watchCollection('layers | filter:layerFilter', function() {
                gaMapUtils.moveLayerOnTop(map, layer);
              });
            }

            gaMapUtils.moveLayerOnTop(map, layer);

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

            deregister = draw.on('drawend', function(evt) {
              // Set the definitve style of the feature
              var styles = scope.options.styleFunction(evt.feature);
              evt.feature.setStyle(styles);
              scope.$apply();
            });

            map.addInteraction(draw);
          };

          var deactivateDrawInteraction = function() {
            // Remove events
            if (deregister) {
              deregister.src.unByKey(deregister);
              deregister = null;
            }
            map.removeInteraction(draw);
            draw = undefined;
          };

          // Set the select interaction
          var activateSelectInteraction = function() {
            deactivateDrawInteraction();
            deactivateSelectInteraction();
            deactivateModifyInteraction();
            select.setActive(true);
          };

          var deactivateSelectInteraction = function() {
            // Clearing the features updates scope.useXXX properties
            select.getFeatures().clear();
            select.setActive(false);
          };

          // Set the modifiy interaction
          var activateModifyInteraction = function() {
            activateSelectInteraction();

            modify.setActive(true);
            if (!gaBrowserSniffer.mobile) {
              viewport.on('mousemove', updateCursorStyleDebounced);
            }
          };

          var deactivateModifyInteraction = function() {
            modify.setActive(false);
            viewport.unbind('mousemove', updateCursorStyleDebounced);
          };


          // Update selected feature with a new style
          var updateSelectedFeatures = function() {
            if (select.getActive()) {
              var features = select.getFeatures();
              if (features) {
                features.forEach(function(feature) {
                  // Update the style of the feature with the current style
                  feature.setStyle(function() {return null;});
                  var styles = scope.options.styleFunction(feature);
                  feature.setStyle(styles);
                  // then apply the select style
                  styles = scope.options.selectStyleFunction(feature);
                  feature.setStyle(styles);
                });
              }
            }
          };


          // Determines which styles are used by selected features
          var updateUseStyles = function(evt) {
            var features = select.getFeatures().getArray();
            var useTextStyle = false;
            var useIconStyle = false;
            var useColorStyle = false;
            // if there is only one feature selected we update the inputs with
            // the current feature style
            var unique = (features.length == 1);

            for (var i = 0, ii = features.length; i < ii; i++) {
              var styles = features[i].getStyleFunction()();
              if (styles[0].getImage() instanceof ol.style.Icon) {
                useIconStyle = true;

                // Update html inputs.
                scope.options.icon = (unique) ?
                    findIcon(styles[0].getImage()) : scope.options.icon[0];
                scope.options.iconSize = (unique) ?
                    findIconSize(styles[0].getImage()) :
                    scope.options.iconSizes[0];
                continue;

              } else if (styles[0].getText()) {
                useTextStyle = true;

                // Update html inputs
                scope.options.text = (unique) ?
                    styles[0].getText().getText() : '';
                scope.options.color = (unique) ?
                    findColor(styles[0].getText().getFill().getColor()) :
                    scope.options.colors[0];

              } else {

                // Update html inputs
                scope.options.color = (unique) ?
                    findColor(styles[0].getStroke().getColor()) :
                    scope.options.colors[0];
              }
              useColorStyle = true;
            }

            scope.options.description = (unique) ?
                features[0].get('description') : '';

            scope.$evalAsync(function() {
              scope.useTextStyle = useTextStyle;
              scope.useIconStyle = useIconStyle;
              scope.useColorStyle = useColorStyle;
            });
          };

          // Delete all features of the layer
          var deleteAllFeatures = function() {
            if (confirm($translate.instant('confirm_remove_all_features'))) {
              layer.getSource().clear();
            }

            // We reactivate the lastActiveTool
            if (lastActiveTool) {
              activateTool(lastActiveTool);
            }
          };


          // Activate/deactivate a tool
          scope.toggleTool = function(evt, tool) {
            if (scope.options[tool.activeKey]) {
              // Deactivate all tools
              deactivate();
              lastActiveTool = undefined;
            } else {
              activateTool(tool);
            }
            evt.preventDefault();
          };

          // Delete selected features by the edit tool
          scope.deleteFeatures = function(evt) {
            if (confirm($translate.instant(
                          'confirm_remove_selected_features')) &&
                select.getActive()) {
              var features = select.getFeatures();
              if (features) {
                features.forEach(function(feature) {
                  layer.getSource().removeFeature(feature);
                });
                // We reactivate the select interaction instead of clearing
                // directly the selectd features array to avoid an digest cycle
                // error in updateUseStyles function
                activateSelectInteraction();
              }
            }
            evt.preventDefault();
          };

          scope.exportKml = function(evt) {
            gaExportKml.createAndDownload(layer, map.getView().getProjection());
            evt.preventDefault();
          };

          scope.canExport = function() {
            return source.getFeatures().length > 0;
          };

          scope.aToolIsActive = function() {
            return !!lastActiveTool;
          };

          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              activate();
            } else {
              deactivate();
            }
          });

          scope.$watchGroup(['options.iconSize', 'options.icon',
              'options.color', 'options.text', 'options.description'],
              function() {
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

          $rootScope.$on('$translateChangeEnd', function() {
            layer.label = $translate.instant('draw');
          });

          // Utils

          // Find the corresponding style
          var findIcon = function(olIcon) {
            var id = olIcon.getSrc();
            for (var i = 0; i < scope.options.icons.length; i++) {
              var regex = new RegExp('/' + scope.options.icons[i].id + '-24');
              if (regex.test(id)) {
                return scope.options.icons[i];
              }
            }
            return scope.options.iconSizes[0];
          };

          var findIconSize = function(olIcon) {
            var scale = olIcon.getScale();
            for (var i = 0; i < scope.options.iconSizes.length; i++) {
              if (scale == scope.options.iconSizes[i].scale) {
                return scope.options.iconSizes[i];
              }
            }
            return scope.options.iconSizes[0];
          };

          var findColor = function(olColor) {
            var rgb = ol.color.asString(olColor.slice(0, 3));
            for (var i = 0; i < scope.options.colors.length; i++) {
              if (rgb == ol.color.asString(scope.options.colors[i].fill)) {
                return scope.options.colors[i];
              }
            }
            return scope.options.colors[0];
          };

          // Find the first feature from a vector layer
          var findDrawnFeature = function(pixel, vectorLayer) {
              var featureFound;
              map.forEachFeatureAtPixel(pixel, function(feature, olLayer) {
                featureFound = feature;
              }, this, function(olLayer) {
                return (layer == olLayer);
              });
              return featureFound;
            };

          // Change cursor style on mouse move, only on desktop
          var updateCursorStyle = function(evt) {
            var feature = findDrawnFeature(map.getEventPixel(evt));
            map.getTarget().style.cursor = (feature) ? 'pointer' : '';
          };
          var updateCursorStyleDebounced = gaDebounce.debounce(
              updateCursorStyle, 10, false, false);

          // Focus on the first input.
          var setFocus = function() {
            $timeout(function() {
              var inputs = element.find('input, select');
              if (inputs.length > 0) {
                inputs[0].focus();
              }
            });
          };
        }
      };
    }
  );
})();
