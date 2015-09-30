goog.provide('fps');



/**
 * @param {!Cesium.Scene} scene
 * @param {!Angular.Scope} scope
 * @constructor
 */
function FPS(scene, scope) {

  /**
   * @type {boolean}
   * @private
   */
  this.active_ = false;

  /**
   * @private
   */
  this.scene_ = scene;

  /**
   * @private
   */
  this.scope_ = scope;

  /**
   * @private
   */
  this.camera_ = scene.camera;

  /**
   * @private
   */
  this.ellipsoid_ = scene.globe.ellipsoid;

  /**
   * @type {Object.<string, boolean>}
   * @private
   */
  this.buttons_ = {
    shift: false,
    forward: false,
    backward: false,
    left: false,
    right: false
  };

  /**
   * @type {number}
   * @private
   */
  this.movementX_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.movementY_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.previousTime_ = undefined;

  /**
   * In meters/second.
   * @const {number}
   * @private
   */
  this.walkSpeed_ = 4 * 1000 / 3600;

  /**
   * In meters/second.
   * @const {number}
   * @private
   */
  this.runSpeed_ = 10 * 1000 / 3600;

  /**
   * Number of meters above terrain.
   * @const {number}
   * @private
   */
  this.heightAboveTerrain_ = 4;

  /**
   * @type {boolean}
   * @private
   */
  this.flyMode_ = false;

  document.addEventListener('keydown', this.onKey_.bind(this));
  document.addEventListener('keyup', this.onKey_.bind(this));
  document.addEventListener('mousemove', this.onMouseMove_.bind(this));
}


/**
 * Set the mode.
 * @param {boolean} flyMode
 */
FPS.prototype.setFlyMode = function(flyMode) {
  this.flyMode_ = flyMode;
  if (this.flyMode_) {
    this.heightAboveTerrain_ = 400;
    this.camera_.setView({
      pitch: 0.1
    });
  } else {
    this.heightAboveTerrain_ = 4;
    this.camera_.setView({
      pitch: 0.0,
      roll: 0.0
    });
  }
};


/**
 * @return {boolean}
 */
FPS.prototype.getActive = function() {
  return this.active_;
};


/**
 * @return {boolean}
 */
FPS.prototype.getFlyMode = function() {
  return this.flyMode_;
};


/**
 * @return {boolean}
 */
FPS.prototype.getJetMode = function() {
  return this.flyMode_ && this.buttons_.shift;
};


/**
 * @return {boolean}
 */
FPS.prototype.getPointerLock = function() {
  return !!(document.pointerLockElement || document.mozPointerLockElement);
};


/**
 * @private
 */
FPS.prototype.requestPointerLock_ = function() {
  if (this.scene_.canvas.requestPointerLock) {
    this.scene_.canvas.requestPointerLock();
  } else if (this.scene_.canvas.mozRequestPointerLock) {
    this.scene_.canvas.mozRequestPointerLock();
  }
};

/**
 * @param {boolean} enable
 * @private
 */
FPS.prototype.enableInputs_ = function(enable) {
  var controller = this.scene_.screenSpaceCameraController;
  controller.enableTranslate = enable;
  controller.enableZoom = enable;
  controller.enableRotate = enable;
  controller.enableTilt = enable;
  controller.enableLook = enable;
};


/**
 * @param {boolean} active
 */
FPS.prototype.setActive = function(active) {
  this.active_ = active;
  var positionCarto = this.camera_.positionCartographic;
  if (active) {
    this.requestPointerLock_();

    positionCarto.height = this.heightAboveTerrain_;
    this.scene_.camera.flyTo({
      destination: this.ellipsoid_.cartographicToCartesian(positionCarto),
      orientation: {
        heading: this.scene_.camera.heading,
        pitch: 0.0,
        roll: 0.0
      },
      complete: function() {
        this.scene_.postRender.addEventListener(this.tick_, this);
        this.enableInputs_(false);
      }.bind(this)
    });
  } else {
    this.setFlyMode(false);
    this.scene_.postRender.removeEventListener(this.tick_, this);
    this.enableInputs_(true);
    positionCarto.height = 4000; // FIXME
    this.scene_.camera.flyTo({
      destination: this.ellipsoid_.cartographicToCartesian(positionCarto),
      orientation: {
        heading: this.scene_.camera.heading,
        pitch: -Cesium.Math.PI_OVER_FOUR, // with -PI/2 transition points to sky
        roll: 0.0
      }
    });
  }
};


/**
 * Handle mouse move event.
 * @param {Event} event
 * @private
 */
FPS.prototype.onMouseMove_ = function(event) {
  if (this.getPointerLock()) {
    if (event.movementX && event.movementY) {
      this.movementX_ += event.movementX;
      this.movementY_ += event.movementY;
    } else if (event.mozMovementX && event.mozMovementY) {
      this.movementX_ += event.mozMovementX;
      this.movementY_ += event.mozMovementY;
    }
  }
};


