goog.provide('ga_kml_service');

goog.require('ga_networkstatus_service');
goog.require('ga_styles_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_kml_service', [
    'ga_networkstatus_service',
    'ga_styles_service',
    'ga_urlutils_service'
  ]);

  /**
   * Service used by the gaVector service to have KML layers configuration.
   */
  module.provider('gaKml', function() {

    this.$get = function($http, $q, gaGlobalOptions, gaMapUtils,
        gaNetworkStatus, gaStyleFactory, gaUrlUtils) {

      var format; // KML parser
      var style;
      var Kml = function() {

        this.getType = function() {
          return 'KML';
        };

        // Returns the unique KML format used by the application
        this.getFormat = function() {
          if (!format) {
            // TO FIX, caused by OL 3.18.2
            // Hack for #3531: We create an empty format first to create the
            // default style variables.
            // https://github.com/openlayers/openlayers/blob/master/src/ol/format/kml.js#L143
            // https://github.com/openlayers/openlayers/pull/5587
            ol.format.KML();

            format = new ol.format.KML({
              extractStyles: true,
              defaultStyle: [this.getStyle()]
            });
          }
          return format;
        };

        // Returns the default style for KML feature
        this.getStyle = function() {
          if (!style) {
            style = gaStyleFactory.getStyle('kml');
          }
          return style;
        };

        // Sanitize the content of a KML file.
        this.sanitize = function(kml) {
          // Replace all hrefs to prevent errors if image doesn't have
          // CORS headers. Exception for *.geo.admin.ch, *.bgdi.ch and google
          // markers icons (only https)
          // to keep the OL magic for anchor origin.
          // Test regex here: http://regex101.com/r/tF3vM0/9
          // List of google icons: http://www.lass.it/Web/viewer.aspx?id=4
          kml = kml.replace(
              /<href>http(?!(s:\/\/maps\.(google|gstatic)\.com[a-zA-Z\d.\-/_]*\.png|s?:\/\/[a-z\d.-]*(bgdi|geo.admin)\.ch))/g,
              '<href>' + gaGlobalOptions.proxyUrl + 'http'
          );

          // We still need to convert <href>https://proxy.admin.ch/https:// to
          // <href>https://proxy.admin.ch/https/
          kml = kml.replace(
              new RegExp('<href>' + gaGlobalOptions.proxyUrl + 'http://', 'g'),
              '<href>' + gaGlobalOptions.proxyUrl + 'http/').
              replace(
                  new RegExp('<href>' + gaGlobalOptions.proxyUrl + 'https://', 'g'),
                  '<href>' + gaGlobalOptions.proxyUrl + 'https/');

          // Replace all http hrefs from *.geo.admin.ch or *.bgdi.ch by https
          // Test regex here: http://regex101.com/r/fY7wB3/5
          kml = kml.replace(
              /<href>http(?=s{0}:\/\/[a-z\d.-]*(bgdi|admin)\.ch)/g,
              '<href>https'
          );

          // Replace all old maki urls image by the color service url
          // Test regex here: https://regex101.com/r/rF2tA1/4
          kml = kml.replace(
              /<href>https?:\/\/[a-z\d.-]*(bgdi|geo.admin)\.ch[a-zA-Z\d\-_/]*img\/maki\/([a-z\-0-9]*-24@2x\.png)/g,
              '<href>' + gaGlobalOptions.apiUrl + '/color/255,0,0/$2'
          );

          return kml;
        };

        // Sanitize the feature.
        this.sanitizeFeature = function(feature) {
          var geom = feature.getGeometry();
          var styles = feature.getStyleFunction().call(feature);

          // The use of clone is part of the scale fix line 156
          var style = styles[0].clone();

          // The canvas draws a stroke width=1 by default if width=0, so we
          // remove the stroke style in that case.
          // See https://github.com/geoadmin/mf-geoadmin3/issues/3421
          var stroke = style.getStroke();
          if (stroke && stroke.getWidth() === 0) {
            stroke = undefined;
          }

          // if the feature is a Point and we are offline, we use default vector
          // style.
          // if the feature is a Point and has a name with a text style, we
          // create a correct text style.
          // TODO Handle GeometryCollection displaying name on the first Point
          // geometry.
          if (style && (geom instanceof ol.geom.Point ||
              geom instanceof ol.geom.MultiPoint)) {
            var image = style.getImage();
            var text = null;
            var fill = style.getFill();

            if (gaNetworkStatus.offline) {
              image = this.getStyle().getImage();
            }

            // If the feature has name we display it on the map as Google does
            if (feature.get('name') && style.getText() &&
                style.getText().getScale() !== 0) {

              if (image && image.getScale() === 0) {
                // transparentCircle is used to allow selection
                image = gaStyleFactory.getStyle('transparentCircle');
              }
              text = new ol.style.Text({
                font: gaStyleFactory.FONT,
                text: feature.get('name'),
                fill: style.getText().getFill(),
                stroke: gaStyleFactory.getTextStroke(
                    style.getText().getFill().getColor()),
                scale: style.getText().getScale()
              });

              fill = undefined;
              stroke = undefined;
            }

            styles = [new ol.style.Style({
              fill: fill,
              stroke: stroke,
              image: image,
              text: text,
              zIndex: style.getZIndex()
            })];
            feature.setStyle(styles);
          }

          // Get the type of the feature (creates by drawing tools)
          if (feature.getId()) {
            var split = feature.getId().split('_');
            if (split.length === 2) {
              feature.set('type', split[0]);
            }
          }

          // Apply the good style (with azimuth drawn) for measure feature
          if (style && gaMapUtils.isMeasureFeature(feature)) {
            feature.set('type', 'measure');
            feature.setStyle(gaStyleFactory.getFeatureStyleFunction('measure'));
          // Remove image and text styles for polygons and lines
          } else if (!(geom instanceof ol.geom.Point ||
              geom instanceof ol.geom.MultiPoint ||
              geom instanceof ol.geom.GeometryCollection)) {
            styles = [new ol.style.Style({
              fill: style.getFill(),
              stroke: stroke,
              image: null,
              text: null,
              zIndex: style.getZIndex()
            })];
            feature.setStyle(styles);
          }
          return feature;
        };

        // Get the content of Name tag
        this.getName = function(kml) {
          return this.getFormat().readName(kml);
        };

        // Get the content of NetworkLink tags
        this.getLinkedData = function(kml) {
          var all = [];
          var networkLinks = this.getFormat().readNetworkLinks(kml);
          if (networkLinks.length) {
            angular.forEach(networkLinks, function(networkLink) {
              if (gaUrlUtils.isValid(networkLink.href)) {
                all.push($http.get(networkLink.href));
              }
            });
          }
          return $q.all(all);
        };
      };
      return new Kml();
    };
  });
})();
