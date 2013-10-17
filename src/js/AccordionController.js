(function() {
  goog.provide('ga_accordion_controller');

  goog.require('ga_permalink');
  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_accordion_controller', [
    'ga_permalink',
    'ga_browsersniffer_service'
  ]);

  module.controller('GaAccordionController',
      function($scope, gaPermalink, gaBrowserSniffer) {

        var params = gaPermalink.getParams();

        $scope.catalogPanelOpen = function() {
          return !gaBrowserSniffer.mobile;
        };

        $scope.layerPanelOpen = function() {
          return !gaBrowserSniffer.mobile &&
                 angular.isDefined(params.layers);
        };
        
      });

})();
