(function() {
  goog.provide('ga_featuretree_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_featuretree_directive', [
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaFeaturetree',
      function($rootScope, $compile, $timeout, $http, $q, $translate, $sce,
               gaLayers, gaDefinePropertiesForLayer) {

        var selectStyle = new ol.style.Style({
          symbolizers: [
            new ol.style.Fill({
              color: '#ff0000'
            }),
            new ol.style.Stroke({
              color: '#f00000',
              width: 6
            }),
            new ol.style.Shape({
              size: 20,
              fill: new ol.style.Fill({
                color: '#ff0000'
              }),
              stroke: new ol.style.Stroke({
                color: '#ff0000',
                width: 6
              })
            })
          ]
        });

        var highlightStyle = new ol.style.Style({
          symbolizers: [
            new ol.style.Fill({
              color: '#ffff00'
            }),
            new ol.style.Stroke({
              color: '#ff8000',
              width: 3
            }),
            new ol.style.Shape({
              size: 20,
              fill: new ol.style.Fill({
                color: '#ffff00'
              }),
              stroke: new ol.style.Stroke({
                color: '#ff8000',
                width: 3
              })
            })
          ]
        });

        var createVectorLayer = function(proj, parser, style) {
          var vector = new ol.layer.Vector({
                style: style,
                source: new ol.source.Vector({
                  projection: proj,
                  parser: parser,
                  data: {
                    type: 'FeatureCollection',
                    features: []
                  }
                })
              });
          gaDefinePropertiesForLayer(vector);
          vector.highlight = true;
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
            var projection = view.getProjection();
            var geoJsonParser = new ol.parser.GeoJSON();
            var objectInfoToggleEl = $('#object-info-toggle');
            var objectInfoParentEl = $('#object-info-parent');
            var objectInfo = {};
            var selectionLayer = createVectorLayer(projection,
                                                   geoJsonParser,
                                                   selectStyle);
            var previewLayer = createVectorLayer(projection,
                                                 geoJsonParser,
                                                 highlightStyle);
            map.addLayer(previewLayer);
            map.addLayer(selectionLayer);

            objectInfo.html = '';
            objectInfo.loading = false;
            $rootScope.objectinfo = objectInfo;

            $compile($('#object-info-target')[0])($rootScope);

            var getLayersToQuery = function(layers) {
              var layerstring = '';
              map.getLayers().forEach(function(l) {
                  var id = l.get('bodId');
                  if (gaLayers.getLayer(id) &&
                      gaLayers.getLayerProperty(id, 'queryable')) {
                    if (layerstring.length) {
                      layerstring = layerstring + ',';
                    }
                    layerstring = layerstring + id;
                  }
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

            var updateTree = function(res) {
              var tree = {}, i, li, j, lj, layerId, newNode, oldNode,
                  feature, oldFeature, result;
              if (res.results &&
                  res.results.length > 0) {

                for (i = 0, li = res.results.length; i < li; i++) {
                  result = res.results[i];
                  layerId = result.attrs.layer;
                  newNode = tree[layerId];
                  oldNode = scope.tree[layerId];
                  feature = undefined;

                  if (!angular.isDefined(newNode)) {
                    newNode = {
                      label: gaLayers.getLayer(layerId).label,
                      features: [],
                      open: oldNode ? oldNode.open : false
                    };
                    tree[layerId] = newNode;
                  }

                  //look if feature exists already. We do this
                  //to avoid loading it time and again for
                  //the same features
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
                      id: result.attrs.id,
                      layer: layerId,
                      label: result.attrs.label
                    };
                  }
                  newNode.features.push(feature);
                  loadAndDrawGeometry(feature, previewLayer);
                }
              }
              scope.tree = tree;
            };

            var getUrlAndParameters = function(layersToQuery) {
              var size = map.getSize(),
                  extent = view.calculateExtent(size),
                  url = scope.options.searchUrlTemplate,
                  params = {
                    bbox: extent[0] + ',' + extent[1] +
                        ',' + extent[2] + ',' + extent[3],
                    type: 'features',
                    features: layersToQuery,
                    callback: 'JSON_CALLBACK'
                  };
              url = url.replace('{Topic}', currentTopic);
              return {
                url: url,
                params: params
              };
            };

            var requestFeatures = function() {
              var layersToQuery = getLayersToQuery(),
                  req;
              previewLayer.clear();
              selectionLayer.clear();
              if (layersToQuery.length) {
                req = getUrlAndParameters(layersToQuery);

                scope.loading = true;

                // Look for all features in current bounding box
                $http.jsonp(req.url, {
                  timeout: canceler.promise,
                  params: req.params
                }).success(function(res) {
                  updateTree(res);
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
                }, 300);
              }
            };

            var assureLayerOnTop = function(layer) {
              map.removeLayer(layer);
              map.addLayer(layer);
            };

            var drawGeometry = function(geometry, layer) {
              if (geometry) {
                layer.parseFeatures(geometry,
                                    geoJsonParser,
                                    projection);
                assureLayerOnTop(layer);
              }
            };

            var loadAndDrawGeometry = function(feature, layer) {
              //Load geometry and display it
              var featureUrl;
              if (!feature.geometry) {
                featureUrl = scope.options.htmlUrlTemplate
                             .replace('{Topic}', currentTopic)
                             .replace('{Layer}', feature.layer)
                             .replace('{Feature}', feature.id)
                             .replace('/htmlpopup', '');
                $http.jsonp(featureUrl, {
                  timeout: canceler.promise,
                  params: {
                    geometryFormat: 'geojson',
                    callback: 'JSON_CALLBACK'
                  }
                }).success(function(result) {
                  feature.geometry = result.feature;
                  drawGeometry(feature.geometry, layer);
                }).error(function() {
                  feature.geometry = null;
                  drawGeometry(null, layer);
                });
              } else {
                drawGeometry(feature.geometry, layer);
              }
            };

            scope.loading = false;
            scope.tree = {};

            scope.showFeatureInfo = function(feature) {
              var htmlUrl;

              if (!objectInfoParentEl.hasClass('open')) {
                objectInfoToggleEl.dropdown('toggle');
              }

              //Load information if not already there
              if (feature.info == '') {
                objectInfo.loading = true;
                htmlUrl = scope.options.htmlUrlTemplate
                          .replace('{Topic}', currentTopic)
                          .replace('{Layer}', feature.layer)
                          .replace('{Feature}', feature.id);
                $http.jsonp(htmlUrl, {
                  timeout: canceler.promise,
                  params: {
                    lang: $translate.uses(),
                    callback: 'JSON_CALLBACK'
                  }
                }).success(function(html) {
                  feature.info = $sce.trustAsHtml(html);
                  objectInfo.html = feature.info;
                  objectInfo.loading = false;
                }).error(function() {
                  feature.info = '';
                  objectInfo.html = feature.info;
                  objectInfo.loading = false;
                });
              } else {
                objectInfo.html = feature.info;
              }
              selectionLayer.clear();
              loadAndDrawGeometry(feature, selectionLayer);
            };

            view.on('change', triggerChange);

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
            });

            scope.$watch('options.active', function(newVal, oldVal) {
              cancel();
              if (newVal === true) {
                requestFeatures();
              }
            });

          }
        };

      }
  );
})();

