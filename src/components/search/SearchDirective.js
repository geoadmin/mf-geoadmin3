(function() {
  goog.provide('ga_search_directive');

  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');
  goog.require('ga_permalink');
  goog.require('ga_search_service');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_search_directive', [
    'ga_layer_metadata_popup_service',
    'ga_map_service',
    'ga_permalink',
    'pascalprecht.translate',
    'ga_urlutils_service',
    'ga_search_service'
  ]);

  module.directive('gaSearch',
      function($compile, $translate, $timeout, $rootScope, $http, gaMapUtils,
        gaLayerMetadataPopup, gaPermalink, gaUrlUtils, gaGetCoordinate,
        gaBrowserSniffer, gaLayerFilters, gaKml, gaPreviewLayers, gaLayers,
        gaPreviewFeatures, gaPermalinkSearch) {
          var currentTopic,
              footer = [
            '<div class="ga-search-footer clearfix">',
            '<div class="ga-search-footer-left">',
            '<b translate>search_help</b></div>',
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
              var year;
              var map = scope.map;
              var options = scope.options;
              var highlightedFeatures = {};

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
                if (!highlightedFeatures.hasOwnProperty(key)) {
                  var featureUrl = options.featureUrl
                               .replace('{Topic}', currentTopic)
                               .replace('{Layer}', layerId)
                               .replace('{Feature}', featureId);
                  $http.get(featureUrl, {
                    params: {
                       geometryFormat: 'geojson'
                    }
                  }).success(function(result) {
                    highlightedFeatures[key] = result.feature;
                    cb(result.feature);
                  });
                } else {
                  $timeout(function() {
                    cb(highlightedFeatures[key]);
                  }, 0);
                }
              };

              scope.query = '';

              scope.layers = map.getLayers().getArray();

              scope.overlay = undefined;

              scope.getHref = function() {
                // set those values only on mouseover
                scope.encodedPermalinkHref =
                encodeURIComponent(gaPermalink.getHref());
                scope.lang = $translate.uses();
              };

              scope.getLegend = function(ev, bodId) {
                gaLayerMetadataPopup(bodId);
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
                    scope.map, bodId);

                // Don't add preview layer if the layer is already on the map
                if (!layer) {
                  gaPreviewLayers.addBodLayer(scope.map, bodId);
                }
              };

              scope.removePreviewLayer = function() {
                if (gaBrowserSniffer.mobile) {
                  return;
                }
                gaPreviewLayers.removeAll(scope.map);
              };

              scope.addPreviewFeature = function(layerId, featureId) {
                if (gaBrowserSniffer.mobile) {
                  return;
                }
                loadGeometry(layerId, featureId, function(feature) {
                  gaPreviewFeatures.highlight(map,
                      geojsonParser.readFeature(feature));
                });
              };

              scope.removePreviewFeature = function() {
                if (gaBrowserSniffer.mobile) {
                  return;
                }
                gaPreviewFeatures.clearHighlight();
              };

              scope.selectFeature = function(layerId, featureId) {
                loadGeometry(layerId, featureId, function(feature) {
                  $rootScope.$broadcast('gaTriggerTooltipRequest', {
                    features: [feature],
                    onCloseCB: function() {}
                  });
                  gaPreviewFeatures.zoom(map,
                      geojsonParser.readFeature(feature));

                });
              };

              scope.addCross = function(center) {
                var cross = $('<div></div>')
                  .addClass('ga-crosshair')
                  .addClass('cross');
                scope.removeCross();
                scope.overlay = new ol.Overlay({
                  element: cross.get(0),
                  position: center,
                  stopEvent: false
                });
                map.addOverlay(scope.overlay);
              };

              scope.removeCross = function() {
                if (scope.overlay) {
                  map.removeOverlay(scope.overlay);
                }
              };

              var getLocationLabel = function(attrs) {
                var label = attrs.label;
                if (attrs.origin == 'zipcode') {
                  label = '<span>{{ "plz" | translate }} ' + label;
                } else if (attrs.origin == 'kantone') {
                  label = '<span>{{ "ct" | translate }} ' + label;
                } else if (attrs.origin == 'district') {
                  label = '<span>{{ "district" | translate }} ' + label;
                } else if (attrs.origin == 'parcel') {
                  label += ' <span>{{ "parcel" | translate }} ';
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

              var typeAheadDatasets = [
                {
                  header: locationsHeaderTemplate,
                  name: 'locations',
                  timeout: 20,
                  valueKey: 'inputVal',
                  limit: 30,
                  template: function(context) {
                    var label = getLocationLabel(context.attrs);
                    var template = '<div class="tt-search">' +
                        label + '</div>';
                    return template;
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
                         scope.addCross(position);
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
                    var attrs = context.attrs;
                    var label = getLocationLabel(attrs);
                    var template = '<div class="tt-search" ' +
                        'ng-mouseover="addPreviewFeature(\'' +
                        attrs.layer + '\', \'' + attrs.feature_id + '\')"' +
                        'ng-mouseout="removePreviewFeature()"' +
                        'ng-click="selectFeature(\'' +
                        attrs.layer + '\', \'' + attrs.feature_id + '\')" >' +
                        label + '</div>';
                    return template;
                  },
                  remote: {
                    url: gaUrlUtils.append(options.searchUrl,
                        'type=featuresearch'),
                    beforeSend: function(jqXhr, settings) {
                      scope.$apply(function() {
                        scope.layers = map.getLayers().getArray();
                      });
                      if (!gaGetCoordinate(
                          map.getView().getProjection().getExtent(),
                          scope.query) &&
                              scope.searchableLayers.length) {
                        highlightedFeatures = {};
                        return true;
                      } else {
                        // Do not perform a query
                        return false;
                      }
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
                      return !gaGetCoordinate(
                        map.getView().getProjection().getExtent(),
                        scope.query);
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
                      // hasLayerResults is used to control
                      // the display of the footer
                      scope.$apply(function() {
                        scope.hasLayerResults = (results.length !== 0);
                      });
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
                  scope.searchFocused = false;
                  taElt.trigger('blur', [true]);
                  if (origin !== 'feature' && origin !== 'layer') {
                    var extent = parseExtent(datum.attrs.geom_st_box2d);

                    var originZoom = {
                      address: 10,
                      parcel: 10,
                      sn25: 8,
                      feature: 7
                    };

                    if (originZoom.hasOwnProperty(origin)) {
                      var zoom = originZoom[origin];
                      var center = [(extent[0] + extent[2]) / 2,
                        (extent[1] + extent[3]) / 2];
                      moveTo(map, zoom, center);
                      scope.addCross(center);
                    } else {
                      zoomToExtent(map, extent);
                      scope.removeCross();
                    }
                  }
                  if (origin === 'layer') {
                    scope.addLayer(datum.attrs.layer, false);
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

              viewDropDown.on('gaSuggestionsRendered', function(evt) {
                var el;
                if (viewDropDown.isVisible()) {
                  el = element.find('.tt-dataset-' + evt.data.name);
                  if (el) {
                    el = el.find('.tt-suggestions');
                    if (el) {
                      $compile(el)(scope);
                      gaPermalinkSearch.feed(el);
                    }
                    el.scrollTop(0);
                  }
                }
                gaPermalinkSearch.check();
              });

              scope.clearInput = function() {
                $(taElt).val('');
                $(taElt).data('ttView').inputView.setQuery('');
                scope.query = '';
                scope.removeCross();
                viewDropDown.clearSuggestions();
                scope.searchFocused = false;
              };

              scope.$on('gaTopicChange', function(event, topic) {
                currentTopic = topic.id;
              });

              var triggerSearch = function(dataSetIndex) {
                var dataset = $(taElt).data('ttView').datasets[dataSetIndex];
                dataset.getSuggestions(scope.query,
                    function(suggestions) {
                      viewDropDown.renderSuggestions(dataset, suggestions,
                          false);
                });
              };

              scope.$on('$translateChangeEnd', function() {
                if (angular.isDefined(currentTopic) && scope.query !== '') {
                  triggerSearch(LAYERS);
                }
              });

              scope.$on('gaTimeSelectorChange', function(event, newYear) {
                if (newYear !== year) {
                  year = newYear;
                  if (scope.query !== '') {
                    triggerSearch(FEATURES);
                  }
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

              //if search parameter specified, start it with a search parameter
              var searchParam = gaPermalink.getParams()['swisssearch'];
              if (angular.isDefined(searchParam) &&
                  searchParam.length > 0) {
                var unregister = scope.$on('gaLayersChange', function() {
                  gaPermalinkSearch.activate((2 * typeAheadDatasets.length));
                  scope.query = searchParam;
                  triggerSearch(LOCATIONS);
                  triggerSearch(FEATURES);
                  triggerSearch(LAYERS);
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
