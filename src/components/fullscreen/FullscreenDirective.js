(function() {
  goog.provide('ga_fullscreen_directive');

  var module = angular.module('ga_fullscreen_directive', ['ga_permalink']);

  module.directive('gaFullscreen', function(gaPermalink) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaFullscreenMap'
      },
      template: "<a href='#' ng-if='fullscreenSupported' " +
        "ng-click='click()' translate>full_screen</a>",
      link: function(scope, element, attrs) {
        // Use the documentElement element in order to check if the
        // Fullscreen API is usable
        // Documentation about Fullscreen API flavours:
        // https://docs.google.com/spreadsheet/
        //  ccc?key=0AvgmqEgDEiu5dGtqVEUySnBvNkxiYlAtbks1eDFibkE#gid=0
        var docElm = document.documentElement;
        scope.fullscreenSupported = (docElm.requestFullScreen ||
          docElm.mozRequestFullScreen ||
          docElm.webkitRequestFullScreen ||
          docElm.msRequestFullscreen
        );
        document.addEventListener('fullscreenchange', function(evt) {
          scope.onFullscreenChange();
        });
        document.addEventListener('mozfullscreenchange', function(evt) {
          scope.onFullscreenChange();
        });
        document.addEventListener('webkitfullscreenchange', function(evt) {
          scope.onFullscreenChange();
        });
        document.addEventListener('msfullscreenchange', function(evt) {
          scope.onFullscreenChange();
        });
        scope.click = function() {
          var target = scope.map.getTarget();
          if (target.requestFullScreen) {
            target.requestFullScreen();
          } else if (target.mozRequestFullScreen) {
            target.mozRequestFullScreen();
          } else if (target.webkitRequestFullScreen) {
            target.webkitRequestFullScreen();
          } else if (target.msRequestFullscreen) {
            target.msRequestFullscreen();
          }
        };
        scope.onFullscreenChange = function() {
          // Bug in Safari
          scope.map.updateSize();
          var target = scope.map.getTarget();
          if (!(document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement)) {
            gaPermalink.refresh();
          }
        };
      }
    };
  });
})();
