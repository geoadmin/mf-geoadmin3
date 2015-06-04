(function() {
  goog.provide('ga_print_directive');

  goog.require('ngeo.Print');
  goog.require('ngeo.PrintUtils');

  var module = angular.module('ga_print_directive', ['ngeo']);

  module.controller('GaPrintDirectiveController', function($scope,
          $window, $timeout, $q, $http,
          ngeoCreatePrint, ngeoPrintUtils) {

    $scope.printError = false;

    var canceler;
    var print = ngeoCreatePrint($scope.options.printPath);
    var printConfigLoaded = false;
    var deregister = [];

    // Get print config
    var updatePrintConfig = function(data) {
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

      printConfigLoaded = true;
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

    var refreshComp = function() {
      $scope.map.render();
    };

    var deactivate = function() {
      if (deregister) {
        for (var i = 0; i < deregister.length; i++) {
          ol.Observable.unByKey(deregister[i]);
        }
      }
      refreshComp();
    };

    var printReportTimeout;
    $scope.submit = function() {
      var map = $scope.map;

      $scope.options.printing = true;
      $scope.options.printsuccess = false;

      var url = $window.location.toString();
      var spec = print.createSpec(map, $scope.scale, $scope.dpi,
        $scope.layout.name, {
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

    var handleCreateReportSuccess = function(resp) {
      getStatus(resp.data.ref);
    };

    var getStatus = function(ref) {
      canceler = $q.defer();
      print.getStatus(ref, {timeout: canceler.promise}).then(
              function(resp) {
                handleGetStatusSuccess(ref, resp);
              },
              handleGetStatusError
              );
    };

    var handleGetStatusSuccess = function(ref, resp) {
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
    };

    var handleGetStatusError = function() {
      handlePrintError();
    };

    var handlePrintError = function() {
      $scope.options.printsuccess = false;
      $scope.options.printing = false;
      $scope.printError = true;
    };

    var handleCreateReportError = function() {
      handlePrintError();
    };

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
      canceler = $q.defer();
      if (!printConfigLoaded) {
        print.getCapabilities({timeout: canceler.promise})
                .success(updatePrintConfig)
                .error(handlePrintError);
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