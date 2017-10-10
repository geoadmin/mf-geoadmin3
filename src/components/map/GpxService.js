goog.provide('ga_gpx_service');

goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_gpx_service', [
    'ga_styles_service'
  ]);

  /**
   * Service used by the gaVector service to have GPX layers configuration.
   */
  module.provider('gaGpx', function() {

    this.$get = function($q, gaStyleFactory) {

      var format; // GPX parser
      var style; // GPX default style

      var Gpx = function() {

        this.getType = function() {
          return 'GPX';
        };

        // Returns the unique GPX format used by the application
        this.getFormat = function() {
          if (!format) {
            format = new ol.format.GPX({
              readExtensions: false
            });
          }
          return format;
        };

        // Returns the default style for GPX feature
        this.getStyle = function() {
          if (!style) {
            style = gaStyleFactory.getStyle('kml');
          }
          return style;
        };

        // Sanitize the content of a GPX file.
        this.sanitize = function(gpx) {
          return gpx;
        };

        // Sanitize a feature.
        this.sanitizeFeature = function(feature) {
          feature.setStyle([this.getStyle()]);

          var geom = feature.getGeometry();

          // When the 3rd coordinate of wpt is time, we remove it because
          // we don't manage it in tooltip.
          if (geom instanceof ol.geom.Point && geom.getLayout() === 'XYM') {
            geom = new ol.geom.Point(geom.getCoordinates().slice(0, 2), 'XY');
            feature.setGeometry(geom);
          }
          return feature;
        };

        // Get name of the layer.
        this.getName = function(gpx) {
          var name = (gpx.match(/<metadata>\s*<name>(.*?)<\/name>/) || [])[1];
          if (/CDATA/.test(name)) {
            name = name.replace(/(<!\[CDATA\[|\]\]>)/gi, '');
          }
          return name;
        };

        // Does nothing, GPX doesn't contains linked data
        this.getLinkedData = function(gpx) {
          return $q.when([]);
        };
      };

      return new Gpx();
    };
  });
})();
