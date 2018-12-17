goog.provide('ga_attribution_service');

goog.require('ga_layers_service');
goog.require('ga_translation_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_attribution_service', [
    'ga_layers_service',
    'ga_translation_service',
    'ga_urlutils_service'
  ]);

  /**
   * Attribution manager
   * We display an attribution only if the layer is from bod or from an
   * external service. No attribution for local data displayed with DnD.
   */
  module.provider('gaAttribution', function() {
    this.$get = function(gaUrlUtils, gaLang, gaLayers) {
      var attribs = {};
      var getBodLayerAttribution = function(bodId, useConfig3d) {
        var config = gaLayers.getLayer(bodId);
        if (useConfig3d) {
          config = gaLayers.getConfig3d(config);
        }
        var key = config.attribution;
        var lang = gaLang.get();
        if (!attribs[lang]) {
          attribs[lang] = {};
        }
        if (!attribs[lang][key]) {
          attribs[lang][key] = config.attribution;
          if (gaUrlUtils.isValid(config.attributionUrl)) {
            attribs[lang][key] = '<a target="new" href="' +
                config.attributionUrl + '">' + config.attribution + '</a>';
          }
        }
        return attribs[lang][key];
      };

      var Attribution = function() {

        // Get the attribution of a layer without HTML.
        this.getTextFromLayer = function(layer) {
          if (gaUrlUtils.isValid(layer.url)) {
            if (gaUrlUtils.isBlob(layer.url)) {
              return 'User local file'
            } else {
              return gaUrlUtils.getHostname(layer.url);
            }
          } else if (layer.bodId) {
            return gaLayers.getLayerProperty(layer.bodId, 'attribution');
          }
        };

        // Get the HTML attribution of a layer.
        this.getHtmlFromLayer = function(layer, useConfig3d) {

          if (gaUrlUtils.isValid(layer.url || layer.externalStyleUrl)) {
            var attribution = this.getTextFromLayer(layer);

            if (layer.url && gaUrlUtils.isThirdPartyValid(layer.url)) {
              return '<span class="ga-warning-tooltip">' + attribution +
                  '</span>';
            // We add the public link after the data attributons
            } else if (layer.externalStyleUrl &&
                gaUrlUtils.isThirdPartyValid(layer.externalStyleUrl)) {
              return (attribution ? attribution + ', ' : '') +
                  '<span class="ga-warning-tooltip">' +
                    gaUrlUtils.getHostname(layer.externalStyleUrl) +
                  '</span>';
            }
            return attribution;
          } else if (layer.bodId) {
            return getBodLayerAttribution(layer.bodId, useConfig3d);
          }
        };
      };
      return new Attribution();
    };
  });
})();
