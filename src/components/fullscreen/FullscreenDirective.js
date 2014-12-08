(function() {
  goog.provide('ga_fullscreen_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_permalink');


  var module = angular.module('ga_fullscreen_directive', [
    'ga_browsersniffer_service',
    'ga_permalink'
  ]);

  module.directive('gaFullscreen', function(gaPermalink, gaBrowserSniffer) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaFullscreenMap'
      },
      template: "<a href='#' ng-if='fullscreenSupported' " +
        "ng-click='click()' translate>full_screen</a>",
      link: function(scope, element, attrs) {
        var fullScreenCssClass = 'ga-full-screen';
        var inputsForbidCssClass = 'ga-full-screen-no-inputs';
        // Use the documentElement element in order to check if the
        // Fullscreen API is usable
        // Documentation about Fullscreen API flavours:
        // https://docs.google.com/spreadsheet/
        //  ccc?key=0AvgmqEgDEiu5dGtqVEUySnBvNkxiYlAtbks1eDFibkE#gid=0
        var target = document.documentElement;
        scope.fullscreenSupported = (
            // IE 11 bug when the page is inside an iframe:
            // http://connect.microsoft.com/IE/feedback/details/814527/
            // ie11-iframes-body-offsetwidth-incorrect-when-iframe-is-in
            // -full-screen-mode
            !(gaBrowserSniffer.msie == 11 && gaBrowserSniffer.isInFrame) &&
            (target.requestFullScreen ||
            target.mozRequestFullScreen ||
            target.webkitRequestFullScreen ||
            target.msRequestFullscreen)
        );

        scope.click = function() {
          if (target.requestFullScreen) {
            target.requestFullScreen();
          } else if (target.mozRequestFullScreen) {
            target.mozRequestFullScreen();
          } else if (target.webkitRequestFullScreen) {
            // Element.ALLOW_KEYBOARD_INPUT allow keyboard input in fullscreen
            // mode, but that doesn't work for Safari
            target.webkitRequestFullScreen((gaBrowserSniffer.safari ?
                0 : Element.ALLOW_KEYBOARD_INPUT));
          } else if (target.msRequestFullscreen) {
            target.msRequestFullscreen();
          }
        };

        if (scope.fullscreenSupported) {
          var onFullscreenChange = function() {
            $(document.body).addClass(fullScreenCssClass);

            // Safari forbids inputs in full screen mode
            // for security reasons
            if (gaBrowserSniffer.safari) {
              $(document.body).addClass(inputsForbidCssClass);
            }

            scope.map.updateSize();
            if (!(document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement)) {
              gaPermalink.refresh();
              $(document.body).removeClass(fullScreenCssClass);
              $(document.body).removeClass(inputsForbidCssClass);
            }
          };

          document.addEventListener('fullscreenchange', onFullscreenChange);
          document.addEventListener('mozfullscreenchange', onFullscreenChange);
          document.addEventListener('webkitfullscreenchange',
              onFullscreenChange);
          document.addEventListener('MSFullscreenChange', onFullscreenChange);

          // Catch F11 event to provide an HTML5 fullscreen instead of
          // default one
          $(document).on('keydown', function(event) {
            if (event.which == 122) {
              event.preventDefault();
              scope.click(); // From fullscreen API
            }
          });
        }
      }
    };
  });
})();
