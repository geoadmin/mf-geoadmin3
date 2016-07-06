goog.provide('ga_draw_directive');

goog.require('ga_exportkml_service');
goog.require('ga_filestorage_service');
goog.require('ga_map_service');
goog.require('ga_measure_service');
goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_draw_directive', [
    'ga_exportkml_service',
    'ga_filestorage_service',
    'ga_map_service',
    'ga_measure_service',
    'ga_styles_service',
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
  module.directive('gaDraw', function($translate, $rootScope, $timeout,
      gaBrowserSniffer, gaDefinePropertiesForLayer, gaDebounce, gaFileStorage,
      gaLayerFilters, gaExportKml, gaMapUtils, $document,
gaMeasure, gaStyleFactory) {

    var createDefaultLayer = function(map, useTemporaryLayer) {
      // #2820: we set useSpatialIndex to false to allow display of azimuth
      // circle created by style.
      var dfltLayer = new ol.layer.Vector({
        source: new ol.source.Vector({useSpatialIndex: false}),
        visible: true
      });
      gaDefinePropertiesForLayer(dfltLayer);

      if (useTemporaryLayer) {
        dfltLayer.displayInLayerManager = false;
        dfltLayer.preview = true;
      }
      gaMeasure.registerOverlaysEvents(map, dfltLayer);
      dfltLayer.label = $translate.instant('draw_layer_label');
      dfltLayer.type = 'KML';
      return dfltLayer;
    };

    // Creates a new help tooltip
    var createHelpTooltip = function() {
      var tooltipElement = $document[0].createElement('div');
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
      var tooltipElement = $document[0].createElement('div');
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
      var helpMsg = $translate.instant('draw_start_' + type);
      if (drawStarted) {
        if (type != 'Point') {
          helpMsg = $translate.instant('draw_next_' + type);
        }
        if (onLastPoint) {
          helpMsg = $translate.instant('draw_snap_last_point_' + type);
        }
        if (onFirstPoint) {
          helpMsg = $translate.instant('draw_snap_first_point_' + type);
        }
      }
      overlay.getElement().innerHTML = helpMsg;
    };

    // Display measure overlays if the geometry alloow it otherwise hide them.
    var updateMeasureTooltips = function(distTooltip, areaTooltip, geom) {
      if (geom instanceof ol.geom.Polygon) {
        if (areaTooltip) {
          areaTooltip.getElement().innerHTML = gaMeasure.getAreaLabel(geom);
          areaTooltip.setPosition(geom.getInteriorPoint().getCoordinates());
        }
        geom = new ol.geom.LineString(geom.getCoordinates()[0]);
      } else if (areaTooltip) {
        areaTooltip.setPosition(undefined);
      }
      if (geom instanceof ol.geom.LineString) {
        if (distTooltip) {
          var label = '';
          var coords = geom.getCoordinates();
          if (coords.length == 2 || (coords.length == 3 &&
              coords[1][0] == coords[2][0] &&
              coords[1][1] == coords[2][1])) {
            label += gaMeasure.getAzimuthLabel(geom) + ' / ';
          }
          label += gaMeasure.getLengthLabel(geom);
          distTooltip.getElement().innerHTML = label;
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
        if (!scope.options) {
          scope.options = {};
        }
        var layer, draw, lastActiveTool, snap;
        var unDblClick, unLayerAdd, unLayerRemove, unSourceEvents = [],
            deregPointerMove, deregFeatureChange, unLayerVisible,
            unWatch = [], unDrawEvts = [];
        var useTemporaryLayer = scope.options.useTemporaryLayer || false;
        var helpTooltip, distTooltip, areaTooltip;
        var map = scope.map;
        var viewport = $(map.getViewport());
        var body = $($document[0].body);
        var cssModify = 'ga-draw-modifying';
        var cssPointer = 'ga-pointer';
        var cssGrab = 'ga-grab';
        var cssGrabbing = 'ga-grabbing';
        var mapDiv = $(map.getTarget());
        scope.statusMsgId = '';

        // Filters functions
        var layerFilter = function(itemLayer) {
         return (itemLayer === layer);
        };
        var featureFilter = function(itemFeature, itemLayer) {
          // Filter out unmanaged layers
          if (layerFilter(itemLayer)) {
            return itemFeature;
          }
        };
        // Add select interaction
        var select = new ol.interaction.Select({
          layers: layerFilter,
          filter: featureFilter,
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
            ol.Observable.unByKey(deregPointerMove);
            $document.off('keyup', scope.deleteSelectedFeature);
            select.getFeatures().clear();
          }
        });
        select.getFeatures().on('add', function(evt) {
          // Apply the select style
          var styles = scope.options.selectStyleFunction(evt.element);
          evt.element.setStyle(styles);
          togglePopup(evt.element);
        });
        select.getFeatures().on('remove', function(evt) {
          // Remove the select style
          var styles = evt.element.getStyle();
          styles.pop();
          evt.element.setStyle(styles);
          togglePopup();
        });
        select.setActive(false);

        var unselectFeature = function(feature) {
          var selected = select.getFeatures().getArray();
          for (var i = 0, ii = selected.length; i < ii; i++) {
            if (selected[i] == feature) {
              select.getFeatures().remove(feature);
              break;
            }
          }
        };
        // Add modify interaction
        // The modify interaction works with features selected by the select
        // interaction so no need to activate/deactivate it.
        // Activate/deactivate the select interaction is enough.
        var modify = new ol.interaction.Modify({
          features: select.getFeatures(),
          style: scope.options.selectStyleFunction
        });
        modify.on('modifystart', function(evt) {
          body.addClass(cssModify);
          mapDiv.addClass(cssGrabbing);
        });
        modify.on('modifyend', function(evt) {
          togglePopup(scope.feature); // Update popup position
          mapDiv.removeClass(cssGrabbing);
          // Remove the css class after digest cycle to avoid flickering
          $timeout(function() {
            body.removeClass(cssModify);
          }, 5, false);
        });
        var defineLayerToModify = function() {

          // Unregister the events attached to the previous source
          while (unSourceEvents.length) {
            ol.Observable.unByKey(unSourceEvents.pop());
          }
          ol.Observable.unByKey(unLayerVisible);

          // Set the layer to modify if exist, otherwise we use an empty
          // layer
          layer = createDefaultLayer(map, useTemporaryLayer);
          if (!useTemporaryLayer) {

            // If there is a layer loaded from public.admin.ch, we use it for
            // modification.
            map.getLayers().forEach(function(item) {
              if (gaMapUtils.isStoredKmlLayer(item)) {
                layer = item;
              }
            });

            // Attach events to the source to update the KML file stored
            // and to remove overlays when necessary
            var source = layer.getSource();
            unSourceEvents = [
              source.on('addfeature', saveDebounced),
              source.on('changefeature', saveDebounced),
              source.on('removefeature', saveDebounced),
              source.on('removefeature', function(evt) {
                // Use when the feature is removed outside the draw directive.
                unselectFeature(evt.feature);
              })
            ];

          }

          // Attach the snap interaction to the new layer's source
          if (snap) {
            map.removeInteraction(snap);
          }
          snap = new ol.interaction.Snap({
            source: layer.getSource()
          });
          map.addInteraction(snap);

          // Send the choosen layer to other components
          if (scope.options.broadcastLayer) {
            $rootScope.$broadcast('gaDrawingLayer', layer);
          }
        };

        // Activate the component: active a tool if one was active when draw
        // has been deactivated.
        var activate = function() {
          if (!scope.options.noModify) {
            map.addInteraction(select);
            map.addInteraction(modify);
          }
          defineLayerToModify();

          ol.Observable.unByKey(unLayerAdd);
          ol.Observable.unByKey(unLayerRemove);
          while (unWatch.length) {
            unWatch.pop()();
          }
          // if a layer is added from other component (Import KML, Permalink,
          // DnD ...) and the currentlayer has no features, we define a
          // new layer.
          unLayerAdd = map.getLayers().on('add', function(evt) {
            if (gaMapUtils.isStoredKmlLayer(evt.element) &&
                layer.getSource().getFeatures().length == 0 &&
                !useTemporaryLayer) {
              defineLayerToModify();
            }
          });

          // Block dblclick event in draw mode to avoid map zooming
          unDblClick = map.on('dblclick', function(evt) {
            return false;
          });
          select.setActive(true);

        };


        // Deactivate the component: remove layer and interactions.
        var deactivate = function(evt) {
          ol.Observable.unByKey(unLayerAdd);
          ol.Observable.unByKey(unDblClick);
          while (unWatch.length) {
            unWatch.pop()();
          }

          // Deactivate the tool
          if (lastActiveTool) {
            scope.options[lastActiveTool.activeKey] = false;
          }

          // Remove interactions
          deactivateDrawInteraction();
          select.setActive(false);

          // Unregister the events attached to the source
          while (unSourceEvents.length) {
            ol.Observable.unByKey(unSourceEvents.pop());
          }

          // Remove the layer if no features added
          if (layer && (useTemporaryLayer ||
              layer.getSource().getFeatures().length == 0)) {
            map.removeLayer(layer);
            layer = null;
          }
          map.removeInteraction(select);
          map.removeInteraction(modify);
          map.removeInteraction(snap);
        };

        // Set the draw interaction with the good geometry
        var activateDrawInteraction = function(tool) {
          select.setActive(false);
          deactivateDrawInteraction();

          // Create temporary help overlays
          helpTooltip = createHelpTooltip();
          map.addOverlay(helpTooltip);

          updateHelpTooltip(helpTooltip, tool.id, false);

          if (!gaBrowserSniffer.mobile) {
            unDrawEvts.push(map.on('pointermove', function(evt) {
              helpTooltip.setPosition(evt.coordinate);
            }));
          }

          draw = new ol.interaction.Draw(tool.drawOptions);
          var isFinishOnFirstPoint;
          unDrawEvts.push(draw.on('drawstart', function(evt) {
            // Remove the first features created if wanted
            var src = layer.getSource();
            if (tool.maxFeatures &&
                src.getFeatures().length >= tool.maxFeatures) {
              src.removeFeature(src.getFeatures()[0]);
            }
            var nbPoint = 1;
            var isSnapOnLastPoint = false;
            updateHelpTooltip(helpTooltip, tool.id, true,
                isFinishOnFirstPoint, isSnapOnLastPoint);

            // Add temporary measure tooltips
            if (tool.showMeasure) {
              // Distance overlay
              distTooltip = createMeasureTooltip();
              map.addOverlay(distTooltip);

              // Area overlay
              areaTooltip = createMeasureTooltip();
              map.addOverlay(areaTooltip);
            }

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
                updateHelpTooltip(helpTooltip, tool.id, true,
                    isFinishOnFirstPoint, isSnapOnLastPoint);
                if (tool.showMeasure) {
                  if (!isFinishOnFirstPoint) {
                    geom = new ol.geom.LineString(lineCoords);
                  }
                  updateMeasureTooltips(distTooltip, areaTooltip, geom);
                }
              }
            });
          }));

          unDrawEvts.push(draw.on('drawend', function(evt) {
            // Unregister the change event
            ol.Observable.unByKey(deregFeatureChange);
            deactivateTool(lastActiveTool);
            scope.$applyAsync();

            var featureToAdd = evt.feature;
            var geom = featureToAdd.getGeometry();

            // According to #3319, it seems LineString can be created with one
            // point (or with an array of exact same points). If it's the case
            // we ignore it.
            if (geom instanceof ol.geom.Polygon) {
              var hasUniqueCoords = true;
              var coords;
              geom.getCoordinates()[0].forEach(function(item) {
                if (!coords) {
                  coords = item;
                } else if (hasUniqueCoords &&
                    coords[0] == item[0] &&
                    coords[1] == item[1] &&
                    coords[2] == item[2]) {
                  coords = item;
                } else {
                  hasUniqueCoords = false;
                }
              });
              if (hasUniqueCoords) {
                return;
              }
            }

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

            // Set the definitve style of the feature
            featureToAdd.getGeometry().set('altitudeMode', 'clampToGround');
            layer.getSource().addFeature(featureToAdd);
            var styles = tool.style(featureToAdd);
            featureToAdd.setStyle(styles);
            select.getFeatures().push(featureToAdd);

            // Add final measure tooltips
            if (tool.showMeasure) {
              gaMeasure.addOverlays(map, layer, featureToAdd);
              map.removeOverlay(distTooltip);
              map.removeOverlay(areaTooltip);
            }
          }));
          map.addInteraction(draw);
        };
        var deactivateDrawInteraction = function() {
          while (unDrawEvts.length) {
            ol.Observable.unByKey(unDrawEvts.pop());
          }
          map.removeOverlay(helpTooltip);
          map.removeOverlay(distTooltip);
          map.removeOverlay(areaTooltip);
          if (draw) {
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


        // Deactivate tools if another draw directive actives one
        scope.$on('gaDrawToolActive', function(evt, drawScope) {
          if (drawScope !== scope && lastActiveTool &&
              scope.options[lastActiveTool.activeKey]) {
            deactivateTool(lastActiveTool);
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
          activateDrawInteraction(lastActiveTool);

          // The snap interaction must be added after modify and draw
          // interactions
          if (snap) {
            map.removeInteraction(snap);
          }
          if (!scope.options.noModify) {
            map.addInteraction(snap);
          }

          // Warn other draw directive that a tool has been activated
          $rootScope.$broadcast('gaDrawToolActive', scope);
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
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          gaExportKml.createAndDownload(layer, map.getView().getProjection());
          evt.preventDefault();
        };
        scope.deleteSelectedFeature = function(evt) {
          if ((!evt || (evt.which == 46 &&
                !/^(input|textarea)$/i.test(evt.target.nodeName))) &&
              select.getFeatures().getLength() > 0) {
            if (layer.getSource().getFeatures().length == 1) {
              scope.deleteAllFeatures();
              return;
            } else if (confirm($translate.instant(
                'confirm_remove_selected_features'))) {
              select.getFeatures().forEach(function(feature) {
                layer.getSource().removeFeature(feature);
              });
              select.getFeatures().clear();
            }
          }
        };
        // Delete all features of the layer
        scope.deleteAllFeatures = function(evt) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          if (confirm($translate.instant('confirm_remove_all_features'))) {
            select.getFeatures().clear();
            layer.getSource().clear();
            if (layer.adminId) {
              scope.statusMsgId = '';
              gaFileStorage.del(layer.adminId).then(function() {
                layer.adminId = undefined;
                layer.url = undefined;
              });
            }
            map.removeLayer(layer);
          }
        };

        scope.canExport = function() {
          return (layer) ? layer.getSource().getFeatures().length > 0 : false;
        };


        ////////////////////////////////////
        // Show share modal
        ////////////////////////////////////
        scope.canShare = function() {
          return layer && layer.adminId;
        };
        scope.share = function(evt) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          $rootScope.$broadcast('gaShareDrawActive', layer);
        };


        ////////////////////////////////////
        // Popup content management
        ////////////////////////////////////
        var togglePopup = function(feature) {
          if (scope.options.noStyleUpdate) {
            return;
          }
          scope.feature = feature;
          if (!scope.feature) {
            // Deactivate popups
            $rootScope.$broadcast('gaProfileActive');
            $rootScope.$broadcast('gaDrawStyleActive');
          } else if (gaMapUtils.isMeasureFeature(scope.feature)) {
            // Hide or show the Profile popup
            $rootScope.$broadcast('gaProfileActive', scope.feature,
                unselectFeature);

          } else {
            // Move the popup on the first coordinate of the feature
            var coord = feature.getGeometry().getFirstCoordinate();
            var pixel = map.getPixelFromCoordinate(coord);

            $rootScope.$broadcast('gaDrawStyleActive', layer, scope.feature, [
              pixel[0],
              pixel[1]
            ], unselectFeature);
          }
          scope.$applyAsync();
        };


        ////////////////////////////////////
        // create/update the file on s3
        ////////////////////////////////////
        var save = function(evt) {
          if (layer.getSource().getFeatures().length == 0) {
            //if no features to save do nothing
            return;
          }
          scope.statusMsgId = 'draw_file_saving';
          var kmlString = gaExportKml.create(layer,
              map.getView().getProjection());
          var id = layer.adminId ||
              gaFileStorage.getFileIdFromFileUrl(layer.url);
          gaFileStorage.save(id, kmlString,
              'application/vnd.google-earth.kml+xml').then(function(data) {
            scope.statusMsgId = 'draw_file_saved';

            // If a file has been created we set the correct id to the layer
            if (data.adminId && data.adminId != layer.adminId) {
              layer.adminId = data.adminId;
              layer.url = data.fileUrl;
              layer.id = 'KML||' + layer.url;
            }
          });
        };
        var saveDebounced = gaDebounce.debounce(save, 2000, false, false);


        var dereg = [
          $rootScope.$on('$translateChangeEnd', function() {
            if (layer) {
              layer.label = $translate.instant('draw_layer_label');
            }
          })
        ];

        // Remove interactions on destroy
        scope.$on('$destroy', function() {
          deactivate();
          dereg.forEach(function(item) {
            item();
          });
        });


        ////////////////////////////////////
        // Utils functions
        ////////////////////////////////////
        // Change cursor style on mouse move, only on desktop
        var updateCursorStyle = function(evt) {
          if (mapDiv.hasClass(cssGrabbing)) {
            mapDiv.removeClass(cssGrab);
            return;
          }
          var featureFound = map.forEachFeatureAtPixel(evt.pixel,
              featureFilter, this, layerFilter);
          var classes = cssPointer + ' ' + cssGrab;
          if (featureFound) {
            classes = cssPointer;
            var styles = featureFound.getStyle();
            if (styles && styles.length > 1 &&
                styles[styles.length - 1].getZIndex() ==
                gaStyleFactory.ZSKETCH) {
              classes += ' ' + cssGrab;
            }
            mapDiv.addClass(classes);
          } else {
            mapDiv.removeClass(classes);
          }
        };
        var updateCursorStyleDebounced = gaDebounce.debounce(
            updateCursorStyle, 10, false, false);
      }
    };
  });
})();
