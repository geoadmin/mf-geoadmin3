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
  provider = olLayer['getCesiumImageryProvider']();
  if (!provider) {
    return null;
  }

  // the provider is always non-null if we got this far

  var layerOptions = {};

  var ext = olLayer.getExtent();
  if (goog.isDefAndNotNull(ext) && !goog.isNull(viewProj)) {
    layerOptions.rectangle = olcs.core.extentToRectangle(ext, viewProj);
  }

  return new Cesium.ImageryLayer(provider, layerOptions);
};
