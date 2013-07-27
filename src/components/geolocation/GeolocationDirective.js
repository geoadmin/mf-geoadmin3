(function() {
  goog.provide('ga_geolocation_directive');

  goog.require('ga_permalink');

  var module = angular.module('ga_geolocation_directive', [
  ]);

  module.directive('gaGeolocation', ['$parse', 'gaPermalink',
        function($parse, gaPermalink) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaGeolocationMap'
      },
      template: '<a href="#geolocation" class="geolocation">',
      replace: true,
      link: function(scope, element, attrs) {
        var map = scope.map;
        var view = map.getView().getView2D();
        var tracking = gaPermalink.getParams().geolocation == 'true';
        if (tracking) {
            element.addClass('tracking');
        }
        var geolocation = new ol.Geolocation({
          tracking: true
        });
        geolocation.bindTo('projection', map.getView());
        var first = true;
        var locate = function(dest) {
          if (dest) {
            var source = view.getCenter();
            var dist = Math.sqrt(Math.pow(source[0] - dest[0], 2),
                         Math.pow(source[1] - dest[1], 2));
            var duration = Math.sqrt(500 + dist / view.getResolution() *
                1000);
            var start = +new Date();
            var pan = ol.animation.pan({
              duration: duration,
              source: source,
              start: start
            });
            if (first) {
              var accuracy = geolocation.getAccuracy();
              var extent = [
                dest[0] - accuracy,
                dest[0] + accuracy,
                dest[1] - accuracy,
                dest[1] + accuracy
              ];
              var size = map.getSize();
              var resolution = Math.max(
                (extent[1] - extent[0]) / size[0],
                (extent[3] - extent[2]) / size[1]);
              resolution = view.constrainResolution(resolution, 0, 0);
              var bounce = ol.animation.bounce({
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
              map.addPreRenderFunctions([pan, zoom, bounce]);
              view.setCenter(dest);
              view.setResolution(resolution);
            }
            else {
              var bounce = ol.animation.bounce({
                duration: duration,
                resolution: Math.max(view.getResolution(), dist / 1000),
                start: start
              });
              map.addPreRenderFunctions([pan, bounce]);
              view.setCenter(dest);
            }
          }
        };
        geolocation.on('change:position', function(evt) {
          if (tracking) {
            locate(geolocation.getPosition());
          }
        });
        element.bind('click', function(e) {
          e.preventDefault();
          if (tracking) {
            tracking = false;
            element.removeClass('tracking');
          }
          else {
            element.addClass('tracking');
            first = true;
            locate(geolocation.getPosition());
            tracking = true;
          }
          gaPermalink.updateParams({geolocation: tracking ? 'true' : 'false'});
        }
        )}
    };
  }]);
})();


