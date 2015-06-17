goog.provide('ga_throttle_service');
(function() {

  var module = angular.module('ga_throttle_service', []);

  module.provider('gaThrottle', function() {
    this.$get = function($timeout) {
      var Throttle = function() {
        this.throttle = function(func, delay, noTrailing, invokeApply) {
          var timeout, lastExec = 0;
          return function() {
            var context = this, args = arguments,
                elapsed = +new Date() - lastExec;
            var exec = function() {
              lastExec = +new Date();
              func.apply(context, args);
            };
            if (timeout) {
              $timeout.cancel(timeout);
            }
            if (elapsed > delay) {
              exec();
            } else if (!noTrailing) {
              timeout = $timeout(exec, delay - elapsed, invokeApply);
            }
          };
        };
      };
      return new Throttle();
    };
  });
})();
