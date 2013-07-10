(function() {
  goog.provide('ga_map_service');

  var module = angular.module('ga_map_service', []);

  module.provider('gaLayers', function() {

    this.$get = ['$http', function($http) {

      var wmtsGetTileUrl = 'http://wmts.geo.admin.ch/1.0.0/{Layer}/default/' +
          '{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.jpeg';

      var layers = {};
      var tileGrid;

      var promise = $http.get('layers.json').then(function(o) {
        var i;
        var data = o.data;

        for (i = 0; i < data.layers.length; ++i) {
          layers[data.layers[i].idBod] = data.layers[i];
        }

        var tileInfo = data.tileInfo;
        var origin = [tileInfo.origin.x, tileInfo.origin.y];
        var tileSize = [tileInfo.cols, tileInfo.rows];
        var lods = tileInfo.lods;
        var numLods = lods.length;
        var resolutions = new Array(numLods);
        var matrixIds = new Array(numLods);

        for (i = 0; i < numLods; ++i) {
          resolutions[i] = +lods[i].resolution;
          matrixIds[i] = lods[i].level + '';
        }

        tileGrid = new ol.tilegrid.WMTS({
          matrixIds: matrixIds,
          origin: origin,
          resolutions: resolutions,
          tileSize: tileSize
        });
      });

      return {
        getLayerById: function(id) {
          return promise.then(function() {
            var layer = layers[id];
            var olLayer = layer.olLayer;
            if (!angular.isDefined(olLayer)) {
              if (layer.attributes.layerType == 'wmts') {
                olLayer = new ol.layer.TileLayer({
                  source: new ol.source.WMTS({
                    attributions: [
                      new ol.Attribution('&copy; Data: swisstopo')
                    ],
                    dimensions: {
                      'Time': layer.attributes.timestamps[0]
                    },
                    format: layer.attributes.format,
                    layer: id,
                    matrixSet: '21781_' + layer.attributes.tileMatrixSet,
                    projection: 'EPSG:21781',
                    requestEncoding: 'REST',
                    tileGrid: tileGrid,
                    url: wmtsGetTileUrl.replace('{Layer}', id)
                  })
                });
                layer.olLayer = olLayer;
              }
            }
            return olLayer;
          });
        }
      };
    }];

  });

})();
