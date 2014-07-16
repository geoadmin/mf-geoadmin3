(function() {
  goog.provide('ga_search_directive');

  goog.require('ga_debounce_service');
  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');
  goog.require('ga_marker_overlay_service');
  goog.require('ga_permalink');
  goog.require('ga_search_service');
  goog.require('ga_urlutils_service');
  goog.require('ga_waitcursor_service');

  var module = angular.module('ga_search_directive', [
    'ga_debounce_service',
    'ga_layer_metadata_popup_service',
    'ga_map_service',
    'ga_marker_overlay_service',
    'ga_permalink',
    'pascalprecht.translate',
    'ga_urlutils_service',
    'ga_search_service',
    'ga_waitcursor_service'
  ]);

  module.directive('gaSearch',
      function($compile, $translate, $timeout, $rootScope, $http,
        gaWaitCursor, gaMapUtils, gaLayerMetadataPopup, gaPermalink, gaUrlUtils,
        gaGetCoordinate, gaBrowserSniffer, gaLayerFilters, gaKml,
        gaPreviewLayers, gaLayers, gaPreviewFeatures, gaMarkerOverlay,
        gaSwisssearch, gaDebounce) {
          var currentTopic,
              footer = [
            '<div class="ga-search-footer clearfix">',
            '<div class="ga-search-footer-left"></div>',
            '<div class="ga-search-footer-right">',
            '<a class="ga-search-contact-icon" ',
            'title="{{\'contact_us\' | translate}}" ',
            'ng-mouseover="getHref()" ',
            'ng-href="http://www.geo.admin.ch/',
            'internet/geoportal/{{lang}}/tools/contact.html" ',
            'target="_blank">',
            '<i class="icon-phone"></i> ',
            '</a>',
            '<a class="ga-search-contact-icon" ',
            'title="{{\'follow_us\' | translate}}" ',
            'href="https://twitter.com/swiss_geoportal"',
            'target="_blank">',
            '<i class="icon-twitter"></i>',
            '</a>',
            '<a class="ga-search-contact-icon"',
            'title="{{\'email_us\' | translate}}" ',
            'ng-mouseover="getHref()" ',
            'ng-href="mailto:webgis@swisstopo.ch?',
            'body={{encodedPermalinkHref}}">',
            '<i class="icon-envelope-alt"></i>',
            '</a>',
            '</div>'].join('');

          var geojsonParser = new ol.format.GeoJSON();

          function parseExtent(stringBox2D) {
            var extent = stringBox2D.replace('BOX(', '')
              .replace(')', '').replace(',', ' ')
              .split(' ');
            return $.map(extent, parseFloat);
          }

          function getBBoxParameters(map) {
            var size = map.getSize();
            var view = map.getView();
            var bounds = view.calculateExtent(size);
            return bounds.join(',');
          }

          function zoomToExtent(map, extent) {
            var size = map.getSize();
            var view = map.getView();

            view.fitExtent(extent, size);
          }

          function moveTo(map, zoom, center) {
            var view = map.getView();

            view.setZoom(zoom);
            view.setCenter(center);
          }

          return {
            restrict: 'A',
            replace: true,
            scope: {
              options: '=gaSearchOptions',
              map: '=gaSearchMap',
              searchFocused: '=gaSearchFocused'
            },
            templateUrl: 'components/search/partials/search.html',
            link: function(scope, element, attrs) {
              var year, hasLocationResults, hasFeatureResults, listenerMoveEnd;
              var map = scope.map;
              var options = scope.options;
              var selectedFeatures = {};
              var originZoom = {
                address: 10,
                parcel: 10,
                sn25: 8
              };

              var footerTemplate = angular.element(footer);
              $compile(footerTemplate)(scope);

              var locationsHeaderTemplate = angular.element(
                  '<div class="tt-header-locations" ' +
                  'translate>locations</div>');
              $compile(locationsHeaderTemplate)(scope);

              var featureSearchHeaderTemplate = angular.element(
                  '<div class="tt-header-locations" ' +
                  'translate>items</div>');
              $compile(featureSearchHeaderTemplate)(scope);

              var layerHeaderTemplate = angular.element(
                  '<div class="tt-header-mapinfos" ' +
                  'ng-show="hasLayerResults" translate>map_info</div>');
              $compile(layerHeaderTemplate)(scope);

              var loadGeometry = function(layerId, featureId, cb) {
                var key = layerId + featureId;
                if (!selectedFeatures.hasOwnProperty(key)) {
                  var featureUrl = options.featureUrl
                               .replace('{Topic}', currentTopic)
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
                  }, 0);
                }
              };

              scope.query = '';

              scope.layers = map.getLayers().getArray();

              scope.getHref = function() {
                // set those values only on mouseover
                scope.encodedPermalinkHref =
                encodeURIComponent(gaPermalink.getHref());
                scope.lang = $translate.uses();
              };

              scope.getLegend = function(ev, bodId) {
                gaLayerMetadataPopup.toggle(bodId);
                ev.stopPropagation();
              };

              scope.addLayer = function(bodId) {
                // removePreviewLayer is not called automaticallay
                // after a click
                scope.removePreviewLayer();

                var layerInMap = gaMapUtils.getMapOverlayForBodId(
                    map, bodId);
                if (!angular.isDefined(layerInMap)) {
                  var olLayer = gaLayers.getOlLayerById(bodId);
                  map.addLayer(olLayer);
                }
              };

              scope.addPreviewLayer = function(bodId) {
                if (gaBrowserSniffer.mobile) {
                  return;
                }

                var layer = gaMapUtils.getMapOverlayForBodId(
                    map, bodId);

                // Don't add preview layer if the layer is already on the map
                if (!layer) {
                  gaPreviewLayers.addBodLayer(map, bodId);
                }
              };

              scope.removePreviewLayer = function() {
                if (gaBrowserSniffer.mobile) {
                  return;
                }
                gaPreviewLayers.removeAll(map);
              };

              var registerMove = function() {
                listenerMoveEnd = map.on('moveend',
                    gaDebounce.debounce(function() {
                  var zoom = map.getView().getZoom();
                  gaMarkerOverlay.setVisibility(zoom);
                }, 200, false));
              };

              var unregisterMove = function() {
                if (listenerMoveEnd) {
                  listenerMoveEnd.src.unByKey(listenerMoveEnd);
                  listenerMoveEnd = null;
                }
              };

              var selectFeature = function(layerId, featureId) {
                loadGeometry(layerId, featureId, function(feature) {
                  $rootScope.$broadcast('gaTriggerTooltipRequest', {
                    features: [feature],
                    onCloseCB: angular.noop
                  });
                  gaPreviewFeatures.zoom(map,
                      geojsonParser.readFeature(feature));

                });
              };

              scope.addOverlay = function(extent, center, origin) {
                if (gaBrowserSniffer.mobile) {
                  return;
                }
                if (originZoom.hasOwnProperty(origin)) {
                  gaMarkerOverlay.add(map, center, extent, true);
                } else {
                  gaMarkerOverlay.add(map, center, extent);
                }
              };

              scope.removeOverlay = function() {
                if (gaBrowserSniffer.mobile) {
                  return;
                }
                gaMarkerOverlay.remove(map);
                unregisterMove();
              };

              var getLocationTemplate = function(context) {
                var attrs = context.attrs;
                var label = getLocationLabel(attrs);
                var origin = attrs.origin;
                var center = [attrs.y, attrs.x];
                var extent = parseExtent(attrs.geom_st_box2d);
                var template = '<div class="tt-search" ' +
                    'ng-mouseover="addOverlay([' +
                    extent + ']' + ',[' + center + '],' + '\'' +
                    origin + '\')" ' + 'ng-mouseout="removeOverlay()">' +
                    label + '</div>';
                return template;
              };

              var getFeatureTemplate = function(context) {
                var attrs = context.attrs;
                var label = getLocationLabel(attrs);
                var origin = attrs.origin;
                var center = ol.proj.transform([attrs.lon, attrs.lat],
                    'EPSG:4326', 'EPSG:21781');
                var extent = parseExtent(attrs.geom_st_box2d);
                var template = '<div class="tt-search" ' +
                    'ng-mouseover="addOverlay([' +
                    extent + ']' + ',[' + center + '],' + '\'' +
                    origin + '\')" ' + 'ng-mouseout="removeOverlay()">' +
                    label + '</div>';
                return template;
              };

              var getLocationLabel = function(attrs) {
                var label = attrs.label;
                if (attrs.origin == 'zipcode') {
                  label = '<span>' + $translate('plz') + ' ' + label;
                } else if (attrs.origin == 'kantone') {
                  label = '<span>' + $translate('ct') + ' ' + label;
                } else if (attrs.origin == 'district') {
                  label = '<span>' + $translate('district') + ' ' + label;
                } else if (attrs.origin == 'parcel') {
                  label += ' <span>' + $translate('parcel') + ' ';
                } else if (attrs.origin == 'feature') {
                  label = '<b>' +
                      gaLayers.getLayerProperty(attrs.layer, 'label') +
                      '</b><br>';
                  label += attrs.label;
                }
                return label;
              };

              //These definitions here have to correspond to
              //the array that follows
              var LOCATIONS = 0;
              var FEATURES = 1;
              var LAYERS = 2;

              //Determines if a featuresearch request should be triggered
              //based on map state (have searchable layers) and query
              var triggerFeatureSearch = function() {
                 if (!gaGetCoordinate(map.getView().getProjection().getExtent(),
                                      scope.query) &&
                     scope.searchableLayers.length) {
                   return true;
                 }
                 return false;
              };

              var typeAheadDatasets = [
                {
                  header: locationsHeaderTemplate,
                  name: 'locations',
                  timeout: 20,
                  valueKey: 'inputVal',
                  limit: 30,
                  template: function(context) {
                    return getLocationTemplate(context);
                  },
                  remote: {
                    url: gaUrlUtils.append(options.searchUrl,
                        'type=locations'),
                    beforeSend: function(jqXhr, settings) {
                      // Check url
                      if (gaUrlUtils.isValid(scope.query)) {
                        gaKml.addKmlToMapForUrl(map,
                          scope.query, {
                          attribution: gaUrlUtils.getHostname(scope.query)
                        });
                        return false;
                      }
                      var position =
                        gaGetCoordinate(
                          map.getView().getProjection().getExtent(),
                          scope.query);

                      if (position) {
                        moveTo(map, 8, position);
                        var center = [position[0], position[1]];
                        var extent = [center, center];
                        gaMarkerOverlay.add(map, center, extent, true);
                      } else {
                        // Requests are not sent but before sent is invoked
                        // anyway
                        if (scope.query !== '') {
                          gaWaitCursor.add();
                        }
                      }
                      return !position;
                    },
                    replace: function(url, searchText) {
                      var queryText = '&searchText=' + searchText;
                      var lang = '&lang=' + $translate.uses();
                      url = options.applyTopicToUrl(url,
                          currentTopic);
                      url += queryText + lang;
                      return url;
                    },
                    filter: function(response) {
                      var results = response.results;
                      return $.map(results, function(val) {
                        val.inputVal = val.attrs.label
                            .replace('<b>', '').replace('</b>', '');
                        return val;
                      });
                    }
                  }
                },
                {
                  header: featureSearchHeaderTemplate,
                  name: 'featuresearch',
                  timeout: 20,
                  valueKey: 'inputVal',
                  limit: 30,
                  template: function(context) {
                    return getFeatureTemplate(context);
                  },
                  remote: {
                    url: gaUrlUtils.append(options.searchUrl,
                        'type=featuresearch'),
                    beforeSend: function(jqXhr, settings) {
                      scope.$apply(function() {
                        scope.layers = map.getLayers().getArray();
                      });
                      if (!triggerFeatureSearch()) {
                        return false;
                      }
                      if (scope.query !== '') {
                        gaWaitCursor.add();
                      }
                      return true;
                    },
                    replace: function(url, searchText) {
                      var queryText = '&searchText=' + searchText;
                      var bbox = '&bbox=' + getBBoxParameters(map);
                      var lang = '&lang=' + $translate.uses();
                      var searchableLayers = '&features=' +
                          scope.searchableLayers.join(',');
                      var timeEnabled = '&timeEnabled=' +
                          scope.timeEnabled.join(',');
                      var timeInstant = '';
                      if (year) {
                        timeInstant = '&timeInstant=' + year;
                      }
                      url = options.applyTopicToUrl(url,
                          currentTopic);
                      url += queryText + searchableLayers + timeEnabled +
                          bbox + lang + timeInstant;
                      return url;
                    },
                    filter: function(response) {
                      var results = response.results;
                      return $.map(results, function(val) {
                        val.inputVal = val.attrs.label
                            .replace('<b>', '').replace('</b>', '');
                        return val;
                      });
                    }
                  }
                },
                {
                  header: layerHeaderTemplate,
                  name: 'layers',
                  timeout: 20,
                  valueKey: 'inputVal',
                  limit: 20,
                  template: function(context) {
                    var template = '<div ng-show="hasLayerResults" ' +
                        'class="tt-search"' +
                        'ng-mouseover="addPreviewLayer(\'' +
                        context.attrs.layer + '\', true)" ' +
                        'ng-mouseout="removePreviewLayer(\'' +
                        context.attrs.layer + '\')"' +
                        '>' + context.attrs.label +
                        '<i ng-click="getLegend($event, \'' +
                        context.attrs.layer + '\')" ' +
                        'class="icon-info-sign"> </i></div>';
                    return template;
                  },
                  remote: {
                    url: options.searchUrl + 'type=layers',
                    beforeSend: function(jqXhr, settings) {
                      if (gaGetCoordinate(
                            map.getView().getProjection().getExtent(),
                            scope.query)) {
                        return false;
                      }
                      if (scope.query !== '') {
                        gaWaitCursor.add();
                      }
                      return true;
                    },
                    replace: function(url, searchText) {
                      var queryText = '&searchText=' + searchText;
                      var lang = '&lang=' + $translate.uses();
                      url = options.applyTopicToUrl(url,
                          currentTopic);
                      url += queryText + lang;
                      return url;
                    },
                    filter: function(response) {
                      var results = response.results;
                      return $.map(results, function(val) {
                        val.inputVal = val.attrs.label
                            .replace('<b>', '').replace('</b>', '');
                        return val;
                      });
                    }
                  }
                }
              ];

              var taElt = $(element).find('input');
              taElt.blur(function(e, nonStop) {
                if (!nonStop) {
                  e.stopImmediatePropagation();
                  if ($(this).val() != '') {
                    return;
                  }
                  $timeout(function() {
                    scope.searchFocused = false;
                  });
                }
              });
              taElt.on('typeahead:initialized', function() {
                taElt.parent().find('.tt-dropdown-menu').append(footerTemplate);
              });
              taElt.typeahead(typeAheadDatasets)
                .on('typeahead:selected', function(event, datum) {
                  var origin = datum.attrs.origin;
                  gaMarkerOverlay.remove(map);
                  scope.removePreviewLayer();
                  scope.searchFocused = false;
                  taElt.trigger('blur', [true]);
                  if (origin !== 'feature' && origin !== 'layer') {
                    registerMove();
                    var center = [datum.attrs.y, datum.attrs.x];
                    var extent = parseExtent(datum.attrs.geom_st_box2d);
                    if (originZoom.hasOwnProperty(origin)) {
                      var zoom = originZoom[origin];
                      moveTo(map, zoom, center);
                      // Make sure the above origins are visible at all
                      // zoom levels
                      gaMarkerOverlay.add(map, center, extent, true);
                    } else {
                      zoomToExtent(map, extent);
                      gaMarkerOverlay.add(map, center, extent);
                    }
                  } else {
                    unregisterMove();
                  }
                  if (origin === 'feature') {
                    var layerId = datum.attrs.layer;
                    var featureId = datum.attrs.featureId;
                    selectFeature(layerId, featureId);
                  }
                  if (origin === 'layer') {
                    scope.addLayer(datum.attrs.layer, false);
                  }
                  //Take care of swisssearch parameter
                  var sP = gaPermalink.getParams().swisssearch;
                  if (angular.isDefined(sP) &&
                      sP.length > 0) {
                    //If we end up here because swisssearch cause a single
                    //click, we remove the swisssearch parameter on
                    //move/zoom. Otherwise, we always remove it
                    if (gaSwisssearch.singleResult()) {
                      //attach to property change to remove
                      var unregProp = map.getView().on('propertychange',
                                                       function() {
                        gaPermalink.deleteParam('swisssearch');
                        map.getView().unByKey(unregProp);
                      });
                    } else {
                      gaPermalink.deleteParam('swisssearch');
                    }
                  }
                });

              scope.searchableLayersFilter = function(layer) {
                var layerBodId = layer.bodId;
                return gaLayerFilters.selected(layer) &&
                       layer.visible &&
                       angular.isDefined(layerBodId) &&
                       gaLayers.getLayerProperty(layerBodId, 'searchable');
              };

              scope.$watchCollection('layers | filter:searchableLayersFilter',
                  function(layers) {
                var layerBodIds = [];
                var timeEnabled = [];
                angular.forEach(layers, function(layer) {
                  layerBodIds.push(layer.bodId);
                  timeEnabled.push(layer.timeEnabled);
                });
                scope.searchableLayers = layerBodIds;
                scope.timeEnabled = timeEnabled;
              });

              var viewDropDown = $(taElt).data('ttView').dropdownView;
              // We have to create a small workaround to get the
              // a suggestionsRendered event that includes the
              // dataset
              var renderSuggestions = viewDropDown.renderSuggestions;
              viewDropDown.renderSuggestions = function(dataset, suggestions,
                                                        invokeApply) {
                if (dataset.name === 'locations') {
                  hasLocationResults = (suggestions.length !== 0);
                } else if (dataset.name === 'featuresearch') {
                  hasFeatureResults = (suggestions.length !== 0);
                } else if (dataset.name === 'layers') {
                  // hasLayerResults is used to control
                  // the display of the footer
                  $timeout(function() {
                    scope.hasLayerResults = (suggestions.length !== 0);
                  }, 0);
                }
                renderSuggestions.apply(this, [dataset, suggestions]);
                if (invokeApply !== false) {
                  var self = this;
                  scope.$apply(function() {
                    self.trigger('gaSuggestionsRendered', dataset);
                  });
                } else {
                  this.trigger('gaSuggestionsRendered', dataset);
                }
              };

              // Adapt dynamically the list height according to the
              // number of lists
              scope.nbOfSuggestionsLists = {
                'ga-search-1': false,
                'ga-search-2': false,
                'ga-search-3': false
              };

              var setListCount = function() {
                var counter = 0;
                counter = !hasLocationResults ? counter : counter + 1;
                counter = !hasFeatureResults ? counter : counter + 1;
                counter = !scope.hasLayerResults ? counter : counter + 1;
                for (var cssClass in scope.nbOfSuggestionsLists) {
                  if (cssClass === 'ga-search-' + counter) {
                    scope.nbOfSuggestionsLists[cssClass] = true;
                  } else {
                    scope.nbOfSuggestionsLists[cssClass] = false;
                  }
                }
              };

              viewDropDown.on('gaSuggestionsRendered', function(evt) {
                var el;
                gaWaitCursor.remove();
                if (viewDropDown.isVisible()) {
                  $timeout(function() {
                    setListCount();
                  }, 0);
                  el = element.find('.tt-dataset-' + evt.data.name);
                  el.attr('ng-class', 'nbOfSuggestionsLists');
                  $compile(el)(scope);
                  if (el) {
                    el = el.find('.tt-suggestions');
                    if (el) {
                      gaSwisssearch.feed(el);
                    }
                    el.scrollTop(0);
                  }
                }
                gaSwisssearch.check();
              });

              scope.clearInput = function() {
                $(taElt).val('');
                $(taElt).data('ttView').inputView.setQuery('');
                scope.query = '';
                gaMarkerOverlay.remove(map);
                unregisterMove();
                viewDropDown.clearSuggestions();
                scope.searchFocused = false;
              };

              scope.$on('gaTopicChange', function(event, topic) {
                currentTopic = topic.id;
              });

              var triggerSearch = function(dataSetIndex) {
                if (scope.query !== '') {
                  var dataset = $(taElt).data('ttView').datasets[dataSetIndex];
                  dataset.getSuggestions(scope.query,
                      function(suggestions) {
                        viewDropDown.renderSuggestions(dataset, suggestions,
                            false);
                  });
                }
              };

              // When the query string changes, renderSuggestions is not
              // necessarily called if the response time is long and the
              // query string changes very fast. Here we make sure the waiting
              // cursor is removed between different searches.
              scope.$watch('query', function() {
                for (var i in typeAheadDatasets) {
                  gaWaitCursor.remove();
                }
              });

              scope.$on('$translateChangeEnd', function() {
                if (angular.isDefined(currentTopic)) {
                  triggerSearch(LAYERS);
                }
              });

              scope.$on('gaTimeSelectorChange', function(event, newYear) {
                if (newYear !== year) {
                  year = newYear;
                  triggerSearch(FEATURES);
                }
              });

              taElt.focus(function() {
                $timeout(function() {
                  scope.searchFocused = true;
                  window.scrollTo(0, 1);
                });
              });
              taElt.on('search', function(e) {
                taElt.trigger('blur');
              });

              var searchParam = gaPermalink.getParams().swisssearch;
              if (angular.isDefined(searchParam) &&
                  searchParam.length > 0) {
                var unregister = scope.$on('gaLayersChange', function() {
                  // At this point layers are not added to the map yet
                  var unregisterLayers = scope.$watchCollection('layers',
                      function(layers) {
                    $timeout(function() {
                      var maxCallbacks = 2 * typeAheadDatasets.length;
                      if (!triggerFeatureSearch()) {
                        maxCallbacks -= 1;
                      }
                      gaSwisssearch.activate(maxCallbacks);
                      scope.query = searchParam;
                      triggerSearch(LOCATIONS);
                      triggerSearch(FEATURES);
                      triggerSearch(LAYERS);
                      //Remove swisssearch parameter when query text changes
                      var unregWatch = scope.$watch('query', function(newval) {
                        if (newval != searchParam) {
                          gaPermalink.deleteParam('swisssearch');
                          unregWatch();
                        }
                      });
                    }, 0);
                    unregisterLayers();
                  });
                 unregister();
                });
              }

              if (!gaBrowserSniffer.mobile ||
                  (angular.isDefined(searchParam) &&
                  searchParam.length > 0)) {
                $timeout(function() {
                  taElt.focus();
                });
              }

            }
          };
        });
})();
