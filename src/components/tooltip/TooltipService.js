(function() {
  goog.provide('ga_tooltip_service');

  var module = angular.module('ga_tooltip_service', []);

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
    this.$get = function($timeout) {
      return {
        listen: function(map, callback) {

          var viewport = map.getViewport();

          var bindUnbind = true;

          var down = null;
          var moving = false;
          var timeoutPromise = null;

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
                }, 250, false);
              }
            }
            moving = false;
            down = null;
          };

          var mousedownListener = function(evt) {
            down = evt.originalEvent;
            if (bindUnbind) {
              $(viewport).unbind('touchstart', touchstartListener);
              $(viewport).unbind('MSPointerDown', mspointerdownListener);
              $(viewport).on('mouseup', upListener);
              $(viewport).on('mousemove', moveListener);
              bindUnbind = false;
            }
          };

          var touchstartListener = function(evt) {
            down = evt.originalEvent;
            if (bindUnbind) {
              $(viewport).unbind('mousedown', mousedownListener);
              $(viewport).unbind('MSPointerDown', mspointerdownListener);
              $(viewport).on('touchend', upListener);
              $(viewport).on('touchmove', moveListener);
              bindUnbind = false;
            }
          };

          var mspointerdownListener = function(evt) {
            down = evt.originalEvent;
            if (bindUnbind) {
              $(viewport).unbind('mousedown', mousedownListener);
              $(viewport).unbind('touchstart', touchstartListener);
              $(viewport).on('MSPointerUp', upListener);
              $(viewport).on('MSPointerMove', moveListener);
              bindUnbind = false;
            }
          };

          $(viewport).on('mousedown', mousedownListener);
          $(viewport).on('touchstart', touchstartListener);
          $(viewport).on('MSPointerDown', mspointerdownListener);
        }
      };
    };
  });
})();
