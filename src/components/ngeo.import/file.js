goog.provide('ngeo.fileService');

(function() {

  var module = angular.module('ngeo.fileService', []);

  /**
   * Read/load a file then returns the content.
   */
  module.provider('ngeoFile', function() {

    var fileReader, canceler;

    this.$get = function($q, $http, $window) {

      var FileContent = function() {

        // Test the validity of the file size
        this.isValidFileSize = function(fileSize) {
          return !(fileSize > 20000000); // 20 Mo
        };

        this.isWmsGetCap = function(fileContent) {
          return /<(WMT_MS_Capabilities|WMS_Capabilities)/.test(fileContent);
        };

        this.isKml = function(fileContent) {
          return /<kml/.test(fileContent) && /<\/kml>/.test(fileContent);
        };

        this.read = function(file) {
          var defer = $q.defer();
          if (fileReader) {
            fileReader.abort();
          }
          fileReader = new FileReader();
          fileReader.onload = function(evt) {
            defer.resolve(evt.target.result);
          };
          fileReader.onerror = function(evt) {
            var err = evt.target.error;
            $window.console.error('Reading file failed: ', err);
            defer.reject({
              message: err.code == 20 ? 'operation_canceled' : 'read_failed',
              reason: err.message
            });
          };
          fileReader.onprogress = function(evt) {
            defer.notify(evt);
          };
          // Read the file
          fileReader.readAsText(file);
          return defer.promise;
        };

        this.load = function(url, cancelP) {

          if (canceler) {
            canceler.resolve();
          }
          canceler = cancelP || $q.defer();

          // Angularjs doesn't handle onprogress event
          var defer = $q.defer();
          $http.get(url, {
            timeout: canceler.promise
          }).then(function(response) {
            defer.resolve(response.data);
          }, function(reason) {
            $window.console.error('Uploading file failed: ', reason);
            defer.reject({
              message: 'upload_failed',
              reason: reason
            });
          });
          return defer.promise;
        };
      };
      return new FileContent();
    };
  });
})();
