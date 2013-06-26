(function() {
  goog.provide('ga_contextmenu_directive');

  var module = angular.module('ga_contextmenu_directive', []);

  module.directive('gaContextMenu', ['$parse', '$http', function($parse, $http) {
    var height = 'http://api.geo.admin.ch/height?cb=JSON_CALLBACK';
    var lv03tolv95 = 'http://tc-geodesy.bgdi.admin.ch/reframe/lv03tolv95?cb=JSON_CALLBACK';

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var map = $parse(attrs.gaContextMenuMap)(scope);

        map.on('contextmenu', function(event) {
          scope.$apply(function() {
            event.preventDefault();
            var epsg21781 = event.getCoordinate();
            var epsg4326 = ol.proj.transform(epsg21781, 'EPSG:21781', 'EPSG:4326');
            scope.epsg21781 = ol.coordinate.toStringXY(epsg21781, 0);
            scope.epsg4326 = ol.coordinate.toStringXY(epsg4326, 5);

            $http.jsonp(height, {
              params: {
                easting: epsg21781[0],
                northing: epsg21781[1],
                elevation_model: 'COMB'
              }
            }).success(function(data) {
              scope.altitude = data.height;
            });
            $http.jsonp(lv03tolv95, {
              params: {
                easting: epsg21781[0],
                northing: epsg21781[1]
              }
            }).success(function(data) {
              scope.epsg2056 = ol.coordinate.toStringXY(data.coordinates, 2);
            });

            var pixel = event.getPixel();
            element.css('left', pixel[0] + 'px');
            element.css('top', pixel[1] + 'px');
            element.css('display', 'block');

            map.once('down', function() {
              element.css('display', 'none');
            });
          });
        });
      }
    };
  }]);

})();
