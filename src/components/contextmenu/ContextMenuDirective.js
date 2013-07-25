(function() {
  goog.provide('ga_contextmenu_directive');

  var module = angular.module('ga_contextmenu_directive', []);

  module.directive('gaContextMenu',
      ['$http', '$q', '$timeout', 'gaPermalink',
        function($http, $q, $timeout, gaPermalink) {
          var lv03tolv95Url =
              'http://tc-geodesy.bgdi.admin.ch/reframe/lv03tolv95?cb=JSON_CALLBACK';
          return {
            restrict: 'A',
            replace: true,
            templateUrl: 'components/contextmenu/partials/contextmenu.html',
            scope: {
              map: '=gaContextMenuMap',
              options: '=gaContextMenuOptions'
            },
            link: function(scope, element, attrs) {
              var heightUrl = scope.options.heightUrl;
              var qrcodeUrl = scope.options.qrcodeUrl;

              // The popup content is updated (a) on contextmenu events,
              // and (b) when the permalink is updated.

              var map = scope.map;
              var view = map.getView();

              var coord21781;
              var popoverShown = false;

              var handler = function(event) {
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
                    height: $http.jsonp(heightUrl + '?callback=JSON_CALLBACK', {
                      params: {
                        easting: coord21781[0],
                        northing: coord21781[1],
                        elevation_model: 'COMB'
                      }
                    }),
                    lv03tolv95: $http.jsonp(lv03tolv95Url, {
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
                      hidePopover();
                    });

                    element.css('left', (pixel[0] - 150) + 'px');
                    element.css('top', pixel[1] + 'px');
                    showPopover();
                  });
                });
              };

              // Listen to contextmenu events from the map.
              map.on('contextmenu', handler);

              // On touch devices, display the context menu after a
              // long press (750ms)
              var startPixel, holdPromise;
              map.on('touchstart', function(event) {
                $timeout.cancel(holdPromise);
                startPixel = event.getPixel();
                holdPromise = $timeout(function() {
                  handler(event);
                }, 750, false);
              });
              map.on('touchend', function(event) {
                $timeout.cancel(holdPromise);
                startPixel = undefined;
              });
              map.on('touchmove', function(event) {
                if (startPixel) {
                  var pixel = event.getPixel();
                  var deltaX = Math.abs(startPixel[0] - pixel[0]);
                  var deltaY = Math.abs(startPixel[1] - pixel[1]);
                  if (deltaX + deltaY > 2) {
                    $timeout.cancel(holdPromise);
                    startPixel = undefined;
                  }
                }
              });

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                if (angular.isDefined(coord21781) && popoverShown) {
                  updatePopupLinks();
                }
              });

              scope.hidePopover = function() {
                hidePopover();
              };

              function showPopover() {
                element.css('display', 'block');
                popoverShown = true;
              }

              function hidePopover() {
                element.css('display', 'none');
                popoverShown = false;
              }

              function updatePopupLinks() {
                var p = {
                  X: Math.round(coord21781[1], 1),
                  Y: Math.round(coord21781[0], 1)
                };

                var contextPermalink = gaPermalink.getHref(p);
                scope.contextPermalink = contextPermalink;

                scope.crosshairPermalink = gaPermalink.getHref(
                    angular.extend({crosshair: 'bowl'}, p));

                scope.qrcodeUrl = qrcodeUrl +
                   '?url=' +
                   escape(contextPermalink);
              }
            }
          };
        }]);

})();
