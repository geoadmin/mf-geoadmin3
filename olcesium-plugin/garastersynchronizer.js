goog.provide('olcs.GaRasterSynchronizer');
goog.require('ol');
goog.require('olcs.util');
goog.require('olcs.RasterSynchronizer');



/**
 * Handle mapping OL3 2D layers to Cesium 3D Imageries in EPSG:4326.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @constructor
 * @extends {olcs.RasterSynchronizer}
 * @api
 */
olcs.GaRasterSynchronizer = function(map, scene) {
  olcs.RasterSynchronizer.call(this, map, scene);
};
ol.inherits(olcs.GaRasterSynchronizer, olcs.RasterSynchronizer);


/**
 * @override
 */
olcs.GaRasterSynchronizer.prototype.convertLayerToCesiumImageries =
    function(olLayer, viewProj) {

  if (olLayer instanceof ol.layer.Layer) {
    var source = olLayer.getSource();
    if (source instanceof ol.source.Vector) {
      return null;
    }
  }

  /**
   * @type {Cesium.ImageryProvider}
   */
  var provider = null;

  // Read custom, non standard properties
  var factory = olcs.util.obj(olLayer)['getCesiumImageryProvider'];
  if (!factory) {
    // root layer group
    return null;
  }
  provider = factory();
  if (!provider) {
    return null;
  }

  // the provider is always non-null if we got this far

  var providers = Array.isArray(provider) ? provider : [provider];
  return providers.map(function(p) {
    return new Cesium.ImageryLayer(p);
  });
};
