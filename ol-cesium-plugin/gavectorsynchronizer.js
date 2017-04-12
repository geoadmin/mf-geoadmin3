goog.provide('olcs.GaVectorSynchronizer');
goog.require('ol');
goog.require('olcs.VectorSynchronizer');


/**
 * Unidirectionally synchronize OpenLayers vector layers to Cesium.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @param {olcs.FeatureConverter=} opt_converter
 * @constructor
 * @extends {olcs.VectorSynchronizer}
 * @api
 * @struct
 */
olcs.GaVectorSynchronizer = function(map, scene, opt_converter) {
  olcs.VectorSynchronizer.call(this, map, scene, opt_converter);
};
ol.inherits(olcs.GaVectorSynchronizer, olcs.VectorSynchronizer);


/**
 * @inheritDoc
 */
olcs.GaVectorSynchronizer.prototype.createSingleLayerCounterparts =
    function(olLayer) {
  if (olLayer.get('type') === 'KML' && olLayer.get('url') &&
      !/:\/\/public\./.test(olLayer.get('url'))) {
    return null;
  }
  return olcs.VectorSynchronizer.prototype.createSingleLayerCounterparts.call(this, olLayer);
};
