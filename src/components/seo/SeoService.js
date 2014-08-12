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
      var isActive = gaPermalink.getParams()._escaped_fragment_ !== undefined;
      var layersAtStart = gaPermalink.getParams().layers ?
                          gaPermalink.getParams().layers.split(',') : [];

      var yxzoom = {
        Y: gaPermalink.getParams().Y,
        X: gaPermalink.getParams().X,
        zoom: gaPermalink.getParams().zoom
      };

     // We remove the _escaped_fragment_ parameter in order to not have it
      // anywhere in the page as part of the permalink inside the page.
      // State is available through the isActive function.
      gaPermalink.deleteParam('_escaped_fragment_');

      //has to come after _escaped_fragment_ parameter is removed
      var linkAtStart = gaPermalink.getHref();

      var SeoService = function() {
        this.getLinkAtStart = function() {
          return linkAtStart;
        };

        this.isActive = function() {
          return isActive;
        };

        this.getLayers = function() {
          return layersAtStart;
        };

        this.getYXZoom = function() {
          return yxzoom;
        };
      };

      return new SeoService();
    };
  });

})();
