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
   * Service containing utilities function for vector tile layer.
   */
  module.provider('gaMvt', function() {

    this.$get = function($http, $window, $q, gaLayers, gaMapUtils, gaUrlUtils,
        gaStorage) {

      var Mvt = function() {

        // This function will apply the gl style associated to a layer.
        this.reload = function(olLayer) {
          if (!olLayer || (!(olLayer instanceof ol.layer.Group) &&
              !olLayer.sourceId)) {
            return $q.when();
          }

          var styles = gaLayers.getLayerProperty(olLayer.id, 'styles');
          if (!styles) {
            return $q.when();
          }

          // An vector tile layer MUST have a styles property
          var styleUrl = gaUrlUtils.resolveStyleUrl(styles[0].url,
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

          olLayer.useThirdPartyData = gaUrlUtils.isThirdPartyValid(styleUrl);

          return gaStorage.load(styleUrl).then(function(glStyle) {
            gaMapUtils.applyGlStyleToOlLayer(olLayer, glStyle);
            return glStyle;
          });

        };
      };
      return new Mvt();
    };
  });
})();
