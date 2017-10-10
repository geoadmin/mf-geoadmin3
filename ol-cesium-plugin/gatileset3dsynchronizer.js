goog.provide('olcs.GaTileset3dSynchronizer');
goog.require('ol');
goog.require('olcs.util');
goog.require('olcs.AbstractSynchronizer');


/**
 * Unidirectionally synchronize geoadmin kml layers to Cesium.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @constructor
 * @extends {olcs.AbstractSynchronizer}
 * @api
 * @struct
 */
olcs.GaTileset3dSynchronizer = function(map, scene) {

  /**
   * @protected
   */
  this.primitives_ = new Cesium.PrimitiveCollection();
  scene.primitives.add(this.primitives_);
  olcs.AbstractSynchronizer.call(this, map, scene);
};
ol.inherits(olcs.GaTileset3dSynchronizer, olcs.AbstractSynchronizer);


/**
 * @inheritDoc
 */
olcs.GaTileset3dSynchronizer.prototype.createSingleLayerCounterparts =
    function(olLayer) {

  var prim;
  var factory = olcs.util.obj(olLayer)['getCesiumTileset3d'];

  if (factory) {
    prim = factory(this.scene);
  }

  if (!prim) {
    return null;
  }
  if (prim) {
    prim.show = olLayer.getVisible();
    const uid = ol.getUid(olLayer).toString();
    const listenKeyArray = [];
    listenKeyArray.push(olLayer.on(['change:visible'], (e) => {
      prim.show = olLayer.getVisible();
    }));
    this.olLayerListenKeys[uid].push(...listenKeyArray);
  }

  return [prim];
};


/**
 * @inheritDoc
 */
olcs.GaTileset3dSynchronizer.prototype.addCesiumObject = function(prim) {
  if (!this.primitives_.contains(prim)) {
    this.primitives_.add(prim);
  }
};


/**
 * @inheritDoc
 */
olcs.GaTileset3dSynchronizer.prototype.destroyCesiumObject = function(prim) {
  if (this.primitives_.contains(prim)) {
    this.primitives_.remove(prim);
  }
};


/**
 * @inheritDoc
 */
olcs.GaTileset3dSynchronizer.prototype.removeSingleCesiumObject =
    function(prim, destroy) {
  if (this.primitives_.contains(prim)) {
    this.primitives_.remove(prim);
  }
};


/**
 * @inheritDoc
 */
olcs.GaTileset3dSynchronizer.prototype.removeAllCesiumObjects = function(destroy) {
  this.primitives_.removeAll();
};

