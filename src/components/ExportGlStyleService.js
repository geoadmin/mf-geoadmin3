goog.provide('ga_exportglstyle_service');

goog.require('ga_browsersniffer_service');
goog.require('ga_glstyle_service');

(function() {

  var module = angular.module('ga_exportglstyle_service', [
    'ga_glstyle_service',
    'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);

  /**
   * This service can be used to export a kml file based on some
   * features on an ol map
   */
  module.provider('gaExportGlStyle', function() {
    this.$get = function($translate, $window, $document, $http,
        gaBrowserSniffer, gaGLStyle) {

      var downloadUrl = this.downloadUrl;

      var useDownloadService = function() {
        return !!(gaBrowserSniffer.msie === 9 ||
            gaBrowserSniffer.safari ||
            !gaBrowserSniffer.blob)
      };

      var Export = function() {

        this.create = function(layer) {
          return gaGLStyle.get(layer.externalStyleUrl).then(function(data) {
            return JSON.stringify(data.style);
          });
        };

        this.createAndDownload = function(layer) {
          var now = $window.moment().format('YYYYMMDDhhmmss');
          var saveAs = $window.saveAs;
          var fileName = 'map.geo.admin.ch_GLSTYLE_' + now + '.json';
          var charset = $document.characterSet || 'UTF-8';
          var type = 'application/json' + charset;
          this.create(layer).then(function(dataString) {

            if (!dataString) {
              return;
            }

            if (!useDownloadService()) {
              var blob = new Blob([dataString], {type: type});
              saveAs(blob, fileName);
              return;
            }

            $http.post(downloadUrl, {
              kml: dataString,
              filename: fileName
            }).then(function(response) {
              var url = response.data.url;

              if (gaBrowserSniffer.msie === 9) {
                $window.open(url);
                return;
              }

              $window.location = url;
            }, function(reason) {
              $window.console.error('Can\'t download the glStyle: ', reason);
            });
          });
        };
      };

      return new Export();
    };
  });
})();
