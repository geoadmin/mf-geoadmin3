/**
 * @module olcs.GaRasterSynchronizer
 */
import Layer from 'ol/layer/Layer.js';
import Vector from 'ol/source/Vector.js';
import olcsRasterSynchronizer from './RasterSynchronizer.js';

const exports = class extends olcsRasterSynchronizer {

  /**
   * @override
   */
  convertLayerToCesiumImageries(olLayer, viewProj) {

    if (olLayer instanceof Layer) {
      const source = olLayer.getSource();
      if (source instanceof Vector) {
        return null;
      }
    }

    /**
     * @type {Cesium.ImageryProvider}
     */
    let provider = null;

    // Read custom, non standard properties
    const factory = olLayer['getCesiumImageryProvider'];
    if (!factory) {
      // root layer group
      return null;
    }
    provider = factory();
    if (!provider) {
      return null;
    }

    // the provider is always non-null if we got this far

    const providers = Array.isArray(provider) ? provider : [provider];
    return providers.map(p => new Cesium.ImageryLayer(p));
  }
};


export default exports;
