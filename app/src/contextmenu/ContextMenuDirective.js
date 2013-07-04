(function() {
  goog.provide('ga_contextmenu_directive');

  var module = angular.module('ga_contextmenu_directive', []);

  module.directive('gaContextMenu',
      ['$http', '$q', 'gaPermalink',
        function($http, $q, gaPermalink) {
          var heightURL =
              'http://api.geo.admin.ch/height?cb=JSON_CALLBACK';
          var lv03tolv95URL =
              'http://tc-geodesy.bgdi.admin.ch/reframe/lv03tolv95?cb=JSON_CALLBACK';
          return {
            restrict: 'A',
            templateUrl: 'src/contextmenu/partials/menu.html',
            require: '^gaMap',
            scope: {},
            link: function(scope, element, attrs, gaMapDirectiveCtrl) {

              // The popup content is updated (a) on contextmenu events,
              // and (b) when the permalink is updated.

              var map = gaMapDirectiveCtrl.getMap();
              var view = map.getView();

              var coord21781;

              // Listen to contextmenu events from the map.
              map.on('contextmenu', function(event) {
                event.preventDefault();

                var pixel = event.getPixel();
                coord21781 = event.getCoordinate();
                var coord4326 = ol.proj.transform(coord21781,
                    'EPSG:21781', 'EPSG:4326');

                // The $http service does not send requests immediately but
                // wait for the "nextTick". Not sure this is bug in Angular.
                // https://github.com/angular/angular.js/issues/2442 reports
                // it a bug. As a workaround we call $http in an $apply
                // callback.
                scope.$apply(function() {
                  $q.all({
                    height: $http.jsonp(heightURL, {
                      params: {
                        easting: coord21781[0],
                        northing: coord21781[1],
                        elevation_model: 'COMB'
                      }
                    }),
                    lv03tolv95: $http.jsonp(lv03tolv95URL, {
                      params: {
                        easting: coord21781[0],
                        northing: coord21781[1]
                      }
                    })
                  }).then(function(results) {
                    var coord2056 = results.lv03tolv95.data.coordinates;

                    scope.coord21781 = ol.coordinate.toStringXY(coord21781, 1);
                    scope.coord4326 = ol.coordinate.toStringXY(coord4326, 5);
                    scope.coord2056 = ol.coordinate.toStringXY(coord2056, 2);
                    scope.altitude = parseFloat(results.height.data.height);

                    updatePopupLinks();

                    view.once('change:center', function() {
                      scope.popoverClose();
                    });

                    element.css('left', (pixel[0] - 150) + 'px');
                    element.css('top', pixel[1] + 'px');
                    element.css('display', 'block');
                  });
                });
              });

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                if (angular.isDefined(coord21781)) {
                  updatePopupLinks();
                }
              });

              scope.popoverClose = function() {
                element.css('display', 'none');
              };

              function updatePopupLinks() {
                var contextPermalink = gaPermalink.getHref({
                  Y: Math.round(coord21781[0], 1),
                  X: Math.round(coord21781[1], 1)});
                scope.contextPermalink = contextPermalink;

                scope.crosshairPermalink = gaPermalink.getHref({
                  Y: Math.round(coord21781[0], 1),
                  X: Math.round(coord21781[1], 1),
                  crosshair: 'bowl'});

                scope.qrCodeUrl =
                   'http://api.geo.admin.ch/qrcodegenerator?url=' +
                   escape(contextPermalink);
              }
            }
          };
        }]);

})();
