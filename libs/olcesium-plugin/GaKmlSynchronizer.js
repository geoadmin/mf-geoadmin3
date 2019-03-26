/**
 * @module olcs.GaKmlSynchronizer
 */
import Layer from 'ol/layer/Layer.js';
import VectorLayer from 'ol/layer/Vector.js';
import {getUid} from './util.js';
import olcsAbstractSynchronizer from './AbstractSynchronizer.js';

const exports = class extends olcsAbstractSynchronizer {
  /**
   * Unidirectionally synchronize geoadmin kml layers to Cesium.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @param {!Cesium.DataSourceCollection} dataSources
   */
  constructor(map, scene, dataSources) {

    super(map, scene);

    /**
     * @protected
     */
    this.dataSources_ = dataSources;
  }

  createSingleLayerCounterparts(olLayerWithParents) {

    let dsP;
    const layer = olLayerWithParents.layer;
    const factory = layer['getCesiumDataSource'];

    if (factory) {
      dsP = factory(this.scene);
    }

    if (!dsP) {

      /** @type {string} */
      const id = layer.id;

      /** @type {string} */
      const url = layer.url;

      if (!(layer instanceof Layer) ||
          !id || !/^KML/.test(id) ||
          !url || /:\/\/public\./.test(url)) {
        return null;
      }

      /** @type {string|Document} */
      let loadParam = url;

      /** @type {string} */
      const kml = `${layer.getSource().get('rawData') || ''}`;
      if (kml) {
        loadParam = (new DOMParser()).parseFromString(kml, 'text/xml');
      }
      dsP = Cesium.KmlDataSource.load(loadParam, {
        camera: this.scene.camera,
        canvas: this.scene.canvas,
        clampToGround: true
      });
    }
    const that = this;
    dsP.then((ds) => {
      ds.show = layer.getVisible();
      const uid = getUid(layer).toString();
      const listenKeyArray = [];
      listenKeyArray.push(layer.on('change:visible', (evt) => {
        ds.show = evt.target.getVisible();
      }));
      that.olLayerListenKeys[uid].push(...listenKeyArray);

      // Add link between OL and Cesium features.
      if (layer instanceof VectorLayer) {
        layer.getSource().getFeatures().forEach((feature) => {
          if (ds.entities.getById) {
            const entity = ds.entities.getById(feature.getId());
            if (entity) {
              entity['olFeature'] = feature;
              entity['olLayer'] = layer;
            }
          }
        });
      }
    });

    return [dsP];
  }


  addCesiumObject(dsP) {
    this.dataSources_.add(dsP);
  }


  /**
   * @inheritDoc
   */
  destroyCesiumObject(dsP) {
    const that = this;
    dsP.then((ds) => {
      that.dataSources_.remove(ds, true);
    });
  }


  /**
   * @inheritDoc
   */
  removeSingleCesiumObject(dsP, destroy) {
    const that = this;
    dsP.then((ds) => {
      that.dataSources_.remove(ds, destroy);
    });
  }


  /**
   * @inheritDoc
   */
  removeAllCesiumObjects(destroy) {
    this.dataSources_.removeAll(destroy);
  }
};


export default exports;
