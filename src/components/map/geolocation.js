(function() 
{
  'use strict';
  goog.provide('ga_map_geolocation');

  var module = angular.module('ga_map_geolocation', [
  ]);

  module.directive('gaMapGeoLocation', function($parse) {
//  module.directive('demoBad', function($parse) {
          return {
            restrict: 'AC',
            link: function linkFn(scope, lElement, attrs) {
              var map = scope.map;
              var geolocation = new ol.Geolocation({
                tracking: true
              });
              geolocation.bindTo('projection', map.getView());
              lElement.bind('click', function(e) {
                e.preventDefault();
                var view = map.getView().getView2D();
                var dest = geolocation.getPosition();

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
                var bounce = ol.animation.bounce({
                  duration: duration,
                  resolution: Math.max(view.getResolution(), dist / 1000),
                  start: start
                });
                map.addPreRenderFunctions([pan, bounce]);
                view.setCenter(dest);
              }
            )}
          };
        });
})();