/**
 * Handle key event.
 * @param {Event} event
 * @private
 */
FPS.prototype.onKey_ = function(event) {
  if (this.active_) {
    this.scope_.$apply(function() {
      var pressed = event.type == 'keydown';
      this.buttons_.shift = event.shiftKey;
      if (event.keyCode == 65 || event.keyCode == 37) {
        // A or Left.
        this.buttons_.left = pressed;
      } else if (event.keyCode == 68 || event.keyCode == 39) {
        // D or Right.
        this.buttons_.right = pressed;
      } else if (event.keyCode == 87 || event.keyCode == 38) {
        // W or Up.
        this.buttons_.forward = pressed;
      } else if (event.keyCode == 83 || event.keyCode == 40) {
        // S or Down.
        this.buttons_.backward = pressed;
      } else if (pressed && event.keyCode == 70) {
        // F
        this.setFlyMode(!this.flyMode_);
      }
    }.bind(this));
  }
};


/**
 * Tick.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.JulianDate} time
 * @private
 */
FPS.prototype.tick_ = function(scene, time) {
  var delta = this.getTimeDifference_();
  if (this.flyMode_) {
    this.flyModeTick_(delta);
  } else {
    this.manTick_(delta);
  }
};


/**
 * Tick.
 * @return {number}
 * @private
 */
FPS.prototype.getTimeDifference_ = function() {
  var now = new Date().getTime();
  if (!this.previousTime_) {
    this.previousTime_ = now;
  }

  var delta = now - this.previousTime_;
  this.previousTime_ = now;
  return delta;
};


/**
 * Clamp a point above terrain
 * @param {!Cesium.Cartesian3} gpos
 * @param {number} minHeight
 * @param {number=} opt_maxHeight
 * @return {!Cesium.Cartesian3}
 * @private
 */
FPS.prototype.clampAboveTerrain_ = function(gpos, minHeight, opt_maxHeight) {
  var lla = this.ellipsoid_.cartesianToCartographic(gpos);
  var groundAlt = Cesium.defaultValue(this.scene_.globe.getHeight(lla), 0.0);
  if (lla.height - groundAlt < minHeight) {
    lla.height = groundAlt + minHeight;
  }
  if (opt_maxHeight && (lla.height - groundAlt > opt_maxHeight)) {
    lla.height = groundAlt + opt_maxHeight;
  }
  return this.ellipsoid_.cartographicToCartesian(lla);
};


/**
 * Tick.
 * @param {number} delta
 * @private
 */
FPS.prototype.flyModeTick_ = function(delta) {
  var heading = this.camera_.heading;
  var pitch = this.camera_.pitch;

  // update camera orientation
  var angleX = Cesium.Math.convertLongitudeRange(this.camera_.roll);
  if (Math.abs(angleX) > 0.20) {
    this.movementX_ = angleX / 4;
  }
  heading += this.movementX_ * 0.025;
  this.movementX_ = 0;

  // update camera position
  // 50x faster than the pysical speed
  var speed = this.buttons_.shift ? this.runSpeed_ : this.walkSpeed_;
  var moveAmount = 50 * speed * delta / 1000;
  if (this.buttons_.left) {
    this.camera_.twistLeft();
  }
  if (this.buttons_.right) {
    this.camera_.twistRight();
  }
  if (this.buttons_.forward) {
    pitch -= 0.02;
  }
  if (this.buttons_.backward) {
    pitch += 0.02;
  }

  this.camera_.moveForward(moveAmount);

  var gpos = this.clampAboveTerrain_(this.camera_.position, 2);

  this.camera_.setView({
    position: gpos,
    heading: heading,
    pitch: pitch
  });
};


/**
 * Tick.
 * @param {number} delta
 * @private
 */
FPS.prototype.manTick_ = function(delta) {
  var heading = this.camera_.heading;
  var pitch = this.camera_.pitch;

  // update camera orientation
  heading += this.movementX_ * 0.002;
  this.movementX_ = 0;

  pitch -= this.movementY_ * 0.002;
  pitch = Math.max(-Cesium.Math.PI_OVER_FOUR, pitch);
  pitch = Math.min(0.3, pitch);
  this.movementY_ = 0;

  // update camera position
  // 50x faster than the pysical speed
  var speed = this.buttons_.shift ? this.runSpeed_ : this.walkSpeed_;
  var moveAmount = 50 * speed * delta / 1000;
  if (this.buttons_.left) {
    this.camera_.moveLeft(moveAmount);
  }
  if (this.buttons_.right) {
    this.camera_.moveRight(moveAmount);
  }
  if (this.buttons_.forward) {
    this.camera_.moveForward(moveAmount);
  }
  if (this.buttons_.backward) {
    this.camera_.moveBackward(moveAmount);
  }

  var gpos = this.clampAboveTerrain_(this.camera_.position, 2, 2);

  this.camera_.setView({
    position: gpos,
    heading: heading,
    pitch: pitch
  });
};
