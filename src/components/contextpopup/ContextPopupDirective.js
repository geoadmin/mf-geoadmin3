goog.provide('ga_contextpopup_directive');

goog.require('ga_networkstatus_service');
goog.require('ga_permalink');
goog.require('ga_what3words_service');
(function() {

  var module = angular.module('ga_contextpopup_directive', [
    'ga_networkstatus_service',
    'ga_permalink',
    'ga_what3words_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaContextPopup',
      function($rootScope, $http, $translate, $q, $timeout, $window,
          gaBrowserSniffer, gaNetworkStatus, gaPermalink, gaGlobalOptions,
          gaLang, gaWhat3Words) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/contextpopup/partials/contextpopup.html',
          scope: {
            map: '=gaContextPopupMap',
            options: '=gaContextPopupOptions',
            is3dActive: '=gaContextPopupIs3d'
          },
          link: function(scope, element, attrs) {
            var heightUrl = scope.options.heightUrl;
            var qrcodeUrl = scope.options.qrcodeUrl;
            var lv03tolv95Url = scope.options.lv03tolv95Url;

            // The popup content is updated (a) on contextmenu events,
            // and (b) when the permalink is updated.

            var map = scope.map;
            var view = map.getView();

            var coord21781, coord4326;
            var popoverShown = false;

            var overlay = new ol.Overlay({
              element: element[0],
              stopEvent: true
            });
            map.addOverlay(overlay);

            scope.showQR = function() {
              return !gaBrowserSniffer.mobile && !gaNetworkStatus.offline;
            };

            var formatCoordinates = function(coord, prec, ignoreThousand) {
              var fCoord = ol.coordinate.toStringXY(coord, prec);
              if (!ignoreThousand) {
                fCoord = fCoord.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
              }
              return fCoord;
            };

            var coordinatesFormatUTM = function(coordinates, zone) {
              var coord = ol.coordinate.toStringXY(coordinates, 0).
                  replace(/\B(?=(\d{3})+(?!\d))/g, "'");
              return coord + ' ' + zone;
            };

            var updateW3W = function() {
              gaWhat3Words.getWords(coord4326[1],
                                    coord4326[0]).then(function(res) {
                scope.w3w = res;
              });
            };

            var handler = function(event) {
              if (scope.is3dActive) {
                return;
              }
              event.stopPropagation();
              event.preventDefault();

              //On Mac, left-click with ctrlKey also fires
              //the 'contextmenu' event. But this conflicts
              //with selectByRectangle feature (in featuretree
              //directive). So we bail out here if
              //ctrlKey is pressed
              if (event.ctrlKey) {
                return;
              }

              var pixel = (event.originalEvent) ?
                  map.getEventPixel(event.originalEvent) :
                  event.pixel;
              coord21781 = (event.originalEvent) ?
                  map.getEventCoordinate(event.originalEvent) :
                  event.coordinate;
              coord4326 = ol.proj.transform(coord21781,
                  'EPSG:21781', 'EPSG:4326');
              var coord2056 = ol.proj.transform(coord21781,
                  'EPSG:21781', 'EPSG:2056');

              scope.coord21781 = formatCoordinates(coord21781, 1);
              scope.coord4326 = ol.coordinate.format(coord4326, '{y}, {x}', 5);
              var coord4326String = ol.coordinate.toStringHDMS(coord4326, 3).
                                   replace(/ /g, '');
              scope.coordiso4326 = coord4326String.replace(/N/g, 'N ');
              scope.coord2056 = formatCoordinates(coord2056, 2) + ' *';
              if (coord4326[0] < 6 && coord4326[0] >= 0) {
                var utm_31t = ol.proj.transform(coord4326,
                    'EPSG:4326', 'EPSG:32631');
                scope.coordutm = coordinatesFormatUTM(utm_31t, '(zone 31T)');
              } else if (coord4326[0] < 12 && coord4326[0] >= 6) {
                var utm_32t = ol.proj.transform(coord4326,
                    'EPSG:4326', 'EPSG:32632');
                scope.coordutm = coordinatesFormatUTM(utm_32t, '(zone 32T)');
              } else {
                return '-';
              }

              coord4326['lon'] = coord4326[0];
              coord4326['lat'] = coord4326[1];
              scope.coordmgrs = $window.proj4.mgrs.forward(coord4326).
                  replace(/(.{5})/g, '$1 ');

              // A digest cycle is necessary for $http requests to be
              // actually sent out. Angular-1.2.0rc2 changed the $evalSync
              // function of the $rootScope service for exactly this. See
              // Angular commit 6b91aa0a18098100e5f50ea911ee135b50680d67.
              // We use a conservative approach and call $apply ourselves
              // here, but we instead could also let $evalSync trigger a
              // digest cycle for us.
              scope.$apply(function() {

                $http.get(heightUrl, {
                  params: {
                    easting: coord21781[0],
                    northing: coord21781[1],
                    elevation_model: gaGlobalOptions.defaultElevationModel
                  }
                }).then(function(response) {
                  scope.altitude = parseFloat(response.data.height);
                });

                $http.get(lv03tolv95Url, {
                  params: {
                    easting: coord21781[0],
                    northing: coord21781[1]
                  }
                }).then(function(response) {
                  coord2056 = response.data.coordinates;
                  scope.coord2056 = formatCoordinates(coord2056, 2);
                });

                updateW3W();

              });

              updatePopupLinks();

              if (gaBrowserSniffer.phone) {
                view.animate({
                  center: coord21781,
                  duration: 200
                }, hidePopoverOnNextChange);

              } else {
                hidePopoverOnNextChange();
              }

              overlay.setPosition(coord21781);
              showPopover();
            };


            if (!gaBrowserSniffer.mobile && gaBrowserSniffer.events.menu) {
              $(map.getViewport()).on(gaBrowserSniffer.events.menu, handler);
              element.on(gaBrowserSniffer.events.menu, 'a', function(e) {
                e.stopPropagation();
              });

            } else {
              // On touch devices and browsers others than ie10, display the
              // context popup after a long press (300ms)
              var startPixel, holdPromise;
              map.on('pointerdown', function(event) {
                $timeout.cancel(holdPromise);
                startPixel = event.pixel;
                holdPromise = $timeout(function() {
                  handler(event);
                }, 300, false);
              });
              map.on('pointerup', function(event) {
                $timeout.cancel(holdPromise);
                startPixel = undefined;
              });
              map.on('pointermove', function(event) {
                if (startPixel) {
                  var pixel = event.pixel;
                  var deltaX = Math.abs(startPixel[0] - pixel[0]);
                  var deltaY = Math.abs(startPixel[1] - pixel[1]);
                  if (deltaX + deltaY > 6) {
                    $timeout.cancel(holdPromise);
                    startPixel = undefined;
                  }
                }
              });
            }

            $rootScope.$on('$translateChangeEnd', function() {
              if (popoverShown) {
                updateW3W();
              }
            });

            // Listen to permalink change events from the scope.
            scope.$on('gaPermalinkChange', function(event) {
              if (angular.isDefined(coord21781) && popoverShown) {
                updatePopupLinks();
              }
            });

            scope.hidePopover = function(evt) {
              if (evt) {
                evt.stopPropagation();
              }
              hidePopover();
            };

            function hidePopoverOnNextChange() {
              view.once('change:center', function() {
                hidePopover();
              });
            }

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
                  angular.extend({crosshair: 'marker'}, p));

              if (!gaBrowserSniffer.mobile) {
                scope.qrcodeUrl = qrcodeUrl + '?url=' +
                    escape(contextPermalink);
              }
            }
          }
        };
      });
})();
