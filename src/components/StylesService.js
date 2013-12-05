(function() {
  goog.provide('ga_styles_service');

  var module = angular.module('ga_styles_service', []);

  module.provider('gaStyleFunctionFactory', function() {

    this.$get = function() {

      var selectStroke = new ol.style.Stroke({
        color: '#ff8000',
        width: 3
      });

      var selectFill = new ol.style.Fill({
        color: '#ffff00'
      });

      var selectCircle = ol.shape.renderCircle(10, selectFill,
                                              selectStroke);

      var selectStyle = new ol.style.Style({
        fill: selectFill,
        stroke: selectStroke
      });

      var selectPointStyle = new ol.style.Style({
        image: selectCircle
      });

      var selectStyle = {
        'Point': [selectPointStyle],
        'LineString': [selectStyle],
        'MultiLineString': [selectStyle],
        'MultiPoint': [selectPointStyle],
        'MultiPolygon': [selectStyle],
        'Polygon': [selectStyle]
      };

      var hlStroke = new ol.style.Stroke({
        color: '#f00000',
        width: 6
      });

      var hlFill = new ol.style.Fill({
        color: '#ff0000'
      });

      var hlCircle = ol.shape.renderCircle(10, hlFill,
                                              hlStroke);

      var hlStyle = new ol.style.Style({
        fill: hlFill,
        stroke: hlStroke
      });

      var hlPointStyle = new ol.style.Style({
        image: selectCircle
      });

      var hlStyle = {
        'Point': [hlPointStyle],
        'LineString': [hlStyle],
        'MultiLineString': [hlStyle],
        'MultiPoint': [hlPointStyle],
        'MultiPolygon': [hlStyle],
        'Polygon': [hlStyle]
      };

      var styles = {
        'select': selectStyle,
        'highlight': hlStyle
      };

      return function(type) {
        return function(feature, resolution) {
          return styles[type][feature.getGeometry().getType()];
        };
      };
    };
  });
})();
