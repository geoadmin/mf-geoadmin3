goog.provide('ga_tilegrid_service');

(function() {

  var module = angular.module('ga_tilegrid_service', []);

  module.provider('gaTileGrid', function() {
    var origin = [2420000, 1350000];

    function getDefaultResolutions() {
      return [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250,
        2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250,
        100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5];
    }

    function getWmsResolutions() {
      return getDefaultResolutions().concat([0.25, 0.1]);
    }

    function createTileGrid(resolutions, type) {
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

    this.$get = function() {
      return {
        get: function(resolutions, minResolution, type) {
          if (!resolutions) {
            resolutions = (type === 'wms') ? getWmsResolutions() :
              getDefaultResolutions();
          }
          if (minResolution) { // we remove useless resolutions
            for (var i = 0, ii = resolutions.length; i < ii; i++) {
              if (resolutions[i] === minResolution) {
                resolutions = resolutions.splice(0, i + 1);
                break;
              }
            }
          }
          return createTileGrid(resolutions, type);
        }
      };
    };
  });
})();
