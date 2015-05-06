(function() {
  goog.provide('ga_export_kml_service');
  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_export_kml_service', [
    'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);

  /**
   * This service can be used to export a kml file based on some
   * features on an ol3 map
   *
   */
  module.provider('gaExportKml', function() {
    this.$get = function($translate, $window, $document, $http,
                         gaBrowserSniffer) {

      var downloadUrl = this.downloadKmlUrl;
      var isBlobSupported = false;
      try {
        isBlobSupported = !!new Blob;
      } catch (e) {
      }

      var pp0 = function(s) {
        return s.length === 2 ? s : '0' + s;
      };

      var dateFormat = function(d) {
        var YYYY = d.getFullYear().toString();
        var MM = (d.getMonth() + 1).toString(); // getMonth() is zero-based
        var DD = d.getDate().toString();
        var hh = d.getHours().toString();
        var mm = d.getMinutes().toString();
        var ss = d.getSeconds().toString();
        return YYYY + pp0(MM) + pp0(DD) + pp0(hh) + pp0(mm) + pp0(ss);
      };

      var useDownloadService = function() {
        if (gaBrowserSniffer.msie == 9 ||
            gaBrowserSniffer.safari ||
            !isBlobSupported) {
          return true;
        }
        return false;
      };

      var ExportKml = function() {
        this.create = function(layer, projection) {
          var kmlString,
              exportFeatures = [];
          layer.getSource().forEachFeature(function(f) {
            var clone = f.clone();
            clone.setId(f.getId());
            clone.getGeometry().transform(projection, 'EPSG:4326');
            var styles;
            if (clone.getStyleFunction()) {
              styles = clone.getStyleFunction().call(clone);
            } else {
              styles = layer.getStyleFunction().call(layer, clone);
            }
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

            //We silently ignore Circle elements as they are not supported
            //in kml
            if (f.getGeometry().getType() !== 'Circle') {
              exportFeatures.push(clone);
            }
          });

          if (exportFeatures.length > 0) {
            if (exportFeatures.length == 1) {
              //force the add of a <Document> node
              exportFeatures.push(new ol.Feature());
            }
            kmlString = new ol.format.KML().writeFeatures(exportFeatures);
            // Remove no image hack
            kmlString = kmlString.
                replace(/<Icon>\s*<href>noimage<\/href>\s*<\/Icon>/g, '');

            // Add KML document name
            if (layer.label) {
              kmlString = kmlString.replace(/<Document>/, '<Document><name>' +
                  layer.label + '</name>');
            }

          }
          return kmlString;
        };

        this.createAndDownload = function(layer, projection) {
          var now = dateFormat(new Date());
          var saveAs = $window.saveAs;
          var filename = 'map.geo.admin.ch_KML_' + now + '.kml';
          var charset = $document.characterSet || 'UTF-8';
          var type = 'application/vnd.google-earth.kml+xml';
          type = type + ';charset=' + charset;

          if (!this.canSave()) {
            alert($translate.instant('export_kml_notsupported'));
          } else {
            var kmlString = this.create(layer, projection);
            if (kmlString) {
              if (useDownloadService()) {
                $http.post(downloadUrl, {
                  kml: kmlString,
                  filename: filename
                }).success(function(data) {
                  if (gaBrowserSniffer.msie == 9) {
                    $window.open(data.url);
                  } else {
                    $window.location = data.url;
                  }
                });
              } else {
                var blob = new Blob([kmlString],
                                    {type: type});
                saveAs(blob, filename);
              }
            }
          }
        };

        this.canSave = function() {
          return !gaBrowserSniffer.mobile;
        };
      };

      return new ExportKml();

    };
  });
})();

