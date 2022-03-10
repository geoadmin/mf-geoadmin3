goog.provide('ga_tooltip_controller');

goog.require('ga_window_service');

(function() {

  var module = angular.module('ga_tooltip_controller', [
    'ga_window_service'
  ]);

  module.controller('GaTooltipController', function($scope, gaGlobalOptions,
      gaWindow) {
    $scope.options = {
      tolerance: gaWindow.isWidth('<=s') ? 20 : 10,
      htmlUrlTemplate: gaGlobalOptions.apiUrl +
          '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup'
    };
  });
})();
