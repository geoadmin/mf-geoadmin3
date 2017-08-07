goog.provide('ga_stylesfromliterals_service');

(function() {

  var module = angular.module('ga_stylesfromliterals_service', []);

  module.provider('gaStylesFromLiterals', function() {

    this.$get = function($window) {

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
          // Necessary for Cesium
          olImage.crossOrigin = 'anonymous';

          delete olImage.label;
          olImage = getOlStyleForPoint(olImage, style.type);
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
          return value.property;
        }
      }

      function getMinResolution(value) {
        return value.minResolution || 0;
      }

      function getMaxResolution(value) {
        return value.maxResolution || Infinity;
      }

      var OlStyleForPropertyValue = function(properties) {
        this.singleStyle = null;

        this.defaultVal = 'defaultVal';

        this.defaultStyle = new ol.style.Style();

        this.styles = {
          point: {},
          line: {},
          polygon: {}
        };

        this.type = properties.type;

        this.initialize_(properties);
      };

      OlStyleForPropertyValue.prototype.initialize_ = function(properties) {
        var i, styleSpec;
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
          for (i = 0; i < values.length; i++) {
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
          for (i = 0; i < ranges.length; i++) {
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

      OlStyleForPropertyValue.prototype.pushOrInitialize_ = function(
          geomType, key, styleSpec) {
        // Happens when styling is only resolution dependent (unique type only)
        if (key === undefined) {
          key = this.defaultVal;
        }
        if (!this.styles[geomType][key]) {
          this.styles[geomType][key] = [styleSpec];
        } else {
          this.styles[geomType][key].push(styleSpec);
        }
      };

      OlStyleForPropertyValue.prototype.findOlStyleInRange_ = function(value,
          geomType) {
        var olStyle, range;
        for (range in this.styles[geomType]) {
          range = range.split(',');
          if (value >= parseFloat(range[0]) &&
              value < parseFloat(range[1])) {
            olStyle = this.styles[geomType][range];
            break;
          }
        }
        return olStyle;
      };

      OlStyleForPropertyValue.prototype.getOlStyleForResolution_ = function(
          olStyles, resolution) {
        var olStyle;
        for (var i = 0, ii = olStyles.length; i < ii; i++) {
          olStyle = olStyles[i];
          if (olStyle.minResolution <= resolution &&
              olStyle.maxResolution > resolution) {
            break;
          }
        }
        return olStyle;
      };

      OlStyleForPropertyValue.prototype.alertDebug_ = function(value, id) {
        value = value === '' ? '<empty string>' : value;
        $window.alert('Feature ID: ' + id + '. No matching style found ' +
            'for key ' + this.key + ' and value ' + value + '.');
        return this.defaultStyle;
      };

      OlStyleForPropertyValue.prototype.getFeatureStyle = function(feature,
          resolution) {
        var properties, value, geomType, olStyles, res, labelProperty, text;
        if (this.type === 'single') {
          labelProperty = this.singleStyle.labelProperty;
          if (labelProperty) {
            properties = feature.getProperties();
            text = properties[labelProperty];
            this.singleStyle.olStyle.getText().setText(text);
          }
          return this.singleStyle.olStyle;
        } else if (this.type === 'unique') {
          properties = feature.getProperties();
          // A value can be 0
          value = properties[this.key];
          value = value !== undefined ? value : this.defaultVal;
          geomType = getGeomTypeFromGeometry(feature.getGeometry());
          olStyles = this.styles[geomType][value];
          if (!olStyles) {
            return this.alertDebug_(value, feature.getId());
          }
          res = this.getOlStyleForResolution_(olStyles, resolution);
          if (res.labelProperty) {
            text = properties[res.labelProperty];
            res.olStyle.getText().setText(text);
          }
          return res.olStyle;
        } else if (this.type === 'range') {
          properties = feature.getProperties();
          value = properties[this.key];
          geomType = getGeomTypeFromGeometry(feature.getGeometry());
          olStyles = this.findOlStyleInRange_(value, geomType);
          if (!olStyles) {
            return this.alertDebug_(value, feature.getId());
          }
          res = this.getOlStyleForResolution_(olStyles, resolution);
          if (res.labelProperty) {
            text = properties[res.labelProperty];
            res.olStyle.getText().setText(text);
          }
          return res.olStyle;
        }
      };

      return function(properties) {
        return new OlStyleForPropertyValue(properties);
      };
    };
  });
})();
