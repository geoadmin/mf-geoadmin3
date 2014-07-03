(function() {
  goog.provide('ga_print_directive');
  goog.require('ga_browsersniffer_service');


  var module = angular.module('ga_print_directive',
    ['ga_browsersniffer_service',
     'pascalprecht.translate']);

  module.controller('GaPrintDirectiveController', function($scope, $http,
      $window, $translate, gaWaitCursor,
      gaLayers, gaPermalink, gaBrowserSniffer) {

    gaWaitCursor.remove();
    var pdfLegendsToDownload = [];
    var pdfLegendString = '_big.pdf';
    var printRectangle;
    var deregister;
    var POINTS_PER_INCH = 72; //PostScript points 1/72"
    var MM_PER_INCHES = 25.4;
    var UNITS_RATIO = 39.37; // inches per meter
    var printConfigLoaded = false;

    // Get print config
    var updatePrintConfig = function() {
      var http = $http.get($scope.options.printConfigUrl);
      http.success(function(data) {
        $scope.capabilities = data;

        // default values:
        $scope.layout = data.layouts[0];
        $scope.dpi = data.dpis[0];
        $scope.scales = data.scales;
        $scope.scale = data.scales[5];
        $scope.options.legend = false;
        $scope.options.graticule = false;
      });
    };

    var activate = function() {
      deregister = [
        $scope.map.on('precompose', handlePreCompose),
        $scope.map.on('postcompose', handlePostCompose),
        $scope.map.getView().on('propertychange', function(event) {
          updatePrintRectanglePixels($scope.scale);
        })
      ];
      $scope.scale = getOptimalScale();
      refreshComp();
    };

    var deactivate = function() {
      if (deregister) {
        for (var i = 0; i < deregister.length; i++) {
          deregister[i].src.unByKey(deregister[i]);
        }
      }
      refreshComp();
    };

    var refreshComp = function() {
      updatePrintRectanglePixels($scope.scale);
      $scope.map.render();
    };

    // Compose events
    var handlePreCompose = function(evt) {
      var ctx = evt.context;
      ctx.save();
    };

    var handlePostCompose = function(evt) {
      var ctx = evt.context;
      var size = $scope.map.getSize();
      var height = size[1] * ol.BrowserFeature.DEVICE_PIXEL_RATIO;
      var width = size[0] * ol.BrowserFeature.DEVICE_PIXEL_RATIO;

      var minx, miny, maxx, maxy;
      minx = printRectangle[0], miny = printRectangle[1],
           maxx = printRectangle[2], maxy = printRectangle[3];

      ctx.beginPath();
      // Outside polygon, must be clockwise
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.lineTo(0, 0);
      ctx.closePath();

      // Inner polygon,must be counter-clockwise
      ctx.moveTo(minx, miny);
      ctx.lineTo(minx, maxy);
      ctx.lineTo(maxx, maxy);
      ctx.lineTo(maxx, miny);
      ctx.lineTo(minx, miny);
      ctx.closePath();

      ctx.fillStyle = 'rgba(0, 5, 25, 0.75)';
      ctx.fill();

      ctx.restore();
    };

    // Listeners
    $scope.$on('gaTopicChange', function(event, topic) {
      if (!printConfigLoaded) {
        updatePrintConfig();
        printConfigLoaded = true;
      }
    });
    $scope.$on('gaLayersChange', function(event, data) {
      updatePrintRectanglePixels($scope.scale);
    });
    $scope.map.on('change:size', function(event) {
      updatePrintRectanglePixels($scope.scale);
    });
    $scope.$watch('scale', function() {
      updatePrintRectanglePixels($scope.scale);
    });
    $scope.$watch('layout', function() {
      updatePrintRectanglePixels($scope.scale);
    });


    // Encode ol.Layer to a basic js object
    var encodeLayer = function(layer, proj) {
      var encLayer, encLegend;
      var ext = proj.getExtent();
      var resolution = $scope.map.getView().getResolution();

      if (!(layer instanceof ol.layer.Group)) {
        var src = layer.getSource();
        var layerConfig = gaLayers.getLayer(layer.bodId) || {};
        var minResolution = layerConfig.minResolution || 0;
        var maxResolution = layerConfig.maxResolution || Infinity;

        if (resolution <= maxResolution &&
            resolution >= minResolution) {
          if (src instanceof ol.source.WMTS) {
            encLayer = $scope.encoders.layers['WMTS'].call(this,
                layer, layerConfig);
          } else if (src instanceof ol.source.ImageWMS ||
              src instanceof ol.source.TileWMS) {
            encLayer = $scope.encoders.layers['WMS'].call(this,
                layer, layerConfig);
          } else if (src instanceof ol.source.Vector ||
              src instanceof ol.source.ImageVector) {
            if (src instanceof ol.source.ImageVector) {
              src = src.getSource();
            }
            var features = [];
            src.forEachFeatureInExtent(ext, function(feat) {
              features.push(feat);
            });

            if (features && features.length > 0) {
              encLayer =
                  $scope.encoders.layers['Vector'].call(this,
                     layer, features);
            }
          }
        }
      }

      if ($scope.options.legend && layerConfig.hasLegend) {
        encLegend = $scope.encoders.legends['ga_urllegend'].call(this,
            layer, layerConfig);

        if (encLegend.classes &&
            encLegend.classes[0] &&
            encLegend.classes[0].icon) {
          var legStr = encLegend.classes[0].icon;
          if (legStr.indexOf(pdfLegendString,
              legStr.length - pdfLegendString.length) !== -1) {
            pdfLegendsToDownload.push(legStr);
            encLegend = undefined;
          }
        }
      }
      return {layer: encLayer, legend: encLegend};
    };


    // Create a ol.geom.Polygon from an ol.geom.Circle, comes from OL2
    // https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/Polygon.js#L240
    var circleToPolygon = function(circle, sides, rotation) {
      var origin = circle.getCenter();
      var radius = circle.getRadius();
      sides = sides || 40;
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
    };

    // Transform an ol.Color to an hexadecimal string
    var toHexa = function(olColor) {
      var hex = '#';
      for (var i = 0; i < 3; i++) {
        var part = olColor[i].toString(16);
        if (part.length === 1 && parseInt(part) < 10) {
          hex += '0';
        }
        hex += part;
      }
      return hex;
    };

    // Transform a ol.style.Style to a print literal object
    var transformToPrintLiteral = function(feature, style) {
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
       * labelOutlineColor
       * labelOutlineWidth
       * graphicHeight
       * graphicOpacity
       * graphicWidth
       * graphicXOffset
       * graphicYOffset
       * zIndex
       */

      var literal = {
        zIndex: style.getZIndex()
      };
      var type = feature.getGeometry().getType();
      var fill = style.getFill();
      var stroke = style.getStroke();
      var textStyle = style.getText();
      var imageStyle = style.getImage();

      if (imageStyle) {
        var size = imageStyle.getSize();
        var anchor = imageStyle.getAnchor();
        var scale = imageStyle.getScale();
        literal.rotation = imageStyle.getRotation();
        if (size) {
          literal.graphicWidth = size[0] * scale;
          literal.graphicHeight = size[1] * scale;
        }
        if (anchor) {
          literal.graphicXOffset = -anchor[0] * scale;
          literal.graphicYOffset = -anchor[1] * scale;
        }
        if (imageStyle instanceof ol.style.Icon) {
          literal.externalGraphic = imageStyle.getSrc();
          literal.fillOpacity = 1;
        } else { // ol.style.Circle
          fill = imageStyle.getFill();
          stroke = imageStyle.getStroke();
          literal.pointRadius = imageStyle.getRadius();
        }
      }

      if (fill) {
        var color = ol.color.asArray(fill.getColor());
        literal.fillColor = toHexa(color);
        literal.fillOpacity = color[3];
      } else if (!literal.fillOpacity) {
        literal.fillOpacity = 0; // No fill
      }

      if (stroke) {
        var color = ol.color.asArray(stroke.getColor());
        literal.strokeWidth = stroke.getWidth();
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

      if (textStyle) {
        var fillColor = ol.color.asArray(textStyle.getFill().getColor());
        var strokeColor = ol.color.asArray(textStyle.getStroke().getColor());
        var fontValues = textStyle.getFont().split(' ');
        literal.fontColor = toHexa(fillColor);
        // Fonts managed by print server: COURIER, HELVETICA, TIMES_ROMAN
        literal.fontFamily = fontValues[2].toUpperCase();
        literal.fontSize = parseInt(fontValues[1]);
        literal.fontWeight = fontValues[0];
        literal.label = textStyle.getText();
        literal.labelAlign = textStyle.getTextAlign();
        literal.labelOutlineColor = toHexa(strokeColor);
        literal.labelOutlineWidth = textStyle.getStroke().getWidth();
      }

      return literal;
    };

    // Encoders by type of layer
    $scope.encoders = {
      'layers': {
        'Layer': function(layer) {
          var enc = {
            layer: layer.bodId,
            opacity: layer.getOpacity()
          };
          return enc;
        },
        'Group': function(layer, proj) {
          var encs = [];
          var subLayers = layer.getLayers();
          subLayers.forEach(function(subLayer, idx, arr) {
            if (subLayer.visible) {
              var enc = $scope.encoders.
                  layers['Layer'].call(this, layer);
              var layerEnc = encodeLayer(subLayer, proj);
              if (layerEnc && layerEnc.layer) {
                $.extend(enc, layerEnc);
                encs.push(enc.layer);
              }
            }
          });
          return encs;
        },
        'Vector': function(layer, features) {
          var enc = $scope.encoders.
              layers['Layer'].call(this, layer);
          var format = new ol.format.GeoJSON();
          var encStyles = {};
          var encFeatures = [];
          var stylesDict = {};
          var styleId = 0;
          var hasLayerStyleFunction = !!(layer.getStyleFunction &&
              layer.getStyleFunction());

          angular.forEach(features, function(feature) {
            var encStyle = {
              id: styleId
            };
            var styles = (hasLayerStyleFunction) ?
                layer.getStyleFunction()(feature) :
                ol.feature.defaultStyleFunction(feature);


            var geometry = feature.getGeometry();

            // Transform an ol.geom.Circle to a ol.geom.Polygon
            if (geometry.getType() === 'Circle') {
              var polygon = circleToPolygon(geometry);
              feature = new ol.Feature(polygon);
            }

            var encJSON = format.writeFeature(feature);
            if (!encJSON.properties) {
              encJSON.properties = {};

            // Fix https://github.com/geoadmin/mf-geoadmin3/issues/1213
            } else if (encJSON.properties.Style) {
              delete encJSON.properties.Style;
            }

            encJSON.properties._gx_style = styleId;
            encFeatures.push(encJSON);

            if (styles && styles.length > 0) {
              $.extend(encStyle, transformToPrintLiteral(feature, styles[0]));
            }

            encStyles[styleId] = encStyle;
            styleId++;
          });
          angular.extend(enc, {
            type: 'Vector',
            styles: encStyles,
            styleProperty: '_gx_style',
            geoJson: {
              type: 'FeatureCollection',
              features: encFeatures
            },
            name: layer.bodId,
            opacity: (layer.opacity != null) ? layer.opacity : 1.0
          });
          return enc;
        },
        'WMS': function(layer, config) {
            var enc = $scope.encoders.
              layers['Layer'].call(this, layer);
            var params = layer.getSource().getParams();
            var layers = params.LAYERS.split(',') || [];
            var styles = (params.STYLES !== undefined) ?
                params.STYLES.split(',') :
                new Array(layers.length).join(',').split(',');
            angular.extend(enc, {
              type: 'WMS',
              baseURL: config.wmsUrl || layer.url,
              layers: layers,
              styles: styles,
              format: 'image/' + (config.format || 'png'),
              customParams: {
                'EXCEPTIONS': 'XML',
                'TRANSPARENT': 'true',
                'CRS': 'EPSG:21781',
                'TIME': params.TIME
              },
              singleTile: config.singleTile || false
            });
            return enc;

        },
        'WMTS': function(layer, config) {
            var enc = $scope.encoders.layers['Layer'].
                call(this, layer);
            var source = layer.getSource();
            var tileGrid = source.getTileGrid();
            angular.extend(enc, {
              type: 'WMTS',
              baseURL: location.protocol + '//wmts.geo.admin.ch',
              layer: config.serverLayerName,
              maxExtent: source.getExtent(),
              tileOrigin: tileGrid.getOrigin(),
              tileSize: [tileGrid.getTileSize(), tileGrid.getTileSize()],
              resolutions: tileGrid.getResolutions(),
              zoomOffset: tileGrid.getMinZoom(),
              version: '1.0.0',
              requestEncoding: 'REST',
              formatSuffix: config.format || 'jpeg',
              style: 'default',
              dimensions: ['TIME'],
              params: {'TIME': source.getDimensions().Time},
              matrixSet: '21781'
          });

          return enc;
        }
      },
      'legends' : {
        'ga_urllegend': function(layer, config) {
          var format = '.png';
          if ($scope.options.pdfLegendList.indexOf(layer.bodId) != -1) {
            format = pdfLegendString;
          }
          var enc = $scope.encoders.legends.base.call(this, config);
          enc.classes.push({
            name: '',
            icon: $scope.options.legendUrl +
                layer.bodId + '_' + $translate.uses() + format
          });
          return enc;
        },
        'base': function(config) {
          return {
            name: config.label,
            classes: []
          };
        }
      }
    };

    var getNearestScale = function(target, scales) {
      var nearest = null;
      angular.forEach(scales, function(scale) {
        if (nearest == null ||
            Math.abs(scale - target) < Math.abs(nearest - target)) {
              nearest = scale;
        }
      });
      return nearest;
    };

    $scope.downloadUrl = function(url) {
      if (gaBrowserSniffer.msie == 9) {
        $window.open(url);
      } else {
        $window.location = url;
      }
    };

    $scope.submit = function() {
      if (!$scope.options.active) {
        return;
      }
      // http://mapfish.org/doc/print/protocol.html#print-pdf
      gaWaitCursor.add();
      var view = $scope.map.getView();
      var proj = view.getProjection();
      var lang = $translate.uses();
      var defaultPage = {};
      defaultPage['lang' + lang] = true;
      var qrcodeUrl = $scope.options.qrcodeUrl +
          encodeURIComponent(gaPermalink.getHref());
      var encLayers = [];
      var encLegends;
      var attributions = [];
      var layers = this.map.getLayers();
      pdfLegendsToDownload = [];

      angular.forEach(layers, function(layer) {
        if (layer.visible) {
          var attribution = layer.attribution;
          if (attribution !== undefined &&
              attributions.indexOf(attribution) == -1) {
            attributions.push(attribution);
          }
          if (layer instanceof ol.layer.Group) {
            var encs = $scope.encoders.layers['Group'].call(this,
                layer, proj);
            encLayers = encLayers.concat(encs);
          } else {
            var enc = encodeLayer(layer, proj);
            if (enc && enc.layer) {
              encLayers.push(enc.layer);
              if (enc.legend) {
                encLegends = encLegends || [];
                encLegends.push(enc.legend);
              }
            }
          }
        }
      });
      if ($scope.options.graticule) {
        var graticule = {
          'baseURL': 'http://wms.geo.admin.ch/',
          'opacity': 1,
          'singleTile': true,
          'type': 'WMS',
          'layers': ['org.epsg.grid_21781,org.epsg.grid_4326'],
          'format': 'image/png',
          'styles': [''],
          'customParams': {
            'TRANSPARENT': true
          }
        };
        encLayers.push(graticule);
      }
      // FIXME this is a temporary solution
      var overlays = $scope.map.getOverlays();
      var resolution = $scope.map.getView().getResolution();

      overlays.forEach(function(overlay) {
        var center = overlay.getPosition();
        var offset = 5 * resolution;
        if (center) {
          var marker = {
            'type': 'Vector',
            'styles': {
              '1': {
                'externalGraphic': $scope.options.markerUrl,
                'graphicWidth': 20,
                'graphicHeight': 30,
                // the icon is not perfectly centered in the image
                // these values must be the same in map.less
                'graphicXOffset': -12,
                'graphicYOffset': -30
              }
            },
            'styleProperty': '_gx_style',
            'geoJson': {
              'type': 'FeatureCollection',
              'features': [{
                'type': 'Feature',
                'properties': {
                  '_gx_style': 1
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': [center[0], center[1], 0]
                }
              }]
            },
            'name': 'drawing',
            'opacity': 1
          };
          encLayers.push(marker);
        }
      });

      var scales = this.scales.map(function(scale) {
        return parseInt(scale.value);
      });
      var that = this;
      $http.jsonp($scope.options.shortenUrl, {
        params: {
          url: gaPermalink.getHref()
        }
      }).success(function(response) {
        var spec = {
          layout: that.layout.name,
          srs: proj.getCode(),
          units: proj.getUnits() || 'm',
          rotation: -((view.getRotation() * 180.0) / Math.PI),
          app: 'config',
          lang: lang,
          dpi: that.dpi.value,
          layers: encLayers,
          legends: encLegends,
          enableLegends: (encLegends && encLegends.length > 0),
          qrcodeurl: qrcodeUrl,
          pages: [
            angular.extend({
              center: getPrintRectangleCenterCoord(),
              // scale has to be one of the advertise by the print server
              scale: $scope.scale.value,
              dataOwner: '© ' + attributions.join(),
              shortLink: response.shorturl.replace('/shorten', ''),
              rotation: -((view.getRotation() * 180.0) / Math.PI)
            }, defaultPage)
          ]
        };
        var http = $http.post(that.capabilities.createURL + '?url=' +
            encodeURIComponent(that.capabilities.createURL), spec);
        http.success(function(data) {
          gaWaitCursor.remove();
          $scope.downloadUrl(data.getURL);
          //After standard print, download the pdf Legends
          //if there are any
          for (var i = 0; i < pdfLegendsToDownload.length; i++) {
            $window.open(pdfLegendsToDownload[i]);
          }
        });
        http.error(function() {
          gaWaitCursor.remove();
        });
      }).error(function() {
        gaWaitCursor.remove();
      });
    };

    var getPrintRectangleCenterCoord = function() {
      // Framebuffer size!!
      var bottomLeft = printRectangle.slice(0, 2);
      var width = printRectangle[2] - printRectangle[0];
      var height = printRectangle[3] - printRectangle[1];
      var center = [bottomLeft[0] + width / 2, bottomLeft[1] + height / 2];
      // convert back to map display size
      var mapPixelCenter = [center[0] / ol.BrowserFeature.DEVICE_PIXEL_RATIO,
           center[1] / ol.BrowserFeature.DEVICE_PIXEL_RATIO];
      return $scope.map.getCoordinateFromPixel(mapPixelCenter);
    };

    var updatePrintRectanglePixels = function(scale) {
      if ($scope.options.active) {
        printRectangle = calculatePageBoundsPixels(scale);
        $scope.map.render();
      }
    };

    var getOptimalScale = function() {
      var size = $scope.map.getSize();
      var resolution = $scope.map.getView().getResolution();
      var width = resolution * (size[0] - ($scope.options.widthMargin * 2));
      var height = resolution * (size[1] - ($scope.options.heightMargin * 2));
      var layoutSize = $scope.layout.map;
      var scaleWidth = width * UNITS_RATIO * POINTS_PER_INCH /
          layoutSize.width;
      var scaleHeight = height * UNITS_RATIO * POINTS_PER_INCH /
          layoutSize.height;
      var testScale = scaleWidth;
      if (scaleHeight < testScale) {
        testScale = scaleHeight;
      }
      var nextBiggest = null;
      //The algo below assumes that scales are sorted from
      //biggest (1:500) to smallest (1:2500000)
      angular.forEach($scope.scales, function(scale) {
        if (nextBiggest == null ||
            testScale > scale.value) {
              nextBiggest = scale;
        }
      });
      return nextBiggest;
    };

    var calculatePageBoundsPixels = function(scale) {
      var s = parseFloat(scale.value);
      var size = $scope.layout.map; // papersize in dot!
      var view = $scope.map.getView();
      var resolution = view.getResolution();
      var w = size.width / POINTS_PER_INCH * MM_PER_INCHES / 1000.0 *
          s / resolution * ol.BrowserFeature.DEVICE_PIXEL_RATIO;
      var h = size.height / POINTS_PER_INCH * MM_PER_INCHES / 1000.0 *
          s / resolution * ol.BrowserFeature.DEVICE_PIXEL_RATIO;
      var mapSize = $scope.map.getSize();
      var center = [mapSize[0] * ol.BrowserFeature.DEVICE_PIXEL_RATIO / 2 ,
          mapSize[1] * ol.BrowserFeature.DEVICE_PIXEL_RATIO / 2];

      var minx, miny, maxx, maxy;

      minx = center[0] - (w / 2);
      miny = center[1] - (h / 2);
      maxx = center[0] + (w / 2);
      maxy = center[1] + (h / 2);
      return [minx, miny, maxx, maxy];
    };

    $scope.$watch('options.active', function(newVal, oldVal) {
      if (newVal === true) {
        activate();
      } else {
        deactivate();
      }
    });

  });

  module.directive('gaPrint',
    function($http, $log, $translate) {
      return {
        restrict: 'A',
        templateUrl: 'components/print/partials/print.html',
        controller: 'GaPrintDirectiveController',
        link: function(scope, elt, attrs, controller) {
        }
      };
    }
  );
})();
