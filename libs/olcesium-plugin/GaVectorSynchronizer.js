/**
 * @module olcs.GaVectorSynchronizer
 */
import olcsVectorSynchronizer from './VectorSynchronizer.js';

const exports = class extends olcsVectorSynchronizer {

  createSingleLayerCounterparts(olLayerWithParents) {

    const layer = olLayerWithParents.layer;

    /** @type {string} */
    const id = layer.id;

    /** @type {string} */
    const url = layer.url;

    if (/^KML/.test(id) && url && !/:\/\/public\./.test(url)) {
      return null;
    }
    return super.createSingleLayerCounterparts(olLayerWithParents);
  }
};


export default exports;
