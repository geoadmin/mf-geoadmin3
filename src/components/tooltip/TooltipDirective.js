goog.provide('ga_tooltip_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_debounce_service');
goog.require('ga_identify_service');
goog.require('ga_iframecom_service');
goog.require('ga_map_service');
goog.require('ga_popup_service');
goog.require('ga_previewfeatures_service');
goog.require('ga_time_service');
goog.require('ga_topic_service');

(function() {

  var module = angular.module('ga_tooltip_directive', [
    'ga_browsersniffer_service',
    'ga_debounce_service',
    'ga_identify_service',
    'ga_iframecom_service',
    'ga_map_service',
    'ga_popup_service',
    'ga_previewfeatures_service',
    'ga_time_service',
    'ga_topic_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaTooltip',
      function($timeout, $http, $q, $translate, $sce, $rootScope, gaPopup,
          gaLayers, gaBrowserSniffer, gaMapClick, gaDebounce, gaPreviewFeatures,
          gaMapUtils, gaTime, gaTopic, gaIdentify, gaGlobalOptions,
          gaPermalink, gaIFrameCom, gaUrlUtils, gaLang) {
        var mouseEvts = '';
        if (!gaBrowserSniffer.mobile) {
          mouseEvts = 'ng-mouseenter="options.onMouseEnter($event,' +
              'options.htmls.length)" ' +
              'ng-mouseleave="options.onMouseLeave($event)" ';
        }
        var popupContent =
          '<div ng-repeat="html in options.htmls track by $index" ' +
               'ng-mouseenter="options.onMouseEnter($event,' +
                   'options.htmls.length)" ' +
               'ng-mouseleave="options.onMouseLeave($event)">' +
            '<div ng-bind-html="html.snippet"></div>' +
            '<div ng-if="::html.showVectorInfos" class="ga-vector-tools">' +
              '<div ga-measure="::html.feature"></div>' +
              '<div ng-if="::html.showProfile" ' +
                   'ga-profile-bt="::html.feature"></div>' +
            '</div>' +
            '<div ga-shop ' +
                 'ga-shop-map="::html.map" ' +
                 'ga-shop-feature="::html.feature" ' +
                 'ga-shop-clipper-geometry="::html.clickGeometry"></div>' +
            '<div class="ga-tooltip-separator" ' +
                 'ng-show="!$last"></div>' +
          '</div>';

        var getOlParentLayer = function(olLayer) {
          var parentLayerBodId = gaLayers.getBodParentLayerId(olLayer);
          return gaLayers.getOlLayerById(parentLayerBodId) || olLayer;
        };

        // Get all the queryable layers
        var getLayersToQuery = function(map) {
          var layersToQuery = {
            bodLayers: [],
            vectorLayers: [],
            wmsLayers: []
          };
          map.getLayers().forEach(function(l) {
            if (!l.visible || l.preview) {
              return;
            }

            if (gaMapUtils.isVectorLayer(l)) {
              layersToQuery.vectorLayers.push(l);
            } else if (gaLayers.hasTooltipBodLayer(l)) {
              layersToQuery.bodLayers.push(l);
            } else if (gaMapUtils.isWMSLayer(l)) {
              layersToQuery.wmsLayers.push(l);
            }
          });
          return layersToQuery;
        };

        // Test if a feature is queryable.
        var isFeatureQueryable = function(feature) {
          var geom = feature.getGeometry();
          return feature && feature.get('name') || feature.get('description') ||
              !(geom instanceof ol.geom.MultiPoint ||
              geom instanceof ol.geom.MultiLineString ||
              geom instanceof ol.geom.MultiPolygon ||
              geom instanceof ol.geom.GeometryCollection);
        };

        // Find the first feature from a vector layer
        var findVectorFeature = function(map, pixel, vectorLayer) {
          var featureFound;
          map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            // vectorLayer is defined when a feature is clicked.
            // onclick, geolocation circle is unselectable
            if (layer && !feature.getProperties().unselectable) {
              if (!vectorLayer || vectorLayer == layer) {
                if (!featureFound) {
                  featureFound = feature;
                }
              }
            }
          });
          return featureFound;
        };

        // Change cursor style on mouse move, only on desktop
        var mapDiv;
        var updateCursorStyle = function(map, pixel) {
          var feature;
          var hasQueryableLayer = false;
          if (!mapDiv) {
            mapDiv = $(map.getTarget());
          }
          if (!gaBrowserSniffer.msie || gaBrowserSniffer.msie > 10) {
            hasQueryableLayer = map.forEachLayerAtPixel(pixel,
              function() {
                return true;
              },
              undefined,
              function(layer) {
                return gaLayers.hasTooltipBodLayer(layer);
              });
          }
          if (!hasQueryableLayer) {
            feature = findVectorFeature(map, pixel);
          }
          if (hasQueryableLayer || feature) {
            mapDiv.addClass('ga-pointer');
          } else {
            mapDiv.removeClass('ga-pointer');
          }
        };
        var updateCursorStyleDebounced = gaDebounce.debounce(
                updateCursorStyle, 10, false, false);

        // Register click/touch/mousemove events on map
        var deregMapEvents = angular.noop;
        var registerMapEvents = function(scope, onClick) {
          if (deregMapEvents !== angular.noop) {
            return;
          }
          var map = scope.map;
          var onMapClick = function(evt) {
            var coordinate = (evt.originalEvent) ?
                map.getEventCoordinate(evt.originalEvent) :
                evt.coordinate;

            // A digest cycle is necessary for $http requests to be
            // actually sent out. Angular-1.2.0rc2 changed the $evalSync
            // function of the $rootScope service for exactly this. See
            // Angular commit 6b91aa0a18098100e5f50ea911ee135b50680d67.
            // We use a conservative approach and call $apply ourselves
            // here, but we instead could also let $evalSync trigger a
            // digest cycle for us.

            scope.$applyAsync(function() {
              onClick(coordinate);
            });
          };
          var deregMapClick = gaMapClick.listen(map, onMapClick);
          var deregPointerMove;
          if (!gaBrowserSniffer.mobile) {
            deregPointerMove = map.on('pointermove', function(evt) {
              updateCursorStyleDebounced(map, evt.pixel);
            });
          }
          deregMapEvents = function() {
            deregMapClick();
            ol.Observable.unByKey(deregPointerMove);
            deregMapEvents = angular.noop;
          };
        };

        // Register leftclick event on globe
        var deregGlobeEvents = angular.noop;
        var registerGlobeEvents = function(scope, onClick) {
          if (deregGlobeEvents != angular.noop) {
            return;
          }
          var ms = 0;
          var blockNextLeftClick = false;
          var scene = scope.ol3d.getCesiumScene();
          var ellipsoid = scene.globe.ellipsoid;
          var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
          handler.setInputAction(function(evt, a, b) {
            if (blockNextLeftClick && (new Date() - ms) < 1000) {
              blockNextLeftClick = false;
              return;
            }
            var cartesian = olcs.core.pickOnTerrainOrEllipsoid(scene,
                evt.position);
            if (cartesian) {
              var cartographic = ellipsoid.cartesianToCartographic(cartesian);
              var coordinate = ol.proj.transform([
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude)
              ], 'EPSG:4326', scope.map.getView().getProjection());
            }
            scope.$applyAsync(function() {
              onClick(coordinate, evt.position);
            });
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

          handler.setInputAction(function(evt, a, b) {
            blockNextLeftClick = true;
            ms = new Date();
          }, Cesium.ScreenSpaceEventType.PINCH_END);


          deregGlobeEvents = function() {
            if (!handler.isDestroyed()) {
              handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
              handler.removeInputAction(Cesium.ScreenSpaceEventType.PINCH_END);
              handler.destroy();
              deregGlobeEvents = angular.noop;
            }
          };
        };

        return {
          restrict: 'A',
          scope: {
            map: '=gaTooltipMap',
            ol3d: '=gaTooltipOl3d',
            options: '=gaTooltipOptions',
            isActive: '=gaTooltipActive'
          },
          link: function(scope, element, attrs) {
            var htmls = [],
                featuresByLayerId = {},
                onCloseCB = angular.noop,
                map = scope.map,
                popup,
                canceler,
                vector,
                vectorSource,
                listenerKey,
                parser = new ol.format.GeoJSON();

            var is3dActive = function() {
              return scope.ol3d && scope.ol3d.getEnabled();
            };

            // Destroy the popup specified when needed
            var destroyPopup = function() {
              $timeout(function() {
                // We destroy the popup only if it's still closed
                if (popup && popup.scope && popup.scope.toggle === false) {
                  popup.destroy();
                  popup = undefined;
                }
              }, 0);
            };

            var cancelRequests = function() {
              // Cancel all pending requests
              if (canceler) {
                canceler.resolve();
              }
              // Create new cancel object
              canceler = $q.defer();
            };

            // Destroy popup and highlight
            var initTooltip = function() {
              cancelRequests();
              // htmls = [] would break the reference in the popup
              htmls.splice(0, htmls.length);
              featuresByLayerId = {};
              if (popup) {
                popup.close();
              }

              // Clear the preview features
              gaPreviewFeatures.clear(map);

              // Remove the remove layer listener if exist
              if (listenerKey) {
                ol.Observable.unByKey(listenerKey);
              }
            };
            scope.$on('gaTopicChange', initTooltip);
            scope.$on('gaTriggerTooltipInit', initTooltip);
            scope.$on('gaTriggerTooltipRequest', function(event, data) {
              if (!data.nohighlight) {
                initTooltip();
              }

              // We use $timeout to execute the showFeature when the
              // popup is correctly closed.
              $timeout(function() {
                showFeatures(data.features, null, data.nohighlight);
                onCloseCB = data.onCloseCB;
              }, 0);
            });
            var reloadHtmlByIndex = function(i) {
              var feat = htmls[i].feature;
              if (feat && feat.layerBodId) {
                getFeaturePopupHtml(feat.layerBodId, feat.id)
                    .then(function(response) {
                  htmls[i].snippet = $sce.trustAsHtml(response.data);
                });
              }
            };
            // TODO handle vector layer toolip
            $rootScope.$on('$translateChangeEnd', function() {
              var tmp, feature, layerBodId, featureId;
              if (scope.isActive && htmls.length) {
                cancelRequests();
                for (var i = 0; i < htmls.length; i++) {
                  reloadHtmlByIndex(i);
                }
              }
            });

            scope.$on('gaTriggerTooltipInitOrUnreduce', function(event) {
              if (popup && popup.scope.options.isReduced) {
                popup.close();
              } else {
                initTooltip();
              }
            });

            // Register the click on globe when ol3d is ready
            scope.$watch('::ol3d', function(ol3d) {
              if (ol3d) {
                // Listen when the app switch between 2d/3d
                scope.$watch(function() {
                  return scope.ol3d.getEnabled();
                }, function(enabled) {
                  if (scope.isActive) {
                    if (enabled) {
                      deregMapEvents();
                      registerGlobeEvents(scope, findFeatures);
                    } else {
                      deregGlobeEvents();
                      registerMapEvents(scope, findFeatures);
                    }
                  }
                });
              }
            });

            var activate = function() {
              if (is3dActive()) {
                registerGlobeEvents(scope, findFeatures);
              } else {
                registerMapEvents(scope, findFeatures);
              }
            };

            var deactivate = function() {
              // Remove the highlighted feature when we deactivate the tooltip
              initTooltip();
              deregMapEvents();
              deregGlobeEvents();
            };

            scope.$watch('isActive', function(active) {
              if (active) {
                activate();
              } else {
                deactivate();
              }
            });

            scope.$on('destroy', function() {
              deactivate();
            });

            // Find features for all type of layers
            var findFeatures = function(coordinate, position3d) {
              initTooltip();
              if (!coordinate ||
                 !ol.extent.containsCoordinate(gaMapUtils.defaultExtent,
                 coordinate)) {
                return;
              }
              // Use by the ga-shop directive
              scope.clickCoordinate = coordinate;
              var pointerShown = (map.getTarget().style.cursor == 'pointer');
              var mapRes = map.getView().getResolution();
              var mapProj = map.getView().getProjection();
              var pixel = map.getPixelFromCoordinate(coordinate);
              var layersToQuery = getLayersToQuery(map);

              // When 3d is Active we use the cesium native function to get the
              // first queryable feature.
              if (is3dActive()) {
                var pickedObjects = scope.ol3d.getCesiumScene().
                    drillPick(position3d);
                for (var i = 0, ii = pickedObjects.length; i < ii; i++) {
                   var prim = pickedObjects[i].primitive;
                   if (isFeatureQueryable(prim.olFeature)) {
                     showVectorFeature(prim.olFeature, prim.olLayer);
                     break;
                   }
                }
              } else {
                // Go through queryable vector layers
                // Launch no requests.
                layersToQuery.vectorLayers.forEach(function(layerToQuery) {
                  var feature = findVectorFeature(map, pixel, layerToQuery);
                  if (feature) {
                    showVectorFeature(feature, layerToQuery);
                  }
                });
              }

              var all = []; // List of promises launched

              // Go through all queryable bod layers.
              // Launch identify requests.
              layersToQuery.bodLayers.forEach(function(layerToQuery) {
                var geometry = new ol.geom.Point(coordinate);
                var returnGeometry = !!gaLayers.getLayerProperty(
                    layerToQuery.bodId, 'highlightable');
                var shopLayer = (gaLayers.getLayerProperty(
                    layerToQuery.bodId, 'shop') && !gaLayers.getLayerProperty(
                    layerToQuery.bodId, 'shopMulti'));
                var shopMultiLayer = gaLayers.getLayerProperty(
                    layerToQuery.bodId, 'shopMulti');

                var limit = shopMultiLayer ? 10 : null;
                var order = limit ? 'distance' : null;
                var tol = shopLayer ? 0 : scope.options.tolerance;

                all.push(gaIdentify.get(map, [layerToQuery], geometry, tol,
                    returnGeometry, canceler.promise, limit, order).then(
                  function(response) {
                    showFeatures(response.data.results, coordinate);
                    return response.data.results.length;
                }));
              });

              // Go through queryable wms layers
              // Launch GetFeatureInfo requests.
              layersToQuery.wmsLayers.forEach(function(layerToQuery) {
                var extent = layerToQuery.getExtent();
                if (extent && !ol.extent.containsCoordinate(extent,
                    coordinate)) {
                  return;
                }
                var source = layerToQuery.getSource();
                var sourceCoord, sourceRes,
                    sourceProj = source.getProjection();
                if (sourceProj) { // auto reprojection
                  sourceRes = ol.reproj.calculateSourceResolution(sourceProj,
                      mapProj, coordinate, mapRes);
                  sourceCoord = ol.proj.transform(coordinate, mapProj,
                      sourceProj);
                }
                var url = source.getGetFeatureInfoUrl(
                    sourceCoord || coordinate,
                    sourceRes || mapRes,
                    sourceProj || mapProj,
                    {'INFO_FORMAT': 'text/plain', 'LANG': gaLang.get()});
                if (!is3dActive() && url) {
                  url = gaUrlUtils.proxifyUrl(url);
                  all.push($http.get(url, {
                    timeout: canceler.promise,
                    layer: layerToQuery
                  }).then(function(response) {
                    var text = response.data;
                    if (/(Server Error|ServiceException)/.test(text)) {
                      return 0;
                    }
                    var feat = new ol.Feature({
                      geometry: null,
                      description: '<pre>' + text + '</pre>'
                    });
                    showVectorFeature(feat, response.config.layer);
                    return 1;
                  }));
                }
              });

              // When all the requests are finished we test how many features
              // are displayed. If there is none and the cursor was a pointer
              // in the moment of the click, we show a no-info box for
              // 3 seconds. As we show pointer only on desktop, this also
              // means that no-info box is never shown on mobile
              if (all.length > 0) {
                $q.all(all).then(function(nbResults) {
                  var sum = nbResults.reduce(function(a, b) {
                    return a + b;
                  });
                  if (sum == 0 && pointerShown) {
                    showNoInfo();
                  }
                });
              }
            };

            var getFeaturePopupHtml = function(bodId, featureId, coordinate) {
              var mapSize = map.getSize();
              var mapExtent = map.getView().calculateExtent(mapSize);
              var htmlUrl = scope.options.htmlUrlTemplate
                            .replace('{Topic}', gaTopic.get().id)
                            .replace('{Layer}', bodId)
                            .replace('{Feature}', featureId);
              return $http.get(htmlUrl, {
                timeout: canceler.promise,
                cache: true,
                params: {
                  lang: gaLang.get(),
                  mapExtent: mapExtent.toString(),
                  coord: (coordinate) ? coordinate.toString() : undefined,
                  imageDisplay: mapSize.toString() + ',96'
                }
              });
            };

            var storeFeature = function(layerId, feature) {
              if (!featuresByLayerId[layerId]) {
                featuresByLayerId[layerId] = {};
              }
              var featureId = feature.getId();
              featuresByLayerId[layerId][featureId] = feature;
            };

            // Highlight the features found
            var showFeatures = function(foundFeatures, coordinate,
                nohighlight) {
              if (foundFeatures && foundFeatures.length > 0) {
                // Remove the tooltip, if a layer is removed, we don't care
                // which layer. It worked like that in RE2.
                listenerKey = map.getLayers().on('remove',
                  function(evt) {
                    if (evt.element.displayInLayerManager) {
                      initTooltip();
                    }
                  }
                );
                angular.forEach(foundFeatures, function(value) {
                  if (value instanceof ol.Feature) {
                    var layerId = value.get('layerId');
                    var feature = new ol.Feature(value.getGeometry());
                    feature.setId(value.getId());
                    feature.set('layerId', layerId);
                    gaPreviewFeatures.add(map, feature);
                    if (value.get('htmlpopup')) {
                      showPopup(value.get('htmlpopup'), value);
                    }
                    // Store the ol feature for highlighting
                    storeFeature(layerId, feature);
                  } else {
                    //draw feature, but only if it should be drawn
                    if (!nohighlight &&
                        gaLayers.getLayer(value.layerBodId) &&
                        gaLayers.getLayerProperty(value.layerBodId,
                                                  'highlightable')) {
                      var features = parser.readFeatures(value);
                      for (var i = 0, ii = features.length; i < ii; ++i) {
                        features[i].set('layerId', value.layerBodId);
                        gaPreviewFeatures.add(map, features[i]);
                        storeFeature(value.layerBodId, features[i]);
                      }
                    }
                    getFeaturePopupHtml(value.layerBodId, value.featureId,
                        coordinate).then(function(response) {
                      showPopup(response.data, value);
                    });
                  }
                });
              }
            };

            // Create the html popup for a feature then display it.
            var showVectorFeature = function(feature, layer) {
              var label = layer.label ||
                  $translate.instant(feature.getProperties().label);
              var htmlpopup =
                '<div id="{{id}}" class="htmlpopup-container">' +
                  '<div class="htmlpopup-header">' +
                    '<span>' + label + ' &nbsp;</span>' +
                    '{{name}}' +
                  '</div>' +
                  '<div class="htmlpopup-content">' +
                    '{{descr}}' +
                  '</div>' +
                '</div>';
              var name = feature.get('name');
              var featureId = feature.getId();
              var layerId = feature.get('layerId') || layer.id;
              var id = layerId + '#' + featureId;
              htmlpopup = htmlpopup.
                  replace('{{id}}', id).
                  replace('{{descr}}', feature.get('description') || '').
                  replace('{{name}}', (name) ? '(' + name + ')' : '');
              feature.set('htmlpopup', htmlpopup);
              if (!isFeatureQueryable(feature)) {
                feature.set('htmlpopup', undefined);
              }
              feature.set('layerId', layerId);
              showFeatures([feature]);

              // Iframe communication from inside out
              if (layer.get('type') == 'KML') {
                layerId = layer.label;
                if (name && name.length) {
                  featureId = name;
                }
              }
              gaIFrameCom.send('gaFeatureSelection', {
                layerId: layerId,
                featureId: featureId
              });

              // We leave the old code to not break existing clients
              // Once they have adapted to new implementation, we
              // can remove the code below
              if (top != window) {
               if (featureId && layerId) {
                  window.parent.postMessage(id, '*');
                }
              }
            };

            var showNoInfo = function() {
              if (!popup) {
                popup = gaPopup.create({
                  className: 'ga-tooltip',
                  showReduce: false,
                  title: 'object_information',
                  content: '<div class="ga-popup-no-info" translate>' +
                      'no_more_information</div>',
                  onCloseCallback: function() {
                    destroyPopup();
                  }
                });
              }
              popup.open(3000); // Close after 3 seconds
            };

            // Show the popup with all features informations
            var showPopup = function(html, value) {
              // Don't show popup when notooltip paramter is active
              if (gaPermalink.getParams().notooltip == 'true') {
                return;
              }

              // Show popup on first result
              if (htmls.length === 0) {

                //always reposition element when newly opened
                var x;
                if (!gaBrowserSniffer.mobile) {
                  x = function(element) {
                    return map.getSize()[0] -
                        parseFloat(element.css('max-width')) - 58;
                  };
                }
                if (!popup) {
                  popup = gaPopup.create({
                    className: 'ga-tooltip ga-popup-mobile-bottom',
                    x: x,
                    onCloseCallback: function() {
                      if (onCloseCB) {
                        onCloseCB();
                      }
                      onCloseCB = angular.noop;
                      gaPreviewFeatures.clear(map);
                      destroyPopup();
                    },
                    onMouseEnter: function(evt, nbTooltips) {
                      if (nbTooltips == 1) return;
                      var target = $(evt.currentTarget);
                      var containerId = target.find('.htmlpopup-container').
                          attr('id');
                      if (/#/.test(containerId)) {
                        var split = containerId.split('#');
                        var feat = featuresByLayerId[split[0]][split[1]];
                        if (feat.getGeometry()) {
                          target.addClass('ga-active');
                          gaPreviewFeatures.highlight(map, feat);
                        }
                      }
                    },
                    onMouseLeave: function(evt) {
                      $(evt.currentTarget).removeClass('ga-active');
                      gaPreviewFeatures.clearHighlight();
                    },
                    title: 'object_information',
                    content: popupContent,
                    htmls: htmls,
                    showPrint: true
                  });
                }
                popup.open();
              }
              // Add result to array. ng-repeat will take
              // care of the rest
              htmls.push({
                map: scope.map,
                feature: value,
                showVectorInfos: (value instanceof ol.Feature),
                clickGeometry: new ol.geom.Point(scope.clickCoordinate),
                snippet: $sce.trustAsHtml(html),
                showProfile: !gaBrowserSniffer.mobile &&
                    value instanceof ol.Feature && value.getGeometry()
              });
            };
          }
        };
      });
})();
