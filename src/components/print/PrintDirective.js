goog.provide('ga_print_directive');

goog.require('ga_attribution_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_printlayer_service');
goog.require('ga_translation_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_print_directive', [
    'ga_browsersniffer_service',
    'pascalprecht.translate',
    'ga_printlayer_service',
    'ga_attribution_service',
    'ga_maputils_service',
    'ga_layers_service',
    'ga_urlutils_service',
    'ga_translation_service'
  ]);

  module.controller('GaPrintDirectiveController', function($scope,
      $http, $q, $window, $translate, $timeout, gaLayers, gaMapUtils,
      gaPermalink, gaBrowserSniffer, gaWaitCursor, gaLang,
      gaPrintLayer, gaAttribution, gaUrlUtils) {
    var pdfLegendString = '_big.pdf';
    var printRectangle;
    var deregister = [];
    var POINTS_PER_INCH = 72; // PostScript points 1/72"
    var MM_PER_INCHES = 25.4;
    var UNITS_RATIO = 39.37; // inches per meter
    var POLL_INTERVAL = 2000; // interval for multi-page prints (ms)
    var POLL_MAX_TIME = 600000; // ms (10 minutes)
    var layersYears = [];
    var canceller;
    var currentMultiPrintId;

    $scope.isIE = gaBrowserSniffer.msie;
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
      while ((item = deregister.pop())) {
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

    $scope.downloadUrl = function(url, pdfLegendsToDownload) {
      $scope.options.printsuccess = true;
      if (gaBrowserSniffer.msie === 9) {
        $window.open(url);
      } else {
        $window.location = url;
      }
      // After standard print, download the pdf Legends
      // if there are any
      for (var i = 0; i < pdfLegendsToDownload.length; i++) {
        $window.open(pdfLegendsToDownload[i]);
      }
      $scope.options.printing = false;
    };

    // Abort the print process
    var pollMultiPromise; // Promise of the last $timeout called
    var pollMulti = function(url, startPollTime, pollErrors,
        pdfLegendsToDownload) {
      pollMultiPromise = $timeout(function() {

        if (!$scope.options.printing) {
          return;
        }
        var noCacheUrl = url;
        if ([9, 10, 11].indexOf(gaBrowserSniffer.msie) !== -1) {
          // #3937: Avoid caching of the request by IE9
          noCacheUrl += '&' + (new Date()).getTime();
        }
        canceller = $q.defer();
        $http.get(noCacheUrl, {
          timeout: canceller.promise
        }).then(function(response) {
          var data = response.data;
          if (!$scope.options.printing) {
            return;
          }
          if (data.status === 'failed') {
              $scope.options.printing = false;
              return;
          }
          if (data.status === 'ongoing' || data.status === 'done') {
            if (!data.getURL) {
              // Write progress using the following logic
              // First 60% is pdf page creationg
              // 60-70% is merging of pdf
              // 70-100% is writing of resulting pdf
              if (data.filesize) {
                var written = data.written || 0;
                $scope.options.progress =
                    (70 + Math.floor(written * 30 / data.filesize)) + '%';
              } else if (data.total) {
                if (angular.isDefined(data.merged)) {
                  $scope.options.progress =
                      (60 + Math.floor(data.done * 10 / data.total)) + '%';
                } else if (angular.isDefined(data.done)) {
                  $scope.options.progress =
                      Math.floor(data.done * 60 / data.total) + '%';
                }
              }
              var now = new Date();
              // We abort if we waited too long
              if (now - startPollTime < POLL_MAX_TIME) {
                pollMulti(url, startPollTime, pollErrors, pdfLegendsToDownload);
              } else {
                $scope.options.printing = false;
              }
            } else {
              $scope.downloadUrl(data.getURL, pdfLegendsToDownload);
            }
          } else {
            $scope.options.printing = false;
          }
        }, function() {
          if ($scope.options.printing === false) {
            return;
          }
          pollErrors += 1;
          if (pollErrors > 2) {
            $scope.options.printing = false;
          } else {
            pollMulti(url, startPollTime, pollErrors, pdfLegendsToDownload);
          }
        });
      }, POLL_INTERVAL, false);
    };

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
      var lang = gaLang.get();
      var defaultPage = {};
      defaultPage['lang' + lang] = true;
      var qrcodeUrl = $scope.options.qrcodeUrl +
          encodeURIComponent(gaPermalink.getHref());
      var printZoom = getZoomFromScale($scope.scale.value);
      qrcodeUrl = qrcodeUrl.replace(/zoom%3D(\d{1,2})/, 'zoom%3D' + printZoom);
      var encLayers = [];
      var encLegends = [];
      var attributions = [];
      var thirdPartyAttributions = [];
      var pdfLegendsToDownload = [];
      var layers = this.map.getLayers().getArray();
      layersYears = [];

      var dpi = getDpi($scope.layout.name, $scope.dpi);
      var scaleDenom = parseFloat($scope.scale.value);
      var printRectangeCoords = getPrintRectangleCoords();
      var resolution = $scope.map.getView().getResolution();

      // Re order layer by z-index
      layers.sort(function(a, b) {
        return a.getZIndex() - b.getZIndex();
      });

      // Transform layers to literal
      var msg = '';
      layers.forEach(function(layer) {

        if (!layer.visible || layer.opacity === 0) {
          return;
        }
        // Only print layer which have an extent intersecting the print extent
        if (!ol.extent.intersects(layer.getExtent() || gaMapUtils.defaultExtent,
            getPrintRectangleCoords())) {
          return;
        }
        // layer not having the same projection as the map, won't be printed
        // layer without explicit projection are assumed default
        // TODO: issue a warning for the user
        if (layer.getSource && layer.getSource().getProjection) {
          var layerProj = layer.getSource().getProjection();
          if (layerProj && layerProj.getCode() !== proj.getCode()) {
            msg = msg + '\n' + layer.label;
            return;
          }
        }
        // Encode layers
        var encs, encLegend;
        if (layer instanceof ol.layer.Group) {
          encs = gaPrintLayer.encodeGroup(layer, proj, scaleDenom,
              printRectangeCoords, resolution, dpi);
        } else {
          var layerConfig = gaLayers.getLayer(layer.bodId) || {};
          var enc = gaPrintLayer.encodeLayer(layer, proj, scaleDenom,
              printRectangeCoords, resolution, dpi);

          if (layerConfig.timeEnabled && layer.time) {
            layersYears.push(layer.time);
          }

          if ($scope.options.legend && layerConfig.hasLegend) {
            encLegend = gaPrintLayer.encodeLegend(layer, layerConfig,
                $scope.options);
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
          enc.legend = encLegend;

          if (enc && enc.layer) {
            encs = [enc.layer];
            if (enc.legend) {
              encLegends.push(enc.legend);
            }
          }
        }

        if (encs && encs.length) {
          encLayers = encLayers.concat(encs);

          // Add attribution of encoded layers
          var attribution = gaAttribution.getTextFromLayer(layer);
          if (attribution) {
            if (layer.useThirdPartyData) {
              if (thirdPartyAttributions.indexOf(attribution) === -1) {
                thirdPartyAttributions.push(attribution);
              }
            } else if (attributions.indexOf(attribution) === -1) {
              attributions.push(attribution);
            }
          }
        }
      });

      // Display alert message
      if (msg) {
        msg = $translate.instant('layer_cant_be_printed') + msg;
        $window.alert(msg);
      }

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
        var graticule = gaPrintLayer.encodeGraticule(dpi);
        encLayers.push(graticule);
      }

      // Transform overlays to literal
      // FIXME this is a temporary solution
      var overlays = $scope.map.getOverlays();

      // On OL, overlays which stop events are displayed on top of overlays
      // which don't. So we need to do the same for the print to keep order of
      // display.
      var ovStop = [];
      var ov = [];
      overlays.forEach(function(overlay) {
        var encOverlayLayer = gaPrintLayer.encodeOverlay(overlay,
            resolution, $scope.options);

        if (encOverlayLayer) {
          var container = $(overlay.getElement()).parent().parent();
          if (container.hasClass('ol-overlaycontainer-stopevent')) {
            ovStop.push(encOverlayLayer);
          } else {
            ov.push(encOverlayLayer);
          }
        }
      });
      encLayers = encLayers.concat(ov, ovStop);

      // Get the short link
      var shortLink;
      canceller = $q.defer();
      gaUrlUtils.shorten(gaPermalink.getHref(), canceller.promise).
          then(function(shortUrl) {
            shortLink = shortUrl.replace('/shorten', '');

            // Build the complete json then send it to the print server
            if (!$scope.options.printing) {
              return;
            }

            // Build the correct copyright text to display
            var allDataOwner = attributions.concat(thirdPartyAttributions);
            allDataOwner = allDataOwner.join(', ');
            var movieprint = $scope.options.movie && $scope.options.multiprint;
            var spec = {
              layout: $scope.layout.name,
              srs: proj.getCode(),
              units: proj.getUnits() || 'm',
              rotation: -((view.getRotation() * 180.0) / Math.PI),
              app: 'config',
              lang: lang,
              // use a function to get correct dpi according to layout (A4/A3)
              dpi: getDpi($scope.layout.name, $scope.dpi),
              layers: encLayers,
              legends: encLegends,
              enableLegends: !!encLegends.length,
              qrcodeurl: qrcodeUrl,
              movie: movieprint,
              pages: [
                angular.extend({
                  center: getPrintRectangleCenterCoord(),
                  bbox: getPrintRectangleCoords(),
                  display: [$scope.layout.map.width, $scope.layout.map.height],
                  // scale has to be one of the advertise by the print server
                  scale: $scope.scale.value,
                  dataOwner: allDataOwner ? '© ' + allDataOwner : '',
                  shortLink: shortLink || '',
                  rotation: -((view.getRotation() * 180.0) / Math.PI)
                }, defaultPage)
              ]
            };

            var printUrl = $scope.capabilities.createURL;
            // When movie is on, we use printmulti
            if (movieprint) {
              printUrl = printUrl.replace('/print/', '/printmulti/');
            }
            canceller = $q.defer();
            $http.post(printUrl + '?url=' + encodeURIComponent(printUrl),
                spec, {
                  timeout: canceller.promise
                }).then(function(response) {
              var data = response.data;
              if (movieprint) {
                // start polling process
                var pollUrl = $scope.options.printPath + 'progress?id=' +
                data.idToCheck;
                currentMultiPrintId = data.idToCheck;
                pollMulti(pollUrl, new Date(), 0, pdfLegendsToDownload);
              } else {
                $scope.downloadUrl(data.getURL, pdfLegendsToDownload);
              }
            }, function(response) {
              if (response.status === 413) {
                var msg = $translate.instant('print_request_too_large');
                $window.alert(msg);
              }
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
        return c / ol.has.DEVICE_PIXEL_RATIO
      });
      // PrintRectangle coordinates have top-left as origin
      var bottomLeft = $scope.map.getCoordinateFromPixel([displayCoords[0],
        displayCoords[3]]);
      var topRight = $scope.map.getCoordinateFromPixel([displayCoords[2],
        displayCoords[1]]);
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
      // The algo below assumes that scales are sorted from
      // biggest (1:500) to smallest (1:2500000)
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
      var center = [mapSize[0] * ol.has.DEVICE_PIXEL_RATIO / 2,
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
      return layer.bodId === 'ch.swisstopo.zeitreihen' && layer.visible;
    };
    $scope.$watchCollection('layers | filter:layerFilter', function(lrs) {
      $scope.options.multiprint = (lrs.length === 1);
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

  module.directive('gaPrint', function() {
    return {
      restrict: 'A',
      scope: {
        map: '=gaPrintMap',
        options: '=gaPrintOptions',
        active: '=gaPrintActive'
      },
      templateUrl: 'components/print/partials/print.html',
      controller: 'GaPrintDirectiveController'
    };
  });
})();
