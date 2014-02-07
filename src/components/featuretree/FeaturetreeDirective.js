(function() {
  goog.provide('ga_featuretree_directive');

  goog.require('ga_map_service');
  goog.require('ga_styles_service');

  var module = angular.module('ga_featuretree_directive', [
    'ga_map_service',
    'ga_styles_service',
    'pascalprecht.translate'
  ]);

  /**
   * TODOs:
   * - create all sphinxsearch indices (querable layers)
   * - translations
   * - rectangle drawing always active. auto-open accordion
   **/

  module.directive('gaFeaturetree',
      function($rootScope, $compile, $timeout, $http, $q, $translate, $sce,
               gaLayers, gaDefinePropertiesForLayer, gaStyleFunctionFactory, 
               gaMapClick, gaRecenterMapOnFeatures, gaLayerFilters,
               gaBrowserSniffer) {

        var createVectorLayer = function(style) {
          var vector = new ol.layer.Vector({
                styleFunction: gaStyleFunctionFactory(style),
                source: new ol.source.Vector()
              });
          gaDefinePropertiesForLayer(vector);
          vector.highlight = true;
          vector.invertedOpacity = 0.25;
          return vector;
        };

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/featuretree/partials/featuretree.html',
          scope: {
            options: '=gaFeaturetreeOptions',
            map: '=gaFeaturetreeMap'
          },
          link: function(scope, element, attrs) {
            var currentYear;
            var currentTopic;
            var timeoutPromise = null;
            var canceler = null;
            var map = scope.map;
            var view = map.getView();
            var viewport = $(map.getViewport());
            var projection = view.getProjection();
            var parser = new ol.format.GeoJSON();
            var highlightLayer = createVectorLayer('highlight');
            var tooltipShown = false;
            var selectionRecFeature = new ol.Feature();
            var selectionRecOverlay = new ol.FeatureOverlay({
              map: map,
              styleFunction: gaStyleFunctionFactory('selectrectangle')
            });
            map.addLayer(highlightLayer);

            scope.dragBox = new ol.interaction.DragBox({
              condition: function(evt) {
                //MacEnvironments don't get here because the event is not
                //recognized as mouseEvent on Mac by the google closure.
                //We have to use the apple key on those devices
                return evt.originalEvent.ctrlKey ||
                       (gaBrowserSniffer.mac && evt.originalEvent.metaKey);
              },
              style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'blue',
                  width: 3
                })
              })
            });
            map.addInteraction(scope.dragBox);

            scope.layerFilter = function(l) {
              return gaLayerFilters.selected(l) &&
                     l.visible &&
                     gaLayers.getLayer(l.bodId) &&
                     gaLayers.getLayerProperty(l.bodId, 'queryable');

            };

            scope.noResults = function() {
              // We can't use undefined or null for scope.tree
              // because it would break the ng-repeat in the partial.
              // Therefore, we have to have this dummy for loop to
              // determine if we have results or not
              var dummy;
              for (dummy in scope.tree) {
                return false;
              }
              return true;
            };

            scope.layers = map.getLayers().getArray();
            scope.filteredLayers = [];

            scope.$watchCollection('layers | filter:layerFilter',
                function(layers) {
              scope.filteredLayers = layers;
              triggerChange();
            });

            var getLayersToQuery = function() {
              var layerstring = '';
              scope.filteredLayers.forEach(function(l) {
                if (layerstring.length) {
                  layerstring = layerstring + ',';
                }
                layerstring = layerstring + l.bodId;
              });
              return layerstring;
            };

            var cancel = function() {
              if (timeoutPromise !== null) {
                $timeout.cancel(timeoutPromise);
              }
              if (canceler !== null) {
                canceler.resolve();
              }
              scope.loading = false;
              canceler = $q.defer();
            };

            var parseBoxString = function(stringBox2D) {
              var extent = stringBox2D.replace('BOX(', '')
                .replace(')', '').replace(',', ' ')
                .split(' ');
              return $.map(extent, parseFloat);
            };

            //FIXME: should use ol.extent.getArea,
            //but it's not in ol build.
            var area = function(ext) {
              return ol.extent.getWidth(ext) *
                     ol.extent.getHeight(ext);
            };

            //FIXME: should use ol.extent.getIntersectionArea,
            //but it's not in ol build.
            var intersectionArea = function(extent1, extent2) {
              var minX = Math.max(extent1[0], extent2[0]);
              var minY = Math.max(extent1[1], extent2[1]);
              var maxX = Math.min(extent1[2], extent2[2]);
              var maxY = Math.min(extent1[3], extent2[3]);
              return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
            };

            var updateTree = function(res, searchExtent) {
              var tree = {}, i, li, j, lj, layerId, newNode, oldNode,
                  feature, oldFeature, result, bbox, ext;
              if (res.results &&
                  res.results.length > 0) {

                for (i = 0, li = res.results.length; i < li; i++) {
                  result = res.results[i];

                  // The feature search using sphinxsearch uses quadindex
                  // to filter results based on their bounding boxes. This is
                  // in order to make the search extremely fast even for a large
                  // number of features. The downside is that we will have false
                  // positives in the results (features which are outside of
                  // the searched box). Here, we filter out those false
                  // positives based on the bounding box of the feature. Note
                  // that we could refine this by using the exact geometry in
                  // the future
                  if (result.attrs.geom_st_box2d) {
                    bbox = parseBoxString(result.attrs.geom_st_box2d);
                    ext = ol.extent.boundingExtent([[bbox[0], bbox[1]],
                                                       [bbox[2], bbox[3]]]);
                    if (area(ext) <= 0) {
                      if (!ol.extent.containsCoordinate(searchExtent,
                                                        [ext[0], ext[1]])) {
                        continue;
                      }
                    } else if (intersectionArea(searchExtent,
                                                      ext) <= 0) {
                      continue;
                    }
                  }

                  layerId = result.attrs.layer;
                  newNode = tree[layerId];
                  oldNode = scope.tree[layerId];
                  feature = undefined;

                  if (!angular.isDefined(newNode)) {
                    newNode = {
                      label: '',
                      features: [],
                      open: oldNode ? oldNode.open : false
                    };
                    tree[layerId] = newNode;
                  }

                  //look if feature exists already. We do this
                  //to avoid loading the same feature again and
                  //to preserve state (selected)
                  if (oldNode) {
                    for (j = 0, lj = oldNode.features.length; j < lj; j++) {
                      oldFeature = oldNode.features[j];
                      if (oldFeature.id === result.attrs.id) {
                        feature = oldFeature;
                        break;
                      }
                    }
                  }
                  if (!angular.isDefined(feature)) {
                    feature = {
                      info: '',
                      geometry: null,
                      selected: false,
                      id: result.attrs.feature_id || result.attrs.id,
                      layer: layerId,
                      label: result.attrs.label
                    };
                  }
                  newNode.features.push(feature);
                }
                //assure that label contains number of items
                angular.forEach(tree, function(value, key) {
                  var l = gaLayers.getLayer(key).label +
                          ' (' + value.features.length + ' ' +
                          getItemText(value.features.length) + ')';
                  value.label = l;

                  function getItemText(number) {
                    if (number <= 1) {
                      return $translate('item');
                    }
                    return $translate('items');
                  }
                });
              }
              scope.tree = tree;
            };

            var getUrlAndParameters = function(layersToQuery, extent) {
              var url = scope.options.searchUrlTemplate,
                  params = {
                    bbox: extent[0] + ',' + extent[1] +
                        ',' + extent[2] + ',' + extent[3],
                    type: 'features',
                    features: layersToQuery
                  };
              if (currentYear) {
                params.timeInstant = currentYear;
              }

              url = url.replace('{Topic}', currentTopic);
              return {
                url: url,
                params: params
              };
            };

            var requestFeatures = function() {
              var layersToQuery = getLayersToQuery(),
                  req, searchExtent;
              scope.clearHighlight();
              if (layersToQuery.length &&
                  scope.dragBox.getGeometry()) {
                searchExtent = ol.extent.boundingExtent(
                    scope.dragBox.getGeometry().getCoordinates()[0]);
                req = getUrlAndParameters(layersToQuery, searchExtent);

                scope.loading = true;

                // Look for all features in current bounding box
                $http.get(req.url, {
                  timeout: canceler.promise,
                  params: req.params
                }).success(function(res) {
                  updateTree(res, searchExtent);
                  scope.loading = false;
                }).error(function(reason) {
                  scope.tree = {};
                  scope.loading = false;
                });
              }
            };

            // Update the tree based on map changes. We use a timeout in
            // order to not trigger angular digest cycles and too many
            // updates. We don't use the permalink here because we want
            // to separate these concerns.
            var triggerChange = function() {
              if (scope.options.active) {
                scope.tree = {};
                cancel();
                timeoutPromise = $timeout(function() {
                  requestFeatures();
                  timeoutPromise = null;
                }, 0);
              }
            };

            var assureLayerOnTop = function(layer) {
              map.removeLayer(layer);
              map.addLayer(layer);
            };

            var loadGeometry = function(feature, cb) {
              var featureUrl;
              if (!feature.geometry) {
                featureUrl = scope.options.htmlUrlTemplate
                             .replace('{Topic}', currentTopic)
                             .replace('{Layer}', feature.layer)
                             .replace('{Feature}', feature.id)
                             .replace('/htmlpopup', '');
                $http.get(featureUrl, {
                  timeout: canceler.promise,
                  params: {
                    geometryFormat: 'geojson'
                  }
                }).success(function(result) {
                  feature.geometry = result.feature;
                  cb();
                }).error(function() {
                  feature.geometry = null;
                  cb();
                });
              } else {
                //make sure it's async as the other cb() calls
                $timeout(function() {
                  cb();
                }, 0);
              }
            };

            scope.loading = false;
            scope.tree = {};

            scope.highlightFeatureInMap = function(feature) {
              loadGeometry(feature, function() {
                if (feature.geometry) {
                  highlightLayer.getSource().addFeature(
                      parser.readFeature(feature.geometry));
                  assureLayerOnTop(highlightLayer);
                }
              });
            };

            scope.clearHighlight = function() {
              highlightLayer.getSource().clear();
            };

            var selectAndTriggerTooltip = function(feature) {
              loadGeometry(feature, function() {
                if (!feature.selected) {
                  feature.selected = true;
                  if (feature.geometry) {
                    tooltipShown = true;
                    $rootScope.$broadcast('gaTriggerTooltipRequest', {
                      features: [feature.geometry],
                      onCloseCB: function() {
                        tooltipShown = false;
                        if (feature.selected) {
                          feature.selected = false;
                        }
                      }
                    });
                  }
                }
              });
            };

            var ignoreOneClick = false;
            var fromMouseDown = false;

            scope.onFocus = function(evt, feature) {
              if (!feature.selected) {
                if (fromMouseDown) {
                  ignoreOneClick = true;
                }
                selectAndTriggerTooltip(feature);
              }
            };

            scope.onMouseDown = function(evt, feature) {
              fromMouseDown = true;
            };

            scope.onClick = function(evt, feature) {
              fromMouseDown = false;
              if (ignoreOneClick) {
                ignoreOneClick = false;
              } else {
                if (feature.selected) {
                  $rootScope.$broadcast('gaTriggerTooltipInit');
                } else {
                  selectAndTriggerTooltip(feature);
                }
              }
            };

            scope.onKeyDown = function(evt, feature) {
              var focusFn, el;
              //upKey
              if (evt.keyCode == 38) {
                if (evt.target &&
                    evt.target.previousElementSibling) {
                  $timeout(function() {
                    evt.target.previousElementSibling.focus();
                  }, 0);
                  evt.preventDefault();
                }
              //downKey
              } else if (evt.keyCode == 40) {
                if (evt.target &&
                    evt.target.nextElementSibling) {
                  $timeout(function() {
                    evt.target.nextElementSibling.focus();
                  }, 0);
                  evt.preventDefault();
                }
              }
            };

            scope.recenterToFeature = function(evt, f) {
              var recenterObject = {};
              evt.stopPropagation();
              recenterObject[f.layer] = [f.id];
              gaRecenterMapOnFeatures(map, recenterObject, false);
            };

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
            });

            scope.$on('gaTimeSelectorChange', function(event, newYear) {
              if (newYear !== currentYear) {
                currentYear = newYear;
                triggerChange();
              }
            });

            var showSelectionRectangle = function() {
              if (!selectionRecOverlay.getFeatures().getLength() &&
                  selectionRecFeature.getGeometry()) {
                selectionRecOverlay.addFeature(selectionRecFeature);
              }
            };

            var hideSelectionRectangle = function() {
              if (selectionRecOverlay.getFeatures().getLength()) {
                selectionRecOverlay.removeFeature(selectionRecFeature);
              }
            };

            var activate = function() {
              showSelectionRectangle();
              triggerChange();
            };

            scope.$watch('options.active', function(newVal, oldVal) {
              cancel();
              if (newVal === true) {
                activate();
              } else {
                if (tooltipShown) {
                  $rootScope.$broadcast('gaTriggerTooltipInit');
                }
                scope.clearHighlight();
                hideSelectionRectangle();
              }
            });

            scope.dragBox.on('boxstart', function(evt) {
              hideSelectionRectangle();
            });

            scope.dragBox.on('boxend', function(evt) {
              selectionRecFeature.setGeometry(scope.dragBox.getGeometry());
              if (scope.options.active) {
                activate();
              } else {
                scope.$apply(function() {
                  $rootScope.$broadcast('gaTriggerFeatureTreeActivation');
                });
              }
            });
          }
        };

      }
  );
})();

