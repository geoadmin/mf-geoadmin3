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
ga.GaRasterSynchronizer.prototype.convertLayerToCesiumImageries =
    function(olLayer, viewProj) {

  /**
   * @type {Cesium.ImageryProvider}
   */
  var provider = null;

  var isGroup = olLayer instanceof ol.layer.Group;
  if (!isGroup && (olLayer.getSource() instanceof ol.source.Vector)) {
    return null;
  }

  // Read custom, non standard properties
  var factory = olLayer['getCesiumImageryProvider'];
  if (!factory) {
    // root layer group
    return null;
  }
  provider = factory();
  if (!provider) {
    return null;
  }

  // the provider is always non-null if we got this far

  var layerOptions = {};

  var ext = olLayer.getExtent();
  if (goog.isDefAndNotNull(ext) && !goog.isNull(viewProj)) {
    layerOptions.rectangle = olcs.core.extentToRectangle(ext, viewProj);
  }

  var providers = Array.isArray(provider) ? provider : [provider];
  return providers.map(function(p) {
    return new Cesium.ImageryLayer(p, layerOptions);
  });
};
