(function() {
  goog.provide('ga_map_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_debounce_service');
  goog.require('ga_permalink');

  var module = angular.module('ga_map_directive', [
    'ga_browsersniffer_service',
    'ga_debounce_service',
    'ga_permalink'
  ]);

  module.directive('gaMap',
      function($window, $parse, $timeout, gaPermalink, gaBrowserSniffer,
          gaLayers, gaDebounce) {
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
              var eastings = parseFloat(queryParams.Y.replace(/,/g, '.'));
              var northings = parseFloat(queryParams.X.replace(/,/g, '.'));
              view.setCenter([+eastings, +northings]);
            }
            if (queryParams.zoom !== undefined) {
              view.setZoom(+queryParams.zoom);
            }

            if (queryParams.crosshair !== undefined) {
              var crosshair = $('<div></div>')
                .addClass('ga-crosshair')
                .addClass(queryParams.crosshair);
              map.addOverlay(new ol.Overlay({
                element: crosshair.get(0),
                position: view.getCenter()
              }));
              gaPermalink.deleteParam('crosshair');
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

            if (!gaBrowserSniffer.touchDevice) {
              map.addControl(new ol.control.ZoomSlider());
            }
            map.addControl(new ol.control.ZoomToExtent({tipLabel: ''}));

            map.setTarget(element[0]);

            // IE + Firefox
            // We can't call a map.updateSize() for these browsers(because it's
            // applied after the printing) so we resize
            // the map keeping the ratio currently display.
            if ('onbeforeprint' in window) {
              window.onbeforeprint = function() {
                var size = map.getSize();
                element.css({
                  width: '650px',
                  height: (650 * size[1] / size[0]) + 'px'
                });
              };
              window.onafterprint = function() {
                element.css({width: '100%', height: '100%'});
              };
            }

            // Chrome + Safari
            // These events are called twice on Chrome
            if (window.matchMedia) {
              window.matchMedia('print').addListener(function(mql) {
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
        };
      }
  );
})();

