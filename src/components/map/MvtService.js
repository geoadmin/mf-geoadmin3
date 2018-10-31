goog.provide('ga_mvt_service');

goog.require('ga_maputils_service');
goog.require('ga_networkstatus_service');
goog.require('ga_styles_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_mvt_service', [
    'ga_networkstatus_service',
    'ga_styles_service',
    'ga_urlutils_service',
    'ga_maputils_service'
  ]);

  /**
   * Service used by the gaVector service to have KML layers configuration.
   */
  module.provider('gaMvt', function() {

    this.$get = function($http, $window, gaGlStyle, gaLayers, gaMapUtils,
        gaUrlUtils) {

      var Mvt = function() {

        // This function will load the style to apply then aplly it.
        this.reload = function(olLayer) {
          if (!olLayer || (!(olLayer instanceof ol.layer.Group) &&
              !olLayer.sourceId)) {
            return;
          }

          var config = gaLayers.getLayer(olLayer.id);
          if (!config) {
            return;
          }

          var styleUrl = gaUrlUtils.resolveStyleUrl(config.styleUrl, olLayer);
          if (!styleUrl) {
            return;
          }

          if (olLayer instanceof ol.layer.Group) {
            var that = this;
            olLayer.getLayers().forEach(function(sublayer) {
              if (!sublayer.sourceId) {
                return;
              }
              sublayer.externalStyleUrl = olLayer.externalStyleUrl;
              that.reload(sublayer);
            });
            return;
          }

          gaGlStyle.get(styleUrl).then(function(glStyle) {
            gaMapUtils.applyGlStyleToOlLayer(olLayer, glStyle);
          });
        };
      };
      return new Mvt();
    };
  });
})();
