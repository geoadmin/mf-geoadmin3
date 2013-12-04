(function() {
  goog.provide('ga_styles_service');

  var module = angular.module('ga_styles_service', []);

  module.provider('gaStyles', function() {

    this.$get = function() {

      var Styles = function() {

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

        var styles = {
          'select': selectStyle
        };

        this.styleFunction = function(type) {
          return function(feature, resolution) {
            return styles[type][feature.getGeometry().getType()];
          };
        };
      };
      return new Styles();
    };
  });
})();
