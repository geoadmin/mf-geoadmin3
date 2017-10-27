goog.provide('ga_contextpopup_directive');

goog.require('ga_event_service');
goog.require('ga_networkstatus_service');
goog.require('ga_permalink');
goog.require('ga_reframe_service');
goog.require('ga_what3words_service');
goog.require('ga_window_service');

(function() {

  var module = angular.module('ga_contextpopup_directive', [
    'ga_event_service',
    'ga_networkstatus_service',
    'ga_permalink',
    'ga_reframe_service',
    'ga_window_service',
    'ga_what3words_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaContextPopup',
      function($http, $q, $timeout, $window, $rootScope, gaBrowserSniffer,
          gaNetworkStatus, gaPermalink, gaGlobalOptions, gaLang, gaWhat3Words,
          gaReframe, gaEvent, gaWindow) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/contextpopup/partials/contextpopup.html',
          scope: {
            map: '=gaContextPopupMap',
            options: '=gaContextPopupOptions',
            isActive: '=gaContextPopupActive'
          },
          link: function(scope, element, attrs) {
            var heightUrl = scope.options.heightUrl;
            var qrcodeUrl = scope.options.qrcodeUrl;
            var holdPromise, isPopoverShown = false;
            var reframeCanceler = $q.defer();
            var heightCanceler = $q.defer();
            var map = scope.map;
            var view = map.getView();
            var clickCoord, coord4326;
            var proj = map.getView().getProjection();
            var overlay = new ol.Overlay({
              element: element[0],
              stopEvent: true
            });
            map.addOverlay(overlay);

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
              }, function(response) {
                if (response.status !== -1) { // Error
                  scope.w3w = '-';
                }
              });
            };

            var cancelRequests = function() {
              // Cancel last requests
              heightCanceler.resolve();
              reframeCanceler.resolve();
              heightCanceler = $q.defer();
              reframeCanceler = $q.defer();
              gaWhat3Words.cancel();
            };

            var handler = function(event) {
              if (!scope.isActive) {
                return;
              }
              event.stopPropagation();
              event.preventDefault();

              // On Mac, left-click with ctrlKey also fires
              // the 'contextmenu' event. But this conflicts
              // with selectByRectangle feature (in featuretree
              // directive). So we bail out here if
              // ctrlKey is pressed
              if (event.ctrlKey) {
                return;
              }

              clickCoord = (event.originalEvent) ?
                map.getEventCoordinate(event.originalEvent) :
                event.coordinate;
              clickCoord[0] = parseFloat(clickCoord[0].toFixed(1));
              clickCoord[1] = parseFloat(clickCoord[1].toFixed(1));
              coord4326 = ol.proj.transform(clickCoord, proj, 'EPSG:4326');
              scope.coord4326 = ol.coordinate.format(coord4326, '{y}, {x}', 5);
              var coord4326String = ol.coordinate.toStringHDMS(coord4326, 3).
                  replace(/ /g, '');
              scope.coordiso4326 = coord4326String.replace(/N/g, 'N ');
              scope.coord2056 = formatCoordinates(clickCoord, 1);
              if (coord4326[0] < 6 && coord4326[0] >= 0) {
                var utm31t = ol.proj.transform(coord4326,
                    'EPSG:4326', 'EPSG:32631');
                scope.coordutm = coordinatesFormatUTM(utm31t, '(zone 31T)');
              } else if (coord4326[0] < 12 && coord4326[0] >= 6) {
                var utm32t = ol.proj.transform(coord4326,
                    'EPSG:4326', 'EPSG:32632');
                scope.coordutm = coordinatesFormatUTM(utm32t, '(zone 32T)');
              } else {
                scope.coordutm = '-';
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
              scope.$applyAsync(function() {

                $http.get(heightUrl, {
                  params: {
                    easting: clickCoord[0],
                    northing: clickCoord[1],
                    elevation_model: gaGlobalOptions.defaultElevationModel,
                    sr: proj.getCode().split(':')[1]
                  },
                  timeout: heightCanceler.promise
                }).then(function(response) {
                  scope.altitude = parseFloat(response.data.height);
                }, function(response) {
                  if (response.status !== -1) { // Error
                    scope.altitude = '-';
                  }
                });

                gaReframe.get95To03(clickCoord, reframeCanceler.promise).then(
                    function(coords) {
                      scope.coord21781 = formatCoordinates(coords, 2);
                    }, function() {
                      var coords = ol.proj.transform(clickCoord, proj,
                          'EPSG:21781');
                      scope.coord21781 = formatCoordinates(coords, 2);
                    });

                updateW3W();
              });

              updatePopupLinks();

              if (gaWindow.isWidth('xs') || gaWindow.isHeight('xs')) {
                view.animate({
                  center: clickCoord,
                  duration: 200
                }, hidePopoverOnNextChange);

              } else {
                hidePopoverOnNextChange();
              }

              overlay.setPosition(clickCoord);
              element.show();
              // We use a boolean instead of  jquery .is(':visible') selector
              // because that doesn't work with phantomJS.
              isPopoverShown = true;
            };

            if ('oncontextmenu' in $window) {
              $(map.getViewport()).on('contextmenu', function(event) {
                if (isPopoverShown) {
                  scope.hidePopover();
                }
                $timeout.cancel(holdPromise);
                handler(event);
              });
              element.on('contextmenu', 'a', function(e) {
                e.stopPropagation();
              });
            }

            // IE manage contextmenu event also with touch so no need to add
            // pointers events too.
            if (!gaBrowserSniffer.msie) {
              // On touch devices and browsers others than ie10, display the
              // context popup after a long press (300ms)
              map.on('pointerdown', function(event) {
                if (gaEvent.isMouse(event)) {
                  return;
                }
                $timeout.cancel(holdPromise);
                holdPromise = $timeout(function() {
                  handler(event);
                }, 300, false);
              });
              map.on('pointerup', function(event) {
                if (gaEvent.isMouse(event)) {
                  return;
                }
                $timeout.cancel(holdPromise);
              });
              map.on('pointermove', function(event) {
                if (gaEvent.isMouse(event)) {
                  return;
                }
                if (event.dragging) {
                  $timeout.cancel(holdPromise);
                }
              });
            }

            $rootScope.$on('$translateChangeEnd', function() {
              if (isPopoverShown) {
                updateW3W();
              }
            });

            // Listen to permalink change events from the scope.
            scope.$on('gaPermalinkChange', function(event) {
              if (angular.isDefined(clickCoord) && isPopoverShown) {
                updatePopupLinks();
              }
            });

            scope.hidePopover = function(evt) {
              if (evt) {
                evt.stopPropagation();
              }
              cancelRequests();
              element.hide();
              isPopoverShown = false;
            };

            function hidePopoverOnNextChange() {
              view.once('change:center', scope.hidePopover);
            }

            function updatePopupLinks() {
              var p = {
                E: Math.round(clickCoord[0], 1),
                N: Math.round(clickCoord[1], 1)
              };
              scope.contextPermalink = gaPermalink.getHref(p);
              scope.crosshairPermalink = gaPermalink.getHref(
                  angular.extend({crosshair: 'marker'}, p));

              scope.qrcodeUrl = null;
              if (!gaNetworkStatus.offline && gaWindow.isWidth('>=s') &&
                  gaWindow.isHeight('>s')) {
                scope.qrcodeUrl = qrcodeUrl + '?url=' +
                    escape(scope.contextPermalink);
              }
            }
          }
        };
      });
})();
