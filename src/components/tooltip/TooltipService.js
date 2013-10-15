(function() {
  goog.provide('ga_tooltip_service');

  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_tooltip_service', [
    'ga_browsersniffer_service'
  ]);

  /**
   * This service is to be used to register a "click" listener
   * on a OpenLayer map.
   *
   * Notes:
   *
   * - Mouse, touch and ms pointer devices are supported.
   * - No "click" event is triggered when "move" events occur between
   *   "down" and "up".
   * - No "click" event is triggered on double click/tap.
   */
  module.provider('gaMapClick', function() {
    this.$get = function($timeout, gaBrowserSniffer) {
      return {
        listen: function(map, callback) {

          var viewport = map.getViewport();

          var bindUnbind = true;

          var down = null;
          var moving = false;
          var timeoutPromise = null;
          var touchstartTime;

          var isMouseAction = function(evt) {
            var s = gaBrowserSniffer;
            return (evt.button === 0) && !(s.webkit && s.mac && evt.ctrlKey);
          };

          var moveListener = function(evt) {
            if (down) {
              moving = true;
            }
          };

          var upListener = function(evt) {
            if (down && !moving) {
              if (timeoutPromise) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = null;
              } else {
                var clickEvent = down;
                timeoutPromise = $timeout(function() {
                  callback(clickEvent);
                  timeoutPromise = null;
                }, 350, false);
              }
            }
            moving = false;
            down = null;
          };

          var touchendListener = function(evt) {
            var now = (new Date()).getTime();
            if (now - touchstartTime < 300) {
              upListener(evt);
            }
          };

          var mousedownListener = function(evt) {
            if (bindUnbind) {
              $(viewport).unbind('touchstart', touchstartListener);
              $(viewport).unbind('MSPointerDown', mspointerdownListener);
              $(viewport).on('mouseup', upListener);
              $(viewport).on('mousemove', moveListener);
              bindUnbind = false;
            }
            var originalEvent = evt.originalEvent;
            if (isMouseAction(originalEvent)) {
              down = evt.originalEvent;
            }
          };

          var touchstartListener = function(evt) {
            if (bindUnbind) {
              $(viewport).unbind('mousedown', mousedownListener);
              $(viewport).unbind('MSPointerDown', mspointerdownListener);
              $(viewport).on('touchend', touchendListener);
              $(viewport).on('touchmove', moveListener);
              bindUnbind = false;
            }
            touchstartTime = (new Date()).getTime();
            down = evt.originalEvent;
          };

          var mspointerdownListener = function(evt) {
            if (bindUnbind) {
              $(viewport).unbind('mousedown', mousedownListener);
              $(viewport).unbind('touchstart', touchstartListener);
              $(viewport).on('MSPointerUp', upListener);
              $(viewport).on('MSPointerMove', moveListener);
              bindUnbind = false;
            }
            down = evt.originalEvent;
          };

          $(viewport).on('mousedown', mousedownListener);
          $(viewport).on('touchstart', touchstartListener);
          $(viewport).on('MSPointerDown', mspointerdownListener);
        }
      };
    };
  });
})();
