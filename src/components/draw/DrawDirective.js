goog.provide('ga_draw_directive');

goog.require('ga_export_kml_service');
goog.require('ga_file_storage_service');
goog.require('ga_map_service');
goog.require('ga_measure_service');
goog.require('ga_permalink');
(function() {

  var module = angular.module('ga_draw_directive', [
    'ga_export_kml_service',
    'ga_file_storage_service',
    'ga_map_service',
    'ga_measure_service',
    'ga_permalink',
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
        gaExportKml, gaMapUtils, gaPermalink, gaUrlUtils,
        $document, gaMeasure) {

      var createDefaultLayer = function(map, useTemporaryLayer) {
        var dfltLayer = new ol.layer.Vector({
          source: new ol.source.Vector(),
          visible: true
        });
        gaDefinePropertiesForLayer(dfltLayer);

        if (useTemporaryLayer) {
          dfltLayer.displayInLayerManager = false;
          dfltLayer.preview = true;
        }
        gaMeasure.registerOverlaysEvents(map, dfltLayer);
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
            if (coords.length == 2 ||
                (coords.length == 3 && coords[1][0] == coords[2][0] &&
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
          var layer, draw, lastActiveTool, snap;
          var unDblClick, unLayerAdd, unLayerRemove, unSourceEvents = [],
              deregPointerMove, deregFeatureChange, unLayerVisible,
              unWatch = [], unDrawEvts = [];
          var useTemporaryLayer = scope.options.useTemporaryLayer || false;
          var helpTooltip, distTooltip, areaTooltip;
          var map = scope.map;
          var viewport = $(map.getViewport());
          scope.isPropsActive = true;
          scope.isMeasureActive = false;
          scope.options.isProfileActive = false;
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
            updatePropsTabContent();
            togglePopup(evt.element);
          });
          select.getFeatures().on('remove', function(evt) {
            // Remove the select style
            var styles = evt.element.getStyle();
            styles.pop();
            evt.element.setStyle(styles);
            updatePropsTabContent();
            togglePopup();
          });
          select.setActive(false);
          map.addInteraction(select);

          // Add modify interaction
          // The modify interaction works with features selected by the select
          // interaction so no need to activate/deactivate it.
          // Activate/deactivate the select interaction is enough.
          var modify = new ol.interaction.Modify({
            features: select.getFeatures(),
            style: scope.options.selectStyleFunction
          });
          map.addInteraction(modify);

          var defineLayerToModify = function() {

            // Unregister the events attached to the previous source
            for (var i in unSourceEvents) {
              ol.Observable.unByKey(unSourceEvents[i]);
            }
            ol.Observable.unByKey(unLayerVisible);

            // Set the layer to modify if exist, otherwise we use an empty
            // layer
            layer = createDefaultLayer(map, useTemporaryLayer);
            if (!useTemporaryLayer) {
              scope.adminShortenUrl = undefined;
              scope.userShortenUrl = undefined;

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
                source.on('removefeature', saveDebounced)
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
            defineLayerToModify();

            if (layer.adminId) {
              updateShortenUrl(layer.adminId);
            }
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

            // Active watchers
            // Update selected feature's style when the user change a value
            unWatch.push(scope.$watchGroup([
              'options.icon',
              'options.iconSize',
              'options.color',
              'options.name',
              'options.description'
            ], function() {
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
            }));

            unWatch.push(scope.$watch('popupToggle', function(active) {
              if (!active) {
                select.getFeatures().clear();
              }
            }));

            unWatch.push(scope.$on('gaPermalinkChange', function() {
              if (layer.adminId) {
                updateShortenUrl(layer.adminId);
              }
            }));
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
            for (var i in unSourceEvents) {
              ol.Observable.unByKey(unSourceEvents[i]);
            }
            unSourceEvents = [];

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
              featureToAdd.getGeometry().set('altitudeMode', 'clampToGround');
              layer.getSource().addFeature(featureToAdd);
              var styles = tool.style(featureToAdd);
              featureToAdd.setStyle(styles);
              scope.$apply();
              deactivateTool(lastActiveTool);
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

            // The snap interaction must be added after modify and draw
            // interactions
            if (snap) {
              map.removeInteraction(snap);
            }
            map.addInteraction(snap);

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
          scope.deleteAllFeatures = function() {
            if (confirm($translate.instant('confirm_remove_all_features'))) {
              select.getFeatures().clear();
              layer.getSource().clear();
              if (layer.adminId) {
                scope.statusMsgId = '';
                gaFileStorage.del(layer.adminId).then(function() {
                  layer.adminId = undefined;
                  layer.url = undefined;
                  scope.adminShortenUrl = undefined;
                  scope.userShortenUrl = undefined;
                });
              }
              map.removeLayer(layer);
            }
          };

          scope.canExport = function() {
            return (layer) ? layer.getSource().getFeatures().length > 0 : false;
          };



          ////////////////////////////////////
          // Shorten url stuff
          ////////////////////////////////////
          var updateShortenUrl = function(adminId) {

            // For now we pass the long permalink otherwoise we need to
            // regenerate the permalink on each map interaction
            /*$http.get(scope.options.shortenUrl, {
              params: {
                url: gaPermalink.getHref().replace(
                    gaUrlUtils.encodeUriQuery(layer.id, true), '') +
                    '&adminId=' + adminId
              }
            }).success(function(data) {
              scope.adminShortenUrl = data.shorturl;
            });
            $http.get(scope.options.shortenUrl, {
              params: {
                url: gaPermalink.getHref()
              }
            }).success(function(data) {
              scope.userShortenUrl = data.shorturl;
            });*/
            scope.adminShortenUrl = gaPermalink.getHref().replace(
                gaUrlUtils.encodeUriQuery(layer.id, true), '') +
                '&adminId=' + adminId;
            scope.userShortenUrl = gaPermalink.getHref();
          };



          ////////////////////////////////////
          // Popup content management
          ////////////////////////////////////
          var popupTitlePrefix = 'draw_popup_title_';
          var togglePopup = function(feature) {
            if (feature) {
              scope.feature = feature;
              // Open the popup
              scope.popupToggle = true;
              // Set the correct title
              scope.options.popupOptions.title = popupTitlePrefix +
                  feature.get('type');
              if (feature.get('type') == 'measure') {
                scope.activeTabProfile();
              } else if (feature.get('type') == 'linepolygon') {
                scope.activeTabMeasure();
              } else {
                scope.activeTabProps();
              }
            } else {
              scope.feature = undefined;
              scope.popupToggle = false;
              scope.options.popupOptions.title = popupTitlePrefix + 'feature';
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
                scope.options.iconSize = findIconSize(featStyle.getImage(),
                    scope.options.iconSizes);
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
            return (feature.get('type') != 'measure' && !isPoint);
          };
          scope.showProfileTab = function(feature) {
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

              if (!scope.adminShortenUrl) {
                updateShortenUrl(layer.adminId);
              }
            });
          };
          var saveDebounced = gaDebounce.debounce(save, 2000, false, false);

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
            var featureFound = map.forEachFeatureAtPixel(evt.pixel,
                featureFilter, this, layerFilter);
            var isSketchFeature = !!featureFound && !featureFound.getStyle();
            map.getTarget().style.cursor = (featureFound) ?
                ((isSketchFeature) ? 'move' : 'pointer') : '';
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
            dropdown.css('left', bt.offset().left -
                (dropdown.outerWidth() - bt.outerWidth()) + 'px');
          });
        }
      };
  });
})();
