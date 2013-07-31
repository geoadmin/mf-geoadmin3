(function() {
  goog.provide('ga_search_directive');

  var module = angular.module('ga_search_directive', []);

  module.directive('gaSearch',
      ['$compile', '$translate', 'gaPermalink',
       function($compile, $translate, gaPermalink) {
         var footer = [
          '<div style="float: left; padding-top: 10px; padding-left: 20px;">',
          '<b>Please help me</b></div>',
          '<div style="float: right; padding-right: 20px;">',
          '<div>',
          '<a class="share-icon" ',
          'title="Tweet this map" ',
          'ng-click="getHref()" ',
          'ng-mouseover="getHref()" ',
          'ng-href="https://twitter.com/intent/tweet?',
          'url={{options.encodedPermalinkHref}}&text={{options.encodedDocumentTitle}}">',
          '<i class="icon-twitter"></i>',
          '</a>',
          '<a class="share-icon"',
          'title="Share this map with your friends" ',
          'ng-click="getHref()" ',
          'ng-mouseover="getHref()" ',
          'ng-href="http://www.facebook.com/sharer.php?',
          'u={{options.encodedPermalinkHref}}&t={{opitons.encodedDocumentTitle}}">',
          '<i class="icon-facebook"></i>',
          '</a>',
          '<a class="share-icon" ',
          'title="Send a map-email to your friends" ',
          'ng-click="getHref()" ',
          'ng-mouseover="getHref()" ',
          'ng-href="mailto:?',
          'subject={{options.encodedDocumentTitle}}&body={{options.encodedPermalinkHref}}">',
          '<i class="icon-envelope-alt"></i> ',
          '</a>',
          '</div>',
          '</div>'].join('');

         function parseExtent(stringBox2D) {
           return stringBox2D.replace('BOX(', '')
             .replace(')', '').replace(',', ' ').split(' ')
             .map(function(val) {
              return parseFloat(val);
            });
         };

         function getBBoxParameters(map) {
           var size = map.getSize();
           var view = map.getView();
           var bounds = view.calculateExtent(size);
           return bounds[0] + ',' + bounds[2] + ',' +
            bounds[1] + ',' + bounds[3];
         };

         function zoomToExtent(map, extent) {
           var size = map.getSize();
           var view = map.getView();

           //minX maxX minY maxY
           view.fitExtent([extent[0], extent[2], extent[1], extent[3]], size);
         };

         function moveTo(map, zoom, center) {
           var view = map.getView();

           view.setZoom(zoom);
           view.setCenter(center);
         };

         return {
           restrict: 'A',
           replace: true,
           scope: {
             options: '=gaSearchOptions',
             map: '=gaSearchMap'
           },
           template:
           '<div><input id="search" type="text" placeholder=' +
           '"Search for a location of a map information..."></div>',
           link: function(scope, element, attrs) {
             var map = scope.map;
             var options = scope.options;

             var footer_template = angular.element(footer);
             $compile(footer_template)(scope);

             scope.getHref = function() {
              // set those values in options only on mouseover or click
              scope.encodedPermalinkHref =
              encodeURIComponent(gaPermalink.getHref());
              scope.encodedDocumentTitle =
              encodeURIComponent(document.title);
            };

            scope.showLegend = function() {
              alert('Legend window should be defined once and for all!');
            };

            var taElt = $(element).find('input').typeahead([
              {
                header: '<div class="tt-header-locations">Locations:</div>',
                name: 'locations',
                cache: false,
                dataType: 'jsonp',
                timeout: 20,
                valueKey: 'inputVal',
                limit: 30,
                template: function(context) {
                  var template = '<a class="tt-search" ';
                  var origin = context.attrs.origin;
                  var label = context.attrs.label;
                  template += '>' + label + '</a>';
                  return template;
                },
                remote: {
                  url: options.serviceUrl,
                  beforeSend: function(jqXhr, settings) {
                    var bbox = '&bbox=' + getBBoxParameters(map);
                    var lang = '&lang=' + $translate.uses();
                    var type = '&type=locations';
                    // FIXME check if queryable layer is in the map
                    var features = '&features=';
                    settings.url += bbox + lang + type + features;
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
                header: '<div class="tt-header-mapinfos">Map Infos:</div>',
                footer: footer_template,
                name: 'layers',
                cache: false,
                dataType: 'jsonp',
                timeout: 20,
                valueKey: 'inputVal',
                limit: 20,
                template: function(context) {
                  var template = '<a class="tt-search" ';
                  var origin = context.attrs.origin;
                  var label = context.attrs.label;
                  template += '>' + label + '<i id="legend-open" ' +
                  'href="#legend" ng-click="showLegend()"' +
                  'class="icon-info-sign"> </i></a>';
                  return template;
                },
                remote: {
                  url: options.serviceUrl + '&',
                  beforeSend: function(jqXhr, settings) {
                    var lang = 'lang=' + $translate.uses();
                    var type = '&type=layers';
                    settings.url += lang + type;
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
             ]).on('typeahead:selected', function(event, datum) {
                if (typeof datum.attrs.geom_st_box2d != 'undefined') {
                  var extent = parseExtent(datum.attrs.geom_st_box2d);
                  var origin = datum.attrs.origin;

                  var origin_zoom = {
                    'address': 10,
                    'parcel': 9,
                    'sn25': 8
                  };

                  if (origin_zoom.hasOwnProperty(origin)) {
                    var zoom = origin_zoom[origin];
                    var center = [extent[0], extent[1]];
                    moveTo(map, zoom, center);
                  } else {
                    zoomToExtent(map, extent);
                  }
                }
             });

            var viewDropDown = $(taElt).data('ttView').dropdownView;
            viewDropDown.on('suggestionsRendered', function(event) {
                var elements = angular.element('.tt-search');
                $compile(elements)(scope);
            });

           }
         };
       }]);
})();
