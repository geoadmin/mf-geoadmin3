goog.provide('ga_reframe_service');

(function() {

  var module = angular.module('ga_reframe_service', []);
  /**
   * Service to transform coordinates from lv03 to lv95 and vice-versa.
   *
   */
  module.provider('gaReframe', function() {
    this.$get = function($q, $http, gaGlobalOptions) {

      var lv03tolv95Url = gaGlobalOptions.lv03tolv95Url;
      var lv95tolv03Url = gaGlobalOptions.lv95tolv03Url;

      var Reframe = function() {
        this.get03To95 = function(coordinates) {
          var defer = $q.defer();
          $http.get(lv03tolv95Url, {
            params: {
              easting: coordinates[0],
              northing: coordinates[1]
            }
          }).then(function(response) {
            defer.resolve(response.data.coordinates);
          }, function() {
            // Use proj4js on error
            defer.resolve(ol.proj.transform(coordinates,
                'EPSG:21781', 'EPSG:2056'));
          });
          return defer.promise;
        };

        this.get95To03 = function(coordinates) {
          var defer = $q.defer();
          $http.get(lv95tolv03Url, {
            params: {
              easting: coordinates[0],
              northing: coordinates[1]
            }
          }).then(function(response) {
            defer.resolve(response.data.coordinates);
          }, function() {
            // Use proj4js on error
            defer.resolve(ol.proj.transform(coordinates,
                'EPSG:2056', 'EPSG:21781'));
          });
          return defer.promise;
        };
      };

      return new Reframe();
    };
  });
})();
