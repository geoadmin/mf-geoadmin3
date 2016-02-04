goog.provide('ga_service_worker_service');

(function() {

  var module = angular.module('ga_service_worker_service', []);

  /**
   * Wrapper around service Worker to boost page loading performance
   *
   */
  module.provider('gaServiceWorker', function() {

    this.$get = function() {
      var Boost = function() {
        this.register = function(path) {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(path).then(function(registration) {
              // Registration was successful
              console.log('ServiceWorker registration successful with scope: ',
                  registration.scope);
            }).catch (function(err) {
              // registration failed :(
              console.log('ServiceWorker registration failed: ', err);
            });
          }
        };

      };
      return new Boost();
    };
  });
})();

