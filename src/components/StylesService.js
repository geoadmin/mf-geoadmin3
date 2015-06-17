goog.provide('ga_styles_service');
(function() {

  var module = angular.module('ga_styles_service', []);

  module.provider('gaStyleFactory', function() {
    var DEFAULT_FONT = 'normal 16px Helvetica';

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
      color: [255, 128, 0, 1],
      width: 6
    });

    var hlFill = new ol.style.Fill({
      color: [255, 128, 0, 1]
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
          color: [255, 255, 255, 1],
          width: 3
        })
      })
    });

    var offlineStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 0, 0, 0.9],
        width: 3
      })
    });

    // Default style for KML layer
    var fill = new ol.style.Fill({
      color: [255, 0, 0, 0.7]
    });
    var stroke = new ol.style.Stroke({
      color: [255, 0, 0, 1],
      width: 1.5
    });
    var kmlStyle = new ol.style.Style({
      fill: fill,
      stroke: stroke,
      image: new ol.style.Circle({
        radius: 7,
        fill: fill,
        stroke: stroke
      }),
      text: new ol.style.Text({
        font: DEFAULT_FONT,
        fill: fill,
        stroke: new ol.style.Stroke({
          color: [255, 255, 255, 1],
          width: 3
        })
      })
    });

    var transparent = [0, 0, 0, 0];
    var transparentCircle = new ol.style.Circle({
      radius: 1,
      fill: new ol.style.Fill({color: transparent}),
      stroke: new ol.style.Stroke({color: transparent})
    });

    var styles = {
      'select': selectStyle,
      'highlight': hlStyle,
      'selectrectangle': srStyle,
      'geolocation': geolocationStyle,
      'offline': offlineStyle,
      'kml': kmlStyle,
      'transparentCircle': transparentCircle
    };

    this.$get = function(gaGlobalOptions) {

      var imgPath = gaGlobalOptions.resourceUrl + 'img/';
      var headingStyle = new ol.style.Style({
        image: new ol.style.Icon({
          rotateWithView: true,
          src: imgPath + 'geolocation_heading_marker.png'
        })
      });

      var geolocationStyleFunction = function(feature, res) {
        var rotation = feature.get('rotation');
        if (angular.isDefined(rotation)) {
          headingStyle.getImage().setRotation(rotation);
          return [headingStyle];
        }
        return [geolocationStyle];
      };

      var stylesFunction = {
        'geolocation': geolocationStyleFunction
      };

      return {
        // Rules for the z-index (useful for a correct selection):
        // Sketch features (when modifying): 60
        // Features selected: 50
        // Point with Text: 40
        // Point with Icon: 30
        // Line: 20
        // Polygon: 10
        ZPOLYGON: 10,
        ZLINE: 20,
        ZICON: 30,
        ZTEXT: 40,
        ZSELECT: 50,
        ZSKETCH: 60,
        FONT: DEFAULT_FONT,

        getStyle: function(type) {
          return styles[type];
        },
        getStyleFunction: function(type) {
          return stylesFunction[type] || function(feature, resolution) {
            return styles[type];
          };
        },
        // Defines a text stroke (white or black) depending on a text color
        getTextStroke: function(olColor) {
          var stroke = new ol.style.Stroke({
            color: (olColor[1] >= 160) ? [0, 0, 0, 1] : [255, 255, 255, 1],
            width: 3
          });
          return stroke;
        }

      };
    };
  });
})();
