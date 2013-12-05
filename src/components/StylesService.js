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
        image: hlCircle
      });

      var hlStyle = {
        'Point': [hlPointStyle],
        'LineString': [hlStyle],
        'MultiLineString': [hlStyle],
        'MultiPoint': [hlPointStyle],
        'MultiPolygon': [hlStyle],
        'Polygon': [hlStyle]
      };

      var lsStroke = new ol.style.Stroke({
        color: 'red',
        width: 3
      });

      var lsFill = new ol.style.Fill({
        color: '#D8Ddi8D8'
      });

      var lsCircle = ol.shape.renderCircle(10, lsFill,
                                              lsStroke);

      var lsStyle = new ol.style.Style({
        fill: lsFill,
        stroke: lsStroke
      });

      var lsPointStyle = new ol.style.Style({
        image: lsCircle
      });

      var lsStyle = {
        'Point': [lsPointStyle],
        'LineString': [lsStyle],
        'MultiLineString': [lsStyle],
        'MultiPoint': [lsPointStyle],
        'MultiPolygon': [lsStyle],
        'Polygon': [lsStyle]
      };

      var styles = {
        'select': selectStyle,
        'highlight': hlStyle,
        'lightselect': lsStyle
      };

      return function(type) {
        return function(feature, resolution) {
          return styles[type][feature.getGeometry().getType()];
        };
      };
    };
  });
})();
