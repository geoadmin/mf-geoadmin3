goog.provide('ga_height_service');

(function() {

  var module = angular.module('ga_height_service', []);
  /**
   * Service representing the height service.
   * https://api3.geo.admin.ch/services/sdiservices.html#height
   */
  module.provider('gaHeight', function() {

    this.$get = function($http, $q, gaGlobalOptions) {
      var url = gaGlobalOptions.altiUrl + '/rest/services/height';

      var reject = function(msg) {
        var defer = $q.defer();
        defer.reject(msg);
        return defer.promise;
      };

      var Height = function() {
        this.get = function(map, coord, cancelPromise) {

          if (!map || !coord) {
            return reject('Missing required parameters');
          }
          var proj = map.getView().getProjection();
          return $http.get(url, {
            params: {
              easting: coord[0],
              northing: coord[1],
              sr: proj.getCode().split(':')[1],
              elevation_model: gaGlobalOptions.defaultElevationModel
            },
            cache: true,
            timeout: cancelPromise
          }).then(function(response) {
            return parseFloat(response.data.height);
          });
        };
      };
      return new Height();
    };
  });
})();
