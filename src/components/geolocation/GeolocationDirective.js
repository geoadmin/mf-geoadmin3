(function() {
  goog.provide('ga_geolocation_directive');

  goog.require('ga_permalink');

  var module = angular.module('ga_geolocation_directive', [
    'ga_permalink'
  ]);

  module.directive('gaGeolocation', function($parse, $window, gaPermalink) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaGeolocationMap'
      },
      templateUrl: 'components/geolocation/partials/geolocation.html',
      link: function(scope, element, attrs) {
        var btnElt = $(element.children()[0]);
        var markerElt = $('<div class="geolocation-marker">' +
                            '<div class="user-position"></div>' +
                        '</div>');
        if (!('geolocation' in $window.navigator)) {
          btnElt.addClass('error');
          return;
        }
        // This boolean defines if the user has moved the map itself after the
        // first change of position.
        var userTakesControl = false;
        // Defines if the geolocation control is zooming
        var geolocationZooming = false;
        var overlay = null;
        var currentResolution = null;
        var currentAccuracy = null;
        var map = scope.map;
        var view = map.getView().getView2D();
        var geolocation = new ol.Geolocation({
          trackingOptions: {
            maximumAge: 10000,
            enableHighAccuracy: true,
            timeout: 600000
          }
        });
        geolocation.on('error', function() {
          btnElt.removeClass('tracking');
          btnElt.addClass('error');
        });
        geolocation.bindTo('projection', map.getView());
        // used to having a zoom animation when we click on the button,
        // but not when we are tracking the position.
        var first = true;
        var locate = function() {
          geolocationZooming = true;
          var dest = geolocation.getPosition();
          if (dest) {
            var source = view.getCenter();
            var dist = Math.sqrt(Math.pow(source[0] - dest[0], 2),
                Math.pow(source[1] - dest[1], 2));
            var duration = Math.min(
                Math.sqrt(300 + dist / view.getResolution() * 1000), 3000
            );
            var start = +new Date();
            var pan = ol.animation.pan({
              duration: duration,
              source: source,
              start: start
            });
            var bounce;
            if (first) {
              first = false;
              var extent = [
                dest[0] - currentAccuracy,
                dest[1] - currentAccuracy,
                dest[0] + currentAccuracy,
                dest[1] + currentAccuracy
              ];
              var size = map.getSize();
              var resolution = Math.max(
                (extent[2] - extent[0]) / size[0],
                (extent[3] - extent[1]) / size[1]);
              resolution = view.constrainResolution(resolution, 0, 0);
              bounce = ol.animation.bounce({
                duration: duration,
                resolution: Math.max(view.getResolution(), dist / 1000,
                    // needed to don't have up an down and up again in zoom
                    resolution * 1.2),
                start: start
              });
              var zoom = ol.animation.zoom({
                resolution: view.getResolution(),
                duration: duration,
                start: start
              });
              map.beforeRender(pan, zoom, bounce);
              view.setCenter(dest);
              view.setResolution(resolution);
            } else if (!userTakesControl) {
              bounce = ol.animation.bounce({
                duration: duration,
                resolution: Math.max(view.getResolution(), dist / 1000),
                start: start
              });
              map.beforeRender(pan, bounce);
              view.setCenter(dest);
            }
          }
          geolocationZooming = false;
        };
        var markPosition = function() {
          var divSize = currentAccuracy / currentResolution;
          markerElt.css({
            width: divSize,
            height: divSize,
            'border-radius': divSize / 2
          });
        };
        map.on('postrender', function(evt) {
          var res = view.getResolution();
          if (res != currentResolution) {
            currentResolution = res;
            markPosition();
          }
        });

        geolocation.on('change:position', function(evt) {
          btnElt.removeClass('error');
          btnElt.addClass('tracking');
          locate();
          markPosition();
        });

        geolocation.on('change:tracking', function(evt) {
          var tracking = geolocation.getTracking();
          if (tracking) {
            first = true;
            userTakesControl = false;
            if (!overlay) {
              overlay = new ol.Overlay({
                element: markerElt,
                positioning: 'CENTER_CENTER',
                stopEvent: false
              });
              overlay.bindTo('position', geolocation);
            }
            map.addOverlay(overlay);
          } else {
            // stop tracking
            btnElt.removeClass('tracking');
            if (overlay) {
              map.removeOverlay(overlay);
            }
          }
        });
        geolocation.on('change:accuracy', function(evt) {
          var accuracy = geolocation.getAccuracy();
          if (accuracy != currentAccuracy) {
            currentAccuracy = accuracy;
            markPosition();
          }
        });
        btnElt.bind('click', function(e) {
          e.preventDefault();
          var tracking = !geolocation.getTracking();
          geolocation.setTracking(tracking);

          scope.$apply(function() {
            gaPermalink.updateParams({
              geolocation: tracking ? 'true' : 'false'
            });
          });
        });

        geolocation.setTracking(gaPermalink.getParams().geolocation == 'true');

        var updateUserTakesControl = function() {
          if (!geolocationZooming) {
            userTakesControl = true;
          }
        };
        view.on('change:center', updateUserTakesControl);
        view.on('change:resolution', updateUserTakesControl);
      }
    };
  });
})();
