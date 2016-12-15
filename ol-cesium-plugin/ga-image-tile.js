goog.provide('ol.GaImageTile');

goog.require('ol');
goog.require('ol.Tile');
goog.require('ol.dom');
goog.require('ol.events');
goog.require('ol.events.EventType');


/**
 * @constructor
 * @extends {ol.Tile}
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {ol.TileState} state State.
 * @param {string} src Image source URI.
 * @param {?string} crossOrigin Cross origin.
 * @param {ol.TileLoadFunctionType} tileLoadFunction Tile load function.
 * @api
 */
ol.GaImageTile = function(tileCoord, state, src, crossOrigin, tileLoadFunction) {

  ol.Tile.call(this, tileCoord, state);

  /**
   * Image URI
   *
   * @private
   * @type {string}
   */
  this.src_ = src;

  /**
   * @private
   * @type {Image|HTMLCanvasElement}
   */
  this.image_ = new Image();
  if (crossOrigin !== null) {
    this.image_.crossOrigin = crossOrigin;
  }

  /**
   * @private
   * @type {Array.<ol.EventsKey>}
   */
  this.imageListenerKeys_ = null;

  /**
   * @private
   * @type {ol.TileLoadFunctionType}
   */
  this.tileLoadFunction_ = tileLoadFunction;

};
ol.inherits(ol.GaImageTile, ol.Tile);


/**
 * @inheritDoc
 */
ol.GaImageTile.prototype.disposeInternal = function() {
  if (this.state == ol.TileState.LOADING) {
    this.unlistenImage_();
  }
  if (this.interimTile) {
    this.interimTile.dispose();
  }
  this.state = ol.TileState.ABORT;
  this.changed();
  ol.Tile.prototype.disposeInternal.call(this);
};


/**
 * Get the image element for this tile.
 * @inheritDoc
 * @api
 */
ol.GaImageTile.prototype.getImage = function() {
  return this.image_;
};


/**
 * @inheritDoc
 */
ol.GaImageTile.prototype.getKey = function() {
  return this.src_;
};


/**
 * Tracks loading or read errors.
 *
 * @private
 */
ol.GaImageTile.prototype.handleImageError_ = function() {
  var ctx = ol.dom.createCanvasContext2D(1, 1);
  ctx.fillRect(0, 0, 1, 1);
  this.image_ = ctx.canvas;
  this.state = ol.TileState.LOADED;
  this.unlistenImage_();
  this.changed();
};


/**
 * Tracks successful image load.
 *
 * @private
 */
ol.GaImageTile.prototype.handleImageLoad_ = function() {
  if (this.image_.naturalWidth && this.image_.naturalHeight) {
    this.state = ol.TileState.LOADED;
  } else {
    this.state = ol.TileState.EMPTY;
  }
  this.unlistenImage_();
  this.changed();
};


/**
 * Load the image or retry if loading previously failed.
 * Loading is taken care of by the tile queue, and calling this method is
 * only needed for preloading or for reloading in case of an error.
 * @override
 */
ol.GaImageTile.prototype.load = function() {
  if (this.state == ol.TileState.IDLE || this.state == ol.TileState.ERROR) {
    this.state = ol.TileState.LOADING;
    this.changed();
    this.imageListenerKeys_ = [
      ol.events.listenOnce(this.image_, ol.events.EventType.ERROR,
          this.handleImageError_, this),
      ol.events.listenOnce(this.image_, ol.events.EventType.LOAD,
          this.handleImageLoad_, this)
    ];
    this.tileLoadFunction_(this, this.src_);
  }
};


/**
 * Discards event handlers which listen for load completion or errors.
 *
 * @private
 */
ol.GaImageTile.prototype.unlistenImage_ = function() {
  this.imageListenerKeys_.forEach(ol.events.unlistenByKey);
  this.imageListenerKeys_ = null;
};
