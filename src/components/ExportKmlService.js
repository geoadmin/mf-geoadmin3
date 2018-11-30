goog.provide('ga_exportkml_service');
goog.require('ga_browsersniffer_service');
(function() {

  var module = angular.module('ga_exportkml_service', [
    'ga_browsersniffer_service',
    'ga_kml_service',
    'pascalprecht.translate'
  ]);

  /**
   * This service can be used to export a kml file based on some
   * features on an ol map
   */
  module.provider('gaExportKml', function() {
    this.$get = function($translate, $window, $document, $http,
        gaBrowserSniffer, gaKml) {

      var downloadUrl = this.downloadKmlUrl;

      var useDownloadService = function() {
        if (gaBrowserSniffer.msie === 9 ||
            gaBrowserSniffer.safari ||
            !gaBrowserSniffer.blob) {
          return true;
        }
        return false;
      };

      var ExportKml = function() {
        this.create = function(layer, projection) {
          var kmlString,
            exportFeatures = [];
          layer.getSource().forEachFeature(function(f) {
            // We silently ignore Circle elements as they are not supported
            // in kml
            if (f.getGeometry().getType() === 'Circle') {
              return;
            }
            var clone = f.clone();
            clone.setId(f.getId());
            clone.getGeometry().setProperties(f.getGeometry().getProperties());
            clone.getGeometry().transform(projection, 'EPSG:4326');
            // TODO should we test getStyle() too?
            var styles = clone.getStyleFunction() || layer.getStyleFunction();
            styles = styles(clone);
            var newStyle = {
              fill: styles[0].getFill(),
              stroke: styles[0].getStroke(),
              text: styles[0].getText(),
              image: styles[0].getImage(),
              zIndex: styles[0].getZIndex()
            };
            if (newStyle.image instanceof ol.style.Circle) {
              newStyle.image = null;
            }

            // If only text is displayed we must specify an image style with
            // scale=0
            if (newStyle.text && !newStyle.image) {
              newStyle.image = new ol.style.Icon({
                src: 'noimage',
                scale: 0
              });
            }

            var myStyle = new ol.style.Style(newStyle);
            clone.setStyle(myStyle);
            exportFeatures.push(clone);
          });

          if (exportFeatures.length > 0) {
            if (exportFeatures.length === 1) {
              // force the add of a <Document> node
              exportFeatures.push(new ol.Feature());
            }
            kmlString = gaKml.getFormat().writeFeatures(exportFeatures);
            // Remove no image hack
            kmlString = kmlString.
                replace(/<Icon>\s*<href>noimage<\/href>\s*<\/Icon>/g, '');

            // Remove empty placemark added to have <Document> tag
            kmlString = kmlString.
                replace(/<Placemark\/>/g, '');

            // Add KML document name
            if (layer.label) {
              kmlString = kmlString.replace(/<Document>/, '<Document><name>' +
                  layer.label + '</name>');
            }

          }
          return kmlString;
        };

        this.createAndDownload = function(layer, projection) {
          var now = $window.moment().format('YYYYMMDDhhmmss');
          var saveAs = $window.saveAs;
          var fileName = 'map.geo.admin.ch_KML_' + now + '.kml';
          var charset = $document.characterSet || 'UTF-8';
          var type = 'application/vnd.google-earth.kml+xml;charset=' + charset;
          var kmlString = this.create(layer, projection);
          if (kmlString) {
            if (useDownloadService()) {
              $http.post(downloadUrl, {
                kml: kmlString,
                filename: fileName
              }).then(function(response) {
                var data = response.data;
                if (gaBrowserSniffer.msie === 9) {
                  $window.open(data.url);
                } else {
                  $window.location = data.url;
                }
              });
            } else {
              var blob = new Blob([kmlString],
                  {type: type});
              saveAs(blob, fileName);
            }
          }
        };
      };

      return new ExportKml();
    };
  });
})();
