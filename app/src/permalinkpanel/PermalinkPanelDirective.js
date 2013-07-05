(function() {
  goog.provide('ga_permalinkpanel_directive');

  var module = angular.module('ga_permalinkpanel_directive', []);

  module.directive('gaPermalinkPanel',
      ['gaPermalink',
        function(gaPermalink) {
          return {
            restrict: 'A',
            scope: {
              map: '=gaPermalinkPanelMap'
            },
            templateUrl: 'src/permalinkpanel/partials/panel.html',
            link: function(scope, element, attrs) {
              scope.permalinkvalue = 'test';
            }
          };
        }]);
})();
