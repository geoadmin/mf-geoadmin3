goog.provide('ga_event_service');

(function() {

  var module = angular.module('ga_event_service', []);

  module.provider('gaEvent', function() {
    this.$get = function() {
      var MOUSE_REGEX = /mouse/;

      var isMouse = function(evt) {
        var evt = evt.originalEvent || evt;
        return MOUSE_REGEX.test(evt.pointerType || evt.type);
      };

      // Ensure actions on mouseover/out are only triggered by a mouse
      var addMouseOnlyEvents = function(elt, eventsIn, eventsOut,
          callbackIn, callbackOut, selector) {
        var cancelMouseEvts = false;
        elt.on(eventsIn, selector, function(evt) {
          if (!isMouse(evt) || cancelMouseEvts) {
            cancelMouseEvts = true;
            return;
          }
          callbackIn(evt);
        }).on(eventsOut, selector, function(evt) {
          if (!isMouse(evt)) {
            return;
          }
          callbackOut(evt);
          cancelMouseEvts = false;
        });
      };

      var EventManager = function() {

        this.isMouse = function(evt) {
          return isMouse(evt);
        };

        // Ensure actions on mouseover/out are only triggered by a mouse
        this.onMouseOverOut = function(elt, onMouseOver, onMouseOut, selector) {
          addMouseOnlyEvents(elt, 'touchstart mouseover', 'mouseout',
              onMouseOver, onMouseOut, selector);
        };

        // Ensure actions on mouseover/out are only triggered by a mouse
        this.onMouseEnterLeave = function(elt, onMouseEnter, onMouseLeave,
            selector) {
          addMouseOnlyEvents(elt, 'touchstart mouseenter', 'mouseleave',
              onMouseEnter, onMouseLeave, selector);
        };
      };

      return new EventManager();
    };
  });
})();
