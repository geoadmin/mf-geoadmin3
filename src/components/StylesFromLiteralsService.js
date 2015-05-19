(function() {
  goog.provide('ga_styles_from_literals_service');

  var module = angular.module('ga_styles_from_literals_service', []);

  module.provider('gaStylesFromLiterals', function() {

    this.$get = function() {

      function getOlStyleForPoint(options, shape) {
        if (shape === 'circle') {
          return new ol.style.Circle(options);
        } else if (shape === 'icon') {
          return new ol.style.Icon(options);
        } else {
          var shapes = {
            square: {
              points: 4,
              angle: Math.PI / 4
            },
            triangle: {
              points: 3,
              rotation: Math.PI / 4,
              angle: 0
            },
            star: {
              points: 5,
              angle: 0
            },
            cross: {
              points: 4,
              angle: 0
            }
          };
          // {} to perserve the original object
          var style = angular.extend({}, shapes[shape], options);
          return new ol.style.RegularShape(style);
        }
      }

      function getOlBasicStyles(options) {
        var olStyles = {};
        angular.forEach(options, function(value, key) {
          var type = key;
          var style = value;
          if (type === 'stroke') {
            olStyles[type] = new ol.style.Stroke(style);
          } else if (type === 'fill') {
            olStyles[type] = new ol.style.Fill(style);
          } else if (type === 'text') {
            olStyles[type] = new ol.style.Text(style);
          }
        });
        return olStyles;
      }

      function getOlStyleFromLiterals(value) {
        var olStyles = {};
        var style = value.vectorOptions;
        var geomType = value.geomType;
        if (geomType === 'point') {
            style = {
              image: style
            };
        }
        angular.forEach(style, function(value, key) {
          var olStyle = {};
          if (key === 'image') {
            var styleP = style[key];
            var options = getOlBasicStyles(styleP);
            // {} to preserve the original object
            options = angular.extend({}, styleP, options);
            olStyle = getOlStyleForPoint(options, value.type);
            olStyles[key] = olStyle;
          } else {
            olStyles = angular.extend({}, olStyle, getOlBasicStyles(style));
          }
        });
        return new ol.style.Style(olStyles);
      }

      function olStyleForPropertyValue(properties) {
        var olStyle;

        this.singleStyle = null;

        this.styles = {
          point: {},
          line: {},
          polygon: {}
        };

        this.type = properties.type;

        if (this.type === 'unique' || this.type === 'range') {
            this.key = properties.property;
        }

        if (this.type === 'single') {
          olStyle = getOlStyleFromLiterals(properties);
          this.singleStyle = olStyle;
        } else if (this.type === 'unique') {
          var values = properties.values;
          for (var i = 0; i < values.length; i++) {
            var value = values[i];
            olStyle = getOlStyleFromLiterals(value);
            this.styles[value.geomType][value.value] = olStyle;
          }
        } else if (this.type === 'range') {
          var ranges = properties.ranges;
          for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            olStyle = getOlStyleFromLiterals(range);
            var key = range.range.toLocaleString();
            this.styles[range.geomType][key] = olStyle;
          }
        }

        this.findOlStyleInRange = function(value, geomType) {
          var olStyle, range;
          for (range in this.styles[geomType]) {
            range = range.split(',');
            if (value >= parseFloat(range[0]) &&
                value <= parseFloat(range[1])) {
              var style = this.styles[geomType][range];
              olStyle = style;
              break;
            }
          }
          return olStyle;
        };

        this.getFeatureStyle = function(feature) {
          var getGeomTypeFromGeometry = function(olGeometry) {
            if (olGeometry instanceof ol.geom.Point ||
                olGeometry instanceof ol.geom.MultiPoint) {
              return 'point';
            } else if (olGeometry instanceof ol.geom.LineString ||
                olGeometry instanceof ol.geom.MultiLineString) {
              return 'line';
            } else if (olGeometry instanceof ol.geom.Polygon ||
                olGeometry instanceof ol.geom.MultiPolygon) {
              return 'polygon';
            }
          };

          if (this.type === 'single') {
            return this.singleStyle;
          } else if (this.type === 'unique') {
            var properties = feature.getProperties();
            var value = properties[this.key];
            var geomType = getGeomTypeFromGeometry(
              feature.getGeometry()
            );
            return this.styles[geomType][value];
          } else if (this.type === 'range') {
            var properties = feature.getProperties();
            var value = properties[this.key];
            var geomType = getGeomTypeFromGeometry(
              feature.getGeometry()
            );
            return this.findOlStyleInRange(value, geomType);
          }
        };
      }

      return function(properties) {
        return new olStyleForPropertyValue(properties);
      };
    };
  });
})();
