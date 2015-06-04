(function() {
  goog.provide('ga_print_directive');

  goog.require('ngeo_create_print');
  goog.require('ngeo_print_utils');

  var module = angular.module('ga_print_directive',
          ['ngeo_create_print',
            'ngeo_print_utils'
          ]);

  module.controller('GaPrintDirectiveController', function($scope,
          $window, $timeout, $q, $http,
          ngeoCreatePrint, ngeoPrintUtils) {

    var canceler;
    var print = ngeoCreatePrint($scope.options.printPath);
    var printConfigLoaded = false;
    var deregister = [];
    var POINTS_PER_INCH = 72; //PostScript points 1/72"
    var MM_PER_INCHES = 25.4;

    // Get print config
    var updatePrintConfig = function() {
      canceler = $q.defer();
      var http = $http.get($scope.options.printConfigUrl, {
        timeout: canceler.promise
      }).success(function(data) {
        $scope.capabilities = data;
        $scope.layouts = [];

        angular.forEach($scope.capabilities.layouts, function(layout) {
          var clientInfo = layout.attributes[4].clientInfo;
          $scope.layouts.push({
            name: layout.name,
            scales: clientInfo.scales.reverse(),
            paperSize: [clientInfo.width, clientInfo.height],
            dpis: clientInfo.dpiSuggestions
          });
        });

        // default values:
        $scope.layout = $scope.layouts[0];
        $scope.dpi = $scope.layout.dpis[0];
        var mapSize = $scope.map.getSize();
        var mapResolution = $scope.map.getView().getResolution();
        $scope.scale = ngeoPrintUtils.getOptimalScale(mapSize, mapResolution,
                $scope.layout.paperSize, $scope.layout.scales);
        $scope.options.legend = false;
        $scope.options.graticule = false;
      });
    };

    var activate = function() {
      deregister = [
        $scope.map.on('postcompose', handlePostCompose)
      ];
      var mapSize = $scope.map.getSize();
      var viewResolution = $scope.map.getView().getResolution();
      $scope.scale = ngeoPrintUtils.getOptimalScale(mapSize, viewResolution,
          $scope.layout.paperSize, $scope.layout.scales);
      refreshComp();
    };

    var calculatePageBoundsPixels = function(scale) {
      var s = parseFloat(scale.value);
      var size = $scope.layout.paperSize; // papersize in dot!
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

    var deactivate = function() {
      if (deregister) {
        for (var i = 0; i < deregister.length; i++) {
          ol.Observable.unByKey(deregister[i]);
        }
      }
      refreshComp();
    };

    var refreshComp = function () {
      if ($scope.options.active) {
        printRectangle = calculatePageBoundsPixels($scope.scale);
        $scope.map.render();
      }
      $scope.map.render();
    };

    // Compose events
    var handlePostCompose = ngeoPrintUtils.createPrintMaskPostcompose(
      /**
       * @return {ol.Size} Size in dots of the map to print.
       */
      function() {
        return $scope.layout.paperSize;
      },
      /**
       * @param {olx.FrameState} frameState Frame state.
       * @return {number} Scale of the map to print.
       */
      function() {
        return $scope.scale;
      });

    var printReportTimeout;
    $scope.submit = function() {
      var map = $scope.map;

      $scope.options.printing = true;
      $scope.options.printsuccess = false;

      var url = $window.location.toString();
      var spec = print.createSpec(map , $scope.scale, $scope.dpi, $scope.layout.name, {
        name: 'Ma super carte',
        qrimage: $scope.options.qrcodeUrl + encodeURIComponent(url),
        url: url,
        scale: $scope.scale
      });

      canceler = $q.defer();
      print.createReport(spec, {timeout: canceler.promise}).then(
              handleCreateReportSuccess,
              handleCreateReportError);
    };

    function handleCreateReportSuccess(resp) {
      getStatus(resp.data.ref);
    }

    function getStatus(ref) {
      canceler = $q.defer();
      print.getStatus(ref, {timeout: canceler.promise}).then(
              function(resp) {
                handleGetStatusSuccess(ref, resp);
              },
              handleGetStatusError
              );
    }

    function handleGetStatusSuccess(ref, resp) {
      var mfResp = resp.data;
      var done = mfResp.done;
      if (done) {
        $scope.options.printing = false;
        $scope.options.printsuccess = true;
        $window.location.href = print.getReportUrl(ref);
      } else {
        printReportTimeout = $timeout(function() {
          getStatus(ref);
        }, 1000, false);
      }
    }

    function handleGetStatusError() {
      $scope.printState = 'print error';
    }

    function handleCreateReportError() {
      $scope.printState = 'print error';
    }

     // Abort the print process
    $scope.abort = function() {
      $scope.options.printing = false;
      // Abort the current $http request
      if (canceler) {
        canceler.resolve();
      }
      $timeout.cancel(printReportTimeout);
    };

    // Listeners
    $scope.$on('gaTopicChange', function(event, topic) {
      if (!printConfigLoaded) {
        updatePrintConfig();
        printConfigLoaded = true;
      }
    });
        // Listeners
    $scope.$on('gaLayersChange', function() {
      refreshComp();
    });
    $scope.map.on('change:size', function() {
      refreshComp();
    });
    $scope.$watch('scale', function() {
      refreshComp();
    });
    $scope.$watch('layout', function() {
      refreshComp();
    });
    $scope.$watch('options.active', function(newVal) {
      if (newVal === true) {
        activate();
      } else {
        deactivate();
      }
    });
  });

  module.directive('gaPrint',
          function() {
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