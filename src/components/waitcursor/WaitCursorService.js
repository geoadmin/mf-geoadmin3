(function() {
  goog.provide('ga_waitcursor_service');

  var module = angular.module('ga_waitcursor_service', []);

  module.provider('gaWaitCursor', function() {
    this.$get = function($document) {
      var waitClass = 'ga-wait-cursor';
      var bodyEl = angular.element($document[0].body);

      var waitCursor = function() {
        var processCounter = 0;
        this.add = function() {
          processCounter++;
          if (processCounter === 1) {
            bodyEl.addClass(waitClass);
          }
        };
        this.remove = function() {
          if (processCounter > 0) {
            processCounter--;
          }
          if (processCounter === 0) {
            bodyEl.removeClass(waitClass);
          }
        };
      };

      var waitingCursor = new waitCursor();
      return waitingCursor;
    };
  });
})();
