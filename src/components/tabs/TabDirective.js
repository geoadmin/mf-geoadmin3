goog.provide('ga_tab_directive');

goog.require('ga_tabs_directive');

(function() {

  var module = angular.module('ga_tab_directive', []);

  module.directive('gaTab', function() {
    return {
      restrict: 'A',
      transclude: true,
      require: '^gaTabs',
      templateUrl: 'components/tabs/partials/tab.html',
      scope: {
        title: '@gaTabTitle'
      },
      link: function(scope, elt, attrs, tabsCtrl) {
        elt.addClass('tab-pane');
        scope.active = false;
        tabsCtrl.addTab(scope);
      }
    };
  });
})();
