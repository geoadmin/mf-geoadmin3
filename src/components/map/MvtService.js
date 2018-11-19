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

    this.$get = function($http, $window, $q, gaGlStyle, gaLayers, gaMapUtils,
        gaUrlUtils) {

      var Mvt = function() {

        // This function will load the gl style of a layer.
        this.reload = function(olLayer) {
          if (!olLayer || (!(olLayer instanceof ol.layer.Group) &&
              !olLayer.sourceId)) {
            return $q.when();
          }

          var config = gaLayers.getLayer(olLayer.id);
          if (!config) {
            return $q.when();
          }

          var styleUrl = gaUrlUtils.resolveStyleUrl(config.styleUrl ||
            (config.styleUrls && config.styleUrls[0]),
          olLayer.externalStyleUrl);

          if (!styleUrl) {
            return $q.when();
          }

          if (olLayer instanceof ol.layer.Group) {
            var children = olLayer.getLayers().getArray();
            for (var i = 0; i < children.length; i++) {
              var sublayer = children[i];
              if (!sublayer.sourceId) {
                continue;
              }
              sublayer.externalStyleUrl = olLayer.externalStyleUrl;
            }
          }

          return gaGlStyle.get(styleUrl).then(function(glStyle) {
            gaMapUtils.applyGlStyleToOlLayer(olLayer, glStyle);
            return glStyle;
          });

        };
      };
      return new Mvt();
    };
  });
})();
