(function() {
  var mapModule = angular.module('app.map');

  mapModule.directive('appMap',
      ['$parse', '$location', function($parse, $location) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var map = $parse(attrs.appMap)(scope);
        var view = map.getView();

        // set view states based on URL query string
        var queryParams = $location.search();
        if (queryParams.Y !== undefined && queryParams.X !== undefined) {
          view.setCenter([+queryParams.Y, +queryParams.X]);
        }
        if (queryParams.zoom !== undefined) {
          var projectionExtent = view.getProjection().getExtent();
          var size = Math.max(
              ol.extent.getHeight(projectionExtent),
              ol.extent.getWidth(projectionExtent));
          var resolution = size / (256 * Math.pow(2, queryParams.zoom));
          view.setResolution(resolution);
        }

        map.setTarget(element[0]);
      }
    };
  }]);
})();


