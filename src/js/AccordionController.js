(function() {
  goog.provide('ga_accordion_controller');

  var module = angular.module('ga_accordion_controller', []);

  module.controller('GaAccordionController',
      function($scope) {

        $scope.catalogPanelOpen = true;
        
      });

})();
