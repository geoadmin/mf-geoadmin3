(function() {
  goog.provide('ga_contextmenu_directive');

  var module = angular.module('ga_contextmenu_directive', []);

  module.directive('gaContextMenu', ['$http', '$q', function($http, $q) {
    var heightURL =
        'http://api.geo.admin.ch/height?cb=JSON_CALLBACK';
    var lv03tolv95URL =
        'http://tc-geodesy.bgdi.admin.ch/reframe/lv03tolv95?cb=JSON_CALLBACK';

    return {
      restrict: 'A',
      templateUrl: 'src/contextmenu/partials/menu.html',
      scope: {
        map: '=gaContextMenuMap'
      },
      link: function(scope, element, attrs) {
        scope.map.on('contextmenu', function(event) {
          event.preventDefault();
          var epsg21781 = event.getCoordinate();
          var epsg4326 = ol.proj.transform(epsg21781,
              'EPSG:21781', 'EPSG:4326');

          $q.all({
            height: $http.jsonp(heightURL, {
              params: {
                easting: epsg21781[0],
                northing: epsg21781[1],
                elevation_model: 'COMB'
              }
            }),
            lv03tolv95: $http.jsonp(lv03tolv95URL, {
              params: {
                easting: epsg21781[0],
                northing: epsg21781[1]
              }
            })
          }).then(function(results) {
            var epsg2056 = results.lv03tolv95.data.coordinates;
            scope.epsg21781 = ol.coordinate.toStringXY(epsg21781, 0);
            scope.epsg4326 = ol.coordinate.toStringXY(epsg4326, 5);
            scope.epsg2056 = ol.coordinate.toStringXY(epsg2056, 2);
            scope.altitude = parseFloat(results.height.data.height);

            element.css('display', 'block');
          });

          var pixel = event.getPixel();
          element.css('left', pixel[0] + 'px');
          element.css('top', pixel[1] + 'px');

          scope.map.getView().once('change:center', function() {
            element.css('display', 'none');
          });

          scope.$apply();
        });
      }
    };
  }]);

})();
