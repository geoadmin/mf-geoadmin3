goog.provide('ga_waitcursor_service');
(function() {

  var module = angular.module('ga_waitcursor_service', []);

  module.provider('gaWaitCursor', function() {
    this.$get = function($document, $rootScope) {
      var timeout = undefined;
      var waitClass = 'ga-wait-cursor';
      var bodyEl = angular.element($document[0].body);
      var processCounter = 0;

      var initTimeout = function() {
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = undefined;
      };

      var update = function() {
        initTimeout();
        if (processCounter <= 0) {
          processCounter = 0;
          bodyEl.removeClass(waitClass);
          // Signals idle state after 4 second.
          timeout = setTimeout(function() {
            $rootScope.$broadcast('gaIdle');
          }, 4000);
        } else {
          bodyEl.addClass(waitClass);
        }
      };

      var WaitCursor = function() {

        this.increment = function() {
          processCounter++;
          update();
        };

        this.decrement = function() {
          processCounter--;
          update();
        };
      };

      var wait = new WaitCursor();

      // Catch every jquery $.ajax requests
      $document.ajaxSend(function() {
        wait.increment();
      }).ajaxComplete(function() {
        wait.decrement();
      });

      return wait;
    };
  });
})();
