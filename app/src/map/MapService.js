(function() {
  goog.provide('ga_map_service');

  var module = angular.module('ga_map_service', []);

  module.provider('gaTileGrid', function() {
    var resolutions = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000,
      1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2,
      1.5, 1, 0.5, 0.25];
    var matrixIds = $.map(resolutions, function(r, i) { return i + ''; });
    var origin = [420000, 350000];

    var tileGrid = new ol.tilegrid.WMTS({
      matrixIds: matrixIds,
      origin: origin,
      resolutions: resolutions
    });

    this.$get = function() {
      return tileGrid;
    };
  });

  module.provider('gaLayers', function() {

    this.$get = ['$http', 'gaTileGrid', function($http, gaTileGrid) {

      var wmtsGetTileUrl = 'http://wmts.geo.admin.ch/1.0.0/{Layer}/default/' +
          '{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.jpeg';

      var layers = {};
      var promise = $http.get('layers.json').then(function(o) {
        layers = o.data.layers;
      });

      return {
        getOlLayerById: function(id) {
          return promise.then(function() {
            var layer = layers[id];
            var olLayer = layer.olLayer;
            if (!angular.isDefined(olLayer)) {
              if (layer.type == 'wmts') {
                olLayer = new ol.layer.TileLayer({
                  source: new ol.source.WMTS({
                    attributions: [
                      new ol.Attribution('&copy; Data: swisstopo')
                    ],
                    dimensions: {
                      'Time': layer.timestamps[0]
                    },
                    format: layer.format,
                    layer: id,
                    matrixSet: '21781_' + layer.matrixSet,
                    projection: 'EPSG:21781',
                    requestEncoding: 'REST',
                    tileGrid: gaTileGrid,
                    url: wmtsGetTileUrl.replace('{Layer}', id)
                  })
                });
                layer.olLayer = olLayer;
              }
            }
            return olLayer;
          });
        },

        getBackgroundLayers: function() {
          return promise.then(function() {
            var backgroundLayers = [];
            angular.forEach(layers, function(layer, id) {
              if (layer.background === true) {
                var backgroundLayer = angular.extend({
                  id: id
                }, layer);
                backgroundLayers.push(backgroundLayer);
              }
            });
            return backgroundLayers;
          });
        }
      };
    }];

  });

})();
