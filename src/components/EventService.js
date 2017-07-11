goog.provide('ga_event_service');

(function() {

  var module = angular.module('ga_event_service', []);

  module.provider('gaEvent', function() {
    this.$get = function() {
      var MOUSE_REGEX = /mouse/;

      var EventManager = function() {

        this.isMouse = function(event) {
          var evt = event.originalEvent || event;
          return MOUSE_REGEX.test(evt.pointerType || evt.type);
        };

        // Ensure actions on mouseover/out are only triggered by a mouse
        this.onMouseOverOut = function(elt, onMouseOver, onMouseOut, selector) {
          var that = this;
          var cancelMouseEvts = false;
          elt.on('touchstart mouseover', selector, function(evt) {
            if (!that.isMouse(evt) || cancelMouseEvts) {
              cancelMouseEvts = true;
              return;
            }
            onMouseOver(evt);
          }).on('mouseout', selector, function(evt) {
            if (!that.isMouse(evt)) {
              return;
            }
            onMouseOut(evt);
            cancelMouseEvts = false;
          });
        };
      };

      return new EventManager();
    };
  });
})();
