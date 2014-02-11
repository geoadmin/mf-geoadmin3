(function() {
  goog.provide('ga_fullscreen_directive');

  var module = angular.module('ga_fullscreen_directive', []);

  module.directive('gaFullscreen', function() {
    return {
      restrict: 'A',
      scope: {
        map: '=gaFullscreenMap'
      },
      template: "<a href='#' ng-click='click()' translate>full_screen</a>",
      link: function(scope, element, attrs) {
        scope.click = function() {
          var target = scope.map.getTarget();
          if (target.requestFullScreen) {
            target.requestFullScreen();
          } else if (target.mozRequestFullScreen) {
            target.mozRequestFullScreen();
          } else if (target.webkitRequestFullScreen) {
            target.webkitRequestFullScreen();
          }
        };
      }
    };
  });
})();
