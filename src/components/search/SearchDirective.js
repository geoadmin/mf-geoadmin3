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
      function($compile, $translate, $timeout, gaMapUtils, gaLayers,
        gaLayerMetadataPopup, gaPermalink, gaUrlUtils, gaGetCoordinate,
        gaBrowserSniffer, gaLayerFilters, gaKml) {
          var currentTopic,
              footer = [
            '<div class="search-footer clearfix">',
            '<div class="footer-left">',
            '<b translate>search_help</b></div>',
            '<div class="footer-right">',
            '<a class="contact-icon" ',
            'title="{{\'contact_us\' | translate}}" ',
            'ng-mouseover="getHref()" ',
            'ng-href="http://www.geo.admin.ch/',
            'internet/geoportal/{{lang}}/tools/contact.html" ',
            'target="_blank">',
            '<i class="icon-phone"></i> ',
            '</a>',
            '<a class="contact-icon" ',
            'title="{{\'follow_us\' | translate}}" ',
            'href="https://twitter.com/swiss_geoportal"',
            'target="_blank">',
            '<i class="icon-twitter"></i>',
            '</a>',
            '<a class="contact-icon"',
            'title="{{\'email_us\' | translate}}" ',
            'ng-mouseover="getHref()" ',
            'ng-href="mailto:webgis@swisstopo.ch?',
            'body={{encodedPermalinkHref}}">',
            '<i class="icon-envelope-alt"></i>',
            '</a>',
            '</div>'].join('');

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

              var footerTemplate = angular.element(footer);
              $compile(footerTemplate)(scope);

              var locationsHeaderTemplate = angular.element(
                  '<div class="tt-header-locations" ' +
                  'translate>locations</div>');
              $compile(locationsHeaderTemplate)(scope);

              var layerHeaderTemplate = angular.element(
                  '<div class="tt-header-mapinfos" ' +
                  'ng-show="hasLayerResults" translate>map_info</div>');
              $compile(layerHeaderTemplate)(scope);
              scope.query = '';

              scope.layers = [];

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

              scope.addLayer = function(bodId, isPreview) {
                var olLayer = gaLayers.getOlLayerById(bodId);
                var layerInMap = gaMapUtils.getMapOverlayForBodId(
                     map, bodId);
                if (angular.isDefined(olLayer) &&
                    !angular.isDefined(layerInMap)) {
                  olLayer.preview = isPreview;
                  map.addLayer(olLayer);
                } else if (angular.isDefined(layerInMap) &&
                  !isPreview) {
                  layerInMap.preview = isPreview;
                }
              };

              scope.removePreviewLayer = function(bodId) {
                var olLayer = gaMapUtils.getMapOverlayForBodId(
                    map, bodId);
                if (angular.isDefined(olLayer) && olLayer.preview) {
                  map.removeLayer(olLayer);
                }
              };

              scope.addCross = function(center) {
                var cross = $('<div></div>')
                  .addClass('crosshair')
                  .addClass('cross');
                scope.removeCross();
                scope.overlay = new ol.Overlay({
                  element: cross.get(0),
                  position: center
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

              var typeAheadDatasets = [
                {
                  header: locationsHeaderTemplate,
                  name: 'locations',
                  timeout: 20,
                  valueKey: 'inputVal',
                  limit: 30,
                  template: function(context) {
                    var label = getLocationLabel(context.attrs);
                    var template = '<div class="tt-search';
                    if (context.attrs.origin == 'feature') {
                      template += ' tt-feature';
                    }
                    template += '">' + label + '</div>';
                    return template;
                  },
                  remote: {
                    url: gaUrlUtils.append(options.serviceUrl,
                        'type=locations'),
                    beforeSend: function(jqXhr, settings) {
                       scope.$apply(function() {
                          scope.layers = map.getLayers().getArray();
                       });
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
                      var bbox = '&bbox=' + getBBoxParameters(map);
                      var lang = '&lang=' + $translate.uses();
                      var searchableLayers = '&features=' +
                          scope.searchableLayers.join(',');
                      var timeInstant = '';
                      if (year) {
                        timeInstant = '&timeInstant=' + year;
                      }
                      url = options.applyTopicToUrl(url,
                                                   currentTopic);
                      url += queryText + searchableLayers + bbox +
                             lang + timeInstant;
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
                        'ng-mouseover="addLayer(\'' +
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
                    url: options.serviceUrl + 'type=layers',
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
                      // hasLaerResults is used to control
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
                  if (angular.isDefined(datum.attrs.geom_st_box2d)) {
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
                angular.forEach(layers, function(layer) {
                  var bodId = layer.bodId;
                  layerBodIds.push(bodId);
                });
                scope.searchableLayers = layerBodIds;
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
                    }
                    el.scrollTop(0);
                  }
                }
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

              scope.$on('$translateChangeEnd', function() {
                if (angular.isDefined(currentTopic) && scope.query !== '') {
                  // Only layers dataset needs to be updated
                  var datasetLayers = $(taElt).data('ttView').datasets[1];
                  datasetLayers.getSuggestions(scope.query,
                                               function(suggestions) {
                    viewDropDown.renderSuggestions(datasetLayers, suggestions,
                                                   false);
                  });
                }
              });

              scope.$on('gaTimeSelectorChange', function(event, currentyear) {
                if (currentyear !== year) {
                  year = currentyear;
                  if (scope.query !== '') {
                    //Update locations search (containing feature search)
                    var datasetLocations = $(taElt).data('ttView').datasets[0];
                    datasetLocations.getSuggestions(scope.query,
                                                 function(suggestions) {
                      viewDropDown.renderSuggestions(datasetLocations,
                                                     suggestions,
                                                     false);
                    });
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

              if (!gaBrowserSniffer.mobile) {
                $timeout(function() {
                  taElt.focus();
                });
              }
            }
          };
        });
})();
