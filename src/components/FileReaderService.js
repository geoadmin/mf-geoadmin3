(function() {
  goog.provide('ga_filereader_service');

  var module = angular.module('ga_filereader_service', []);

  module.provider('gaFileReader', function() {

    this.$get = function($q) {

      var FileReaderUtils = function(scope) {
        var reader,
            deferred;

        var onLoad = function() {
          return function() {
            scope.$apply(function() {
              deferred.resolve(reader.result);
            });
          };
        };

        var onError = function() {
          return function() {
            scope.$apply(function() {
              deferred.reject(reader.result);
            });
          };
        };

        var onProgress = function() {
          return function(evt) {
            if (evt.lengthComputable) {
              scope.$broadcast('gaFileProgress', {
                total: evt.total,
                loaded: evt.loaded
              });
            }
          };
        };

        var initReader = function() {
          reader = new FileReader();
          reader.onload = onLoad();
          reader.onerror = onError();
          reader.onprogress = onProgress();
        };

        this.abort = function() {
          if (reader && reader.readyState == 1) {
            scope.$apply(function() {
              deferred.resolve();
            });
            reader.abort();
          }
        };

        this.readAsText = function(file) {
          this.abort();
          deferred = $q.defer();
          initReader(deferred);
          reader.readAsText(file);
          return deferred.promise;
        };
      };

      return function(scope) {
        return new FileReaderUtils(scope);
      };
    };
  });
})();
