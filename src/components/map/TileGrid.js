goog.provide('ga_tilegrid_service');

(function() {

  var module = angular.module('ga_tilegrid_service', []);

  module.provider('gaTileGrid', function() {

    function createTileGrid(origin, resolutions, type) {
      if (type === 'wms') {
        return new ol.tilegrid.TileGrid({
          tileSize: 512,
          origin: origin,
          resolutions: resolutions
        });
      }
      return new ol.tilegrid.WMTS({
        matrixIds: $.map(resolutions, function(r, i) { return i + ''; }),
        origin: origin,
        resolutions: resolutions
      });
    }

    this.$get = function(gaGlobalOptions) {
      return {
        get: function(minResolution, type) {
          var resolutions = [].concat(gaGlobalOptions.tileGridResolutions);
          if (minResolution) { // we remove useless resolutions
            for (var i = 0, ii = resolutions.length; i < ii; i++) {
              if (resolutions[i] === minResolution) {
                resolutions = resolutions.splice(0, i + 1);
                break;
              } else if (resolutions[i] < minResolution) {
                resolutions = resolutions.splice(0, i);
                break;
              }
            }
          }
          return createTileGrid(gaGlobalOptions.tileGridOrigin, resolutions,
              type);
        }
      };
    };
  });
})();
