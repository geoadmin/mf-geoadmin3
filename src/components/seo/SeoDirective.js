(function() {
  goog.provide('ga_seo_directive');

  goog.require('ga_map_service');
  goog.require('ga_seo_service');

  var module = angular.module('ga_seo_directive', [
    'ga_map_service',
    'ga_seo_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaSeo',
      function($sce, $timeout, $interval, $q, $http, $translate,
               gaSeoService, gaLayers) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/seo/partials/seo.html',
          scope: {
            options: '=gaSeoOptions',
            map: '=gaSeoMap'
          },
          link: function(scope, element, attrs) {
            var MIN_WAIT = 300,
                currentTopic;

            scope.triggerPageEnd = false;
            scope.showPopup = false;
            scope.layerMetadatas = [];
            scope.featureMetadatas = [];
            scope.coordinateLocations = [];

            var getWaitPromise = function(time) {
              var def = $q.defer();
              $timeout(function() {
                def.resolve();
              }, time);
              return def.promise;
            };

            var permalinkLayers = function() {
              var layers = gaSeoService.getLayers(),
                  def = $q.defer(),
                  unregister;

              unregister = scope.$on('gaLayersChange', function() {

                var insertLayerMetadata = function(layers) {
                  var promises = [], i;

                  var getMetadata = function(layerId) {
                    var locdef = $q.defer();
                    gaLayers.getMetaDataOfLayer(layerId)
                        .success(function(data) {
                          scope.layerMetadatas.push($sce.trustAsHtml(data));
                          locdef.resolve();
                        }).error(function() {
                          locdef.resolve();
                        });
                    return locdef.promise;
                  };

                  for (i = 0; i < layers.length; i++) {
                    promises.push(getMetadata(layers[i]));
                  }
                  return $q.all(promises);
                };


                var promises = [];

                //We wait at least MIN_WAIT after layers-config is loaded
                promises.push(getWaitPromise(MIN_WAIT));

                //Display layer metadata
                if (layers.length > 0) {
                  promises.push(insertLayerMetadata(layers));
                }

                $q.all(promises).then(function() {
                  def.resolve();
                });
                unregister();
              });

              return def.promise;
            };

            var onCatalogChange = function() {
              var def = $q.defer(),
                  unregister;

              unregister = scope.$on('gaCatalogChange', function() {
                getWaitPromise(MIN_WAIT).then(function() {
                  def.resolve();
                });
                unregister();
              });

              return def.promise;
            };

            var swissSearchParameter = function() {
              var def = $q.defer(),
                  active = false,
                  uregLay, uregAct, uregDone;

              uregAct = scope.$on('gaSwisssearchActivated', function() {
                 active = true;
                 uregAct();
              });

              uregDone = scope.$on('gaSwisssearchDone', function() {
                // We wait a certain time after the done message
                getWaitPromise(MIN_WAIT).then(function() {
                  def.resolve();
                });
                uregDone();
              });

              uregLay = scope.$on('gaLayersChange', function() {
                // When there is no swisssearch parameter, the gaSwissearch*
                // messages are never send and the defer never gets resolved.
                // Therefore, we check after a certain time if the
                // message was send, and if it's not send, we resolve
                // the defer.
                getWaitPromise(MIN_WAIT).then(function() {
                  if (!active) {
                    def.resolve();
                  }
                });
                uregLay();
              });

              return def.promise;
            };

            var permalinkFeatures = function() {
              var def = $q.defer(),
                  unregister;

              unregister = scope.$on('gaPermalinkFeaturesAdd', function(evt,
                                                                        data) {
                var promises = [];

                var getFeatureHtml = function(featureId, bodId) {
                  var fDef = $q.defer();
                  var htmlUrl = scope.options.htmlUrlTemplate
                                .replace('{Topic}', currentTopic)
                                .replace('{Layer}', bodId)
                                .replace('{Feature}', featureId);
                  $http.get(htmlUrl, {
                    params: {
                      lang: $translate.uses() // Left out other parameters as
                                              // they are not relevant for SEO
                                              // (cadastralWbebMap Links)
                    }
                  }).success(function(html) {
                    scope.featureMetadatas.push($sce.trustAsHtml(html));
                    fDef.resolve();
                  }).error(function() {
                    fDef.resolve();
                  });
                  return fDef.promise;
                };

                if (!angular.isDefined(currentTopic) ||
                    data.count <= 0) {
                  def.resolve();
                } else {
                  angular.forEach(data.featureIdsByBodId,
                                  function(featureIds, bodId) {
                    Array.prototype.push.apply(promises, $.map(featureIds,
                        function(featureId) {
                          return getFeatureHtml(featureId, bodId);
                        }
                    ));
                  });
                  $q.all(promises).then(function() {
                    def.resolve();
                  });
                }
                unregister();
              });

              return def.promise;
            };

            var permalinkYXZoom = function() {
              var def = $q.defer(),
                  xyzoom = gaSeoService.getYXZoom(),
                  bailed = false,
                  BBOX_SIZE = 1000, //1km on each side...likely to be changed
                  MIN_ZOOM = 5, //Minimal zoom to include xy based location info
                  PIXEL_TOLERANCE = 10, //Used for identify service
                  //polygon like layers (better suited for identify)
                  identifyLayers = [
                    'ch.swisstopo-vd.ortschaftenverzeichnis_plz',
                    'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
                    'ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill',
                    'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill'
                  ],
                  //Match layer with property to be inserted
                  layersProperties = {
                    'ch.swisstopo-vd.ortschaftenverzeichnis_plz': 'plz',
                    'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill':
                        'gemname',
                    'ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill':
                        'name',
                    'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill': 'name'
                  },
                  //point like searchable layers (better suited for search)
                  searchLayers = [
                    'ch.swisstopo.vec200-names-namedlocation',
                    'ch.bfs.gebaeude_wohnungs_register'
                  ],
                  //for searchlayers, we specify how many results we want
                  layersMaxResults = {
                    'ch.swisstopo.vec200-names-namedlocation' : 3,
                    'ch.bfs.gebaeude_wohnungs_register': 1
                  },
                  lTpl = '<a href="' + gaSeoService.getLinkAtStart() +
                                 '">{result}</a>',
                  east, north, zoom, bbox;

              if (xyzoom.Y !== undefined &&
                  xyzoom.X !== undefined &&
                  xyzoom.zoom !== undefined) {
                east = parseFloat(xyzoom.Y.replace(/,/g, '.'));
                north = parseFloat(xyzoom.X.replace(/,/g, '.'));
                zoom = parseInt(xyzoom.zoom, 10);
                if (isFinite(east) &&
                    isFinite(north) &&
                    isFinite(zoom) &&
                    zoom >= MIN_ZOOM) {
                  var searchDef = $q.defer();
                  var identifyDef = $q.defer();
                 //for now, we simply get the extent and include everything
                  //in future, we determine with extent and zoom which layers to
                  //actually query...
                  bbox = (east - BBOX_SIZE).toString() + ',' +
                         (north - BBOX_SIZE).toString() + ',' +
                         (east + BBOX_SIZE).toString() + ',' +
                         (north + BBOX_SIZE).toString();

                  $http.get(scope.options.searchUrl, {
                    params: {
                      bbox: bbox,
                      type: 'features',
                      features: searchLayers.join(','),
                      timeEnabled: $.map(searchLayers, function(layer) {
                            return 'false';
                          }).join(',')

                    }
                  }).success(function(json) {
                    var i, li, result, added = {};
                    if (json.results &&
                        json.results.length > 0) {
                      //todo: apply bbox filter? (as in feature tree...)
                      for (i = 0, li = json.results.length; i < li; i++) {
                        result = json.results[i];
                        if (!added[result.attrs.layer]) {
                          added[result.attrs.layer] = 0;
                        }
                        if (added[result.attrs.layer] <
                            layersMaxResults[result.attrs.layer]) {
                          added[result.attrs.layer] += 1;

                          scope.coordinateLocations.push($sce.trustAsHtml(
                              lTpl.replace('{result}', result.attrs.label)));
                        }
                      }
                    }
                    searchDef.resolve();
                  }).error(function() {
                    searchDef.resolve();
                  });

                  var map = scope.map;
                  var size = map.getSize();

                  $http.get(scope.options.identifyUrl, {
                    params: {
                      lang: $translate.uses(),
                      geometryType: 'esriGeometryPoint',
                      geometryFormat: 'geojson',
                      geometry: east + ',' + north,
                      imageDisplay: size[0] + ',' + size[1] + ',96',
                      mapExtent: map.getView().calculateExtent(size).join(','),
                      tolerance: PIXEL_TOLERANCE,
                      layers: 'all:' + identifyLayers.join(',')
                    }
                  }).success(function(json) {
                    var i, li, result, prop;
                    if (json.results &&
                        json.results.length > 0) {
                      for (i = 0, li = json.results.length; i < li; i++) {
                        result = json.results[i];
                        prop = layersProperties[result.layerBodId];
                        scope.coordinateLocations.push($sce.trustAsHtml(
                            lTpl.replace('{result}', result.properties[prop])));
                      }
                    }
                    identifyDef.resolve();
                  }).error(function() {
                    identifyDef.resolve();
                  });
                  $q.all([searchDef.promise, identifyDef.promise])
                  .then(function() {
                    def.resolve();
                  });
                } else {
                  bailed = true;
                }
              } else {
                bailed = true;
              }

              if (bailed) {
                $timeout(function() {
                  def.resolve();
                }, 0);
              }

              return def.promise;
            };

            var injectSnapshotData = function() {
              var promises = [];

              promises.push(onCatalogChange());
              promises.push(swissSearchParameter());
              promises.push(permalinkLayers());
              promises.push(permalinkFeatures());
              promises.push(permalinkYXZoom());

              return $q.all(promises);
            };

            // Just do something if we are active
            if (gaSeoService.isActive()) {
              //Show popup
              $timeout(function() {
                scope.showPopup = true;
              }, 0);

              injectSnapshotData().then(function() {
                scope.triggerPageEnd = true;
              });
           }

           scope.$on('gaTopicChange', function(event, topic) {
             currentTopic = topic.id;
           });
         }
       };
      });
})();
