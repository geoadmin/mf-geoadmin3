goog.provide('ga_draw_directive');

goog.require('ga_export_kml_service');
goog.require('ga_file_storage_service');
goog.require('ga_map_service');
(function() {

  var module = angular.module('ga_draw_directive', [
    'ga_export_kml_service',
    'ga_file_storage_service',
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  /**
   * This directive add a toolbar to draw feature on a map.
   * Options:
   *
   *   - broadcastLayer : send the current layer drawn through the rootScope
   *                      with the event 'gaDrawingLayer'.
   *   - showExport: show the export button which allow to download a KML file.
   *   - useTemporaryLayer: force to use a new layer which will not be saved
   *                        automatically on s3.
   *
   */
  module.directive('gaDraw',
    function($timeout, $translate, $window, $rootScope, gaBrowserSniffer,
        gaDefinePropertiesForLayer, gaDebounce, gaFileStorage, gaLayerFilters,
        gaExportKml, gaMapUtils, gaPermalink, $http, $q, gaUrlUtils) {

      var createDefaultLayer = function(useTemporaryLayer) {
        var dfltLayer = new ol.layer.Vector({
          source: new ol.source.Vector(),
          visible: true
        });
        gaDefinePropertiesForLayer(dfltLayer);

        if (useTemporaryLayer) {
          dfltLayer.displayInLayerManager = false;
        }

        dfltLayer.label = 'Drawing';
        dfltLayer.type = 'KML';
        return dfltLayer;
      };

      return {
        restrict: 'A',
        templateUrl: 'components/draw/partials/draw.html',
        scope: {
          map: '=gaDrawMap',
          options: '=gaDrawOptions',
          isActive: '=gaDrawActive'
        },
        link: function(scope, element, attrs, controller) {
          var layer, draw, lastActiveTool;
          var unLayerRemove, unDrawEnd, unChangeFeature;
          var useTemporaryLayer = scope.options.useTemporaryLayer || false;
          var map = scope.map;
          var viewport = $(map.getViewport());
          scope.layers = scope.map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.selected;

          // Add select interaction
          var select = new ol.interaction.Select({
            layers: function(item) {
              if (item === layer) {
                return true;
              }
            },
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

          var defineLayerToModify = function() {
            // Set the layer to modify if exist otherwise use an empty layer
            layer = createDefaultLayer(useTemporaryLayer);
            if (!useTemporaryLayer) {
              scope.adminShortenUrl = undefined;
              map.getLayers().forEach(function(item) {
                if (gaMapUtils.isStoredKmlLayer(item)) {
                  layer = item;
                }
              });
              unChangeFeature = layer.getSource().on(['addfeature',
                  'changefeature', 'removefeature'], saveDebounced);
            }

            if (scope.options.broadcastLayer) {
              $rootScope.$broadcast('gaDrawingLayer', layer);
            }
          };
          var updateShortenUrl = function(adminId) {
            $http.get(scope.options.shortenUrl, {
              params: {
                url: gaPermalink.getHref().replace(
                    gaUrlUtils.encodeUriQuery(layer.id, true), '') +
                    '&adminId=' + adminId
              }
            }).success(function(data) {
              scope.adminShortenUrl = data.shorturl;
            });
          };

          // Activate the component: active a tool if one was active when draw
          // has been deactivated.
          var activate = function() {
            defineLayerToModify();

            if (layer.adminId) {
              updateShortenUrl(layer.adminId);
            }

            if (lastActiveTool) {
              activateTool(lastActiveTool);
            }

            unLayerRemove = map.getLayers().on('remove', function(evt) {
              if (evt.element === layer) {
                defineLayerToModify();
              }
            });
          };

          // Deactivate the component: remove layer and interactions.
          var deactivate = function() {

            if (unChangeFeature) {
              ol.Observable.unByKey(unChangeFeature);
              unChangeFeature = undefined;
            }

            ol.Observable.unByKey(unLayerRemove);

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
              source: layer.getSource(),
              style: scope.options.drawStyleFunction
            });

            unDrawEnd = draw.on('drawend', function(evt) {
              // Set the definitve style of the feature
              var styles = scope.options.styleFunction(evt.feature);
              evt.feature.setStyle(styles);
              scope.$apply();
            });

            map.addInteraction(draw);
          };

          var deactivateDrawInteraction = function() {
            // Remove events
            if (unDrawEnd) {
              ol.Observable.unByKey(unDrawEnd);
              unDrawEnd = undefined;
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

          // Determines which styles are used by selected fetures
          var updateUseStyles = function(evt) {
            var features = select.getFeatures().getArray();
            var useTextStyle = false;
            var useIconStyle = false;
            var useColorStyle = false;

            for (var i = 0, ii = features.length; i < ii; i++) {
              var styles = features[i].getStyleFunction()();
              if ((features[i].getGeometry() instanceof ol.geom.Point ||
                  features[i].getGeometry() instanceof ol.geom.MultiPoint) &&
                  styles[0].getImage() instanceof ol.style.Icon) {
                useIconStyle = true;
                features[i].set('useIcon', useIconStyle);
                continue;
              } else if (styles[0].getText() && styles[0].getText().getText()) {
                useTextStyle = true;
              }
              useColorStyle = true;
              features[i].set('useText', useTextStyle);
            }
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
              if (layer.adminId) {
                gaFileStorage.del(layer.adminId);
              }
              map.removeLayer(layer);
              defineLayerToModify();
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
            return (layer) ? layer.getSource().getFeatures().length > 0 : false;
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

          scope.$watch('options.iconSize', function(active) {
            if (scope.options.isModifyActive) {
              updateSelectedFeatures();
            }
          });

          scope.$watch('options.icon', function(active) {
            if (scope.options.isModifyActive) {
              updateSelectedFeatures();
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

          // create/update the file on s3
          var save = function() {
            var kmlString = gaExportKml.create(layer,
                map.getView().getProjection());
            var id = layer.adminId ||
                gaFileStorage.getFileIdFromFileUrl(layer.url);
            gaFileStorage.save(id, kmlString,
                'application/vnd.google-earth.kml+xml').then(function(data) {
              // If a file has been created we set the correct id to the layer
              if (data.adminId && data.adminId != layer.adminId) {
                layer.adminId = data.adminId;
                layer.url = data.fileUrl;
                layer.id = 'KML||' + layer.url;
              }

              if (!scope.adminShortenUrl) {
                $timeout(function() {
                  updateShortenUrl(layer.adminId);
                }, 0, false);
               }
            });
          };
          var saveDebounced = gaDebounce.debounce(save, 133, false, false);


          // Utils
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
