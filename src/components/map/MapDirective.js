goog.provide('ga_map_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_debounce_service');
goog.require('ga_offline_service');
goog.require('ga_permalink');
(function() {

  var module = angular.module('ga_map_directive', [
    'ga_browsersniffer_service',
    'ga_debounce_service',
    'ga_offline_service',
    'ga_permalink'
  ]);

  module.directive('gaMap',
      function($window, $parse, $rootScope, $timeout, gaPermalink,
          gaBrowserSniffer, gaLayers, gaDebounce, gaOffline, gaGlobalOptions) {
        return {
          restrict: 'A',
          scope: {
            map: '=gaMapMap'
          },
          link: function(scope, element, attrs) {
            var map = scope.map;
            var view = map.getView();

            // set view states based on URL query string
            var queryParams = gaPermalink.getParams();
            if (queryParams.Y !== undefined && queryParams.X !== undefined) {
              var easting = parseFloat(queryParams.Y.replace(/,/g, '.'));
              var northing = parseFloat(queryParams.X.replace(/,/g, '.'));
              if (isFinite(easting) && isFinite(northing)) {
                var position = [easting, northing];
                if (ol.extent.containsCoordinate(
                    [2420000, 1030000, 2900000, 1350000],
                    position)) {
                  position = ol.proj.transform([easting, northing],
                    'EPSG:2056', 'EPSG:21781');
                }
                view.setCenter(position);
              }
            }
            if (queryParams.zoom !== undefined &&
                isFinite(queryParams.zoom)) {
              view.setZoom(+queryParams.zoom);
            }

            if (queryParams.crosshair !== undefined) {
              var crosshair = $('<div></div>')
                .addClass('ga-crosshair')
                .addClass(queryParams.crosshair),
                unregister;
              map.addOverlay(new ol.Overlay({
                element: crosshair.get(0),
                position: view.getCenter()
              }));
              unregister = view.on('propertychange', function() {
                gaPermalink.deleteParam('crosshair');
                ol.Observable.unByKey(unregister);
              });
            }

            // Update permalink based on view states.
            var updatePermalink = function() {
              var center = view.getCenter();
              var zoom = view.getZoom();
              // when the directive is instantiated the view may not
              // be defined yet.
              if (center && zoom !== undefined) {
                var x = center[1].toFixed(2);
                var y = center[0].toFixed(2);
                gaPermalink.updateParams({X: x, Y: y, zoom: zoom});
              }
            };
            view.on('propertychange', gaDebounce.debounce(updatePermalink,
                1000, false));
            updatePermalink();

            map.setTarget(element[0]);

            // Often when we use embed map the size of the map is fixed, so we
            // don't need to resize the map for printing (use case: print an
            // embed map in a tooltip.
            if (!gaBrowserSniffer.embed) {
              // IE + Firefox
              // We can't call a map.updateSize() for these browsers(because
              // it's applied after the printing) so we resize
              // the map keeping the ratio currently display.
              if ('onbeforeprint' in $window) {
                $window.onbeforeprint = function() {
                  var size = map.getSize();
                  element.css({
                    width: '650px',
                    height: (650 * size[1] / size[0]) + 'px'
                  });
                  map.updateSize();
                };
                $window.onafterprint = function() {
                  element.css({width: '100%', height: '100%'});
                };
              }

              // Chrome + Safari
              // These events are called twice on Chrome
              if ($window.matchMedia) {
                $window.matchMedia('print').addListener(function(mql) {
                  if (mql.matches) { // onbeforeprint
                    map.updateSize();
                  } else { // onafterprint
                    // We use a timeout to be sure the map is resize after
                    // printing
                    $timeout(function() {map.updateSize();}, 500);
                  }
                });
              }
            }

            $rootScope.$on('gaNetworkStatusChange', function(evt, offline) {
              gaOffline.refreshLayers(map.getLayers().getArray(), offline);
              if (offline) {
                gaOffline.showExtent(map);
              } else {
                gaOffline.hideExtent();
              }
            });

            var savedTimeStr = {};
            scope.$on('gaTimeChange', function(evt, time, oldTime) {
              var switchTimeActive = (!oldTime && time);
              var switchTimeDeactive = (oldTime && !time);
              var olLayers = scope.map.getLayers().getArray();
              var singleModif = false;

              // Detection the time change has been triggered by a layer's
              // 'propertychange' event.
              // (ex: using layermanager)
              if (switchTimeDeactive) {
                for (var i = 0, ii = olLayers.length; i < ii; i++) {
                  var olLayer = olLayers[i];
                  // We update only time enabled bod layers
                  if (olLayer.bodId && olLayer.timeEnabled &&
                      angular.isDefined(olLayer.time) &&
                      olLayer.time.substr(0, 4) != oldTime) {
                    singleModif = true;
                    break;
                  }
                }
              }

              // In case the time change event has been triggered by a layer's
              // 'propertychange' event, we do nothing more.
              // (ex: using the layer manager)
              if (singleModif) {
                savedTimeStr = {};
                return;
              }

              // In case the user has done a global modification.
              // (ex: using the time selector toggle)
              for (var i = 0, ii = olLayers.length; i < ii; i++) {
                var olLayer = olLayers[i];
                // We update only time enabled bod layers
                if (olLayer.bodId && olLayer.timeEnabled && olLayer.visible) {
                  var layerTimeStr =
                      gaLayers.getLayerTimestampFromYear(olLayer.bodId, time);
                  if (switchTimeActive) {
                    // We save the current value after a global deactivation.
                    // (ex: using the time selector toggle)
                    savedTimeStr[olLayer.id] = olLayer.time;
                  } else if (switchTimeDeactive && savedTimeStr[olLayer.id]) {
                    // We apply the saved values after a global deactivation.
                    // (ex: using the time selector toggle)
                    layerTimeStr = savedTimeStr[olLayer.id];
                    savedTimeStr[olLayer.id] = undefined;
                  }
                  olLayer.time = layerTimeStr;
                }
              }
            });
          }
        };
      }
  );
})();

