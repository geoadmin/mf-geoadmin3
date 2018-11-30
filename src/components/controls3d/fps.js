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
   * Slow down the mouse movement
   * @const {number}
   * @private
   */
  this.mouseMovementLag_ = 0.1;

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
  this.walkSpeed_ = 6000 / 3600;

  /**
   * In meters/second.
   * @const {number}
   * @private
   */
  this.runSpeed_ = 7 * this.walkSpeed_;

  /**
   * In meters/second. ~ Pilatus PC-6 cruise speed
   * @const {number}
   * @private
   */
  this.flySpeed_ = 69;

  /**
   * In meters/second. ~ FA18 top speed
   * @const {number}
   * @private
   */
  this.jetSpeed_ = 500;

  /**
   * @type {boolean}
   * @private
   */
  this.flyMode_ = false;

  /**
   * @type {number}
   * @private
   */
  this.minimumZoomDistance_ = undefined;

  document.addEventListener('keydown', this.onKey_.bind(this));
  document.addEventListener('keyup', this.onKey_.bind(this));
  document.addEventListener('mousemove', this.onMouseMove_.bind(this));

  document.addEventListener('pointerlockchange',
      this.onPointerLockChange_.bind(this));
  document.addEventListener('mozpointerlockchange',
      this.onPointerLockChange_.bind(this));
}

Object.defineProperties(FPS.prototype, {
  active: {
    get: function() {
      return this.active_;
    }
  },
  flyMode: {
    get: function() {
      return this.flyMode_;
    }
  },
  jetMode: {
    get: function() {
      return this.flyMode_ && this.buttons_.shift;
    }
  }
});

/**
 * Set the mode.
 * @param {boolean} flyMode
 */
FPS.prototype.setFlyMode = function(flyMode) {
  this.flyMode_ = flyMode;
  if (this.flyMode_) {
    this.camera_.setView({
      orientation: {
        heading: this.scene_.camera.heading,
        pitch: 0.1
      }
    });
  } else {
    this.camera_.setView({
      orientation: {
        heading: this.scene_.camera.heading,
        pitch: 0.0,
        roll: 0.0
      }
    });
  }
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
 * @param {?Cesium.Cartesian3} optPosition
 */
FPS.prototype.setActive = function(active, optPosition) {
  var positionCarto;
  if (optPosition) {
    positionCarto = this.ellipsoid_.cartesianToCartographic(optPosition);
  } else {
    positionCarto = this.camera_.positionCartographic;
  }
  this.active_ = active;

  var spaceController = this.scene_.screenSpaceCameraController;
  if (active) {
    this.requestPointerLock_();

    // deactivate the minimumZoomDistance
    this.minimumZoomDistance_ = spaceController.minimumZoomDistance;
    spaceController.minimumZoomDistance = 0;

    positionCarto.height = 2;
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

    // re-activate the minimumZoomDistance
    spaceController.minimumZoomDistance = this.minimumZoomDistance_;

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
      this.movementX_ += event.movementX * this.mouseMovementLag_;
      this.movementY_ += event.movementY * this.mouseMovementLag_;
    } else if (event.mozMovementX && event.mozMovementY) {
      this.movementX_ += event.mozMovementX * this.mouseMovementLag_;
      this.movementY_ += event.mozMovementY * this.mouseMovementLag_;
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
    this.scope_.$applyAsync(function() {
      var pressed = event.type === 'keydown';
      this.buttons_.shift = event.shiftKey;
      if (event.keyCode === 65 || event.keyCode === 37) {
        // A or Left.
        this.buttons_.left = pressed;
      } else if (event.keyCode === 68 || event.keyCode === 39) {
        // D or Right.
        this.buttons_.right = pressed;
      } else if (event.keyCode === 87 || event.keyCode === 38) {
        // W or Up.
        this.buttons_.forward = pressed;
      } else if (event.keyCode === 83 || event.keyCode === 40) {
        // S or Down.
        this.buttons_.backward = pressed;
      } else if (pressed && event.keyCode === 70) {
        // F
        this.setFlyMode(!this.flyMode_);
      } else if (pressed && event.keyCode === 27) {
        // esc
        this.setActive(false);
      }
    }.bind(this));
  }
};

/**
 * Handle pointer lock change event.
 * @param {Event} event
 * @private
 */
FPS.prototype.onPointerLockChange_ = function(event) {
  if (!this.getPointerLock()) {
    this.setActive(false);
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
 * @param {number=} optMaxHeight
 * @return {!Cesium.Cartesian3}
 * @private
 */
FPS.prototype.clampAboveTerrain_ = function(gpos, minHeight, optMaxHeight) {
  var lla = this.ellipsoid_.cartesianToCartographic(gpos);
  var groundAlt = Cesium.defaultValue(this.scene_.globe.getHeight(lla), 0.0);
  if (lla.height - groundAlt < minHeight) {
    lla.height = groundAlt + minHeight;
  }
  if (optMaxHeight && (lla.height - groundAlt > optMaxHeight)) {
    lla.height = groundAlt + optMaxHeight;
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
  var roll = this.camera_.roll;

  // update camera position
  var speed = this.buttons_.shift ? this.jetSpeed_ : this.flySpeed_;
  var moveAmount = speed * delta / 1000;
  if (this.buttons_.left) {
    roll -= 0.02;
  }
  if (this.buttons_.right) {
    roll += 0.02;
  }
  if (this.buttons_.forward) {
    pitch -= 0.02 * Math.cos(roll);
    heading -= 0.02 * Math.sin(roll);
  }
  if (this.buttons_.backward) {
    pitch += 0.02 * Math.cos(roll);
    heading += 0.02 * Math.sin(roll);
  }
  // rotate the plane on roll
  if (roll < Cesium.Math.PI) {
    // turn right
    heading += roll / 250;
  } else {
    // turn left
    heading -= (Cesium.Math.TWO_PI - roll) / 250;
  }

  this.camera_.moveForward(moveAmount);

  var gpos = this.clampAboveTerrain_(this.camera_.position, 2);

  this.camera_.setView({
    destination: gpos,
    orientation: {
      heading: heading,
      pitch: pitch,
      roll: roll
    }
  });
};

/**
 * Tick.
 * @param {number} delta
 * @private
 */
FPS.prototype.manTick_ = function(delta) {
  var hasPointerLock = this.getPointerLock();
  var heading = this.camera_.heading;
  var pitch = this.camera_.pitch;

  // update camera orientation
  heading += this.movementX_ * 0.003;
  this.movementX_ = 0;

  pitch -= this.movementY_ * 0.003;
  pitch = Math.max(-Cesium.Math.PI_OVER_FOUR, pitch);
  pitch = Math.min(0.3, pitch);
  this.movementY_ = 0;

  // update camera position
  var speed = this.buttons_.shift ? this.runSpeed_ : this.walkSpeed_;
  var moveAmount = speed * delta / 1000;
  if (this.buttons_.left) {
    if (hasPointerLock) {
      this.camera_.moveLeft(moveAmount);
    } else {
      heading -= 0.03;
    }
  }
  if (this.buttons_.right) {
    if (hasPointerLock) {
      this.camera_.moveRight(moveAmount);
    } else {
      heading += 0.03;
    }
  }
  if (this.buttons_.forward) {
    this.camera_.moveForward(moveAmount);
  }
  if (this.buttons_.backward) {
    this.camera_.moveBackward(moveAmount);
  }

  var gpos = this.clampAboveTerrain_(this.camera_.position, 2, 2);

  this.camera_.setView({
    destination: gpos,
    orientation: {
      heading: heading,
      pitch: pitch
    }
  });
};
