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
          gaLayers, gaDefinePropertiesForLayer, gaStyleFactory, 
          gaMapClick, gaPreviewFeatures, gaLayerFilters,
          gaBrowserSniffer) {

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/featuretree/partials/featuretree.html',
          scope: {
            map: '=gaFeaturetreeMap',
            options: '=gaFeaturetreeOptions',
            isActive: '=gaFeaturetreeActive'
          },
          link: function(scope, element, attrs) {
            var currentYear;
            var currentTopic;
            var timeoutPromise = null;
            var canceler = null;
            var map = scope.map;
            var parser = new ol.format.GeoJSON();
            var dragBoxStyle = gaStyleFactory.getStyle('selectrectangle');
            var selectionRecFeature = new ol.Feature();
            var selectionRecOverlay = new ol.FeatureOverlay({
              map: map,
              style: dragBoxStyle
            });

            scope.dragBox = new ol.interaction.DragBox({
              condition: function(evt) {
                //MacEnvironments don't get here because the event is not
                //recognized as mouseEvent on Mac by the google closure.
                //We have to use the apple key on those devices
                return evt.originalEvent.ctrlKey ||
                    (gaBrowserSniffer.mac && evt.originalEvent.metaKey);
              },
              style: dragBoxStyle
            });
            map.addInteraction(scope.dragBox);

            scope.layerFilter = function(l) {
              return gaLayerFilters.selected(l) &&
                  l.visible &&
                  gaLayers.getLayer(l.bodId) &&
                  gaLayers.getLayerProperty(l.bodId, 'selectbyrectangle');
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
              var ids = [];
              var timeenabled = [];
              scope.filteredLayers.forEach(function(l) {
                ids.push(l.bodId);
                timeenabled.push(l.timeEnabled);
              });
              return {
                ids: ids,
                timeenabled: timeenabled
              };
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
                    if (!ol.extent.intersects(searchExtent, bbox)) {
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
                      open: oldNode ? oldNode.open : true
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
                      id: result.attrs.featureId || result.attrs.id,
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
              $rootScope.$broadcast('gaUpdateFeatureTree', tree);
            };

            var getUrlAndParameters = function(layersToQuery, extent) {
              var url = scope.options.searchUrlTemplate,
                  params = {
                    bbox: extent[0] + ',' + extent[1] +
                        ',' + extent[2] + ',' + extent[3],
                    type: 'featureidentify',
                    features: layersToQuery.ids.join(','),
                    timeEnabled: layersToQuery.timeenabled.join(',')
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
              gaPreviewFeatures.clearHighlight();
              if (layersToQuery.ids.length &&
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
              if (scope.isActive) {
                scope.tree = {};
                cancel();
                timeoutPromise = $timeout(function() {
                  requestFeatures();
                  timeoutPromise = null;
                }, 0);
              }
            };

            var loadGeometry = function(feature, cb) {
              var featureUrl;
              if (!feature.geometry) {
                featureUrl = scope.options.htmlUrlTemplate
                             .replace('{Topic}', currentTopic)
                             .replace('{Layer}', feature.layer)
                             .replace('{Feature}', feature.id)
                             .replace('/htmlPopup', '');
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

            scope.highlightFeature = function(feature) {
              loadGeometry(feature, function() {
                if (feature.geometry) {

                  gaPreviewFeatures.highlight(map,
                      parser.readFeature(feature.geometry));
                }
              });
            };

            scope.clearHighlight = function() {
              gaPreviewFeatures.clearHighlight();
            };

            var selectAndTriggerTooltip = function(feature) {
              loadGeometry(feature, function() {
                if (!isFeatureSelected(feature)) {
                  featureSelected = feature;
                  if (feature.geometry) {
                    $rootScope.$broadcast('gaTriggerTooltipRequest', {
                      features: [feature.geometry],
                      onCloseCB: function() {
                        if (isFeatureSelected(feature)) {
                          featureSelected = null;
                        }
                      }
                    });
                  }
                }
              });
            };

            var featureSelected;
            var isFeatureSelected = function(feature) {
               return (feature === featureSelected);
            };
            scope.getCssSelected = function(feature) {
               return isFeatureSelected(feature) ? 'selected' : '';
            };

            var ignoreOneClick = false;
            var fromMouseDown = false;
            scope.onFocus = function(evt, feature) {
              if (!isFeatureSelected(feature)) {
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
                if (isFeatureSelected(feature)) {
                  $rootScope.$broadcast('gaTriggerTooltipInitOrUnreduce');
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
                  feature.selected = false;
                  $timeout(function() {
                    evt.target.previousElementSibling.focus();
                  }, 0);
                  evt.preventDefault();
                }
              //downKey
              } else if (evt.keyCode == 40) {
                if (evt.target &&
                    evt.target.nextElementSibling) {
                  feature.selected = false;
                  $timeout(function() {
                    evt.target.nextElementSibling.focus();
                  }, 0);
                  evt.preventDefault();
                }
              }
            };

            scope.recenterToFeature = function(evt, feature) {
              evt.stopPropagation();
              gaPreviewFeatures.zoom(map, parser.readFeature(feature.geometry));
            };

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

            // We consider this component is activated when a box is drawn
            var activate = function() {
              showSelectionRectangle();
              triggerChange();
            };

            var deactivate = function() {
               // Clean the displa in any case
               $rootScope.$broadcast('gaTriggerTooltipInit');
               scope.clearHighlight();
               hideSelectionRectangle();
            };


            // Watchers and scope events
            scope.$watch('isActive', function(newVal, oldVal) {
              cancel();
              if (newVal != oldVal) {
                if (newVal) {
                  activate();
                } else {
                  deactivate();
                }
              }
            });

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
            });

            scope.$on('gaTimeSelectorChange', function(event, newYear) {
              if (newYear !== currentYear) {
                currentYear = newYear;
                triggerChange();
              }
            });

            // Events on dragbox
            scope.dragBox.on('boxstart', function(evt) {
              deactivate();
            });

            scope.dragBox.on('boxend', function(evt) {
              selectionRecFeature.setGeometry(scope.dragBox.getGeometry());
              scope.isActive = true;
              activate();
            });
          }
        };

      }
  );
})();

