(function() {
  goog.provide('ga_contextpopup_directive');
  goog.require('ga_permalink');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_contextpopup_directive', [
    'ga_permalink',
    'ga_urlutils_service'
  ]);

  module.directive('gaContextPopup',
      function($http, $q, $timeout, gaPermalink,
              gaUrlUtils, gaBrowserSniffer) {
          var lv03tolv95Url =
              'http://tc-geodesy.bgdi.admin.ch/reframe/lv03tolv95?cb=JSON_CALLBACK';
          return {
            restrict: 'A',
            replace: true,
            templateUrl: 'components/contextpopup/partials/contextpopup.html',
            scope: {
              map: '=gaContextPopupMap',
              options: '=gaContextPopupOptions'
            },
            link: function(scope, element, attrs) {
              var heightUrl = gaUrlUtils.append(scope.options.heightUrl,
                  'callback=JSON_CALLBACK');
              var qrcodeUrl = scope.options.qrcodeUrl;

              // The popup content is updated (a) on contextmenu events,
              // and (b) when the permalink is updated.

              var map = scope.map;
              var view = map.getView();

              var coord21781;
              var popoverShown = false;

              var overlay = new ol.Overlay({
                element: element[0]
              });
              map.addOverlay(overlay);

              scope.showQR = !gaBrowserSniffer.mobile;

              var handler = function(event) {
                event.preventDefault();

                var pixel = event.getPixel();
                coord21781 = event.getCoordinate();
                var coord4326 = ol.proj.transform(coord21781,
                    'EPSG:21781', 'EPSG:4326');

                // recenter on phones
                if (gaBrowserSniffer.phone) {
                  var pan = ol.animation.pan({
                    duration: 200,
                    source: view.getCenter()
                  });
                  map.beforeRender(pan);
                  view.setCenter(coord21781);
                }

                // A digest cycle is necessary for $http requests to be
                // actually sent out. Angular-1.2.0rc2 changed the $evalSync
                // function of the $rootScope service for exactly this. See
                // Angular commit 6b91aa0a18098100e5f50ea911ee135b50680d67.
                // We use a conservative approach and call $apply ourselves
                // here, but we instead could also let $evalSync trigger a
                // digest cycle for us.

                scope.$apply(function() {
                  $q.all({
                    height: $http.jsonp(heightUrl, {
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

                    overlay.setPosition(coord21781);
                    showPopover();

                  });
                });
              };

              // Listen to contextmenu events from the map.
              map.on('contextmenu', handler);

              // On touch devices, display the context popup after a
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

                if (!gaBrowserSniffer.mobile) {
                  scope.qrcodeUrl = qrcodeUrl +
                    '?url=' +
                    escape(contextPermalink);
                }
              }

              element.on('contextmenu', 'a', function(e) {
                e.stopPropagation();
              });
            }
          };
        });

})();
