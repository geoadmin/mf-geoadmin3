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
      };

      return new EventManager();
    };
  });
})();
