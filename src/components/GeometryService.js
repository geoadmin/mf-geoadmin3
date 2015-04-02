(function() {
  goog.provide('ga_geometry_service');

  var module = angular.module('ga_geometry_service', []);

  module.provider('gaGeom', function() {
    var getFlatCoordinates = function(coords) {
      if (coords[0] instanceof Array) {
        var flatCoords = [];
        angular.forEach(coords, function(coord) {
          flatCoords = flatCoords.concat(getFlatCoordinates(coord));
        });
        return flatCoords;
      }
      return [coords];
    };
    // Return an array of coordinates representing the geometry
    var getCoordinates = function(geom) {
      if (geom instanceof ol.geom.GeometryCollection) {
        var flatCoords = [];
        angular.forEach(geom.getGeometries(), function(aGeom) {
          flatCoords = flatCoords.concat(getCoordinates(aGeom));
        });
        return flatCoords;
      }
      return getFlatCoordinates(geom.getCoordinates());
    };
    this.$get = function() {
      var Geom = function() {
        this.centroid = function(geom) {
          var flatCoords = getCoordinates(geom);
          var xSum = 0, ySum = 0, len = flatCoords.length;
          angular.forEach(flatCoords, function(coord) {
            xSum += coord[0];
            ySum += coord[1];
          });
          return new ol.geom.Point([xSum / len, ySum / len]);
        };
      };
      return new Geom();
    };
  });
})();

