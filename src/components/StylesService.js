goog.provide('ga_styles_service');
(function() {

  var module = angular.module('ga_styles_service', []);

  module.provider('gaStyleFactory', function() {
    var DEFAULT_FONT = 'normal 16px Helvetica',
        ZPOLYGON = 10,
        ZLINE = 20,
        ZICON = 30,
        ZTEXT = 40,
        ZSELECT = 50,
        ZSKETCH = 60;

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

    this.$get = function(gaGlobalOptions, gaMeasure) {

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

      // Draw a dashed line or polygon, and a plain color for azimuth circle
      var measureStyleFunction = function(feature, res) {
        var color = [255, 0, 0];
        var stroke = new ol.style.Stroke({
          color: color.concat([1]),
          width: 3
        });
        var dashedStroke = new ol.style.Stroke({
          color: color.concat([1]),
          width: 3,
          lineDash: [8]
        });
        var zIndex = (feature.getGeometry() instanceof ol.geom.LineString) ?
            ZLINE : ZPOLYGON;
        var styles = [
          new ol.style.Style({
            fill: new ol.style.Fill({
              color: color.concat([0.4])
            }),
            stroke: dashedStroke,
            zIndex: zIndex
          }), new ol.style.Style({
            stroke: stroke,
            geometry: function(feature) {
              var coords = feature.getGeometry().getCoordinates();
              if (coords.length == 2 ||
                  (coords.length == 3 && coords[1][0] == coords[2][0] &&
                  coords[1][1] == coords[2][1])) {
               var circle = new ol.geom.Circle(coords[0],
                   gaMeasure.getLength(feature.getGeometry()));
               return circle;
              }
            },
            zIndex: 0 // TO FIX: We set 0 for now, because the hit detection takes
                      // account of the transparent fill of the circle
          })
        ];
        return styles;
      };

      var stylesFunction = {
        'geolocation': geolocationStyleFunction,
        'measure': measureStyleFunction
      };

      return {
        // Rules for the z-index (useful for a correct selection):
        // Sketch features (when modifying): 60
        // Features selected: 50
        // Point with Text: 40
        // Point with Icon: 30
        // Line: 20
        // Polygon: 10
        ZPOLYGON: ZPOLYGON,
        ZLINE: ZLINE,
        ZICON: ZICON,
        ZTEXT: ZTEXT,
        ZSELECT: ZSELECT,
        ZSKETCH: ZSKETCH,
        FONT: DEFAULT_FONT,

        getStyle: function(type) {
          return styles[type];
        },
        getStyleFunction: function(type) {
          return stylesFunction[type] || function(feature, resolution) {
            return styles[type];
          };
        },
        getFeatureStyleFunction: function(type) {
          return function(resolution) {
            // In a featureStyleFunction this is the current feature
            return stylesFunction[type](this, resolution) || function(feature, resolution) {
              return styles[type];
            }(this, resolution);
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
