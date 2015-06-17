goog.provide('ga_debounce_service');
(function() {

  var module = angular.module('ga_debounce_service', []);

  module.provider('gaDebounce', function() {
    this.$get = function($timeout, $q) {
      var Debounce = function() {
        this.debounce = function(func, wait, immediate, invokeApply) {
          var timeout;
          var deferred = $q.defer();
          return function() {
            var context = this, args = arguments;
            var later = function() {
              timeout = null;
              if (!immediate) {
                deferred.resolve(func.apply(context, args));
                deferred = $q.defer();
              }
            };
            var callNow = immediate && !timeout;
            if (timeout) {
              $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait, invokeApply);
            if (callNow) {
              deferred.resolve(func.apply(context, args));
              deferred = $q.defer();
            }
            return deferred.promise;
          };
        };
      };
      return new Debounce();
    };
  });
})();

