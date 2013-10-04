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
      function($compile, $translate, $timeout, gaLayers, gaLayerMetadataPopup,
        gaPermalink, gaUrlUtils, gaGetCoordinate, gaBrowserSniffer) {
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

              scope.getHref = function() {
                // set those values only on mouseover
                scope.encodedPermalinkHref =
                encodeURIComponent(gaPermalink.getHref());
                scope.lang = $translate.uses();
              };

              scope.getLegend = function(ev, id) {
                gaLayerMetadataPopup(id);
                ev.stopPropagation();
              };

              scope.addLayer = function(id) {
                if (!hasLayer(id)) {
                  var layer = gaLayers.getOlLayerById(id);
                  if (angular.isDefined(layer)) {
                    map.addLayer(layer);
                  } else {
                    alert('A configuration does not exist for this layer yet!');
                  }
                }
              };

              scope.removeLayer = function(id) {
                if (hasLayer(id)) {
                  var layer = gaLayers.getOlLayerById(id);
                  map.removeLayer(layer);
                }
              };

              var hasLayer = function(id) {
                var res = false;
                map.getLayers().forEach(function(layer) {
                  if (angular.isDefined(layer.get('id'))) {
                    if (id === layer.get('id')) {
                      res = true;
                    }
                  }
                });
                return res;
              };

              var typeAheadDatasets = [
                {
                  header: locationsHeaderTemplate,
                  name: 'locations',
                  timeout: 20,
                  valueKey: 'inputVal',
                  limit: 30,
                  template: function(context) {
                    var label = context.attrs.label;
                    var template = '<div class="tt-search" ' +
                        '>' + label + '</div>';
                    return template;
                  },
                  remote: {
                    url: gaUrlUtils.append(options.serviceUrl,
                        'type=locations'),
                    beforeSend: function(jqXhr, settings) {
                       var position =
                         gaGetCoordinate(
                           map.getView().getProjection().getExtent(),
                           scope.query);
                       if (position) {
                         moveTo(map, 8, position);
                       }
                       // TODO: add crosshair
                       return !position;
                    },
                    replace: function(url, searchText) {
                      var queryText = '&searchText=' + searchText;
                      var bbox = '&bbox=' + getBBoxParameters(map);
                      var lang = '&lang=' + $translate.uses();
                      // FIXME check if queryable layer is in the map
                      // var features = '&features=';
                      url = options.applyTopicToUrl(url,
                                                   currentTopic);
                      url += queryText + bbox + lang;
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
                        context.attrs.layer + '\')" ' +
                        'ng-mouseout="removeLayer(\'' +
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
                  scope.$apply(function() {
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
                      parcel: 9,
                      sn25: 8
                    };

                    if (originZoom.hasOwnProperty(origin)) {
                      var zoom = originZoom[origin];
                      var center = [extent[0], extent[1]];
                      moveTo(map, zoom, center);
                    } else {
                      zoomToExtent(map, extent);
                    }
                  }
                  if (origin === 'layer') {
                    scope.addLayer(datum.attrs.layer);
                  }
                });

              // FIXME Find a better way to handle suggestions compilation
              var suggestionsRendered = 0;
              var viewDropDown = $(taElt).data('ttView').dropdownView;
              viewDropDown.on('suggestionsRendered', function(event) {
                if (viewDropDown.isVisible()) {
                  suggestionsRendered += 1;
                  // Make sure the final html content is compiled once only
                  if (typeAheadDatasets.length === suggestionsRendered) {
                    // Only for layer search at the moment
                    var elements = element.find('.tt-dataset-layers')
                      .find('.tt-suggestions');
                    $compile(elements)(scope);
                    suggestionsRendered = 0;
                  }
                }
              });

              scope.clearInput = function() {
                $(taElt).val('');
                $(taElt).data('ttView').inputView.setQuery('');
                scope.query = '';
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
                  datasetLayers.getSuggestions('http', function(suggestions) {
                    viewDropDown.renderSuggestions(datasetLayers, suggestions);
                  });
                }
              });

              taElt.focus(function() {
                scope.$apply(function() {
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
