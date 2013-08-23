(function() {
  goog.provide('ga_search_directive');

  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');
  goog.require('ga_permalink');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_search_directive', [
    'ga_layer_metadata_popup_service',
    'ga_map_service',
    'ga_permalink',
    'pascalprecht.translate',
    'ga_urlutils_service'
  ]);

  module.directive('gaSearch',
      ['$compile', '$translate', 'gaLayers', 'gaLayerMetadataPopup',
        'gaPermalink', 'gaUrlUtils',
        function($compile, $translate, gaLayers, gaLayerMetadataPopup,
        gaPermalink, gaUrlUtils) {
          var currentTopic,
              footer = [
            '<div class="search-footer">',
            '<div class="footer-left">',
            '<b>Please help me</b></div>',
            '<div class="footer-right"><div>',
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
            '</div>',
            '</div>',
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
            return bounds[0] + ',' + bounds[2] + ',' +
                bounds[1] + ',' + bounds[3];
          }

          function zoomToExtent(map, extent) {
            var size = map.getSize();
            var view = map.getView();

            //minX maxX minY maxY
            view.fitExtent([extent[0], extent[2], extent[1], extent[3]], size);
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
              map: '=gaSearchMap'
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
                    dataType: 'jsonp',
                    cache: false,
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
                  footer: footerTemplate,
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
                    dataType: 'jsonp',
                    cache: false,
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

              var taElt = $(element).find('input').typeahead(typeAheadDatasets)
                .on('typeahead:selected', function(event, datum) {
                  var origin = datum.attrs.origin;
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
                    var elements = element.find('.tt-dataset-layers');
                    $compile(elements)(scope);
                    suggestionsRendered = 0;
                  }
                }
              });

              scope.clearInput = function() {
                $(taElt).val('');
                $(taElt).data('ttView').inputView.setQuery('');
                viewDropDown.clearSuggestions();
              };

              scope.$on('gaTopicChange', function(event, topic) {
                currentTopic = topic.id;
              });
            }
          };
        }]);
})();
