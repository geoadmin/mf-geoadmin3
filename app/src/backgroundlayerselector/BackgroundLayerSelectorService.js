(function() {
  goog.provide('ga_backgroundlayerselector_service');

  var module = angular.module('ga_backgroundlayerselector_service', []);

  module.provider('gaWmtsLoader', function() {

    this.$get = ['$q', '$http', function($q, $http) {
      return {
        load: function(url, layers) {
          var deferred = $q.defer();
          $http.get(url).success(function(data, status) {
            var parser = new ol.parser.ogc.WMTSCapabilities();
            var capabilities;
            try {
              capabilities = parser.read(data);
              var i, ii = layers.length;
              var wmtsSourceOptions, wmtsSource, wmtsLayers = [];
              for (i = 0; i < ii; ++i) {
                wmtsSourceOptions = ol.source.WMTS.optionsFromCapabilities(
                    capabilities, layers[i].value);
                wmtsSourceOptions.attributions = [
                  new ol.Attribution('&copy; Data: swisstopo')
                ];
                wmtsSource = new ol.source.WMTS(wmtsSourceOptions);
                wmtsLayers.push(new ol.layer.TileLayer({source: wmtsSource}));
              }
              deferred.resolve(wmtsLayers);
            } catch (e) {
              deferred.reject();
            }
          }).error(function(data, status) {
            deferred.reject();
          });
          return deferred.promise;
        }
      };
    }];

  });

})();
