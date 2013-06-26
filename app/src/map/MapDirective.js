(function() {
  goog.provide('ga_map_directive');

  var module = angular.module('ga_map_directive', []);

  module.directive('gaMap',
      ['$parse', '$location', function($parse, $location) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var map = $parse(attrs.gaMap)(scope);
            var resolutions = $parse(attrs.gaMapResolutions)(scope);
            var view = map.getView();

            // set view states based on URL query string
            var queryParams = $location.search();
            if (queryParams.Y !== undefined && queryParams.X !== undefined) {
              view.setCenter([+queryParams.Y, +queryParams.X]);
            }
            if (queryParams.zoom !== undefined) {
              var zoom = +queryParams.zoom;
              zoom = Math.min(Math.max(zoom, 0), resolutions.length - 1);
              var resolution = resolutions[zoom];
              view.setResolution(resolution);
            }

            map.setTarget(element[0]);
          }
        };
      }]);
})();


