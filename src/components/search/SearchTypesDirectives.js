(function() {
  goog.provide('ga_search_type_directives');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_debounce_service');
  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');
  goog.require('ga_marker_overlay_service');
  goog.require('ga_search_service');
  goog.require('ga_urlutils_service');

  var originToZoomLevel = {
    address: 10,
    parcel: 10,
    sn25: 8
  };

  var parseExtent = function(stringBox2D) {
    var extent = stringBox2D.replace(/(BOX\(|\))/gi, '').replace(',', ' ')
                 .split(' ');
    return $.map(extent, parseFloat);
  };

  var addOverlay = function(gaOverlay, map, res) {
    var visible = originToZoomLevel.hasOwnProperty(res.attrs.origin);
    var center = [res.attrs.y, res.attrs.x];
    if (!res.attrs.y || !res.attrs.x) {
      center = ol.proj.transform([res.attrs.lon, res.attrs.lat],
          'EPSG:4326', 'EPSG:21781');
    }
    gaOverlay.add(map,
                  center,
                  parseExtent(res.attrs.geom_st_box2d),
                  visible);

  };

  var removeOverlay = function(gaOverlay, map) {
    gaOverlay.remove(map);
  };

  var listenerMoveEnd;
  var registerMove = function(gaOverlay, gaDebounce, map) {
    listenerMoveEnd = map.on('moveend', gaDebounce.debounce(function() {
      var zoom = map.getView().getZoom();
      gaOverlay.setVisibility(zoom);
    }, 200, false, false));
  };

  var unregisterMove = function() {
    if (listenerMoveEnd) {
      ol.Observable.unByKey(listenerMoveEnd);
      listenerMoveEnd = undefined;
    }
  };

  var tabStarts = [
    100000,
    200000,
    300000
  ];

  var nextTabGroup = function(val) {
    for (var i = 0; i < tabStarts.length - 1; i++) {
      if (val >= tabStarts[i] &&
          val < tabStarts[i + 1]) {
        return tabStarts[i + 1];
      }
    }
    return undefined;
  };

  var prevTabGroup = function(val) {
    for (var i = tabStarts.length - 1; i > 0; i--) {
      if (val >= tabStarts[i]) {
        return tabStarts[i - 1];
      }
    }
    return undefined;
  };

  var focusElement = function(el, evt) {
    evt.preventDefault();
    el[0].focus();
  };

  var elExists = function(el) {
    if (el.length === 1 &&
        el[0].className.indexOf('ga-search-result') > -1) {
      return true;
    }
    return false;
  };

  var focusToElement = function(next, step, evt) {
    var newEl = undefined;
    if (next) {
      newEl = $(evt.target).nextAll('.ga-search-result').first();
    } else {
      newEl = $(evt.target).prevAll('.ga-search-result').first();
    }
    if (elExists(newEl)) {
      var existingEl = newEl;
      step -= 1;
      while (step > 0 && elExists(newEl)) {
        existingEl = newEl;
        step -= 1;
        if (next) {
          newEl = newEl.nextAll('.ga-search-result').first();
        } else {
          newEl = newEl.prevAll('.ga-search-result').first();
        }
      }
      focusElement(existingEl, evt);
    } else {
      focusToCategory(next, evt);
    }
  };

  var focusToCategory = function(next, evt) {
    var el = $(evt.target);
    if (el.length && el[0] && el[0].attributes && el[0].attributes.tabindex) {
      var jumpGroup;
      if (next) {
        jumpGroup = nextTabGroup(el[0].attributes.tabindex.value);
        while (jumpGroup) {
          var newEl = $('[tabindex=' + jumpGroup + ']');
          if (elExists(newEl)) {
            focusElement(newEl, evt);
            break;
          }
          jumpGroup = nextTabGroup(jumpGroup);
        }
      } else {
        jumpGroup = prevTabGroup(el[0].attributes.tabindex.value);
        while (jumpGroup) {
          var newEl = $('[tabindex=' + jumpGroup + ']');
          if (elExists(newEl)) {
            var existingEl = newEl;
            //Go to last element of category
            while (elExists(newEl)) {
              existingEl = newEl;
              jumpGroup += 1;
              newEl = $('[tabindex=' + jumpGroup + ']');
            }
            focusElement(existingEl, evt);
            return;
          }
          jumpGroup = prevTabGroup(jumpGroup);
        }
        //Nothing found, so jump back to input (ignore bad design...)
        var newEl = $('.ga-search-input');
        if (newEl.length === 1 &&
            newEl[0].className.indexOf('ga-search-input') > -1) {
          focusElement(newEl, evt);
        }
      }
    }
  };

  var module = angular.module('ga_search_type_directives', [
    'ga_browsersniffer_service',
    'ga_debounce_service',
    'ga_layer_metadata_popup_service',
    'ga_map_service',
    'ga_marker_overlay_service',
    'ga_search_service',
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  /*
   * We have 3 distinct directives for each type of result
   * set (locations, features and layers)
   *
   * All 3 result directives share the same template and the
   * same controller code. Put anything that is common for
   * all 3 types in the controller code.
   *
   * Put type specific behaviour in the corresponding
   * directive's code.
   */

  module.controller('GaSearchTypesController',
    function($scope, $http, $q, $sce, gaUrlUtils, gaSearchLabels,
             gaBrowserSniffer, gaMarkerOverlay, gaDebounce) {

      var canceler;

      var cancel = function() {
        $scope.results = [];
        if (canceler !== undefined) {
          canceler.resolve();
          canceler = undefined;
        }
      };

      var triggerSearch = gaDebounce.debounce(function() {
        if (!$scope.doSearch()) {
          $scope.options.announceResults($scope.type, 0);
          return;
        }

        canceler = $q.defer();

        var url = gaUrlUtils.append($scope.options.baseUrl,
                                    'type=' + $scope.type);
        url = $scope.typeSpecificUrl(url);

        $http.get(url, {
          cache: true,
          timeout: canceler.promise
        }).success(function(data) {
          $scope.results = data.results;
          $scope.options.announceResults($scope.type, data.results.length);
        }).error(function(data, statuscode) {
          // If request is canceled, statuscode is 0 and we don't announce it
          if (statuscode !== 0) {
            $scope.options.announceResults($scope.type, 0);
          }
        });
      }, 133, false, false);
      // 133 filters out 'stuck key' events while staying responsive

      $scope.doSearch = function() {
        return true;
      };

      $scope.typeSpecificUrl = function(url) {
        return url;
      };

      $scope.keydown = function(evt, res) {
        if (evt.keyCode == 13) {
          //Enter key
          $scope.select(res);
        } else if (evt.keyCode == 9) {
          //Tab key
          focusToCategory(!evt.shiftKey, evt);
        } else if (evt.keyCode == 40 || evt.keyCode == 34) {
          //Down Arrow or PageDown key
          focusToElement(true, evt.keyCode == 40 ? 1 : 5, evt);
        } else if (evt.keyCode == 38 || evt.keyCode == 33) {
          //Up Arrow or PageUp key
          focusToElement(false, evt.keyCode == 38 ? 1 : 5, evt);
        }
      };

      $scope.preview = function(res) {
        if (gaBrowserSniffer.mobile) {
          return;
        }
        addOverlay(gaMarkerOverlay, $scope.map, res);
      };

      $scope.removePreview = function(evt, res) {
        if (gaBrowserSniffer.mobile ||
            // HACK for #1737: prevent unexpected call of mouseout evt.
            // TODO: maybe this hack is not needed anymore with
            // angular only search
            (evt.target != evt.relatedTarget &&
            evt.relatedTarget instanceof HTMLCanvasElement)) {
          return;
        }
        removeOverlay(gaMarkerOverlay, $scope.map);
      };

      $scope.prepareLabel = function(attrs) {
        var h = gaSearchLabels.highlight(attrs.label, $scope.options.query);
        return $sce.trustAsHtml(h);
      };

      $scope.$watch('options.query', function(newval) {
        //cancel old requests
        cancel();
        if (newval != '') {
          triggerSearch();
        } else {
          unregisterMove();
        }
      });

    }
  );

  module.directive('gaSearchLocations',
      function($http, $q, $sce, $translate, gaUrlUtils, gaBrowserSniffer,
               gaMarkerOverlay, gaSearchLabels, gaMapUtils, gaDebounce) {
        return {
          restrict: 'A',
          templateUrl: 'components/search/partials/searchtypes.html',
          scope: {
            options: '=gaSearchLocationsOptions',
            map: '=gaSearchLocationsMap'
          },
          controller: 'GaSearchTypesController',
          link: function($scope, element, attrs) {
            $scope.type = 'locations';
            $scope.tabstart = tabStarts[0];

            $scope.select = function(res) {
              unregisterMove();
              removeOverlay(gaMarkerOverlay, $scope.map);
              if (originToZoomLevel.hasOwnProperty(res.attrs.origin)) {
                gaMapUtils.moveTo($scope.map,
                                  originToZoomLevel[res.attrs.origin],
                                  [res.attrs.y, res.attrs.x]);
              } else {
                gaMapUtils.zoomToExtent($scope.map,
                                        parseExtent(res.attrs.geom_st_box2d));
              }
              addOverlay(gaMarkerOverlay, $scope.map, res);
              $scope.options.valueSelected(
                  gaSearchLabels.cleanLabel(res.attrs.label));

              registerMove(gaMarkerOverlay, gaDebounce, $scope.map);
            };

            $scope.prepareLabel = function(attrs) {
              var l = gaSearchLabels.highlight(attrs.label,
                                                 $scope.options.query);
              if (attrs.origin == 'zipcode') {
                l = '<span>' + $translate.instant('plz') + ' ' + l +
                    '</span>';
              } else if (attrs.origin == 'kantone') {
                l = '<span>' + $translate.instant('ct') + ' ' + l +
                    '</span>';
              } else if (attrs.origin == 'district') {
                l = '<span>' + $translate.instant('district') + ' ' + l +
                    '</span>';
              } else if (attrs.origin == 'parcel') {
                l += ' <span>' + $translate.instant('parcel') + ' ' +
                     '</span>';
              }
              return $sce.trustAsHtml(l);
            };

          }
        };
      });

  module.directive('gaSearchFeatures',
      function($rootScope, $http, $q, $sce, $timeout, gaUrlUtils,
               gaLayerFilters, gaSearchLabels, gaLayers, gaBrowserSniffer,
               gaMarkerOverlay, gaPreviewFeatures) {

        var selectedFeatures = {};
        var loadGeometry = function(layerId, featureId, topic, urlbase, cb) {
          var key = layerId + featureId;
          if (!selectedFeatures.hasOwnProperty(key)) {
            var featureUrl = urlbase.replace('{Topic}', topic)
                .replace('{Layer}', layerId)
                .replace('{Feature}', featureId);
            $http.get(featureUrl, {
              params: {
                 geometryFormat: 'geojson'
              }
            }).success(function(result) {
              selectedFeatures[key] = result.feature;
              cb(result.feature);
            });
          } else {
            $timeout(function() {
              cb(selectedFeatures[key]);
            }, 0, false);
          }
        };

        return {
          restrict: 'A',
          templateUrl: 'components/search/partials/searchtypes.html',
          scope: {
            options: '=gaSearchFeaturesOptions',
            map: '=gaSearchFeaturesMap'
          },
          controller: 'GaSearchTypesController',
          link: function($scope, element, attrs) {
            var geojsonParser = new ol.format.GeoJSON();
            var searchableLayers = [];
            var timeEnabled = [];
            var timeStamps = [];

            $scope.type = 'featuresearch';
            $scope.tabstart = tabStarts[1];

            $scope.doSearch = function() {
              return searchableLayers.length > 0;
            };

            $scope.typeSpecificUrl = function(url) {
              var bbox = function(map) {
                var size = map.getSize();
                var view = map.getView();
                var bounds = view.calculateExtent(size);
                return bounds.join(',');
              };
              var url = gaUrlUtils.append(url, 'bbox=' + bbox($scope.map));
              url = gaUrlUtils.append(url,
                                      'features=' + searchableLayers.join(','));
              url = gaUrlUtils.append(url,
                                      'timeEnabled=' + timeEnabled.join(','));
              return gaUrlUtils.append(url,
                                      'timeStamps=' + timeStamps.join(','));
            };

            $scope.select = function(res) {
              unregisterMove();
              loadGeometry(res.attrs.layer, res.attrs.featureId,
                           $scope.options.currentTopic,
                           $scope.options.featureUrl, function(f) {
                $rootScope.$broadcast('gaTriggerTooltipRequest', {
                  features: [f],
                  onCloseCB: angular.noop
                });
                gaPreviewFeatures.zoom($scope.map,
                    geojsonParser.readFeature(f));
              });
              $scope.options.valueSelected(
                  gaSearchLabels.cleanLabel(res.attrs.label));
            };

            $scope.prepareLabel = function(attrs) {
              var l = gaSearchLabels.highlight(attrs.label,
                                                 $scope.options.query);
              if (attrs.origin == 'feature') {
                l = '<b>' +
                    gaLayers.getLayerProperty(attrs.layer, 'label') +
                    '</b><br>' + l;
              }
              return $sce.trustAsHtml(l);
            };


            $scope.layers = $scope.map.getLayers().getArray();
            $scope.searchableLayersFilter = gaLayerFilters.searchable;

            $scope.$watchCollection('layers | filter:searchableLayersFilter',
                function(layers) {
              //TODO: this isn't updated when layers param (like 'time') changes
              searchableLayers = [];
              timeEnabled = [];
              timeStamps = [];
              angular.forEach(layers, function(layer) {
                var ts = '';
                if (layer.time && layer.time.substr(0, 4) != '9999') {
                  ts = layer.time.substr(0, 4);
                }
                searchableLayers.push(layer.bodId);
                timeEnabled.push(layer.timeEnabled);
                timeStamps.push(ts);
              });
            });

          }
        };
      });

  module.directive('gaSearchLayers',
      function($http, $q, $sce, gaUrlUtils, gaSearchLabels, gaBrowserSniffer,
               gaPreviewLayers, gaMapUtils, gaLayers, gaLayerMetadataPopup) {
        return {
          restrict: 'A',
          templateUrl: 'components/search/partials/searchtypes.html',
          scope: {
            options: '=gaSearchLayersOptions',
            map: '=gaSearchLayersMap'
          },
          controller: 'GaSearchTypesController',
          link: function($scope, element, attrs) {
            $scope.type = 'layers';
            $scope.tabstart = tabStarts[2];

            $scope.preview = function(res) {
              if (gaBrowserSniffer.mobile) {
                return;
              }
              var layer = gaMapUtils.getMapOverlayForBodId($scope.map,
                                                           res.attrs.layer);

              // Don't add preview layer if the layer is already on the map
              if (!layer) {
                gaPreviewLayers.addBodLayer($scope.map, res.attrs.layer);
              }
            };

            $scope.removePreview = function() {
              if (gaBrowserSniffer.mobile) {
                return;
              }
              gaPreviewLayers.removeAll($scope.map);
            };

            $scope.select = function(res) {
              unregisterMove();
              var l = gaMapUtils.getMapOverlayForBodId($scope.map,
                                                       res.attrs.layer);
              if (!angular.isDefined(l)) {
                var olLayer = gaLayers.getOlLayerById(res.attrs.layer);
                $scope.map.addLayer(olLayer);
              }
              $scope.options.valueSelected(
                  gaSearchLabels.cleanLabel(res.attrs.label));
            };

            $scope.getLegend = function(evt, bodId) {
              gaLayerMetadataPopup.toggle(bodId);
              evt.stopPropagation();
            };
          }
        };
      });

})();
