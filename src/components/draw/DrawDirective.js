goog.provide('ga_draw_directive');

goog.require('ga_exportkml_service');
goog.require('ga_filestorage_service');
goog.require('ga_geomutils_service');
goog.require('ga_map_service');
goog.require('ga_measure_service');
goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_draw_directive', [
    'ga_exportkml_service',
    'ga_filestorage_service',
    'ga_geomutils_service',
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
   *   - useTemporaryLayer: force to use a new layer which will not be saved
   *                        automatically on s3.
   *
   */
  module.directive('gaDraw', function($translate, $rootScope, $timeout,
      gaBrowserSniffer, gaDefinePropertiesForLayer, gaDebounce, gaFileStorage,
      gaLayerFilters, gaExportKml, gaMapUtils, $document, gaMeasure,
      gaStyleFactory, gaGeomUtils) {

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

    // Display an help tooltip when drawing
    var updateHelpTooltip = function(overlay, type, drawStarted,
        hasMinNbPoints, onFirstPoint, onLastPoint) {
      if (!overlay) {
        return;
      }
      var helpMsgId = 'draw_start_';
      if (drawStarted) {
        if (type != 'marker' && type != 'annotation') {
          helpMsgId = 'draw_next_';
        }
        if (onLastPoint) {
          helpMsgId = 'draw_snap_last_point_';
        }
        if (onFirstPoint) {
          helpMsgId = 'draw_snap_first_point_';
        }
      }
      var msg = $translate.instant(helpMsgId + type);

      if (drawStarted && hasMinNbPoints) {
        msg += '<br/>' + $translate.instant('draw_delete_last_point');
      }
      overlay.getElement().innerHTML = msg;
    };

    // Display an help tooltip when modifying
    var updateModifyHelpTooltip = function(overlay, type, onExistingVertex) {
      if (!overlay) {
        return;
      }
      var helpMsgId = 'modify_new_vertex_';
      if (onExistingVertex) {
        helpMsgId = 'modify_existing_vertex_';
      }
      overlay.getElement().innerHTML = $translate.instant(helpMsgId + type);
    };

    // Display an help tooltip when selecting
    var updateSelectHelpTooltip = function(overlay, type) {
      if (!overlay) {
        return;
      }
      var helpMsgId = 'select_no_feature';
      if (type) {
        helpMsgId = 'select_feature_' + type;
      }
      overlay.getElement().innerHTML = $translate.instant(helpMsgId);
    };

    // Remove last point when drawing a feature
    var removeLastPoint = function(evt) {
      if (evt.data && evt.which == 46 &&
          !/^(input|textarea)$/i.test(evt.target.nodeName)) {
        evt.data.removeLastPoint();
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
            deregPointerEvts = [], deregFeatureChange, unLayerVisible,
            unWatch = [], unDrawEvts = [];
        var useTemporaryLayer = scope.options.useTemporaryLayer || false;
        var helpTooltip;
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
        var hideHelpTooltip = function() {
          helpTooltip.setPosition(undefined);
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
              deregPointerEvts = map.on([
                'pointerdown',
                'pointerup',
                'pointermove'
              ], function(evt) {
                helpTooltip.setPosition(evt.coordinate);
                updateCursorAndTooltipsDebounced(evt);
              });
              mapDiv.on('mouseout', hideHelpTooltip);
            }
            // Delete keyboard button
            $document.keyup(scope.deleteSelectedFeature);
          } else {
            deregPointerEvts.forEach(function(item) {
              ol.Observable.unByKey(item);
            });
            $document.off('keyup', scope.deleteSelectedFeature);
            mapDiv.off('mouseout', hideHelpTooltip);
            select.getFeatures().clear();
          }
        });
        select.on('select', function(evt) {
          if (evt.selected[0]) {
            // Update the position of the popup according to the click event.
            managePopup(evt.selected[0], evt.mapBrowserEvent.coordinate);
          }
        });
        select.getFeatures().on('add', function(evt) {
           // Apply the select style
          var styles = scope.options.selectStyleFunction(evt.element);
          evt.element.setStyle(styles);
          // Show the popup
          managePopup(evt.element);
        });
        select.getFeatures().on('remove', function(evt) {
          // Remove the select style
          var styles = evt.element.getStyle();
          styles.pop();
          evt.element.setStyle(styles);
          // Hide or move the popup to the next selected feature
          managePopup(evt.target.item(0));
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
        var onClosePopup = function(feature) {
          if (select.getFeatures().getLength() > 1) {
            return;
          }
          unselectFeature(feature);
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
          if (evt.mapBrowserEvent.type != 'singleclick') {
            body.addClass(cssModify);
            mapDiv.addClass(cssGrabbing);
          }
        });
        modify.on('modifyend', function(evt) {
          if (evt.mapBrowserEvent.type == 'pointerup') {
            mapDiv.removeClass(cssGrabbing);
            // Remove the css class after digest cycle to avoid flickering
            $timeout(function() {
              body.removeClass(cssModify);
            }, 0, false);
            // Move the popup to the new position
            managePopup(evt.features.item(0),
                evt.mapBrowserEvent.coordinate);
          }
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
              source.on('removefeature', function(evt) {
                saveDebounced();
                // Used when the feature is removed outside the draw directive.
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

          // Create temporary help overlays
          if (!gaBrowserSniffer.mobile) {
            if (!helpTooltip) {
              helpTooltip = createHelpTooltip();
            }
            map.addOverlay(helpTooltip);
          }

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

          // Remove help overlay
          if (helpTooltip) {
            map.removeOverlay(helpTooltip);
          }
        };

        // Set the draw interaction with the good geometry
        var activateDrawInteraction = function(tool) {
          select.setActive(false);
          deactivateDrawInteraction();

          updateHelpTooltip(helpTooltip, tool.id, false);

          if (!gaBrowserSniffer.mobile) {
            unDrawEvts.push(map.on('pointermove', function(evt) {
              helpTooltip.setPosition(evt.coordinate);
            }));
          }

          draw = new ol.interaction.Draw(tool.drawOptions);
          var isFinishOnFirstPoint;
          unDrawEvts.push(draw.on('drawstart', function(evt) {
            var nbPoint = 1;
            var isSnapOnLastPoint = false;
            updateHelpTooltip(helpTooltip, tool.id, true, false,
                isFinishOnFirstPoint, isSnapOnLastPoint);

            if (!gaBrowserSniffer.mobile) {
              $document.keyup(draw, removeLastPoint);
            }

            // Add temporary measure tooltips
            if (tool.showMeasure) {
              gaMeasure.addOverlays(map, layer, evt.feature);
            }

            deregFeatureChange = evt.feature.on('change', function(evt) {

              // Keep the overlays on draw to remove it if the draw mode is
              // deactivated during drawing.
              draw.set('overlays', evt.target.get('overlays') || []);

              var geom = evt.target.getGeometry();
              if (geom instanceof ol.geom.Polygon) {
                var lineCoords = geom.getCoordinates()[0];

                if (nbPoint != lineCoords.length) {
                  // A point is added or removed
                  nbPoint = lineCoords.length;
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
                }
                updateHelpTooltip(helpTooltip, tool.id, true,
                    (tool.drawOptions.minPoints < lineCoords.length),
                    isFinishOnFirstPoint, isSnapOnLastPoint);
              }
            });
          }));

          unDrawEvts.push(draw.on('drawend', function(evt) {
            // Unregister key event
            $document.off('keyup', removeLastPoint);

            // Unregister the change event
            ol.Observable.unByKey(deregFeatureChange);

            // Clear overlays property before deactivating the tool
            draw.unset('overlays');
            deactivateTool(lastActiveTool);
            scope.$applyAsync();

            var featureToAdd = evt.feature;
            var geom = featureToAdd.getGeometry();
            // According to #3319, it seems LineString can be created with one
            // point (or with an array of exact same points). If it's the case
            // we ignore it.
            if (geom instanceof ol.geom.Polygon &&
                gaGeomUtils.hasUniqueCoord(geom.getCoordinates()[0])) {
              return;
            }

            if (geom instanceof ol.geom.Polygon && !isFinishOnFirstPoint) {
              // The sketchFeatureArea is automatically closed by the draw
              // interaction even if the user has finished drawing on the
              // last point. So we remove the useless coordinates.
              var lineCoords = geom.getCoordinates()[0];
              lineCoords.pop();
              if (tool.showMeasure) {
                // We remove the area tooltip.
                gaMeasure.removeOverlays(featureToAdd);
              }
              featureToAdd.setGeometry(new ol.geom.LineString(lineCoords));
            }

            // Update feature properties
            if (!featureToAdd.getId() && lastActiveTool) {
              featureToAdd.setId(lastActiveTool.id + '_' +
                  new Date().getTime());
            }
            if (lastActiveTool) {
              featureToAdd.set('type', lastActiveTool.id);
            }
            featureToAdd.getGeometry().set('altitudeMode', 'clampToGround');

            // Set the definitive style of the feature
            featureToAdd.setStyle(tool.style(featureToAdd));

            // Add the feature to the layer and select it
            layer.getSource().addFeature(featureToAdd);
            select.getFeatures().push(featureToAdd);
          }));

          map.addInteraction(draw);
        };

        var deactivateDrawInteraction = function() {
          while (unDrawEvts.length) {
            ol.Observable.unByKey(unDrawEvts.pop());
          }
          if (draw) {
            map.removeInteraction(draw);

            if (draw.get('overlays')) {
              draw.get('overlays').forEach(function(overlay) {
                map.removeOverlay(overlay);
              });
            }
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
          var length = select.getFeatures().getLength();
          if ((!evt || (evt.which == 46 &&
              !/^(input|textarea)$/i.test(evt.target.nodeName))) &&
              length > 0) {
            if (layer.getSource().getFeatures().length == length) {
              scope.deleteAllFeatures(evt);
              return;
            } else if (confirm($translate.instant(
                'confirm_remove_selected_features'))) {
              var feats = select.getFeatures().getArray();
              for (var i = length - 1; i >= 0; i--) {
                layer.getSource().removeFeature(feats[i]);
              }
            }
          }
        };
        // Delete all features of the layer
        scope.deleteAllFeatures = function(evt) {
          if (evt.currentTarget.attributes &&
              evt.currentTarget.attributes.disabled) {
            return;
          }
          if (confirm($translate.instant('confirm_remove_all_features'))) {
            layer.getSource().clear();
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
        // Popup management
        ////////////////////////////////////
        var managePopup = function(feature, clickCoord) {
          scope.feature = feature;
          if (!scope.feature) {
            // Hide popups
            $rootScope.$broadcast('gaProfileActive');
            $rootScope.$broadcast('gaDrawStyleActive');
            scope.$applyAsync();
          } else if (gaMapUtils.isMeasureFeature(scope.feature)) {
            if (!clickCoord) {
              // Hide or show the Profile popup
              $rootScope.$broadcast('gaProfileActive', scope.feature, layer,
                  onClosePopup);
              scope.$applyAsync();
            }
          } else {
            // Move the popup on the closest coordinate of the click event
            var coord = clickCoord ?
                feature.getGeometry().getClosestPoint(clickCoord) :
                feature.getGeometry().getLastCoordinate();
            var pixel = map.getPixelFromCoordinate(coord);

            $rootScope.$broadcast('gaDrawStyleActive', scope.feature, layer,
                pixel, onClosePopup);
            scope.$applyAsync();
          }
        };


        ////////////////////////////////////
        // create/update the file on s3
        ////////////////////////////////////
        var save = function(evt) {
          if (layer.getSource().getFeatures().length == 0) {
            //if no features to save, delete the file
            if (layer.adminId) {
              scope.statusMsgId = '';
              gaFileStorage.del(layer.adminId).then(function() {
                layer.adminId = undefined;
                layer.url = undefined;
              });
            }
            map.removeLayer(layer);
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


        var dereg = $rootScope.$on('$translateChangeEnd', function() {
          if (layer) {
            layer.label = $translate.instant('draw_layer_label');
          }
        });

        // Remove interactions on destroy
        scope.$on('$destroy', function() {
          deactivate();
          dereg();
        });


        ////////////////////////////////////
        // Utils functions
        ////////////////////////////////////
        // Change cursor style on mouse move, only on desktop
        var updateCursorAndTooltips = function(evt) {
          if (mapDiv.hasClass(cssGrabbing)) {
            mapDiv.removeClass(cssGrab);
            return;
          }
          var hoverSelectableFeature = false;
          var hoverNewVertex = false;
          var hoverVertex = false;
          var selectableFeat, newVertexFeat;
          var type;

          // Try to find a selectable feature
          map.forEachFeatureAtPixel(
            evt.pixel,
            function(feature, layer) {
              if (layer && !selectableFeat) {
                // The selected feature is the first we caught with an array as
                // style property.
                selectableFeat = feature;
                hoverSelectableFeature = true;
              } else if (select.getFeatures().getLength() > 0) {
                newVertexFeat = feature;
                hoverNewVertex = true;
              }
            },
            this,
            function(itemLayer) {
              return layerFilter(itemLayer) ||
                  (itemLayer.getStyle &&
                  itemLayer.getStyle() == scope.options.selectStyleFunction);
            }
          );
          if (selectableFeat) {
            // Get the type of the feature
            type = selectableFeat.getId().split('_')[0];

            if (newVertexFeat) {
              // We try to find out if the newVertex is snapped on an existing
              // one.
              var styles = selectableFeat.getStyle();
              var vertexStyle = styles[styles.length - 1];
              if (vertexStyle) {
                var geom = vertexStyle.getGeometryFunction()(selectableFeat);
                if (geom) {
                  var coord = newVertexFeat.getGeometry().getCoordinates();
                  var closestPt = geom.getClosestPoint(coord);
                  hoverVertex = (coord[0] == closestPt[0] &&
                      coord[1] == closestPt[1]);
                }
              }
            }
          }

          if (!hoverSelectableFeature) {
            // If the cursor is not hover a selectable feature.
            mapDiv.removeClass(cssPointer + ' ' + cssGrab);
            updateSelectHelpTooltip(helpTooltip);

          } else if (hoverSelectableFeature && !hoverNewVertex &&
              !hoverVertex) {
            // If the cursor is hover a selectable feature.
            mapDiv.addClass(cssPointer);
            mapDiv.removeClass(cssGrab);
            updateSelectHelpTooltip(helpTooltip, type);

          } else if (hoverNewVertex || hoverVertex) {
            // If a feature is selected and if the cursor is hover a draggable
            // vertex.
            mapDiv.addClass(cssGrab);
            updateModifyHelpTooltip(helpTooltip, type, hoverVertex);
          }
        };
        var updateCursorAndTooltipsDebounced = gaDebounce.debounce(
            updateCursorAndTooltips, 10, false, false);
      }
    };
  });
})();
