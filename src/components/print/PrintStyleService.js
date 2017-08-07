goog.provide('ga_printstyle_service');

goog.require('ga_urlutils_service');

(function() {

  angular.module('ga_printstyle_service', [
    'ga_urlutils_service'
  ]).provider('gaPrintStyle', gaPrintStyle);

  function gaPrintStyle() {
    this.$get = function(gaUrlUtils) {
      return {
        olStyleToPrintLiteral: getolStyleToPrintLiteral(gaUrlUtils),
        olPointToPolygon: olPointToPolygon,
        olCircleToPolygon: olCircleToPolygon
      };
    };
  };

  // Change a distance according to the change of DPI
  function adjustDist(dist, dpi) {
    if (!dist) {
      return;
    }
    return dist * 90 / dpi;
  };

  // Transform an ol.Color to an hexadecimal string
  // Move it to a gaColor service?
  function toHexa(olColor) {
    var hex = '#';
    for (var i = 0; i < 3; i++) {
      var part = olColor[i].toString(16);
      if (part.length === 1) {
        hex += '0';
      }
      hex += part;
    }
    return hex;
  };

  // Create a ol.geom.Polygon from an ol.geom.Circle, comes from OL2
  // https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/Polygon.js#L240
  function olCircleToPolygon(circle, sides, rotation) {
    if (!circle || !(circle instanceof ol.geom.Circle)) {
      return;
    }
    var origin = circle.getCenter();
    var radius = circle.getRadius();
    sides = sides || 40;
    rotation = rotation || 0;
    var angle = Math.PI * ((1 / sides) - (1 / 2));
    if (rotation) {
      angle += (rotation / 180) * Math.PI;
    }
    var points = [];
    for (var i = 0; i < sides; ++i) {
      var rotatedAngle = angle + (i * 2 * Math.PI / sides);
      var x = origin[0] + (radius * Math.cos(rotatedAngle));
      var y = origin[1] + (radius * Math.sin(rotatedAngle));
      points.push([x, y]);
    }
    points.push(points[0]);// Close the polygon
    return new ol.geom.Polygon([points]);
  }

  // Only simple shapes are supported for now (no use of radius2)
  function olPointToPolygon(point, radius, resolution, sides, rotation) {
    if (!point || !radius || !resolution || !(point instanceof ol.geom.Point)) {
      return;
    }
    var origin = point.getCoordinates();
    var angle = rotation || 0;
    sides = sides || 4;

    // First point always at top
    var xO = 0, yO = resolution * radius * 0.8;

    // Rotate around origin counter-clock wise
    var points = [];
    var angleInterval = 2 * Math.PI / sides;
    for (var i = 0; i < sides; i++) {
      var x = origin[0] + (xO * Math.cos(angle) - yO * Math.sin(angle));
      var y = origin[1] + (xO * Math.sin(angle) + yO * Math.cos(angle));
      points.push([x, y]);

      // Next point
      angle += angleInterval;
    }
    // Close the polygon
    points.push(points[0]);
    return new ol.geom.Polygon([points]);
  }

  function getolStyleToPrintLiteral(gaUrlUtils) {
    // Transform a ol.style.Style to a print literal object
    return function(style, dpi) {
      /**
       * ol.style.Style properties:
       *
       *  fill: ol.style.Fill :
       *    fill: String
       *  image: ol.style.Image:
       *    anchor: array[2]
       *    rotation
       *    size: array[2]
       *    src: String
       *  stroke: ol.style.Stroke:
       *    color: String
       *    lineCap
       *    lineDash
       *    lineJoin
       *    miterLimit
       *    width: Number
       *  text
       *  zIndex
       */

      /**
       * Print server properties:
       *
       * fillColor
       * fillOpacity
       * strokeColor
       * strokeOpacity
       * strokeWidth
       * strokeLinecap
       * strokeLinejoin
       * strokeDashstyle
       * pointRadius
       * label
       * fontFamily
       * fontSize
       * fontWeight
       * fontColor
       * labelAlign
       * labelXOffset
       * labelYOffset
       * labelOutlineColor
       * labelOutlineWidth
       * graphicHeight
       * graphicOpacity
       * graphicWidth
       * graphicXOffset
       * graphicYOffset
       * zIndex
       */
      if (!style || !(style instanceof ol.style.Style) || !dpi) {
        return;
      }
      var literal = {
        zIndex: style.getZIndex()
      };
      var fill = style.getFill();
      var stroke = style.getStroke();
      var textStyle = style.getText();
      var imageStyle = style.getImage();
      var color;

      if (imageStyle) {
        var size, anchor, scale = imageStyle.getScale();
        literal.rotation = (imageStyle.getRotation() || 0) * 180.0 / Math.PI;

        if (imageStyle instanceof ol.style.Icon) {
          size = imageStyle.getSize();
          anchor = imageStyle.getAnchor();
          literal.externalGraphic =
            gaUrlUtils.unProxifyUrl(imageStyle.getSrc());
          literal.fillOpacity = 1;
        } else if (imageStyle instanceof ol.style.Circle ||
            imageStyle instanceof ol.style.RegularShape) {
          fill = imageStyle.getFill();
          stroke = imageStyle.getStroke();
          var radius = imageStyle.getRadius();
          var width = adjustDist(2 * radius, dpi);
          if (stroke) {
            width += adjustDist(stroke.getWidth() + 1, dpi);
          }
          size = [width, width];
          anchor = [width / 2, width / 2];
          literal.pointRadius = radius;
        }

        if (size) {
          // Print server doesn't handle correctly 0 values for the size
          literal.graphicWidth = adjustDist((size[0] * scale || 0.1), dpi);
          literal.graphicHeight = adjustDist((size[1] * scale || 0.1), dpi);
        }
        if (anchor) {
          literal.graphicXOffset = adjustDist(-anchor[0] * scale, dpi);
          literal.graphicYOffset = adjustDist(-anchor[1] * scale, dpi);
        }

      }

      if (fill) {
        color = ol.color.asArray(fill.getColor());
        literal.fillColor = toHexa(color);
        literal.fillOpacity = color[3];
      } else if (!literal.fillOpacity) {
        literal.fillOpacity = 0; // No fill
      }

      if (stroke) {
        color = ol.color.asArray(stroke.getColor());
        literal.strokeWidth = adjustDist(stroke.getWidth(), dpi);
        literal.strokeColor = toHexa(color);
        literal.strokeOpacity = color[3];
        literal.strokeLinecap = stroke.getLineCap() || 'round';
        literal.strokeLinejoin = stroke.getLineJoin() || 'round';

        if (stroke.getLineDash()) {
          literal.strokeDashstyle = 'dash';
        }
        // TO FIX: Not managed by the print server
        // literal.strokeMiterlimit = stroke.getMiterLimit();
      } else {
        literal.strokeOpacity = 0; // No Stroke
      }

      if (textStyle && textStyle.getText()) {
        literal.label = textStyle.getText();
        literal.labelAlign = textStyle.getTextAlign();

        if (textStyle.getFill()) {
          var fillColor = ol.color.asArray(textStyle.getFill().getColor());
          literal.fontColor = toHexa(fillColor);
        }

        if (textStyle.getFont()) {
          var fontValues = textStyle.getFont().split(' ');
          // Fonts managed by print server: COURIER, HELVETICA, TIMES_ROMAN
          literal.fontFamily = fontValues[2].toUpperCase();
          literal.fontSize = parseInt(fontValues[1]);
          literal.fontWeight = fontValues[0];
        }

        /* TO FIX: Not managed by the print server
        if (textStyle.getStroke()) {
          var strokeColor = ol.color.asArray(textStyle.getStroke().getColor());
          literal.labelOutlineColor = toHexa(strokeColor);
          literal.labelOutlineWidth = textStyle.getStroke().getWidth();
        } */
      }

      return literal;
    };
  };
})();
