(function() {
  goog.provide('ga_geolocation_directive');

  goog.require('ga_permalink');

  var module = angular.module('ga_geolocation_directive', [
    'ga_permalink'
  ]);

  module.directive('gaGeolocation', function($parse, gaPermalink) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaGeolocationMap'
      },
      template: '<a href="#geolocation" class="geolocation">',
      replace: true,
      link: function(scope, element, attrs) {
        if (!ol.Geolocation.SUPPORTED) {
          element.addClass('error');
          return;
        }
        var map = scope.map;
        var view = map.getView().getView2D();
        var geolocation = new ol.Geolocation();
        geolocation.on('error', function() {
          element.removeClass('tracking');
          element.addClass('error');
        });
        geolocation.bindTo('projection', map.getView());
        // used to having a zoom animation when we click on the button,
        // but not when we are tracking the position.
        var first = true;
        var locate = function(dest) {
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
              var accuracy = geolocation.getAccuracy();
              var extent = [
                dest[0] - accuracy,
                dest[1] - accuracy,
                dest[0] + accuracy,
                dest[1] + accuracy
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
            } else {
              bounce = ol.animation.bounce({
                duration: duration,
                resolution: Math.max(view.getResolution(), dist / 1000),
                start: start
              });
              map.beforeRender(pan, bounce);
              view.setCenter(dest);
            }
          }
        };
        geolocation.on('change:position', function(evt) {
          element.removeClass('error');
          element.addClass('tracking');
          locate(geolocation.getPosition());
        });
        geolocation.on('change:tracking', function(evt) {
          var tracking = geolocation.getTracking();
          if (tracking) {
            first = true;
          } else {
            // stop tracking
            element.removeClass('tracking');
          }

        });
        element.bind('click', function(e) {
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
      }
    };
  });
})();
