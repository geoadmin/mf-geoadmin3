(function() {
  goog.provide('ga_filereader_service');

  var module = angular.module('ga_filereader_service', []);

  module.provider('gaFileReader', function() {

    this.$get = function($q) {

      var FileReaderUtils = function(scope) {
        var reader;

        var onLoad = function(deferred) {
          return function() {
            scope.$apply(function() {
              deferred.resolve(reader.result);
            });
          };
        };

        var onError = function(deferred) {
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

        var initReader = function(deferred) {
          reader = new FileReader();
          reader.onload = onLoad(deferred);
          reader.onerror = onError(deferred);
          reader.onprogress = onProgress();
        };

        this.abort = function() {
          if (reader && reader.readyState == 1) {
            reader.abort();
          }
        };

        this.readAsText = function(file) {
          var deferred = $q.defer();
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
