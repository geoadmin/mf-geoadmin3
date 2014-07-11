(function() {
  goog.provide('ga_tooltip_controller');

  var module = angular.module('ga_tooltip_controller', []);

  module.controller('GaTooltipController',
      function($scope, gaGlobalOptions, gaBrowserSniffer) {

        $scope.options = {
          tolerance: gaBrowserSniffer.touchDevice ? 15 : 5,
          identifyUrlTemplate: gaGlobalOptions.apiUrl + '/rest/services/{Topic}/MapServer/identify',
          htmlUrlTemplate: gaGlobalOptions.cachedApiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup'
        };
      });
})();
