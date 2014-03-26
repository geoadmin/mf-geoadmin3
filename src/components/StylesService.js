(function() {
  goog.provide('ga_styles_service');

  var module = angular.module('ga_styles_service', []);

  module.provider('gaStyleFactory', function() {
    var selectStroke = new ol.style.Stroke({
      color: '#ff8000',
      width: 3
    });

    var selectFill = new ol.style.Fill({
      color: '#ffff00'
    });

    var selectStyle = new ol.style.Style({
      fill: selectFill,
      stroke: selectStroke,
      image: new ol.style.Circle({
        radius: 10,
        fill: selectFill,
        stroke: selectStroke
      })
    });

    var hlStroke = new ol.style.Stroke({
      color: '#f00000',
      width: 6
    });

    var hlFill = new ol.style.Fill({
      color: '#ff0000'
    });

    var hlStyle = new ol.style.Style({
      fill: hlFill,
      stroke: hlStroke,
      image: new ol.style.Circle({
        radius: 10,
        fill: hlFill,
        stroke: hlStroke
      })
    });

    var srStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 3
      })
    });

    var styles = {
      'select': selectStyle,
      'highlight': hlStyle,
      'selectrectangle': srStyle
    };

    this.$get = function() {
      return {
        getStyle: function(type) {
          return styles[type];
        },
        getStyleFunction: function(type) {
          return function(feature, resolution) {
            return styles[feature.get('styleId')];
          };
        }
      };
    };
  });
})();
