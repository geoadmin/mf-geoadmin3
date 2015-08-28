goog.provide('ga.GaRasterSynchronizer');
goog.require('olcs.RasterSynchronizer');



/**
 * Handle mapping OL3 2D layers to Cesium 3D Imageries in EPSG:4326.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @constructor
 * @extends {olcs.RasterSynchronizer}
 * @api
 */
ga.GaRasterSynchronizer = function(map, scene) {
  goog.base(this, map, scene);
};
goog.inherits(ga.GaRasterSynchronizer, olcs.RasterSynchronizer);


/**
 * @override
 */
ga.GaRasterSynchronizer.prototype.convertLayerToCesiumImagery =
    function(olLayer, viewProj) {

  /**
   * @type {Cesium.ImageryProvider}
   */
  var provider = null;
  var source = olLayer.getSource();

  if (source instanceof ol.source.Vector) {
    return null;
  }

  // Read custom, non standard properties
  var layerId = olLayer['id'];
  var layerTime = olLayer['time'];

  if (source instanceof ol.source.WMTS) {
    provider = new Cesium.WebMapTileServiceImageryProvider({
      url: 'https://mf-chsdi3.dev.bgdi.ch/mom_fix_1594/1.0.0/' +
         layerId + '/{Style}/' + layerTime +
         '/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
      layer : layerId,
      style : 'default',
      format : 'image/png',
      tileMatrixSetID : '4326',
      // Is a custom Cesium.GeographicTilingScheme necessary?
      tilingScheme: new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1,
        rectangle: new Cesium.Rectangle(
          Cesium.Math.toRadians(-180.0),
          Cesium.Math.toRadians(-90.0),
          Cesium.Math.toRadians(180.0),
          Cesium.Math.toRadians(90.0))
      }),
      maximumLevel: 19
    });
  } else if (source instanceof ol.source.TileWMS ||
             source instanceof ol.source.ImageWMS) {
    provider = new Cesium.WebMapServiceImageryProvider({
      url: source.getUrls ? source.getUrls()[0] :
                            /** @type {string} */ (source.getUrl()),
      layers: layerId,
      parameters: {format:'image/png'}
    });
  } else {
    throw new Error('We do not handle this case');
  }

  // the provider is always non-null if we got this far

  var layerOptions = {};

  var ext = olLayer.getExtent();
  if (goog.isDefAndNotNull(ext) && !goog.isNull(viewProj)) {
    layerOptions.rectangle = olcs.core.extentToRectangle(ext, viewProj);
  }

  return new Cesium.ImageryLayer(provider, layerOptions);
};
