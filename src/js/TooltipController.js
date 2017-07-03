goog.provide('ga_tooltip_controller');
(function() {

  var module = angular.module('ga_tooltip_controller', []);

  module.controller('GaTooltipController', function($scope, gaGlobalOptions) {
    $scope.options = {
      tolerance: 15,
      htmlUrlTemplate: gaGlobalOptions.cachedApiUrl +
          '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup'
    };
  });
})();
