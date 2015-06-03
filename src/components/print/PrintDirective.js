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

    $scope.options.printUrl = 'http://print.local';
    $scope.options.printConfigUrl = $scope.options.printUrl + '/geoportailv3/capabilities.json';

    var print = ngeoCreatePrint($scope.options.printUrl);
    var printConfigLoaded = false;

    // Get print config
    var updatePrintConfig = function() {
      canceller = $q.defer();
      var http = $http.get($scope.options.printConfigUrl, {
        timeout: canceller.promise
      }).success(function(data) {
        $scope.capabilities = data;

        angular.forEach($scope.capabilities.layouts, function(lay) {
          lay.stripped = lay.name.substr(2);
        });

        // default values:
        $scope.layout = data.layouts[0];
        $scope.dpis = $scope.layout.attributes[4].clientInfo.dpiSuggestions;
        $scope.dpi = $scope.dpis[0];
        $scope.scales = $scope.layout.attributes[4].clientInfo.scales;
        $scope.scale = $scope.scales[0];
        $scope.options.legend = false;
        $scope.options.graticule = false;
      });
    };

    $scope.submit = function() {
      var map = $scope.map;
      var mapSize = map.getSize();
      var viewResolution = map.getView().getResolution();

      $scope.printState = 'Printing...';

      var url = $window.location.toString();
      var spec = print.createSpec(map, $scope.scale, $scope.dpi, $scope.layout.name, {
        name: 'Ma super carte',
        qrimage: $scope.options.qrcodeUrl + encodeURIComponent(url),
        url: url,
        scale: $scope.scale
      });

      print.createReport(spec).then(
              handleCreateReportSuccess,
              handleCreateReportError);
    };

    function handleCreateReportSuccess(resp) {
      getStatus(resp.data.ref);
    }

    function getStatus(ref) {
      print.getStatus(ref).then(
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
        $scope.printState = '';
        $window.location.href = print.getReportUrl(ref);
      } else {
        $timeout(function() {
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

    // Listeners
    $scope.$on('gaTopicChange', function(event, topic) {
      if (!printConfigLoaded) {
        updatePrintConfig();
        printConfigLoaded = true;
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