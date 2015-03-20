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
        // Find the corresponding style
        var findIcon = function(olIcon, icons) {
          var id = olIcon.getSrc();
          for (var i = 0; i < icons.length; i++) {
            var regex = new RegExp('/' + icons[i].id + '-24');
            if (regex.test(id)) {
              return icons[i];
            }
          }
          return icons[0];
        };

        var findIconSize = function(olIcon, iconSizes) {
          var scale = olIcon.getScale();
          for (var i = 0; i < iconSizes.length; i++) {
            if (scale == iconSizes[i].scale) {
              return iconSizes[i];
            }
          }
          return iconSizes[0];
        };

        var findColor = function(olColor, colors) {
          var rgb = ol.color.asString(olColor.slice(0, 3));
          for (var i = 0; i < colors.length; i++) {
            if (rgb == ol.color.asString(colors[i].fill)) {
              return colors[i];
            }
          }
          return colors[0];
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
          scope.pointTool = scope.options.tools[0];
          scope.complexTools = [
            scope.options.tools[1],
            scope.options.tools[2]
          ];
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
          var propsToggle = function(feature) {
            if (feature) {
              if (!overlay.getElement()) {
                overlay.setElement(props[0]);
              }
              props.show();
              var coord, geom = feature.getGeometry();
              if (geom instanceof ol.geom.Polygon) {
                coord = geom.getInteriorPoint().getCoordinates();
              } else {
                coord = geom.getLastCoordinate();
              }
              overlay.setPosition(coord);
            } else {
              props.hide();
              overlay.setPosition(undefined);
            }
          };
          select.getFeatures().on('add', function(evt) {
            // Apply the select style
            var styles = scope.options.selectStyleFunction(evt.element);
            evt.element.setStyle(styles);
            updateUseStyles();
            propsToggle(evt.element);
            //console.debug('add');
          });
          select.getFeatures().on('remove', function(evt) {
            // Remove the select style
            var styles = evt.element.getStyle();
            styles.pop();
            evt.element.setStyle(styles);
            updateUseStyles();
            propsToggle();
            //console.debug('remove');
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
          
          // Activate the component
          var activate = function() {
            if (map.getLayers().getArray().indexOf(layer) == -1) {
              map.addLayer(layer);
              // Move draw layer on each changes in the list of layers
              // in the layer manager.
              scope.$watchCollection('layers | filter:layerFilter', function() {
                gaMapUtils.moveLayerOnTop(map, layer);
              });
            }
            map.addOverlay(overlay);
            activateSelectInteraction();
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
            map.removeOverlay(overlay);
          };

          // Deactivate other tools
          var activateTool = function(tool) {
            layer.visible = true;

            if (map.getLayers().getArray().indexOf(layer) == -1) {
              map.addLayer(layer);
            }

            gaMapUtils.moveLayerOnTop(map, layer);
            lastActiveTool = tool;
            var tools = scope.options.tools;
            for (var i = 0, ii = tools.length; i < ii; i++) {
              scope.options[tools[i].activeKey] = (tools[i].id == tool.id);
            }
          };

          var deactivateTool = function(tool) {
            scope.options[tool.activeKey] = false;
          };

          // Set the draw interaction with the good geometry
          var deregDrawStart, deregDrawEnd;
          var activateDrawInteraction = function(type) {
            deactivateSelectInteraction();
            deactivateDrawInteraction();

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
              deactivateDrawInteraction();
              deactivateTool(lastActiveTool);
              activateSelectInteraction();
              select.getFeatures().push(evt.feature);
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
          };


          // Activate/Deactivate select interaction
          var deregPointerMove;
          var activateSelectInteraction = function() {
            select.setActive(true);
            if (!gaBrowserSniffer.mobile) {
              deregPointerMove = map.on('pointermove',
                  updateCursorStyleDebounced);
            }
            activateModifyInteraction();
          };
          var deactivateSelectInteraction = function() {
            deactivateModifyInteraction();
            if (deregPointerMove) {
              ol.Observable.unByKey(deregPointerMove,
                  updateCursorStyleDebounced);
            }
            select.getFeatures().clear();
            select.setActive(false);
          };

          // Activate/Deactivate modifiy interaction
          var activateModifyInteraction = function() {
            modify.setActive(true);
          };

          var deactivateModifyInteraction = function() {
            modify.setActive(false);
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
          var updateUseStyles = function() {
            var features = select.getFeatures().getArray();
            var feature = features[0];
            var useIconStyle = false;
            var useColorStyle = false;

            if (feature) {
              // The select interaction select only one feature
              var styles = feature.getStyleFunction()();
              var featStyle = styles[0];
              if (featStyle.getImage() instanceof ol.style.Icon) {
                useIconStyle = true;
                scope.options.icon = findIcon(featStyle.getImage(),
                    scope.options.icons);
                scope.options.iconSize = findIconSize(featStyle.getImage(),
                    scope.options.iconSizes);
              }
              if (featStyle.getText()) {
                scope.options.name = featStyle.getText().getText();
                //scope.options.textSize
                //scope.options.textColor
              }
              if (featStyle.getStroke()) {
                useColorStyle = true;
                scope.options.color = findColor(
                    featStyle.getStroke().getColor(), scope.options.colors);

              }
              scope.options.name = feature.get('name') || '';
              scope.options.description = feature.get('description') || '';

            } else {
              scope.options.name = '';
              scope.options.description = '';
            }
            scope.useIconStyle = useIconStyle;
            scope.useColorStyle = useColorStyle;
            scope.$evalAsync();
          };

          // Delete all features of the layer
          scope.deleteAllFeatures = function() {
            if (confirm($translate.instant('confirm_remove_all_features'))) {
              select.getFeatures().clear();
              layer.getSource().clear();
              if (layer.adminId) {
                gaFileStorage.del(layer.adminId);
              }
              map.removeLayer(layer);
              defineLayerToModify();
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

          // hide the overlay with close button
          scope.hide = function() {
            overlay.setPosition(undefined);
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
              'options.color', 'options.name', 'options.description'],
              function() {
            updateSelectedFeatures();
          });

          scope.$watchGroup(['options.isPointActive', 'options.isLineActive',
              'options.isPolygonActive'], function(values) {
            if (values[0]) {
              activateDrawInteraction('Point');
            } else if (values[1]) {
              activateDrawInteraction('LineString');
            } else if (values[2]) {
              activateDrawInteraction('Polygon');
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
          
          $rootScope.$on('$translateChangeEnd', function() {
            layer.label = $translate.instant('draw');
          });

          // Utils

          // Change cursor style on mouse move, only on desktop
          var updateCursorStyle = function(evt) {
            var featureFound;
            map.forEachFeatureAtPixel(evt.pixel, function(feature, olLayer) {
              featureFound = feature;
            }, this, function(olLayer) {
              return (layer == olLayer);
            });
            map.getTarget().style.cursor = (featureFound) ? 'pointer' : '';
          };
          var updateCursorStyleDebounced = gaDebounce.debounce(
              updateCursorStyle, 10, false, false);

          // Focus on the first input.
          /*var setFocus = function() {
            $timeout(function() {
              var inputs = element.find('input, select');
              if (inputs.length > 0) {
                inputs[0].focus();
              }
            });
          };*/
        }
      };
    }
  );
})();
