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
            style.stroke = new ol.style.Stroke(style.stroke);
            style.fill = new ol.style.Fill(style.fill);
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
          var olText;
          if (style.label) {
            olText = getOlBasicStyles(style.label).text;
          }
          var basicStyles = getOlBasicStyles(style);
          var olImage = angular.extend({}, style, basicStyles);
          delete olImage.label;
          olImage = getOlStyleForPoint(basicStyles, style.type);
          olStyles.image = olImage;
          olStyles.text = olText;
        } else {
          angular.forEach(style, function(value, key) {
            if (key === 'label') {
              olStyles['text'] = getOlBasicStyles(style[key])['text'];
            } else if (['stroke', 'fill', 'image'].indexOf(key) !== -1) {
              olStyles[key] = getOlBasicStyles(style)[key];
            }
          });
        }
        return new ol.style.Style(olStyles);
      }

      function getGeomTypeFromGeometry(olGeometry) {
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
      }

      function getLabelProperty(value) {
        if (value) {
          return value.property !== undefined ? value.property : null;
        }
        return null;
      }

      function getMinResolution(value) {
        return value.minResolution !== undefined ? value.minResolution : 0;
      }

      function getMaxResolution(value) {
        return value.maxResolution !== undefined ? value.maxResolution :
            Infinity;
      }


      var olStyleForPropertyValue = function(properties) {
        this.singleStyle = null;

        this.styles = {
          point: {},
          line: {},
          polygon: {}
        };

        this.type = properties.type;

        this.initialize_(properties);
      };

      olStyleForPropertyValue.prototype.initialize_ = function(properties) {
        var styleSpec;
        if (this.type === 'unique' || this.type === 'range') {
          this.key = properties.property;
        }

        if (this.type === 'single') {
          this.singleStyle = {
            olStyle: getOlStyleFromLiterals(properties),
            labelProperty: getLabelProperty(properties.vectorOptions.label)
          };
        } else if (this.type === 'unique') {
          var values = properties.values;
          for (var i = 0; i < values.length; i++) {
            var value = values[i];
            styleSpec = {
              olStyle: getOlStyleFromLiterals(value),
              minResolution: getMinResolution(value),
              maxResolution: getMaxResolution(value),
              labelProperty: getLabelProperty(value.vectorOptions.label)
            };
            this.pushOrInitialize_(value.geomType, value.value, styleSpec);
          }
        } else if (this.type === 'range') {
          var ranges = properties.ranges;
          for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            styleSpec = {
              olStyle: getOlStyleFromLiterals(range),
              minResolution: getMinResolution(range),
              maxResolution: getMaxResolution(range),
              labelProperty: getLabelProperty(range.vectorOptions.label)
            };
            var key = range.range.toLocaleString();
            this.pushOrInitialize_(range.geomType, key, styleSpec);
          }
        }
      };

      olStyleForPropertyValue.prototype.pushOrInitialize_ = function(
          geomType, key, styleSpec) {
        if (!this.styles[geomType][key]) {
          this.styles[geomType][key] = [styleSpec];
        } else {
          this.styles[geomType][key].push(styleSpec);
        }
      };

      olStyleForPropertyValue.prototype.findOlStyleInRange_ = function(value,
          geomType) {
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

      olStyleForPropertyValue.prototype.getOlStyleForResolution_ = function(
          olStyles, resolution) {
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

      olStyleForPropertyValue.prototype.getFeatureStyle = function(feature,
          resolution) {
        if (this.type === 'single') {
          var labelProperty = this.singleStyle.labelProperty;
          if (labelProperty) {
            var properties = feature.getProperties();
            var text = properties[labelProperty];
            var olText = this.singleStyle.olStyle.getText();
            this.singleStyle.olStyle.getText().setText(text);
          }
          return this.singleStyle.olStyle;
        } else if (this.type === 'unique') {
          var properties = feature.getProperties();
          var value = properties[this.key];
          var geomType = getGeomTypeFromGeometry(feature.getGeometry());
          var olStyles = this.styles[geomType][value];
          var res = this.getOlStyleForResolution_(olStyles, resolution);
          var labelProperty = res.labelProperty;
          if (labelProperty) {
            var text = properties[labelProperty];
            res.olStyle.getText().setText(text);
          }
          return res.olStyle;
        } else if (this.type === 'range') {
          var properties = feature.getProperties();
          var value = properties[this.key];
          var geomType = getGeomTypeFromGeometry(feature.getGeometry());
          var olStyles = this.findOlStyleInRange_(value, geomType);
          var res = this.getOlStyleForResolution_(olStyles, resolution);
          var labelProperty = res.labelProperty;
          if (labelProperty) {
            var text = properties[labelProperty];
            res.olStyle.getText().setText(text);
          }
          return res.olStyle;
        }
      };

      return function(properties) {
        return new olStyleForPropertyValue(properties);
      };
    };
  });
})();
