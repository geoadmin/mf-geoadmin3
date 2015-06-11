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
        gaExportKml, gaMapUtils, gaPermalink, $http, $q, gaUrlUtils,
        $document) {

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

      var formatLength = function(line) {
        if (!line instanceof ol.geom.LineString) {
          return '- km';
        }
        var output, length = Math.round(line.getLength() * 100) / 100;
        if (length > 100) {
          output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
        } else {
          output = (Math.round(length * 100) / 100) + ' ' + 'm';
        }
        return output;
      };

      var formatArea = function(polygon) {
        if (!polygon instanceof ol.geom.Polygon) {
          return '- km<sup>2</sup>';
        }
        var output, area = polygon.getArea();
        if (area > 10000) {
          output = (Math.round(area / 1000000 * 100) / 100) + ' ' +
              'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
        }
        return output;
      };

      // Creates a new help tooltip
      var createHelpTooltip = function() {
        var tooltipElement = document.createElement('div');
        tooltipElement.className = 'ga-draw-help';
        var tooltip = new ol.Overlay({
          element: tooltipElement,
          offset: [15, 15],
          positioning: 'top-left',
          stopEvent: false
        });
        return tooltip;
      };

      // Creates a new measure tooltip with a nice arrow
      var createMeasureTooltip = function() {
        var tooltipElement = document.createElement('div');
        tooltipElement.className = 'ga-draw-measure';
        var tooltip = new ol.Overlay({
          element: tooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center',
          stopEvent: true // for copy/paste
        });
        return tooltip;
      };

      var updateHelpTooltip = function(overlay, type, drawStarted, onFirstPoint,
          onLastPoint) {
        var helpMsg = $translate.instant('Click to add a point');
        //draw-help-start');
        if (drawStarted) {
          if (type != 'Point') {
            helpMsg = $translate.instant('Click to add another point');
            //draw-help-next');
          }
          if (onLastPoint) {
            helpMsg = $translate.instant('Click to finish the line');
            //draw-help-first-point');
          }
          if (onFirstPoint) {
            helpMsg = $translate.instant('Click to close the polygon');
            //draw-help-last-point');
          }
        }
        overlay.getElement().innerHTML = helpMsg;
      };

      // Display measure overlays if the geometry alloow it otherwise hide them.
      var updateMeasureTooltips = function(distTooltip, areaTooltip, geom) {
        if (geom instanceof ol.geom.Polygon) {
          if (areaTooltip) {
            areaTooltip.getElement().innerHTML = formatArea(geom);
            areaTooltip.setPosition(geom.getInteriorPoint().getCoordinates());
          }
          geom = new ol.geom.LineString(geom.getCoordinates()[0]);
        } else if (areaTooltip) {
          areaTooltip.setPosition(undefined);
        }
        if (geom instanceof ol.geom.LineString) {
          if (distTooltip) {
            distTooltip.getElement().innerHTML = formatLength(geom);
            distTooltip.setPosition(geom.getLastCoordinate());
          }
        } else if (distTooltip) {
          distTooltip.setPosition(undefined);
        }
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
          var unDblClick, unLayerRemove, unFeatureChange, unFeatureRemove,
              deregPointerMove, deregFeatureChange;
          var useTemporaryLayer = scope.options.useTemporaryLayer || false;
          var map = scope.map;
          var viewport = $(map.getViewport());
          scope.isPropsActive = true;
          scope.isMeasureActive = false;
          scope.options.isProfileActive = false;


          // Create temporary overlays
          // Help overlay
          var helpTooltip = createHelpTooltip();
          map.addOverlay(helpTooltip);

          // Distance overlay
          var distTooltip = createMeasureTooltip();
          map.addOverlay(distTooltip);

          // Area overlay
          var areaTooltip = createMeasureTooltip();
          map.addOverlay(areaTooltip);


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
          // Activate/Deactivate select interaction
          select.on('change:active', function(evt) {
            var active = evt.target.get(evt.key);
            if (active) {
              if (!gaBrowserSniffer.mobile) {
                deregPointerMove = map.on('pointermove',
                    updateCursorStyleDebounced);
              }
              // Delete keyboard button
              $document.keyup(scope.deleteSelectedFeature);
            } else {
              if (deregPointerMove) {
                ol.Observable.unByKey(deregPointerMove,
                    updateCursorStyleDebounced);
              }
              $document.off('keyup', scope.deleteSelectedFeature);
              select.getFeatures().clear();
            }
          });
          select.getFeatures().on('add', function(evt) {
            // Apply the select style
            var styles = scope.options.selectStyleFunction(evt.element);
            evt.element.setStyle(styles);
            updatePropsTabContent();
            togglePopup(evt.element);
            deregFeatureChange = evt.element.on('change', function(evt) {
              var overlays = evt.target.get('overlays');
              if (overlays) {
                updateMeasureTooltips(overlays[0], overlays[1],
                    evt.target.getGeometry());
              }
            });

          });
          select.getFeatures().on('remove', function(evt) {
            // Remove the select style
            var styles = evt.element.getStyle();
            styles.pop();
            evt.element.setStyle(styles);
            updatePropsTabContent();
            togglePopup();
            ol.Observable.unByKey(deregFeatureChange);
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
              unFeatureRemove = layer.getSource().on(['removefeature', 'clear'],
                  function(evt) {
                // Remove the overlays attached to the feature
                var overlays = evt.feature.get('overlays');
                while (overlays && overlays.length) {
                  map.removeOverlay(overlays.pop());
                }
              });
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
            // Block dblclick ievent in draw mode to avoid map zooming
            unDblClick = map.on('dblclick', function(evt) {
              return false;
            });
            modify.setActive(true);
            select.setActive(true);
          };


          // Deactivate the component: remove layer and interactions.
          var deactivate = function(evt) {
            ol.Observable.unByKey(unDblClick);

            if (unFeatureChange) {
              ol.Observable.unByKey(unFeatureChange);
              unFeatureChange = undefined;
            }

            if (unFeatureRemove) {
              ol.Observable.unByKey(unFeatureRemove);
              unFeatureRemove = undefined;
            }

            ol.Observable.unByKey(unLayerRemove);

            // Deactivate the tool
            if (lastActiveTool) {
              scope.options[lastActiveTool.activeKey] = false;
            }

            // Remove interactions
            deactivateDrawInteraction();
            modify.setActive(false);
            select.setActive(false);
          };

          // Set the draw interaction with the good geometry
          var deregDrawStart, deregDrawEnd, deregPointerMove2;
          var activateDrawInteraction = function(tool) {
            select.setActive(false);
            deactivateDrawInteraction();
            updateHelpTooltip(helpTooltip, tool.drawOptions.type, false);

            if (!gaBrowserSniffer.mobile) {
              deregPointerMove2 = map.on('pointermove', function(evt) {
                helpTooltip.setPosition(evt.coordinate);

              });
            }

            draw = new ol.interaction.Draw(tool.drawOptions);
            var isFinishOnFirstPoint;
            deregDrawStart = draw.on('drawstart', function(evt) {
              var nbPoint = 1;
              var isSnapOnLastPoint = false;
              updateHelpTooltip(helpTooltip, tool.drawOptions.type, true,
                  isFinishOnFirstPoint, isSnapOnLastPoint);

              deregFeatureChange = evt.feature.on('change', function(evt) {
                var geom = evt.target.getGeometry();
                if (geom instanceof ol.geom.Polygon) {
                  var lineCoords = geom.getCoordinates()[0];

                  if (nbPoint != lineCoords.length) {
                    // A point is added
                    nbPoint++;
                  } else {
                    var firstPoint = lineCoords[0];

                    // We update features and measures
                    var lastPoint = lineCoords[lineCoords.length - 1];
                    var lastPoint2 = lineCoords[lineCoords.length - 2];

                    var isSnapOnFirstPoint = (lastPoint[0] == firstPoint[0] &&
                        lastPoint[1] == firstPoint[1]);

                    // When the last change event is triggered the polygon is
                    // closed so isSnapOnFirstPoint is true. We need to know
                    // if on the change event just before, the snap on last
                    // point was active.
                    isFinishOnFirstPoint = (!isSnapOnLastPoint &&
                        isSnapOnFirstPoint);

                    isSnapOnLastPoint = (lastPoint[0] == lastPoint2[0] &&
                        lastPoint[1] == lastPoint2[1]);

                    if (isSnapOnLastPoint) {
                      // In that case the 2 last points of the coordinates
                      // array are identical, so we remove the useless one.
                      lineCoords.pop();
                    }
                  }
                  updateHelpTooltip(helpTooltip, tool.drawOptions.type, true,
                      isFinishOnFirstPoint, isSnapOnLastPoint);
                  if (tool.showMeasure) {
                    if (!isFinishOnFirstPoint) {
                      geom = new ol.geom.LineString(lineCoords);
                    }
                    updateMeasureTooltips(distTooltip, areaTooltip, geom);
                  }
                }
              });
            });

            deregDrawEnd = draw.on('drawend', function(evt) {
              var featureToAdd = evt.feature;
              var geom = featureToAdd.getGeometry();
              if (geom instanceof ol.geom.Polygon && !isFinishOnFirstPoint) {
                // The sketchFeatureArea is automatically closed by the draw
                // interaction even if the user has finished drawing on the
                // last point. So we remove the useless coordinates.
                var lineCoords = featureToAdd.getGeometry().getCoordinates()[0];
                lineCoords.pop();
                featureToAdd = new ol.Feature(
                    new ol.geom.LineString(lineCoords));
              }

              // Update feature properties
              if (!featureToAdd.getId() && lastActiveTool) {
                featureToAdd.setId(lastActiveTool.id + '_' +
                    new Date().getTime());
              }
              if (lastActiveTool) {
                featureToAdd.set('type', lastActiveTool.id);
              }


              // Unregister the change event
              ol.Observable.unByKey(deregFeatureChange);

              // Set the definitve style of the feature
              layer.getSource().addFeature(featureToAdd);
              var styles = tool.style(featureToAdd);
              featureToAdd.setStyle(styles);
              scope.$apply();
              deactivateTool(lastActiveTool);
              select.getFeatures().push(featureToAdd);
              // Add final measure tooltips
              if (tool.showMeasure) {
                updateMeasureTooltips(distTooltip, areaTooltip,
                    featureToAdd.getGeometry());
                distTooltip.getElement().className = 'ga-draw-measure-static';
                areaTooltip.getElement().className = 'ga-draw-measure-static';
                distTooltip.setOffset([0, -7]);
                areaTooltip.setOffset([0, -7]);
                featureToAdd.set('overlays', [distTooltip, areaTooltip]);
                distTooltip = createMeasureTooltip();
                areaTooltip = createMeasureTooltip();
                map.addOverlay(distTooltip);
                map.addOverlay(areaTooltip);
              }

              // Remove temporary tooltips
              helpTooltip.setPosition(undefined);
              distTooltip.setPosition(undefined);
              areaTooltip.setPosition(undefined);
            });
            draw.setActive(true);
            map.addInteraction(draw);
          };
          var deactivateDrawInteraction = function() {
            ol.Observable.unByKey(deregPointerMove2);
            ol.Observable.unByKey(deregDrawStart);
            ol.Observable.unByKey(deregDrawEnd);
            helpTooltip.setPosition(undefined);
            if (draw) {
              draw.setActive(false);
              map.removeInteraction(draw);
            }
          };

          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              activate();
            } else {
              deactivate();
            }
          });

          // Update selected feature's style when the user change a value
          scope.$watchGroup(['options.icon', 'options.color', 'options.name',
              'options.description'], function() {
            if (select.getActive()) {
              var feature = select.getFeatures().item(0);
              if (feature) {
                // Update the style of the feature with the current style
                var styles = scope.options.updateStyle(feature);
                feature.setStyle(styles);
                // then apply the select style
                styles = scope.options.selectStyleFunction(feature);
                feature.setStyle(styles);
              }
            }
          });



          ///////////////////////////////////
          // Tools managment
          ///////////////////////////////////
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
            scope.options.setDefaultValues();
            activateDrawInteraction(lastActiveTool);
          };

          var deactivateTool = function(tool) {
            scope.options[tool.activeKey] = false;
            deactivateDrawInteraction();
            select.setActive(true);
          };

          scope.toggleTool = function(evt, tool) {
            if (scope.options[tool.activeKey]) {
              // Deactivate all tools
              deactivateTool(tool);
              lastActiveTool = undefined;
            } else {
              activateTool(tool);
            }
            evt.preventDefault();
          };

          scope.aToolIsActive = function() {
            return !!lastActiveTool;
          };



          ///////////////////////////////////
          // More... button functions
          ///////////////////////////////////
          scope.exportKml = function(evt) {
            gaExportKml.createAndDownload(layer, map.getView().getProjection());
            evt.preventDefault();
          };
          scope.deleteSelectedFeature = function(evt) {
            if ((!evt || evt.which == 46) &&
                select.getFeatures().getLength() > 0) {
              layer.getSource().removeFeature(select.getFeatures().item(0));
              select.getFeatures().clear();
            }
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

          scope.canExport = function() {
            return (layer) ? layer.getSource().getFeatures().length > 0 : false;
          };



          ////////////////////////////////////
          // Popup content management
          ////////////////////////////////////
          var togglePopup = function(feature) {
            if (feature) {
              scope.feature = feature;
              // Open the popup
              scope.popupToggle = true;
              // Set the correct title
              scope.options.popupOptions.title = feature.get('type');
            } else {
              scope.feature = undefined;
              scope.popupToggle = false;
              scope.options.popupOptions.title = 'feature';
            }
          };

          // Determines which elements to display in the feature's propereties
          // tab
          var updatePropsTabContent = function() {
            // The select interaction selects only one feature
            var feature = select.getFeatures().item(0);
            var useTextStyle = false;
            var useIconStyle = false;
            var useColorStyle = false;
            if (feature) {
              var styles = feature.getStyleFunction()();
              var featStyle = styles[0];
              if (featStyle.getImage() instanceof ol.style.Icon) {
                useIconStyle = true;
                scope.options.icon = findIcon(featStyle.getImage(),
                    scope.options.icons);
                //scope.options.iconSize = findIconSize(featStyle.getImage(),
                //    scope.options.iconSizes);
              }
              if (!useIconStyle && featStyle.getStroke()) {
                useColorStyle = true;
                scope.options.color = findColor(
                    featStyle.getStroke().getColor(),
                    scope.options.colors);
              }
              if (!useIconStyle && featStyle.getText()) {
                useColorStyle = true;
                useTextStyle = true;
                scope.options.name = featStyle.getText().getText();
                scope.options.color = findColor(
                    featStyle.getText().getFill().getColor(),
                    scope.options.colors);
              }

              scope.options.name = feature.get('name') || '';
              scope.options.description = feature.get('description') || '';
            } else {
              scope.options.name = '';
              scope.options.description = '';
            }
            scope.useTextStyle = useTextStyle;
            scope.useIconStyle = useIconStyle;
            scope.useColorStyle = useColorStyle;
            scope.$evalAsync();
          };



          ////////////////////////////////////
          // Tab managment
          ////////////////////////////////////
          scope.activeTabProps = function() {
            scope.isPropsActive = true;
            scope.isMeasureActive = false;
            scope.options.isProfileActive = false;
          };
          scope.activeTabProfile = function() {
            scope.isPropsActive = false;
            scope.isMeasureActive = false;
            scope.options.isProfileActive = true;
          };
          scope.activeTabMeasure = function() {
            scope.isPropsActive = false;
            scope.isMeasureActive = true;
            scope.options.isProfileActive = false;
          };
          scope.showTabs = function(feature) {
            //console.debug(feature);
            var bools = [
              scope.showPropsTab(feature),
              scope.showMeasureTab(feature),
              scope.showProfileTab(feature)
            ];
            var cpt = 0;
            for (var i in bools) {
              if (bools[i]) {
                 cpt++;
              }
            }
            return (cpt > 1);
          };
          scope.showMeasureTab = function(feature) {
            var geom = feature.getGeometry();
            var isPoint = (geom instanceof ol.geom.Point);
            return !isPoint;
          };
          scope.showProfileTab = function(feature) {
            //console.debug(feature.get('type'));
            if (feature.get('type') == 'measure' &&
                !scope.isMeasureActive &&
                !scope.options.isProfileActive) {
              scope.activeTabProfile();
            }
            return scope.showMeasureTab(feature);
          };
          scope.showPropsTab = function(feature) {
            var geom = feature.getGeometry();
            var isPoint = (geom instanceof ol.geom.Point);
            if (isPoint) {
              scope.activeTabProps();
            }
            return (!isPoint && feature.get('type') != 'measure');
          };




          ////////////////////////////////////
          // create/update the file on s3
          ////////////////////////////////////
          var save = function() {
            scope.isSaved = false;
            var kmlString = gaExportKml.create(layer,
                map.getView().getProjection());
            var id = layer.adminId ||
                gaFileStorage.getFileIdFromFileUrl(layer.url);
            gaFileStorage.save(id, kmlString,
                'application/vnd.google-earth.kml+xml').then(function(data) {
              scope.isSaved = true;
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
            if (layer) {
              layer.label = $translate.instant('draw');
            }
          });



          ////////////////////////////////////
          // Utils functions
          ////////////////////////////////////
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

          // Fix position of dropdown
          element.find('.dropdown-toggle').click(function() {
            var bt = $(this);
            var dropdown = bt.next('.dropdown-menu');
            var dropDownTop = bt.offset().top + bt.outerHeight() -
                50; // 50 seems to be the size of the #header
            dropdown.css('top', dropDownTop + 'px');
            dropdown.css('left', bt.offset().left + 'px');
          });

        }
      };
  });
})();
