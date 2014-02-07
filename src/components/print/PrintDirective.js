(function() {
  goog.provide('ga_print_directive');


  var module = angular.module('ga_print_directive',
    ['pascalprecht.translate']);

  module.controller('GaPrintDirectiveController',
    function($scope, $http, $window, $translate, $document,
             gaLayers, gaPermalink) {
    var waitclass = 'ga-print-wait';
    var bodyEl = angular.element($document[0].body);

    // Hardcode listd of legends that should be downloaded in
    // separate PDF instead of putting the image in the same
    // PDF as the print (as in RE2). Note: We should avoid doing
    // this as it feels hacky. We should create nice png what are
    // usable in the pdf
    var pdfLegendList = ['ch.astra.ivs-gelaendekarte',
        'ch.astra.ausnahmetransportrouten',
        'ch.bazl.luftfahrtkarten-icao',
        'ch.bazl.segelflugkarte',
        'ch.swisstopo.geologie-eiszeit-lgm-raster',
        'ch.swisstopo.geologie-geologische_karte',
        'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen',
        'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet',
        'ch.swisstopo.geologie-tektonische_karte',
        'ch.kantone.cadastralwebmap-farbe',
        'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk200.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk100.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk50.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk25.noscale'];
    var pdfLegendString = '_big.pdf';
    var pdfLegendsToDownload = [];

    var topicId;
    var printRectangle;

    var updatePrintConfig = function() {
      var printPath = $scope.options.printPath;
      var http = $http.get(printPath +
          '/info.json?url=' + encodeURIComponent(printPath) +
          '&app=' + topicId);

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

   var deregister;

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
      $scope.map.requestRenderFrame();
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


    $scope.$on('gaTopicChange', function(event, topic) {
      topicId = topic.id;
      updatePrintConfig();
    });
    $scope.$on('gaLayersChange', function(event, data) {
      updatePrintRectanglePixels($scope.scale);
    });
    $scope.map.on('change:size', function(event) {
      updatePrintRectanglePixels($scope.scale);
    });

    bodyEl.removeClass(waitclass);

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
          } else if (layer instanceof ol.layer.Vector) {
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
      }

      if (stroke) {
        var color = ol.color.asArray(stroke.getColor());
        literal.strokeWidth = stroke.getWidth();
        literal.strokeColor = toHexa(color);
        literal.strokeOpacity = color[3];
        literal.strokeLinecap = stroke.getLineCap() || 'round';
        literal.strokeLinejoin = stroke.getLineJoin() || 'round';

        if (stroke.getLineDash()) {
          literal.strokeDashstyle = stroke.getLineDash();
        }
        // TO FIX: Not managed by the print server
        // literal.strokeMiterlimit = stroke.getMiterLimit();
      }

      // TO FIX: Not managed by OL3
      /*if (textStyle) {
        literal.fontColor = textStyle.getFill().getColor();
        literal.fontFamily = textStyle.getFont();
        literal.fontSize =
        literal.fontWeight =
        literal.label = textStyle.getText();
        literal.labelAlign = textStyle.getTextAlign();
        literal.labelOutlineColor = textStyle.getStroke().getColor();
        literal.labelOutlineWidth = textStyle.getStroke().getWidth();
      }*/

      return literal;
    };

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

          angular.forEach(features, function(feature) {
            var encStyle = {
              id: styleId
            };
            var geometry = feature.getGeometry();
            var encJSON = format.writeFeature(feature);
            encJSON.properties._gx_style = styleId;
            encFeatures.push(encJSON);
            var styles = (layer.getStyleFunction()) ?
                layer.getStyleFunction()(feature) :
                ol.feature.defaultStyleFunction(feature);

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
            angular.extend(enc, {
              type: 'WMTS',
              baseURL: location.protocol + '//wmts.geo.admin.ch',
              layer: config.serverLayerName,
              maxExtent: [420000, 30000, 900000, 350000],
              tileOrigin: [420000, 350000],
              tileSize: [256, 256],
              style: 'default',
              resolutions: [4000,
                    3750,
                    3500,
                    3250,
                    3000,
                    2750,
                    2500,
                    2250,
                    2000,
                    1750,
                    1500,
                    1250,
                    1000,
                     750,
                     650,
                     500,
                     250,
                     100,
                      50,
                      20,
                      10,
                       5,
                     2.5,
                       2,
                     1.5,
                       1,
                     0.5],
              zoomOffset: 0,
              version: '1.0.0',
              requestEncoding: 'REST',
              formatSuffix: config.format || 'jpeg',
              style: 'default',
              dimensions: ['TIME'],
              params: {'TIME':
                  layer.getSource().getDimensions().Time},
              matrixSet: '21781'
          });

          return enc;
        }
      },
      'legends' : {
        'ga_urllegend': function(layer, config) {
          var format = '.png';
          if (pdfLegendList.indexOf(layer.bodId) != -1) {
            format = pdfLegendString;
          }
          var enc = $scope.encoders.legends.base.call(this, config);
          enc.classes.push({
            name: '',
            icon: location.protocol + $scope.options.serviceUrl +
                '/static/images/legends/' +
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
      $window.location.href = url;
    };

    $scope.submit = function() {
      // http://mapfish.org/doc/print/protocol.html#print-pdf
      bodyEl.addClass(waitclass);
      var view = $scope.map.getView();
      var proj = view.getProjection();
      var lang = $translate.uses();
      var configLang = 'lang' + lang;
      var defaultPage = {};
      defaultPage[configLang] = true;
      var encodedPermalinkHref =
          encodeURIComponent(gaPermalink.getHref());

      var qrcodeurl = location.protocol + $scope.options.serviceUrl +
          '/qrcodegenerator?url=' + encodedPermalinkHref;
      var shortenUrl = location.protocol + $scope.options.serviceUrl +
          '/shorten.json?cb=JSON_CALLBACK';

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
          var cross = {
            'type': 'Vector',
            'styles': {
              '1': {
                'strokeColor': 'red',
                'strokeWidth': 2,
                'strokeOpacity': 1,
                'strokeDashstyle': 'solid',
                'strokeLinecap': 'round'
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
                  'type': 'MultiLineString',
                  'coordinates': [
                    [
                      [center[0] - offset, center[1]],
                      [center[0] + offset, center[1]]
                    ],
                    [
                      [center[0], center[1] - offset],
                      [center[0], center[1] + offset]
                    ]
                  ]
                }
              }]
            },
            'name': 'drawing',
            'opacity': 1
          };
          encLayers.push(cross);
        }
      });

      // scale = resolution * inches per map unit (m) * dpi
      var scale = parseInt(view.getResolution() * 39.37 * 254);
      var scales = this.scales.map(function(scale) {
        return parseInt(scale.value);
      });
      var that = this;
      $http.jsonp(shortenUrl, {
        params: {
          url: gaPermalink.getHref()
        }
      }).success(function(response) {
        var spec = {
          layout: that.layout.name,
          srs: proj.getCode(),
          units: proj.getUnits() || 'm',
          rotation: view.getRotation(),
          app: topicId, //topic name
          lang: $translate.uses(),
          dpi: that.dpi.value,
          layers: encLayers,
          legends: encLegends,
          enableLegends: (encLegends && encLegends.length > 0),
          qrcodeurl: qrcodeurl,
          pages: [
          angular.extend({
            center: getPrintRectangleCenterCoord(),
            // scale has to be one of the advertise by the print server
            scale: $scope.scale.value,
            dataOwner: '© ' + attributions.join(),
            shortLink: response.shorturl.replace('/shorten', '')
          }, defaultPage)]
        };
        var http = $http.post(that.capabilities.createURL +
            '?url=' + encodeURIComponent($scope.options.printPath +
            '/create.json'), spec);
        http.success(function(data) {
          bodyEl.removeClass(waitclass);
          $scope.downloadUrl(data.getURL);
          //After standard print, download the pdf Legends
          //if there are any
          for (var i = 0; i < pdfLegendsToDownload.length; i++) {
            $window.open(pdfLegendsToDownload[i]);
          }
        });
        http.error(function() {
          bodyEl.removeClass(waitclass);
        });
      }).error(function() {
        bodyEl.removeClass(waitclass);
      });
    };

    var getPrintRectangleCenterCoord = function() {
        var bottomLeft = printRectangle.slice(0, 2);
        var width = printRectangle[2] - printRectangle[0];
        var height = printRectangle[3] - printRectangle[1];
        var center = [bottomLeft[0] + width / 2, bottomLeft[1] + height / 2];

        return $scope.map.getCoordinateFromPixel(center);
    };

    var updatePrintRectanglePixels = function(scale) {
      if ($scope.options.active) {
        printRectangle = calculatePageBoundsPixels(scale);
        $scope.map.requestRenderFrame();
      }
    };

    var DPI = 72;
    var MM_PER_INCHES = 25.4;
    var UNITS_RATIO = 39.37;

    var getOptimalScale = function() {
      var size = $scope.map.getSize();
      var resolution = $scope.map.getView().getResolution();
      var width = resolution * (size[0] - ($scope.options.widthMargin * 2));
      var height = resolution * (size[1] - ($scope.options.heightMargin * 2));
      var layoutSize = $scope.layout.map;
      var scaleWidth = width * UNITS_RATIO * DPI / layoutSize.width;
      var scaleHeight = height * UNITS_RATIO * DPI / layoutSize.height;
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

    var fullExtent = [-300000, -300000, 2000000, 2000000];


    var calculatePageBoundsPixels = function(scale) {
        var s = parseFloat(scale.value);
        var size = $scope.layout.map; // papersize in dot!
        var view = $scope.map.getView();
        var center = view.getCenter();
        var resolution = view.getResolution();

        var w = size.width / DPI * MM_PER_INCHES / 1000.0 * s / resolution;
        var h = size.height / DPI * MM_PER_INCHES / 1000.0 * s / resolution;
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
    $scope.$watch('scale', function() {
       updatePrintRectanglePixels($scope.scale);
    });
    $scope.$watch('layout', function() {
      updatePrintRectanglePixels($scope.scale);
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
