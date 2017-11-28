/* eslint-disable max-len */
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
    var circle = new ol.style.Circle({
      radius: 7,
      fill: fill,
      stroke: stroke
    })
    var kmlStyle = new ol.style.Style({
      fill: fill,
      stroke: stroke,
      image: circle,
      text: new ol.style.Text({
        font: DEFAULT_FONT,
        fill: fill,
        stroke: new ol.style.Stroke({
          color: [255, 255, 255, 1],
          width: 3
        })
      })
    });

    // Default style for GPX layer
    var gpxStyle = new ol.style.Style({
      fill: fill,
      stroke: stroke,
      image: circle
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
      'gpx': gpxStyle,
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
          scale: 0.25,
          src: 'data:image/jpeg;base64,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'
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
          return function(feature, resolution) {
            return stylesFunction[type](feature, resolution) ||
                (function(feature, resolution) {
                  return styles[type];
                }(feature, resolution));
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
