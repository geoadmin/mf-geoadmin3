goog.provide('ga_tabs_directive');

(function() {

  var module = angular.module('ga_tabs_directive', []);

  module.controller('GaTabsController', function($scope) {
    $scope.tabs = [];

    this.addTab = function(tab) {
      $scope.tabs.push(tab);

      if ($scope.tabs.length == 1) {
        tab.active = true;
      }
    };
  });

  module.directive('gaTabs', function() {
    return {
      restrict: 'A',
      transclude: true,
      templateUrl: 'components/tabs/partials/tabs.html',
      controller: 'GaTabsController',
      scope: {},
      link: function(scope, elt) {
        elt.addClass('tabbable');

        scope.activeTab = function(tab) {
          scope.tabs.forEach(function(t) {
            t.active = false;
          });
          tab.active = true;
        };
      }
    };
  });
})();
