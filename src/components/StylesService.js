goog.provide('ga_styles_service');

goog.require('ga_measure_service');
(function() {

  var module = angular.module('ga_styles_service', [
    'ga_measure_service'
  ]);

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

    var redCircle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
          color: [255, 0, 0, 0.4]
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 1],
          width: 3
        })
      }),
      zIndex: 10000
    });

    var labelStyle = {
      show: true,
      color: 'rgb(255, 255, 255)',
      outlineColor: 'rgb(0, 0, 0)',
      outlineWidth: 3,
      labelStyle: 2,
      font: "'24px arial'",
      scaleByDistanceNearRange: 1000.0,
      scaleByDistanceNearValue: 2.0,
      scaleByDistanceFarRange: 10000.0,
      scaleByDistanceFarValue: 0.4
    };

    var labelStyleEnhanced = {
      show: true,
      labelStyle: 2,
      labelText: '${DISPLAY_TEXT}',
      disableDepthTestDistance: 5000,
      anchorLineEnabled: true,
      anchorLineColor: "color('white')",
      heightOffset: {
        conditions: [
          ['${LOD} === "7"', 20],
          ['${LOD} === "6"', 40],
          ['${LOD} === "5"', 60],
          ['${LOD} === "4"', 80],
          ['${LOD} === "3"', 100],
          ['${LOD} === "2"', 120],
          ['${LOD} === "1"', 150],
          ['${LOD} === "0"', 200],
          ['true', '200']
        ]
      },
      labelColor: {
        conditions: [
          ['${OBJEKTART} === "See"', 'color("blue")'],
          ['true', 'color("black")']
        ]
      },
      labelOutlineColor: 'color("white", 1)',
      labelOutlineWidth: 5,
      font: {
        conditions: [
          ['${OBJEKTART} === "See"', '"bold 32px arial"'],
          ['${OBJEKTART} === "Alpiner Gipfel"', '"italic 32px arial"'],
          ['true', '" 32px arial"']
        ]
      },
      scaleByDistance: {
        conditions: [
          ['${LOD} === "7"', 'vec4(1000, 1, 5000, 0.4)'],
          ['${LOD} === "6"', 'vec4(1000, 1, 5000, 0.4)'],
          ['${LOD} === "5"', 'vec4(1000, 1, 8000, 0.4)'],
          ['${LOD} === "4"', 'vec4(1000, 1, 10000, 0.4)'],
          ['${LOD} === "3"', 'vec4(1000, 1, 20000, 0.4)'],
          ['${LOD} === "2"', 'vec4(1000, 1, 30000, 0.4)'],
          ['${LOD} === "1"', 'vec4(1000, 1, 50000, 0.4)'],
          ['${LOD} === "0"', 'vec4(1000, 1, 500000, 0.4)'],
          ['true', 'vec4(1000, 1, 10000, 0.4)']
        ]
      },
      translucencyByDistance: {
        conditions: [
          ['${LOD} === "7"', 'vec4(5000, 1, 5001, 1)'],
          ['${LOD} === "6"', 'vec4(5000, 1, 5001, 1)'],
          ['${LOD} === "5"', 'vec4(5000, 1, 8000, 0.4)'],
          ['${LOD} === "4"', 'vec4(5000, 1, 10000, 0.4)'],
          ['${LOD} === "3"', 'vec4(5000, 1, 20000, 0.4)'],
          ['${LOD} === "2"', 'vec4(5000, 1, 30000, 0.4)'],
          ['${LOD} === "1"', 'vec4(5000, 1, 50000, 0.4)'],
          ['${LOD} === "0"', 'vec4(5000, 1, 500000, 1)'],
          ['true', 'vec4(5000, 1, 10000, 0.5)']
        ]
      },
      distanceDisplayCondition: {
        'conditions': [
          ['${LOD} === "7"', 'vec2(0, 5000)'],
          ['${LOD} === "6"', 'vec2(0, 5000)'],
          ['${LOD} === "5"', 'vec2(0, 8000)'],
          ['${LOD} === "4"', 'vec2(0, 10000)'],
          ['${LOD} === "3"', 'vec2(0, 20000)'],
          ['${LOD} === "2"', 'vec2(0, 30000)'],
          ['${LOD} === "1"', 'vec2(0, 50000)'],
          ['${LOD} === "0"', 'vec2(0, 500000)'],
          ['${OBJEKTART} === "Alpiner Gipfel"', 'vec2(0, 100000)']
        ]
      }
    };

    var styles = {
      'select': selectStyle,
      'highlight': hlStyle,
      'selectrectangle': srStyle,
      'geolocation': geolocationStyle,
      'offline': offlineStyle,
      'kml': kmlStyle,
      'transparentCircle': transparentCircle,
      'redCircle': redCircle,
      'label': labelStyle,
      'labelEnhanced': labelStyleEnhanced
    };

    this.$get = function(gaGlobalOptions, gaMeasure) {

      var imgPath = gaGlobalOptions.resourceUrl + 'img/';
      styles['marker'] = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: imgPath + 'marker.png'
        })
      });
      styles['bowl'] = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: imgPath + 'bowl.png'
        })
      });
      styles['circle'] = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: imgPath + 'circle.png'
        })
      });
      styles['cross'] = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: imgPath + 'cross.png'
        })
      });
      styles['point'] = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: imgPath + 'point.png'
        })
      });
      var headingStyle = new ol.style.Style({
        image: new ol.style.Icon({
          rotateWithView: true,
          src: imgPath + 'geolocation_heading_marker.png'
        })
      });

      var geolocationStyleFunction = function(feature, res) {
        var rotation = feature.get('rotation');
        if (rotation) {
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
              if (gaMeasure.canShowAzimuthCircle(feature.getGeometry())) {
                var coords = feature.getGeometry().getCoordinates();
                var circle = new ol.geom.Circle(coords[0],
                    gaMeasure.getLength(feature.getGeometry()));
                return circle;
              }
            },
            zIndex: 0 // TO FIX: We set 0 for now, because the hit detection
            // takes account of the transparent fill of the circle
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
            return stylesFunction[type](this, resolution) ||
                (function(feature, resolution) {
                  return styles[type];
                }(this, resolution));
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
