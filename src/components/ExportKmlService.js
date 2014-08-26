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
    this.$get = function($translate, $window, $document, gaBrowserSniffer) {
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

      var ExportKml = function() {
        this.create = function(layer, projection) {
          var kmlString,
              exportFeatures = [],
              hasText = false;
          layer.getSource().forEachFeature(function(f) {
              //we don't support exports of text elements for now
              if (!f.get('useText')) {
                var clone = f.clone();
                clone.setId(f.getId());
                clone.getGeometry().transform(projection, 'EPSG:4326');
                var styles;
                if (clone.getStyleFunction()) {
                  styles = clone.getStyleFunction()();
                } else {
                  styles = layer.getStyleFunction()(clone);
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
                var myStyle = new ol.style.Style(newStyle);
                clone.setStyle(myStyle);

                exportFeatures.push(clone);
              } else {
                hasText = true;
              }
          });

          if (exportFeatures.length > 0) {
            var node = new ol.format.KML().writeFeatures(exportFeatures);
            kmlString = node.outerHtml;
            //Some browser don't support the node.outerHtml property. For
            //thos browsers, we need to serialize differently.
            if (!kmlString) {
              kmlString = new XMLSerializer().serializeToString(node);
            }
          }
          if (hasText) {
            alert($translate('kml_no_text_elements'));
          }
          return kmlString;
        };

        this.createAndDownload = function(layer, projection) {
          var now = dateFormat(new Date());
          var saveAs = $window.saveAs;
          var filename = 'map.geo.admin.ch_KML_' + now + '.kml';
          var charset = $document.characterSet;
          if (!this.canSave()) {
            alert($translate('export_kml_notsupported'));
          } else {
            var kmlString = this.create(layer, projection);
            if (kmlString) {
              var blob = new Blob([kmlString],
                                  {type: 'application/vnd.google-earth.kml+' +
                                         'xml;charset=' + charset});
              saveAs(blob, filename);
            }
          }
        };

        this.canSave = function() {
          var isFileSaveSupported = false;
          try {
            isFileSaveSupported = !!new Blob;
          } catch (e) {
          }
          return isFileSaveSupported && !gaBrowserSniffer.mobile;
        };
      };

      return new ExportKml();

    };
  });
})();

