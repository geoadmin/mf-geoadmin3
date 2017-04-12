goog.provide('olcs.GaKmlSynchronizer');
goog.require('ol');
goog.require('olcs.util');
goog.require('olcs.AbstractSynchronizer');


/**
 * Unidirectionally synchronize geoadmin kml layers to Cesium.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.DataSourceCollection} dataSources
 * @constructor
 * @extends {olcs.AbstractSynchronizer}
 * @api
 * @struct
 */
olcs.GaKmlSynchronizer = function(map, scene, dataSources) {

  /**
   * @protected
   */
  this.dataSources_ = dataSources;

  olcs.AbstractSynchronizer.call(this, map, scene);
};
ol.inherits(olcs.GaKmlSynchronizer, olcs.AbstractSynchronizer);


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.createSingleLayerCounterparts =
    function(olLayer) {

  var dsP;
  var factory = olcs.util.obj(olLayer)['getCesiumDataSource'];

  if (factory) {
    dsP = factory(this.scene);
  }

  if (!dsP) {
    /** @type {string} */
    var url = olcs.util.obj(olLayer)['url'];

    if (!(olLayer instanceof ol.layer.Layer) || olLayer.get('type') != 'KML' ||
        !url || /:\/\/public\./.test(url)) {
      return null;
    }

    /** @type {string|Document} */
    var loadParam = url;

    /** @type {string} */
    var kml = olcs.util.obj(olLayer.getSource()).get('kmlString');
    if (kml) {
      loadParam = (new DOMParser()).parseFromString(kml, 'text/xml');
    }
    dsP = Cesium.KmlDataSource.load(loadParam, {
      camera: this.scene.camera,
      canvas: this.scene.canvas,
      clampToGround: true
    });
  }

  dsP.then(function(ds) {
    ds.show = olLayer.getVisible();
    olLayer.on('change:visible', function(evt) {
      ds.show = evt.target.getVisible();
    });
  });

  return [dsP];
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.addCesiumObject = function(dsP) {
  this.dataSources_.add(dsP);
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.destroyCesiumObject = function(dsP) {
  var that = this;
  dsP.then(function(ds) {
    that.dataSources_.remove(ds, true);
  });
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.removeSingleCesiumObject =
    function(dsP, destroy) {
  var that = this;
  dsP.then(function(ds) {
    that.dataSources_.remove(ds, destroy);
  });
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.removeAllCesiumObjects = function(destroy) {
  this.dataSources_.removeAll(destroy);
};

