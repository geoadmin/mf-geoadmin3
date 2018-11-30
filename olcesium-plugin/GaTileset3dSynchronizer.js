/**
 * @module olcs.GaTileset3dSynchronizer
 */
import {getUid} from './util.js';
import olcsAbstractSynchronizer from './AbstractSynchronizer.js';

const exports = class extends olcsAbstractSynchronizer {
  /**
   * Unidirectionally synchronize geoadmin kml layers to Cesium.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   */
  constructor(map, scene) {
    super(map, scene);

    /**
     * @protected
     */
    this.primitives_ = new Cesium.PrimitiveCollection();
    scene.primitives.add(this.primitives_);
  }

  createSingleLayerCounterparts(olLayerWithParents) {
    let prim;
    const layer = olLayerWithParents.layer;
    const factory = layer['getCesiumTileset3d'];

    if (factory) {
      prim = factory(this.scene);
    }

    if (!prim) {
      return null;
    }
    if (prim) {
      prim.show = layer.getVisible();
      const uid = getUid(layer).toString();
      const listenKeyArray = [];
      listenKeyArray.push(layer.on(['change:visible'], (e) => {
        prim.show = layer.getVisible();
      }));
      this.olLayerListenKeys[uid].push(...listenKeyArray);
    }

    return [prim];
  }

  addCesiumObject(prim) {
    if (!this.primitives_.contains(prim)) {
      this.primitives_.add(prim);
    }
  }


  destroyCesiumObject(prim) {
    if (this.primitives_.contains(prim)) {
      this.primitives_.remove(prim);
    }
  }

  removeSingleCesiumObject(prim, destroy) {
    if (this.primitives_.contains(prim)) {
      this.primitives_.remove(prim);
    }
  }

  removeAllCesiumObjects(destroy) {
    this.primitives_.removeAll();
  }
};


export default exports;
