goog.provide('ga_stylesfromliterals_service');

(function() {

  var module = angular.module('ga_stylesfromliterals_service', []);

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
            var minResolution = value.minResolution !== undefined ?
                value.minResolution : 0;
            var maxResolution = value.maxResolution !== undefined ?
                value.maxResolution : Infinity;
            olStyle = {
              olStyle: getOlStyleFromLiterals(value),
              minResolution: minResolution,
              maxResolution: maxResolution
            };
            if (!this.styles[value.geomType][value.value]) {
              this.styles[value.geomType][value.value] = [olStyle];
            } else {
              this.styles[value.geomType][value.value].push(olStyle);
            }
          }
        } else if (this.type === 'range') {
          var ranges = properties.ranges;
          for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            var minResolution = range.minResolution !== undefined ?
                range.minResolution : 0;
            var maxResolution = range.maxResolution !== undefined ?
                range.maxResolution : Infinity;
            olStyle = {
              olStyle: getOlStyleFromLiterals(range),
              minResolution: minResolution,
              maxResolution: maxResolution
            };
            var key = range.range.toLocaleString();
            if (!this.styles[range.geomType][key]) {
              this.styles[range.geomType][key] = [olStyle];
            } else {
              this.styles[range.geomType][key].push(olStyle);
            }
          }
        }

        this.findOlStyleInRange = function(value, geomType) {
          var olStyle, range;
          for (range in this.styles[geomType]) {
            range = range.split(',');
            if (value >= parseFloat(range[0]) &&
                value < parseFloat(range[1])) {
              var style = this.styles[geomType][range];
              olStyle = style;
              break;
            }
          }
          return olStyle;
        };

        this.getOlStyleForResolution = function(olStyles, resolution) {
          var i, ii, olStyle;
          for (i = 0, ii = olStyles.length; i < ii; i++) {
            olStyle = olStyles[i];
            if (olStyle.minResolution <= resolution &&
                olStyle.maxResolution > resolution) {
              break;
            }
          }
          return olStyle;
        };

        this.getFeatureStyle = function(feature, resolution) {
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
            var geomType = getGeomTypeFromGeometry(feature.getGeometry());
            var olStyles = this.styles[geomType][value];
            var res = this.getOlStyleForResolution(olStyles, resolution);
            return res.olStyle;
          } else if (this.type === 'range') {
            var properties = feature.getProperties();
            var value = properties[this.key];
            var geomType = getGeomTypeFromGeometry(feature.getGeometry());
            var olStyles = this.findOlStyleInRange(value, geomType);
            var res = this.getOlStyleForResolution(olStyles, resolution);
            return res.olStyle;
          }
        };
      }

      return function(properties) {
        return new olStyleForPropertyValue(properties);
      };
    };
  });
})();
