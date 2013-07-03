(function() {
  goog.provide('ga_map_directive');
  goog.require('ga_permalink');

  var module = angular.module('ga_map_directive', [
    'ga_permalink'
  ]);

  module.controller('GaMapDirectiveController', function() {
    this.setMap = function(map) {
      this.map = map;
    };

    this.getMap = function() {
      return this.map;
    };
  });

  module.directive('gaMap',
      ['$parse', '$timeout', 'gaPermalink',
        function($parse, $timeout, gaPermalink) {
          return {
            restrict: 'A',
            scope: {
              map: '=gaMapMap',
              options: '=gaMapOptions'
            },
            controller: 'GaMapDirectiveController',
            link: function(scope, element, attrs, controller) {
              var map = scope.map;
              controller.setMap(map);

              var options = scope.options;
              var resolutions = options.resolutions;

              var view = map.getView();

              // set view states based on URL query string
              var queryParams = gaPermalink.getParams();
              if (queryParams.Y !== undefined && queryParams.X !== undefined) {
                view.setCenter([+queryParams.Y, +queryParams.X]);
              }
              if (queryParams.zoom !== undefined) {
                var zoom = +queryParams.zoom;
                zoom = Math.min(Math.max(zoom, 0), resolutions.length - 1);
                var resolution = resolutions[zoom];
                view.setResolution(resolution);
              }

              // Update permalink based on view states. We use a timeout
              // not to incur an Angular dirty-check cycle on each view
              // change event.
              var timeoutPromise = null;
              var updatePermalink = function() {
                if (timeoutPromise !== null) {
                  $timeout.cancel(timeoutPromise);
                }
                timeoutPromise = $timeout(function() {
                  var center = view.getCenter();
                  var x = center[1].toFixed(2);
                  var y = center[0].toFixed(2);
                  var resolution = view.getResolution();
                  var zoom = resolutions.indexOf(resolution);
                  gaPermalink.updateParams({X: x, Y: y, zoom: zoom});
                  timeoutPromise = null;
                }, 1000);
              };
              view.on('change', updatePermalink);
              updatePermalink();

              map.setTarget(element[0]);
            }
          };
        }]);
})();


