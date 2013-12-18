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
   * - keyboard controls
   * - create all sphinxsearch indices (querable layers)
   * - updtae ol3 to export readFeatureFromObject function
   * - translations
   * - rectangle drawing always active. auto-open accordion
   **/

  module.directive('gaFeaturetree',
      function($rootScope, $compile, $timeout, $http, $q, $translate, $sce,
               gaLayers, gaDefinePropertiesForLayer, gaStyleFunctionFactory, 
               gaMapClick, gaRecenterMapOnFeatures, gaLayerFilters) {

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
            var currentTopic;
            var timeoutPromise = null;
            var canceler = null;
            var map = scope.map;
            var view = map.getView();
            var viewport = $(map.getViewport());
            var projection = view.getProjection();
            var parser = new ol.format.GeoJSON();
            var dragBox = new ol.render.DragBox();
            var highlightLayer = createVectorLayer('highlight');
            var rectangleLayer = createVectorLayer('selectrectangle');
            var firstPoint;
            scope.searchRectangle = undefined;
            rectangleLayer.invertedOpacity = 0.25;
            map.addLayer(highlightLayer);

            scope.layerFilter = function(l) {
              return gaLayerFilters.selectedLayersFilter(l) &&
                     gaLayers.getLayer(l.bodId) &&
                     gaLayers.getLayerProperty(l.bodId, 'queryable');

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
                      id: result.attrs.id,
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
              url = url.replace('{Topic}', currentTopic);
              return {
                url: url,
                params: params
              };
            };

            var requestFeatures = function() {
              var layersToQuery = getLayersToQuery(),
                  req, searchExtent;
              highlightLayer.getSource().clear();
              if (layersToQuery.length &&
                  angular.isDefined(scope.searchRectangle)) {
                searchExtent = ol.extent.boundingExtent(
                     scope.searchRectangle.getCoordinates());
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
                cb();
              }
            };

            scope.loading = false;
            scope.tree = {};

            scope.highlightFeatureInMap = function(feature) {
              loadGeometry(feature, function() {
                if (feature.geometry) {
                  highlightLayer.getSource().addFeature(
                      parser.readFeatureFromObject(feature.geometry));
                  assureLayerOnTop(highlightLayer);
                }
              });
            };

            scope.clearHighlight = function() {
              highlightLayer.getSource().clear();
            };

            scope.selectFeature = function(feature) {
              loadGeometry(feature, function() {
                if (!feature.selected) {
                  feature.selected = true;
                  $rootScope.$broadcast('gaTriggerTooltipRequest', feature);
                }
              });
            };

            scope.onKeyDown = function(evt, feature, index) {
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
              gaRecenterMapOnFeatures(map, recenterObject);
            };

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
            });

            scope.$watch('options.active', function(newVal, oldVal) {
              cancel();
              if (newVal === true) {
                map.addLayer(rectangleLayer);
                triggerChange();
              } else {
                map.removeLayer(rectangleLayer);
              }
            });

            var updateRectangle = function(evt) {
              var coordinate = evt.getCoordinate();
              scope.searchRectangle.setCoordinates([
                [firstPoint[0], firstPoint[1]],
                [firstPoint[0], coordinate[1]],
                [coordinate[0], coordinate[1]],
                [coordinate[0], firstPoint[1]],
                [firstPoint[0], firstPoint[1]]
              ]);
            };

            map.on('dragstart', function(evt) {
              if (scope.options.active &&
                  !angular.isDefined(firstPoint) &&
                  evt.getBrowserEvent().ctrlKey) {
                firstPoint = evt.getCoordinate();
                dragBox.setCoordinates(firstPoint, firstPoint);
                dragBox.setMap(map);
                //make sure searchRectangle exists
                if (!angular.isDefined(scope.searchRectangle)) {
                  scope.searchRectangle = new ol.geom.LineString([
                    firstPoint]);
                  rectangleLayer.getSource().addFeature(
                      new ol.Feature(scope.searchRectangle));
                }
              }
            });

            map.on('drag', function(evt) {
              if (angular.isDefined(firstPoint)) {
                dragBox.setCoordinates(firstPoint, evt.getCoordinate());
                updateRectangle(evt);
              }
            });

           map.on('dragend', function(evt) {
              if (angular.isDefined(firstPoint)) {
                dragBox.setMap(null);
                updateRectangle(evt);
                firstPoint = undefined;
                triggerChange();
              }
            });
          }
        };

      }
  );
})();

