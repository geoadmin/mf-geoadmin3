import Point from 'ol/geom/Point';
import Observable from 'ol/Observable';
import Polygon from 'ol/geom/Polygon';
import GeoJSON from 'ol/format/GeoJSON';
import { transform } from 'ol/proj';

import gaDebounceService from '../DebounceService.js';

goog.provide('ga_search_type_directives');

goog.require('ga_layerfilters_service');
goog.require('ga_layermetadatapopup_service');
goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_marker_overlay_service');
goog.require('ga_previewfeatures_service');
goog.require('ga_previewlayers_service');
goog.require('ga_search_service');
goog.require('ga_topic_service');
goog.require('ga_urlutils_service');

// We can't put strings in zoomlevel attribute of search results. That's
// why we put huge numbers to indicate that we want to use the bbox for
// zooming instead of the delivered zoomlevel.
const ZOOM_LIMIT = 100;

const parseExtent = function(stringBox2D) {
  const extent = stringBox2D.replace(/(BOX\(|\))/gi, '').replace(',', ' ').
      split(' ');
  return $.map(extent, parseFloat);
};

const getCenter = function(gaMapUtils, map, res) {
  let center;
  if (!res.attrs.y || !res.attrs.x) {
    center = transform([res.attrs.lon, res.attrs.lat],
        'EPSG:4326', map.getView().getProjection());
  } else {
    center = gaMapUtils.transformBack(new Point([res.attrs.y, res.attrs.x]))
      .getCoordinates();
  }
  return center;
};

const addOverlay = function(gaMarkerOverlay, gaMapUtils, map, res, extent) {
  const visible = /^(address|parcel|gazetteer)$/.test(res.attrs.origin);
  const center = getCenter(gaMapUtils, map, res);
  gaMarkerOverlay.add(map,
      center,
      visible,
      extent);
};

const removeOverlay = function(gaMarkerOverlay, map) {
  gaMarkerOverlay.remove(map);
};

let listenerMoveEnd;
const registerMove = function(gaMarkerOverlay, gaDebounce, map) {
  listenerMoveEnd = map.on('moveend', gaDebounce.debounce(function() {
    const zoom = map.getView().getZoom();
    gaMarkerOverlay.setVisibility(zoom);
  }, 200, false, false));
};

const unregisterMove = function() {
  if (listenerMoveEnd) {
    Observable.unByKey(listenerMoveEnd);
    listenerMoveEnd = undefined;
  }
};

const tabStarts = [
  100000,
  200000,
  300000
];

const nextTabGroup = function(val) {
  for (let i = 0; i < tabStarts.length - 1; i++) {
    if (val >= tabStarts[i] &&
        val < tabStarts[i + 1]) {
      return tabStarts[i + 1];
    }
  }
  return undefined;
};

const prevTabGroup = function(val) {
  for (let i = tabStarts.length - 1; i > 0; i--) {
    if (val >= tabStarts[i]) {
      return tabStarts[i - 1];
    }
  }
  return undefined;
};

const focusElement = function(el, evt) {
  evt.preventDefault();
  el.trigger('focus');
};

const elExists = function(el) {
  if (el.length === 1 &&
      el[0].className.indexOf('ga-search-result') > -1) {
    return true;
  }
  return false;
};

