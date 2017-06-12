goog.provide('ga_print_directive');

goog.require('ga_attribution_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_printstyle_service');
goog.require('ga_time_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_print_directive', [
    'ga_browsersniffer_service',
    'pascalprecht.translate',
    'ga_printstyle_service',
    'ga_time_service',
    'ga_attribution_service',
    'ga_urlutils_service'
  ]);

  module.controller('GaPrintDirectiveController', function($rootScope, $scope,
      $http, $q, $window, $translate, $timeout, gaLayers, gaMapUtils, 
      gaPermalink, gaBrowserSniffer, gaWaitCursor, gaPrintStyle,
      gaTime, gaAttribution, gaUrlUtils) {

    var pdfLegendsToDownload = [];
    var pdfLegendString = '_big.pdf';
    var printRectangle;
    var deregister = [];
    var POINTS_PER_INCH = 72; //PostScript points 1/72"
    var MM_PER_INCHES = 25.4;
    var UNITS_RATIO = 39.37; // inches per meter
    var POLL_INTERVAL = 2000; //interval for multi-page prints (ms)
    var POLL_MAX_TIME = 600000; //ms (10 minutes)
    var layersYears = [];
    var canceller;
    var currentMultiPrintId;
    var format = new ol.format.GeoJSON();
    var styleId = 0;
    $scope.printConfigLoaded = false;
    $scope.options.multiprint = false;
    $scope.options.movie = false;
    $scope.options.printing = false;
    $scope.options.printsuccess = false;
    $scope.options.progress = '';

    // Get print config
    var loadPrintConfig = function() {
      canceller = $q.defer();
      var http = $http.get($scope.options.printConfigUrl, {
        timeout: canceller.promise
      });
      return http;
    };

    var activate = function() {
      deregister = [
        $scope.map.on('precompose', handlePreCompose),
        $scope.map.on('postcompose', handlePostCompose),
        $scope.map.on('change:size', function(event) {
          updatePrintRectanglePixels($scope.scale);
        }),
        $scope.map.getView().on('propertychange', function(event) {
          updatePrintRectanglePixels($scope.scale);
        }),
        $scope.$watchGroup(['scale', 'layout'], function() {
          updatePrintRectanglePixels($scope.scale);
        })
      ];
      $scope.scale = getOptimalScale();
      refreshComp();
    };

    var deactivate = function() {
      var item;
      while (item = deregister.pop()) {
        if (angular.isFunction(item)) {
          item();
        } else {
          ol.Observable.unByKey(item);
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
      var ctx = evt.context,
          size = $scope.map.getSize(),
          minx = printRectangle[0],
          miny = printRectangle[1],
          maxx = printRectangle[2],
          maxy = printRectangle[3];

      var height = size[1] * ol.has.DEVICE_PIXEL_RATIO,
          width = size[0] * ol.has.DEVICE_PIXEL_RATIO;

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

    // Encode ol.Layer to a basic js object
    var encodeLayer = function(layer, proj) {
      var encLayer, encLegend;

      if (!(layer instanceof ol.layer.Group)) {
        var src = layer.getSource();
        var layerConfig = gaLayers.getLayer(layer.bodId) || {};
        var resolution = $scope.map.getView().getResolution();
        var minResolution = layerConfig.minResolution || 0;
        var maxResolution = layerConfig.maxResolution || Infinity;

        if (resolution <= maxResolution &&
            resolution >= minResolution) {
          if (src instanceof ol.source.WMTS) {
            encLayer = $scope.encoders.layers['WMTS'].call(this, layer,
                layerConfig);
          } else if (src instanceof ol.source.ImageWMS ||
              src instanceof ol.source.TileWMS) {
            encLayer = $scope.encoders.layers['WMS'].call(this, layer,
                layerConfig);
          } else if (src instanceof ol.source.Vector ||
              src instanceof ol.source.ImageVector) {
            if (src instanceof ol.source.ImageVector) {
              src = src.getSource();
            }
            encLayer = $scope.encoders.layers['Vector'].call(this, layer,
                src.getFeatures());
          }
        }
      }

      if ($scope.options.legend && layerConfig.hasLegend) {
        encLegend = $scope.encoders.legends['ga_urllegend'].call(this, layer,
            layerConfig);

        if (encLegend.classes && encLegend.classes[0] &&
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
              var enc = $scope.encoders.layers['Layer'].call(this, layer);
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
          var enc = $scope.encoders.layers['Layer'].call(this, layer);
          var encStyles = {};
          var encFeatures = [];
          var stylesDict = {};

          // Sort features by geometry type
          var newFeatures = [];
          var polygons = [];
          var lines = [];
          var points = [];

          angular.forEach(features, function(feature) {
            var geotype = feature.getGeometry().getType();
            if (/^(Polygon|MultiPolygon|Circle|GeometryCollection)$/.
                test(geotype)) {
              polygons.push(feature);
            } else if (/^(LineString|MultiLineString)$/.test(geotype)) {
              lines.push(feature);
            } else {
              points.push(feature);
            }
          });
          features = newFeatures.concat(polygons, lines, points);

          angular.forEach(features, function(feature) {
            var encoded = $scope.encoders.features.feature(layer, feature);
            encFeatures = encFeatures.concat(encoded.encFeatures);
            angular.extend(encStyles, encoded.encStyles);
          });
          angular.extend(enc, {
            type: 'Vector',
            styles: encStyles,
            styleProperty: '_gx_style',
            geoJson: {
              type: 'FeatureCollection',
              features: encFeatures
            },
            name: layer.bodId
          });
          return enc;
        },
        'WMS': function(layer, config) {
          var enc = $scope.encoders.layers['Layer'].call(this, layer);
          var source = layer.getSource();
          var params = source.getParams();
          var layers = params.LAYERS.split(',') || [];
          var styles = (params.STYLES !== undefined) ?
              params.STYLES.split(',') :
              new Array(layers.length).join(',').split(',');
          var url = (source.getUrls && source.getUrls()[0]) ||
              (source.getUrl && source.getUrl());

          angular.extend(enc, {
            type: 'WMS',
            baseURL: url.replace(/^\/\//, 'https://'),
            layers: layers,
            styles: styles,
            format: 'image/' + (config.format || 'png'),
            customParams: {
              'EXCEPTIONS': 'XML',
              'TRANSPARENT': 'true',
              'CRS': 'EPSG:21781',
              'TIME': params.TIME,
              'MAP_RESOLUTION': getDpi($scope.layout.name, $scope.dpi)
            },
            singleTile: config.singleTile || false
          });
          return enc;
        },
        'WMTS': function(layer, config) {
          var enc = $scope.encoders.layers['Layer'].call(this, layer);
          var source = layer.getSource();
          var tileGrid = source.getTileGrid();
          if (!config.background && layer.visible && config.timeEnabled) {
            if (!layer.time) {
              return;
            }
            layersYears.push(layer.time);
          }
          angular.extend(enc, {
            type: 'WMTS',
            baseURL: location.protocol + '//wmts.geo.admin.ch',
            layer: config.serverLayerName,
            maxExtent: layer.getExtent(),
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
          var multiPagesPrint = false;
          if (config.timestamps) {
            multiPagesPrint = !config.timestamps.some(function(ts) {
              return ts == '99991231';
            });
          }
          // printing time series
          if (config.timeEnabled && gaTime.get() == undefined &&
              multiPagesPrint) {
            enc['timestamps'] = config.timestamps;
          }

          return enc;
        }
      },
      'features': {
        'feature': function(layer, feature, styles) {
          var encStyles = {};
          var encFeatures = [];
          var encStyle = {
            id: styleId++
          };

          // Get the styles of the feature
          if (!styles) {
            if (feature.getStyleFunction()) {
              styles = feature.getStyleFunction().call(feature);
            } else if (layer.getStyleFunction()) {
              styles = layer.getStyleFunction()(feature);
            } else {
              styles = ol.style.Style.defaultFunction(feature);
            }
          }
          var geometry = feature.getGeometry();
          var styleToEncode;
          if (styles && styles.length > 0) {
            styleToEncode = styles[0];
          }

          // We encode the feature only if the feature has a style.
          if (!styleToEncode) {
            return {
              encFeatures: [],
              encStyles: []
            };
          }

          // Transform an ol.geom.Circle to a ol.geom.Polygon
          if (geometry instanceof ol.geom.Circle) {
            geometry = gaPrintStyle.olCircleToPolygon(geometry);
            feature = new ol.Feature(geometry);
          }

          // Handle ol.style.RegularShape by converting points to polygons
          var image = styleToEncode.getImage();
          if (geometry instanceof ol.geom.Point &&
              image instanceof ol.style.RegularShape &&
              !(image instanceof ol.style.Circle)) {
            var scale = parseFloat($scope.scale.value);
            var resolution = scale / UNITS_RATIO / POINTS_PER_INCH;
            geometry = gaPrintStyle.olPointToPolygon(
              feature.getGeometry(),
              image.getRadius(),
              resolution,
              image.getPoints(),
              image.getRotation()
            );
            feature = new ol.Feature(geometry);
          }

          // Encode a feature if it intersects with the extent and
          // if the map is not rotated

          if (geometry.intersectsExtent(getPrintRectangleCoords())) {
            var encFeature = format.writeFeatureObject(feature);
            if (!encFeature.properties) {
              encFeature.properties = {};
            } else {
             // Fix circular structure to JSON
             // see: https://github.com/geoadmin/mf-geoadmin3/issues/1213
              delete encFeature.properties.Style;
              delete encFeature.properties.overlays;
            }
            encFeature.properties._gx_style = encStyle.id;
            encFeatures.push(encFeature);

            // Encode the style of the feature added
            angular.extend(encStyle, gaPrintStyle.olStyleToPrintLiteral(
                styleToEncode, getDpi($scope.layout.name, $scope.dpi)));

            // Apply the layer's opacity on fill and stroke
            if (encStyle.fillOpacity) {
              encStyle.fillOpacity *= layer.getOpacity();
            }

            if (encStyle.strokeOpacity) {
              encStyle.strokeOpacity *= layer.getOpacity();
            }

            encStyles[encStyle.id] = encStyle;
          }

          // If a feature has a style with a geometryFunction defined, we
          // must also display this geometry with the good style (used for
          // azimuth).
          for (var i = 0; i < styles.length; i++) {
            var style = styles[i];
            if (angular.isFunction(style.getGeometry())) {
              var geom = style.getGeometry()(feature);
              if (geom) {
                var encoded = $scope.encoders.features.feature(layer,
                     new ol.Feature(geom), [style]);
                encFeatures = encFeatures.concat(encoded.encFeatures);
                angular.extend(encStyles, encoded.encStyles);
              }
            }
          }

          return {
            encFeatures: encFeatures,
            encStyles: encStyles
          };
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
                layer.bodId + '_' + $translate.use() + format
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

    var getZoomFromScale = function(scale) {
      var i, len;
      var resolution = scale / UNITS_RATIO / POINTS_PER_INCH;
      var resolutions = gaMapUtils.viewResolutions;
      for (i = 0, len = resolutions.length; i < len; i++) {
        if (resolutions[i] < resolution) {
          break;
        }
      }
      var zoom = Math.max(0, i - 1);

      return zoom;
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
      $scope.options.printsuccess = true;
      if (gaBrowserSniffer.msie == 9) {
        $window.open(url);
      } else {
        $window.location = url;
      }
      //After standard print, download the pdf Legends
      //if there are any
      for (var i = 0; i < pdfLegendsToDownload.length; i++) {
        $window.open(pdfLegendsToDownload[i]);
      }
      $scope.options.printing = false;
    };

    // Abort the print process
    var pollMultiPromise; // Promise of the last $timeout called
    $scope.abort = function() {
      $scope.options.printing = false;
      // Abort the current $http request
      if (canceller) {
        canceller.resolve();
      }
      // Abort the current $timeout
      if (pollMultiPromise) {
        $timeout.cancel(pollMultiPromise);
      }
      // Tell the server to cancel the print process
      if (currentMultiPrintId) {
        $http.get($scope.options.printPath + 'cancel?id=' +
          currentMultiPrintId);
        currentMultiPrintId = null;
      }
    };

    // Start the print process
    $scope.submit = function() {
      if (!$scope.active) {
        return;
      }
      $scope.options.printsuccess = false;
      $scope.options.printing = true;
      $scope.options.progress = '';
      // http://mapfish.org/doc/print/protocol.html#print-pdf
      var view = $scope.map.getView();
      var proj = view.getProjection();
      var lang = $translate.use();
      var defaultPage = {};
      defaultPage['lang' + lang] = true;
      var qrcodeUrl = $scope.options.qrcodeUrl +
          encodeURIComponent(gaPermalink.getHref());
      var print_zoom = getZoomFromScale($scope.scale.value);
      qrcodeUrl = qrcodeUrl.replace(/zoom%3D(\d{1,2})/, 'zoom%3D' + print_zoom);
      var encLayers = [];
      var encLegends;
      var attributions = [];
      var thirdPartyAttributions = [];
      var layers = this.map.getLayers().getArray();
      pdfLegendsToDownload = [];
      layersYears = [];

      // Re order layer by z-index
      layers.sort(function(a, b) {
        return a.getZIndex() - b.getZIndex();
      });

      // Transform layers to literal
      layers.forEach(function(layer) {
        if (!layer.visible || layer.opacity == 0) {
          return;
        }

        // Encode layers
        var encs;
        if (layer instanceof ol.layer.Group) {
          encs = $scope.encoders.layers['Group'].call(this,
              layer, proj);
        } else {
          var enc = encodeLayer(layer, proj);
          if (enc && enc.layer) {
            encs = [enc.layer];
            if (enc.legend) {
              encLegends = encLegends || [];
              encLegends.push(enc.legend);
            }
          }
        }

        if (encs && encs.length) {
          encLayers = encLayers.concat(encs);

          // Add attribution of encoded layers
          var attribution = gaAttribution.getTextFromLayer(layer);
          if (attribution !== undefined) {
            if (layer.useThirdPartyData) {
              if (thirdPartyAttributions.indexOf(attribution) == -1) {
                thirdPartyAttributions.push(attribution);
              }
            } else if (attributions.indexOf(attribution) == -1) {
              attributions.push(attribution);
            }
          }
        }
      });
      if (layersYears) {
        var years = layersYears.reduce(function(a, b) {
          if (a.indexOf(b) < 0) {
            a.push(b);
          }
          return a;
        }, []);
        years = years.map(function(ts) {
          return ts.length > 4 ? ts.slice(0, 4) : ts;
        });
        defaultPage['timestamp'] = years.join(',');
      }

      // Transform graticule to literal
      if ($scope.options.graticule) {
        var graticule = {
          'baseURL': 'https://wms.geo.admin.ch/',
          'opacity': 1,
          'singleTile': true,
          'type': 'WMS',
          'layers': ['org.epsg.grid_2056'],
          'format': 'image/png',
          'styles': [''],
          'customParams': {
            'TRANSPARENT': true,
            'MAP_RESOLUTION': getDpi($scope.layout.name, $scope.dpi)
          }
        };
        encLayers.push(graticule);
      }

      // Transform overlays to literal
      // FIXME this is a temporary solution
      var overlays = $scope.map.getOverlays();
      var resolution = $scope.map.getView().getResolution();

      overlays.forEach(function(overlay) {
        var elt = overlay.getElement();
        // We print only overlay added by the MarkerOverlayService
        // or by crosshair permalink
        if ($(elt).hasClass('popover')) {
          return;
        }
        var center = overlay.getPosition();
        var offset = 5 * resolution;

        if (center) {
          var style = 1, $elt = $(elt);
          if ($elt.text()) {
             style = 2;
             if ($elt.hasClass('ga-draw-measure-tmp')) {
               style = 3;
             }
          }
          var encOverlayLayer = {
            'type': 'Vector',
            'styles': {
              '1': { // Style for marker position
                'externalGraphic':
                  gaUrlUtils.nonCloudFrontUrl($scope.options.markerUrl),
                'graphicWidth': 20,
                'graphicHeight': 30,
                // the icon is not perfectly centered in the image
                // these values must be the same in map.less
                'graphicXOffset': -12,
                'graphicYOffset': -30
              }, '2': { // Style for measure tooltip
                'externalGraphic':
                  gaUrlUtils.nonCloudFrontUrl($scope.options.bubbleUrl),
                'graphicWidth': 97,
                'graphicHeight': 27,
                'graphicXOffset': -48,
                'graphicYOffset': -27,
                'label': $elt.text(),
                'labelXOffset': 0,
                'labelYOffset': 18,
                'fontColor': '#ffffff',
                'fontSize': 10,
                'fontWeight': 'normal'
              }, '3': { // Style for intermeediate measure tooltip
                'label': $elt.text(),
                'labelXOffset': 0,
                'labelYOffset': 18,
                'fontColor': '#ffffff',
                'fontSize': 8,
                'fontWeight': 'normal',
                'fillColor': '#ff0000',
                'strokeColor': '#ff0000'
              }

            },
            'styleProperty': '_gx_style',
            'geoJson': {
              'type': 'FeatureCollection',
              'features': [{
                'type': 'Feature',
                'properties': {
                  '_gx_style': style
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
          encLayers.push(encOverlayLayer);
        }
      });


      // Get the short link
      var shortLink;
      canceller = $q.defer();
      gaUrlUtils.shorten(gaPermalink.getHref(), canceller.promise)
          .then(function(shortUrl) {
        shortLink = shortUrl.replace('/shorten', '');

        // Build the complete json then send it to the print server
        if (!$scope.options.printing) {
          return;
        }

        // Build the correct copyright text to display
        var dataOwner = attributions.join();
        var thirdPartyDataOwner = thirdPartyAttributions.join();
        if (dataOwner && thirdPartyDataOwner) {
          dataOwner = '© ' + dataOwner + ',';
        } else if (!dataOwner && thirdPartyDataOwner) {
          thirdPartyDataOwner = '© ' + thirdPartyDataOwner;
        } else if (dataOwner && !thirdPartyDataOwner) {
          dataOwner = '© ' + dataOwner;
          thirdPartyDataOwner = false;
        }
        var movieprint = $scope.options.movie && $scope.options.multiprint;
        var spec = {
          layout: $scope.layout.name,
          srs: proj.getCode(),
          units: proj.getUnits() || 'm',
          rotation: -((view.getRotation() * 180.0) / Math.PI),
          app: 'config',
          lang: lang,
          //use a function to get correct dpi according to layout (A4/A3)
          dpi: getDpi($scope.layout.name, $scope.dpi),
          layers: encLayers,
          legends: encLegends,
          enableLegends: (encLegends && encLegends.length > 0),
          qrcodeurl: qrcodeUrl,
          movie: movieprint,
          pages: [
            angular.extend({
              center: getPrintRectangleCenterCoord(),
              bbox: getPrintRectangleCoords(),
              display: [$scope.layout.map.width, $scope.layout.map.height],
              // scale has to be one of the advertise by the print server
              scale: $scope.scale.value,
              dataOwner: dataOwner,
              thirdPartyDataOwner: thirdPartyDataOwner,
              shortLink: shortLink || '',
              rotation: -((view.getRotation() * 180.0) / Math.PI)
            }, defaultPage)
          ]
        };
        var startPollTime;
        var pollErrors;
        var pollMulti = function(url) {
          pollMultiPromise = $timeout(function() {
            if (!$scope.options.printing) {
              return;
            }
            canceller = $q.defer();
            var http = $http.get(url, {
               timeout: canceller.promise
            }).then(function(response) {
              var data = response.data;
              if (!$scope.options.printing) {
                return;
              }
              if (!data.getURL) {
                // Write progress using the following logic
                // First 60% is pdf page creationg
                // 60-70% is merging of pdf
                // 70-100% is writing of resulting pdf
                if (data.filesize) {
                  var written = data.written || 0;
                  $scope.options.progress =
                      (70 + Math.floor(written * 30 / data.filesize)) +
                      '%';
                } else if (data.total) {
                  if (angular.isDefined(data.merged)) {
                    $scope.options.progress =
                        (60 + Math.floor(data.done * 10 / data.total)) +
                        '%';
                  } else if (angular.isDefined(data.done)) {
                    $scope.options.progress =
                        Math.floor(data.done * 60 / data.total) + '%';
                  }
                }

                var now = new Date();
                //We abort if we waited too long
                if (now - startPollTime < POLL_MAX_TIME) {
                  pollMulti(url);
                } else {
                  $scope.options.printing = false;
                }
              } else {
                $scope.downloadUrl(data.getURL);
              }
            }, function() {
              if ($scope.options.printing == false) {
                pollErrors = 0;
                return;
              }
              pollErrors += 1;
              if (pollErrors > 2) {
                $scope.options.printing = false;
              } else {
                pollMulti(url);
              }
            });
          }, POLL_INTERVAL, false);
        };

        var printUrl = $scope.capabilities.createURL;
        //When movie is on, we use printmulti
        if (movieprint) {
          printUrl = printUrl.replace('/print/', '/printmulti/');
        }
        canceller = $q.defer();
        var http = $http.post(printUrl + '?url=' + encodeURIComponent(printUrl),
          spec, {
          timeout: canceller.promise
        }).then(function(response) {
          var data = response.data;
          if (movieprint) {
            //start polling process
            var pollUrl = $scope.options.printPath + 'progress?id=' +
                data.idToCheck;
            currentMultiPrintId = data.idToCheck;
            startPollTime = new Date();
            pollErrors = 0;
            pollMulti(pollUrl);
          } else {
            $scope.downloadUrl(data.getURL);
          }
        }, function() {
          $scope.options.printing = false;
        });
      });
    };

    var getDpi = function(layoutName, dpiConfig) {
      if (/a4/i.test(layoutName) && dpiConfig.length > 1) {
        return dpiConfig[1].value;
      } else {
        return dpiConfig[0].value;
      }
    };

    var getPrintRectangleCoords = function() {
      // Framebuffer size!!
      var displayCoords = printRectangle.map(function(c) {
          return c / ol.has.DEVICE_PIXEL_RATIO});
      // PrintRectangle coordinates have top-left as origin
      var bottomLeft = $scope.map.getCoordinateFromPixel([displayCoords[0],
          displayCoords[3]]);
      var topRight = $scope.map.getCoordinateFromPixel([displayCoords[2],
          displayCoords[1]]);
      //
      var topLeft = $scope.map.getCoordinateFromPixel([displayCoords[0],
          displayCoords[1]]);
      var bottomRight = $scope.map.getCoordinateFromPixel([displayCoords[2],
          displayCoords[3]]);

      // Always returns an extent [minX, minY, maxX, maxY]
      var printPoly = new ol.geom.Polygon([[bottomLeft, topLeft, topRight,
          bottomRight, bottomLeft]]);

      return printPoly.getExtent();
    };

    var getPrintRectangleCenterCoord = function() {
      // Framebuffer size!!
      var rect = getPrintRectangleCoords();

      var centerCoords = [rect[0] + (rect[2] - rect[0]) / 2.0,
          rect[1] + (rect[3] - rect[1]) / 2.0];

      return centerCoords;
    };

    var updatePrintRectanglePixels = function(scale) {
      if ($scope.active) {
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
          s / resolution * ol.has.DEVICE_PIXEL_RATIO;
      var h = size.height / POINTS_PER_INCH * MM_PER_INCHES / 1000.0 *
          s / resolution * ol.has.DEVICE_PIXEL_RATIO;
      var mapSize = $scope.map.getSize();
      var center = [mapSize[0] * ol.has.DEVICE_PIXEL_RATIO / 2 ,
          mapSize[1] * ol.has.DEVICE_PIXEL_RATIO / 2];

      var minx, miny, maxx, maxy;

      minx = center[0] - (w / 2);
      miny = center[1] - (h / 2);
      maxx = center[0] + (w / 2);
      maxy = center[1] + (h / 2);
      return [minx, miny, maxx, maxy];
    };

    $scope.layers = $scope.map.getLayers().getArray();
    $scope.layerFilter = function(layer) {
      return layer.bodId == 'ch.swisstopo.zeitreihen' && layer.visible;
    };
    $scope.$watchCollection('layers | filter:layerFilter', function(lrs) {
      $scope.options.multiprint = (lrs.length == 1);
    });

    $scope.$watch('active', function(newVal, oldVal) {
      if (newVal === true) {
        if (!$scope.printConfigLoaded) {
          loadPrintConfig().then(function(response) {
            var data = response.data;
            $scope.capabilities = data;
            angular.forEach($scope.capabilities.layouts, function(lay) {
              lay.stripped = lay.name.substr(2);
            });

            // default values:
            $scope.layout = data.layouts[0];
            $scope.dpi = data.dpis;
            $scope.scales = data.scales;
            $scope.scale = data.scales[5];
            $scope.options.legend = false;
            $scope.options.graticule = false;
            activate();
            $scope.printConfigLoaded = true;
          });
        } else {
          activate();
        }
      } else {
        deactivate();
      }
    });

    // Because of the polling mechanisms, we can't rely on the
    // waitcursor from the NetworkStatusService. Multi-page
    // print might be underway without pending http request.
    $scope.$watch('options.printing', function(newVal, oldVal) {
      if (newVal === true) {
        gaWaitCursor.increment();
      } else {
        gaWaitCursor.decrement();
      }
    });


  });

  module.directive('gaPrint',
    function(gaBrowserSniffer) {
      return {
        restrict: 'A',
        scope: {
          map: '=gaPrintMap',
          options: '=gaPrintOptions',
          active: '=gaPrintActive'
        },
        templateUrl: 'components/print/partials/print.html',
        controller: 'GaPrintDirectiveController',
        link: function(scope, elt, attrs, controller) {
          scope.isIE = gaBrowserSniffer.msie;
        }
      };
    }
  );
})();
