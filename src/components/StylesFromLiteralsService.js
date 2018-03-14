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
            style.backgroundFill = new ol.style.Fill(style.backgroundFill);
            style.backgroundStroke = new ol.style.Stroke(
                style.backgroundStroke);
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
              olText = getOlBasicStyles(style.label).text;
              olStyles.text = olText;
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

      function getLabelTemplate(value) {
        if (value) {
          return value.template || '';
        }
      }

      function getStyleSpec(value) {
        return {
          olStyle: getOlStyleFromLiterals(value),
          minResolution: getMinResolution(value),
          maxResolution: getMaxResolution(value),
          labelProperty: getLabelProperty(value.vectorOptions.label),
          labelTemplate: getLabelTemplate(value.vectorOptions.label),
          imageRotationProperty: value.rotation
        };
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
            labelProperty: getLabelProperty(properties.vectorOptions.label),
            labelTemplate: getLabelTemplate(properties.vectorOptions.label),
            imageRotationProperty: properties.rotation
          };
        } else if (this.type === 'unique') {
          var values = properties.values;
          for (i = 0; i < values.length; i++) {
            var value = values[i];
            styleSpec = getStyleSpec(value);
            this.pushOrInitialize_(value.geomType, value.value, styleSpec);
          }
        } else if (this.type === 'range') {
          var ranges = properties.ranges;
          for (i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            styleSpec = getStyleSpec(range);
            var key = range.range.toString();
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
        var olStyle, range, limits, min, max;
        for (range in this.styles[geomType]) {
          limits = range.split(',');
          min = parseFloat(limits[0].replace(/\s/g, ''));
          max = parseFloat(limits[1].replace(/\s/g, ''));
          if (value >= min && value < max) {
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
          if (olStyles[i].minResolution <= resolution &&
              olStyles[i].maxResolution > resolution) {
            olStyle = olStyles[i];
            break;
          }
        }
        return olStyle;
      };

      OlStyleForPropertyValue.prototype.log_ = function(value, id) {
        value = value === '' ? '<empty string>' : value;
        $window.console.log('Feature ID: ' + id + '. No matching style found ' +
            'for key ' + this.key + ' and value ' + value + '.');
      };

      OlStyleForPropertyValue.prototype.setOlText_ = function(olStyle,
          labelProperty, labelTemplate, properties) {
        var text;
        properties = properties || [];
        if (labelProperty) {
          text = properties[labelProperty];
          if (text !== undefined && text !== null) {
            text = text.toString();
          }
        } else if (labelTemplate) {
          text = labelTemplate;
          angular.forEach(properties, function(prop, k) {
            if (prop !== undefined && prop !== null) {
              text = text.replace('${' + k + '}', prop);
            }
          });
        }
        if (text) {
          olStyle.getText().setText(text);
        }
        return olStyle;
      };

      OlStyleForPropertyValue.prototype.setOlRotation_ = function(olStyle,
          imageRotationProperty, properties) {
        var rotation, image;
        if (imageRotationProperty) {
          rotation = properties[imageRotationProperty];
          if (rotation && $.isNumeric(rotation)) {
            image = olStyle.getImage();
            if (image) {
              image.setRotation(rotation);
            }
          }
        }
        return olStyle;
      };

      OlStyleForPropertyValue.prototype.getOlStyle_ = function(feature,
          resolution, properties) {
        var value, geomType, olStyle, olStyles, styleSpec;
        // A value can be 0
        value = properties[this.key];
        value = value !== undefined ? value : this.defaultVal;
        geomType = getGeomTypeFromGeometry(feature.getGeometry());

        if (this.type === 'unique') {
          olStyles = this.styles[geomType][value];
        } else if (this.type === 'range') {
          olStyles = this.findOlStyleInRange_(value, geomType);
        }

        if (!olStyles) {
          this.log_(value, feature.getId());
          return this.defaultStyle;
        }
        styleSpec = this.getOlStyleForResolution_(olStyles, resolution);
        if (styleSpec) {
          olStyle = this.setOlText_(styleSpec.olStyle, styleSpec.labelProperty,
              styleSpec.labelTemplate, properties);
          olStyle = this.setOlRotation_(styleSpec.olStyle,
              styleSpec.imageRotationProperty, properties);
          return olStyle;
        }
        return this.defaultStyle;
      };

      OlStyleForPropertyValue.prototype.getFeatureStyle = function(feature,
          resolution) {
        var properties, singleStyle;
        if (feature) {
          properties = feature.getProperties();
        }

        if (this.type === 'single') {
          singleStyle = this.setOlText_(this.singleStyle.olStyle,
              this.singleStyle.labelProperty, this.singleStyle.labelTemplate,
              properties);
          singleStyle = this.setOlRotation_(this.singleStyle.olStyle,
              this.singleStyle.imageRotationProperty, properties);
          return singleStyle;
        } else if (this.type === 'unique') {
          return this.getOlStyle_(feature, resolution, properties);
        } else if (this.type === 'range') {
          return this.getOlStyle_(feature, resolution, properties);
        }
      };

      return function(properties) {
        return new OlStyleForPropertyValue(properties);
      };
    };
  });
})();