const focusToElement = function(next, step, evt) {
  let newEl;
  if (next) {
    newEl = $(evt.target).nextAll('.ga-search-result').first();
  } else {
    newEl = $(evt.target).prevAll('.ga-search-result').first();
  }
  if (elExists(newEl)) {
    let existingEl = newEl;
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

const focusToCategory = function(next, evt) {
  const el = $(evt.target);
  if (el.length && el[0] && el[0].attributes && el[0].attributes.tabindex) {
    var jumpGroup, newEl;
    if (next) {
      jumpGroup = nextTabGroup(el[0].attributes.tabindex.value);
      while (jumpGroup) {
        newEl = $('[tabindex=' + jumpGroup + ']');
        if (elExists(newEl)) {
          focusElement(newEl, evt);
          break;
        }
        jumpGroup = nextTabGroup(jumpGroup);
      }
    } else {
      jumpGroup = prevTabGroup(el[0].attributes.tabindex.value);
      while (jumpGroup) {
        newEl = $('[tabindex=' + jumpGroup + ']');
        if (elExists(newEl)) {
          var existingEl = newEl;
          // Go to last element of category
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
      // Nothing found, so jump back to input (ignore bad design...)
      newEl = $('.ga-search-input');
      if (newEl.length === 1 &&
          newEl[0].className.indexOf('ga-search-input') > -1) {
        focusElement(newEl, evt);
      }
    }
  }
};

var SearchTypesDirectives = angular.module('ga_search_type_directives', [
  gaDebounceService,
  'ga_layerfilters_service',
  'ga_layermetadatapopup_service',
  'ga_layers_service',
  'ga_maputils_service',
  'ga_marker_overlay_service',
  'ga_previewfeatures_service',
  'ga_previewlayers_service',
  'ga_search_service',
  'ga_urlutils_service',
  'pascalprecht.translate',
  'ga_topic_service'
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

SearchTypesDirectives.controller('GaSearchTypesController',
    function($scope, $http, $q, $sce, gaUrlUtils, gaSearchLabels,
        gaMapUtils, gaMarkerOverlay, gaDebounce) {

      // This value is used to block blur/mouseleave event, when a value
      // is selected. See #2284. It's reinitialized when a new search is
      // triggered.
      var blockEvent = false;
      var canceler;

      var cancel = function() {
        $scope.results = [];
        $scope.fuzzy = '';
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

        var url = gaUrlUtils.append($scope.options.searchUrl,
            'type=' + $scope.type);
        url = $scope.typeSpecificUrl(url);
        $http.get(url, {
          cache: true,
          timeout: canceler.promise
        }).then(function(response) {
          var data = response.data;
          $scope.results = data.results;
          if (data.fuzzy) {
            $scope.fuzzy = '_fuzzy';
          }
          $scope.options.announceResults($scope.type, data.results.length);
        }, function(response) {
        // If request is canceled, statuscode is 0 and we don't announce it
          if (response.status !== 0) {
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
        if (evt.keyCode === 13) {
        // Enter key
          $scope.removePreview();
          blockEvent = true;
          $scope.select(res);
        } else if (evt.keyCode === 9) {
        // Tab key
          focusToCategory(!evt.shiftKey, evt);
        } else if (evt.keyCode === 40 || evt.keyCode === 34) {
        // Down Arrow or PageDown key
          focusToElement(true, evt.keyCode === 40 ? 1 : 5, evt);
        } else if (evt.keyCode === 38 || evt.keyCode === 33) {
        // Up Arrow or PageUp key
          focusToElement(false, evt.keyCode === 38 ? 1 : 5, evt);
        }
      };

      $scope.click = function(res) {
        $scope.removePreview();
        blockEvent = true;
        $scope.select(res);
      };

      $scope.out = function(evt) {
        if (!blockEvent) {
          $scope.removePreview();
        }
      };

      $scope.preview = function(res) {
        var e = parseExtent(res.attrs.geom_st_box2d);
        e = gaMapUtils.transformBack(Polygon.fromExtent(e)).getExtent();
        addOverlay(gaMarkerOverlay, gaMapUtils, $scope.map, res, e);
      };

      $scope.removePreview = function() {
        removeOverlay(gaMarkerOverlay, $scope.map);
      };

      $scope.prepareLabel = function(attrs) {
        var h = gaSearchLabels.highlight(attrs.label, $scope.options.query);
        return $sce.trustAsHtml(h);
      };

      $scope.cleanLabel = function(attrs) {
        return gaSearchLabels.cleanLabel(attrs.label);
      };

      $scope.fuzzy = '';

      $scope.$watch('options.searchUrl', function() {
      // cancel old requests
        cancel();
        if ($scope.options.query !== '') {
          blockEvent = false;
          triggerSearch();
        } else {
          unregisterMove();
        }
      });
    }
);

SearchTypesDirectives.directive('gaSearchLocations',
    function($sce, $translate, gaMarkerOverlay,
        gaSearchLabels, gaMapUtils, gaDebounce) {
      return {
        restrict: 'A',
        templateUrl: 'components/search/partials/searchtypes.html',
        scope: {
          options: '=gaSearchLocationsOptions',
          map: '=gaSearchLocationsMap',
          ol3d: '=gaSearchLocationsOl3d'
        },
        controller: 'GaSearchTypesController',
        link: function($scope, element, attrs) {
          $scope.type = 'locations';
          $scope.tabstart = tabStarts[0];

          // Can be removed onnce real type contains gazetter
          $scope.typeSpecificUrl = function(url) {
            return url;
          };

          $scope.select = function(res) {
            var isGazetteerPoly = false;
            var e = parseExtent(res.attrs.geom_st_box2d);
            e = gaMapUtils.transformBack(Polygon.fromExtent(e)).getExtent();
            unregisterMove();
            // Gazetteer results that are not points zoom to full bbox extent
            if (res.attrs.origin === 'gazetteer') {
              isGazetteerPoly = (Math.abs(e[0] - e[2]) > 100 &&
                                 Math.abs(e[1] - e[3]) > 100);

            }
            if (res.attrs.zoomlevel < ZOOM_LIMIT &&
                !isGazetteerPoly) {
              gaMapUtils.moveTo(
                  $scope.map,
                  $scope.ol3d,
                  gaMapUtils.swissZoomToMercator(res.attrs.zoomlevel),
                  getCenter(gaMapUtils, $scope.map, res)
              );
            } else {
              gaMapUtils.zoomToExtent($scope.map, $scope.ol3d, e);
            }
            addOverlay(gaMarkerOverlay, gaMapUtils, $scope.map, res, e);
            $scope.options.valueSelected(
                gaSearchLabels.cleanLabel(res.attrs.label));

            registerMove(gaMarkerOverlay, gaDebounce, $scope.map);
          };

          $scope.prepareLabel = function(attrs) {
            var l = gaSearchLabels.highlight(attrs.label,
                $scope.options.query);
            if (attrs.origin === 'zipcode') {
              l = '<span>' + $translate.instant('plz') + ' ' + l +
                  '</span>';
            } else if (attrs.origin === 'kantone') {
              l = '<span>' + $translate.instant('ct') + ' ' + l +
                  '</span>';
            } else if (attrs.origin === 'district') {
              l = '<span>' + $translate.instant('district') + ' ' + l +
                  '</span>';
            } else if (attrs.origin === 'parcel') {
              l += ' <span>' + $translate.instant('parcel') + ' ' +
                   '</span>';
            }
            return $sce.trustAsHtml(l);
          };

        }
      };
    });

SearchTypesDirectives.directive('gaSearchFeatures',
    function($rootScope, $http, $sce, $timeout, gaUrlUtils,
        gaLayerFilters, gaSearchLabels, gaLayers,
        gaPreviewFeatures, gaTopic) {

      var selectedFeatures = {};
      var loadGeometry = function(layerId, featureId, topic, urlbase, cb) {
        var key = layerId + featureId;
        if (!selectedFeatures.hasOwnProperty(key)) {
          var featureUrl = urlbase.replace('{Topic}', topic).
              replace('{Layer}', layerId).
              replace('{Feature}', featureId);
          $http.get(featureUrl, {
            params: {
              geometryFormat: 'geojson',
              'sr': '3857'
            }
          }).then(function(response) {
            var result = response.data;
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
          map: '=gaSearchFeaturesMap',
          ol3d: '=gaSearchFeaturesOl3d'
        },
        controller: 'GaSearchTypesController',
        link: function($scope, element, attrs) {
          var geojsonParser = new GeoJSON();
          var searchableLayers = [];
          var timeEnabled = [];
          var timeStamps = [];

          $scope.type = 'featuresearch';
          $scope.tabstart = tabStarts[1];

          $scope.doSearch = function() {
            return searchableLayers.length > 0;
          };

          $scope.typeSpecificUrl = function(url) {
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
                gaTopic.get().id,
                $scope.options.featureUrl, function(f) {
                  $rootScope.$broadcast('gaTriggerTooltipRequest', {
                    features: [f],
                    onCloseCB: angular.noop
                  });
                  var feature = geojsonParser.readFeature(f);
                  gaPreviewFeatures.zoom($scope.map, $scope.ol3d, feature);
                });
            $scope.options.valueSelected(
                gaSearchLabels.cleanLabel(res.attrs.label));
          };

          $scope.prepareLabel = function(attrs) {
            var l = gaSearchLabels.highlight(attrs.label,
                $scope.options.query);
            if (attrs.origin === 'feature') {
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
                // TODO: this isn't updated when layers param (like 'time')
                // changes
                searchableLayers = [];
                timeEnabled = [];
                timeStamps = [];
                angular.forEach(layers, function(layer) {
                  var ts = '';
                  if (layer.time && layer.time.substr(0, 4) !== '9999' &&
                      layer.timeEnabled) {
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

SearchTypesDirectives.directive('gaSearchLayers', function(gaSearchLabels,
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
        var layer = gaMapUtils.getMapOverlayForBodId($scope.map,
            res.attrs.layer);

        // Don't add preview layer if the layer is already on the map
        if (!layer || !layer.visible) {
          gaPreviewLayers.addBodLayer($scope.map, res.attrs.layer);
        }
      };

      $scope.removePreview = function() {
        gaPreviewLayers.removeAll($scope.map);
      };

      $scope.select = function(res) {
        unregisterMove();
        var l = gaMapUtils.getMapOverlayForBodId($scope.map,
            res.attrs.layer);
        if (!angular.isDefined(l)) {
          var olLayer = gaLayers.getOlLayerById(res.attrs.layer);
          $scope.map.addLayer(olLayer);
        } else {
          // Assure layer is visible
          l.visible = true;
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

export default SearchTypesDirectives;
