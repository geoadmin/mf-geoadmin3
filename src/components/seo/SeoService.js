(function() {
  goog.provide('ga_seo_service');

  goog.require('ga_permalink_service');

  var module = angular.module('ga_seo_service', [
    'ga_permalink_service'
  ]);

  /**
   * The seo service.
   *
   * The service takes care to capture the application state
   * relevant to seo  at initialisation.
   *
   * We can't put this in the directive because of how
   * the initialisation of the application works
   *
   */
  module.provider('gaSeoService', function() {
    this.$get = function(gaPermalink) {
      var openRequests = 0;

      var layersAtStart = gaPermalink.getParams().layers ?
                          gaPermalink.getParams().layers.split(',') : [];

      var isSnapshot = gaPermalink.getParams().snapshot == 'true';

      var SeoService = function() {
        this.addRequestCount = function() {
          openRequests += 1;
        };

        this.removeRequestCount = function() {
          openRequests -= 1;
        };

        this.waitOnRequests = function() {
          return openRequests > 0;
        };

        this.isSnapshot = function() {
          return isSnapshot;
        };

        this.getLayers = function() {
          return layersAtStart;
        };
      };

      return new SeoService();
    };
  });

})();
