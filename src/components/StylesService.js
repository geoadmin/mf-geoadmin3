(function() {
  goog.provide('ga_styles_service');

  var module = angular.module('ga_styles_service', []);

  module.provider('gaStyleFactory', function() {

    var selectStroke = new ol.style.Stroke({
      color: [255, 128, 0, 1],
      width: 3
    });

    var selectFill = new ol.style.Fill({
      color: [255, 255, 0, 0.75]
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
      color: [240, 0, 0, 1],
      width: 6
    });

    var hlFill = new ol.style.Fill({
      color: [255, 0, 0, 1]
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
        color: [0, 0, 255, 1],
        width: 3
      })
    });

    var geolocationStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 0, 0, 0.1]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 0, 0, 0.9],
        width: 3
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: [255, 0, 0, 0.9]
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 1],
          width: 3
        })
      })
    });

    var styles = {
      'select': selectStyle,
      'highlight': hlStyle,
      'selectrectangle': srStyle,
      'geolocation': geolocationStyle
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
