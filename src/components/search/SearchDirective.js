(function() {
  goog.provide('ga_search_directive');

  var module = angular.module('ga_search_directive', []);

  module.directive('gaSearch',
      ['$compile',
       function($compile) {
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
             var config = options.config;
             var footer = '<div ng-include src="\'components/search/' +
             'partials/search_footer.html\'"></div>';

             var footer_template = angular.element(footer);
             $compile(footer_template)(scope);

             // private function for parsing box string
             function parseExtent(stringBox2D) {
               return stringBox2D.replace('BOX(', '')
                .replace(')', '').replace(',', ' ').split(' ')
                .map(function(val) {
                 return parseFloat(val);
               });
             };

             $(element).find('input').typeahead({
               //header: '<div>This is a header</div>',
               name: config.name,
               cache: true,
               footer: footer_template,
               dataType: config.dataType,
               timeout: config.timeout,
               limit: config.limit,
               valueKey: config.valueKey,
               template: function(context) {
                  var html = options.setResponseTemplate(context);
                  return html;
               },
               remote: {
                 url: options.serviceUrl,
                 beforeSend: function(jqXhr, settings) {
                   var bbox = '&bbox=' + options.getBBoxParameters(map);
                   var lang = '&lang=fr';
                   var features = '&features=';
                   settings.url += bbox + lang + features;
                 },
                 filter: function(response) {
                   var addresses = response.locations;
                   var layers = response.map_info;
                   return $.map(addresses.concat(layers), function(val) {
                     val.inputVal = val.attrs.label
                      .replace('<b>', '').replace('</b>', '');
                     return val;
                   });
                 }
               }
             }).on('typeahead:selected', function(event, datum) {
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
                    options.moveTo(map, zoom, center);
                  } else {
                    options.zoomToExtent(map, extent);
                  }
                }
             });
           }
         };
       }]);
})();
