goog.provide('ga_print_style_service');
(function() {

  var module = angular.module('ga_print_style_service', []);

  module.provider('gaPrintStyleService', function() {

    // Create a ol.geom.Polygon from an ol.geom.Circle, comes from OL2
    // https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/Polygon.js#L240
    function olCircleToPolygon(circle, sides, rotation) {
      var origin = circle.getCenter();
      var radius = circle.getRadius();
      sides = sides || 40;
      var angle = Math.PI * ((1 / sides) - (1 / 2));
      if (rotation) {
        angle += (rotation / 180) * Math.PI;
      }
      var points = [];
      for (var i = 0; i < sides; ++i) {
        var rotatedAngle = angle + (i * 2 * Math.PI / sides);
        var x = origin[0] + (radius * Math.cos(rotatedAngle));
        var y = origin[1] + (radius * Math.sin(rotatedAngle));
        points.push([x, y]);
      }
      points.push(points[0]);// Close the polygon
      return new ol.geom.Polygon([points]);
    }

    // Only simple shapes are supported for now (no use of radius2)
    function olPointToPolygon(olStyle, feature, resolution) {
      var geometry = feature.getGeometry();
      var image = olStyle.getImage();
      var imageRotation = image.getRotation();
      var origin = geometry.getCoordinates();
      var pixelRadius = image.getRadius();
      var radius = resolution * pixelRadius * 0.8;

      // First point always at top
      var xO, yO;
      xO = 0;
      yO = radius;

      // Rotate around origin counter-clock wise
      var x, y;
      var coordinates = [];
      var nbPoints = image.getPoints();
      var angle = imageRotation;
      var angleInterval = 2 * Math.PI / nbPoints;
      for (var i = 1; i <= nbPoints; i++) {
        x = origin[0] + (xO * Math.cos(angle) - yO * Math.sin(angle));
        y = origin[1] + (xO * Math.sin(angle) + yO * Math.cos(angle));
        coordinates.push([x, y]);

        // Next point
        angle += angleInterval;
      }
      // Close the polygon
      coordinates.push(coordinates[0]);
      var polygon = new ol.geom.Polygon([coordinates]);

      return new ol.Feature(polygon);
    }

    this.$get = function() {
      return {
        olPointToPolygon: olPointToPolygon,
        olCircleToPolygon: olCircleToPolygon
      };
    };
  });
})();
