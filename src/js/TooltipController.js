(function() {
  goog.provide('ga_tooltip_controller');

  var module = angular.module('ga_tooltip_controller', []);

  module.controller('GaTooltipController',
      function($scope, gaGlobalOptions, gaBrowserSniffer) {

        var baseUrl = gaGlobalOptions.serviceUrl + '/rest/services';

        $scope.options = {
          tolerance: gaBrowserSniffer.touchDevice ? 15 : 5,
          identifyUrlTemplate: baseUrl + '/{Topic}/MapServer/identify',
          htmlUrlTemplate: baseUrl + '/{Topic}/MapServer/{Layer}/{Feature}/htmlpopup'
        };
      });
})();
