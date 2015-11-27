goog.provide('ga_cesium');

/**
 * Class to handle cesium library and cesium view
 *
 * @param {ol.Map} map
 * @param {Object} gaPermalink
 * @param {Object} gaLayers
 * @param {Object} gaGlobalOptions
 * @param {Object} gaBrowserSniffer
 * @param {Object} $q
 * @param {Object} $translate
 *
 * @constructor
 */
var GaCesium = function(map, gaPermalink, gaLayers, gaGlobalOptions,
    gaBrowserSniffer, $q, $translate) {
  // Url of ol3cesium library
  var ol3CesiumLibUrl = gaGlobalOptions.resourceUrl;
  if (gaGlobalOptions.buildMode === 'prod') {
    ol3CesiumLibUrl += 'lib/Cesium.min.js';
  } else {
    ol3CesiumLibUrl += 'lib/Cesium/Cesium.js';
  }
  var cesiumLoaded = $q.defer();
  var cesiumClients = $q.defer();
  var ol3d = undefined;
  var rotateOnEnable = true;

  // the maxium extent in EPSG:4326 and radians
  var extent4326 = ol.proj.transformExtent(gaGlobalOptions.defaultExtent,
      'EPSG:21781', 'EPSG:4326');
  extent4326 = extent4326.map(function(angle) {
    return angle * Math.PI / 180;
  });

  var intParam = function(name, defaultValue) {
    var params = gaPermalink.getParams();
    return parseInt(params[name] || defaultValue, 10);
  };

  var floatParam = function(name, defaultValue) {
    var params = gaPermalink.getParams();
    return parseFloat(params[name] || defaultValue);
  };

  var boolParam = function(name, defaultValue) {
    var params = gaPermalink.getParams();
    var value = params[name];
    if (value !== undefined) {
      return value == 'true' || value == '1';
    }
    return defaultValue;
  };

  var arrayParam = function(name, defaultValue) {
    var params = gaPermalink.getParams()[name];
    var arr = (params && params.length) ? params.split(',') : defaultValue;
    if (arr) {
      arr.forEach(function(item, i) {
        arr[i] = parseInt(item, 10);
      });
    }
    return arr;
  };

  // Create the cesium viewer with basic layers
  var initCesiumViewer = function(map, enabled) {
    var tileCacheSize = intParam('tileCacheSize', '100');
    var maximumScreenSpaceError = floatParam('maximumScreenSpaceError', '2');
    var fogEnabled = boolParam('fogEnabled', true);
    var fogDensity = floatParam('fogDensity', '0.0001');
    var fogSseFactor = floatParam('fogSseFactor', '25');
    var terrainLevels = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    window.minimumRetrievingLevel = intParam('minimumRetrievingLevel', '5');
    window.terrainAvailableLevels = arrayParam('terrainLevels', terrainLevels);
    window.imageryAvailableLevels = arrayParam('imageryLevels', undefined);

    var cesiumViewer;
    try {
      cesiumViewer = new olcs.OLCesium({
        map: map,
        createSynchronizers: function(map, scene) {
           return [
             new olcs.GaRasterSynchronizer(map, scene),
             new olcs.VectorSynchronizer(map, scene)
           ];
        }
      });
      if (boolParam('autorender', true)) {
        cesiumViewer.enableAutoRenderLoop();
      }

      var corrector = new SSECorrector(gaPermalink);
      cesiumViewer.getCesiumScene().globe._surface.sseCorrector = corrector;
    } catch (e) {
      alert(e.message);
      window.console.error(e.stack);
      return;
    }
    var globe = cesiumViewer.getCesiumScene().globe;
    globe.baseColor = Cesium.Color.WHITE;
    globe.tileCacheSize = tileCacheSize;
    globe.maximumScreenSpaceError = maximumScreenSpaceError;
    var scene = cesiumViewer.getCesiumScene();
    scene.backgroundColor = Cesium.Color.WHITE;
    scene.globe.depthTestAgainstTerrain = true;
    scene.screenSpaceCameraController.maximumZoomDistance = 500000;
    scene.terrainProvider =
        gaLayers.getCesiumTerrainProviderById(gaGlobalOptions.defaultTerrain);
    scene.postRender.addEventListener(limitCamera, scene);
    scene.fog.enabled = fogEnabled;
    scene.fog.density = fogDensity;
    scene.fog.screenSpaceErrorFactor = fogSseFactor;
    enableOl3d(cesiumViewer, enabled);
    return cesiumViewer;
  };

  var limitCamera = function() {
    var pos = this.camera.positionCartographic.clone();
    var inside = ol.extent.containsXY(extent4326, pos.longitude, pos.latitude);
    if (!inside) {
      // add a padding based on the camera height
      var maxHeight = this.screenSpaceCameraController.maximumZoomDistance;
      var padding = pos.height * 0.05 / maxHeight;
      pos.longitude = Math.max(extent4326[0] - padding, pos.longitude);
      pos.latitude = Math.max(extent4326[1] - padding, pos.latitude);
      pos.longitude = Math.min(extent4326[2] + padding, pos.longitude);
      pos.latitude = Math.min(extent4326[3] + padding, pos.latitude);
      this.camera.setView({
        destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(pos),
        orientation: {
          heading: this.camera.heading,
          pitch: this.camera.pitch
        }
      });
    }
    // Set the minimumZoomDistance according to the camera height
    var minimumZoomDistance = pos.height > 1800 ? 400 : 200;
    this.screenSpaceCameraController.minimumZoomDistance = minimumZoomDistance;
  };

  var enableOl3d = function(ol3d, enable) {
    var scene = ol3d.getCesiumScene();
    var camera = scene.camera;
    var bottom = olcs.core.pickBottomPoint(scene);
    var transform = Cesium.Matrix4.fromTranslation(bottom);
    if (enable) {
      //Show warning on IE browsers
      if (gaBrowserSniffer.msie &&
          gaBrowserSniffer.msie <= 11) {
        alert($translate.instant('3d_ie11_alert'));
      }
      // 2d -> 3d transition
      ol3d.setEnabled(true);
      var angle = Cesium.Math.toRadians(50);
      // This guard is used because the rotation is in conflict
      // with the permalink driven initilisation of the view in
      // the map directive. It's ... clumsy.
      if (rotateOnEnable) {
        olcs.core.rotateAroundAxis(camera, -angle, camera.right, transform);
      }
      rotateOnEnable = true;
    } else {
      // 3d -> 2d transition
      var angle = olcs.core.computeAngleToZenith(scene, bottom);
      olcs.core.rotateAroundAxis(camera, -angle, camera.right, transform, {
        callback: function() {
          ol3d.setEnabled(false);
          var view = ol3d.getOlMap().getView();
          var resolution = view.getResolution();
          var rotation = view.getRotation();

          view.setResolution(view.constrainResolution(resolution));
          view.setRotation(view.constrainRotation(rotation));
        }
      });
    }
  };

  // Load the cesium libary and initialize the viewer
  var loading = false;
  var loadCesiumLib = function() {
    var toActivate = false;
    return function(activate) {
      // Check if cesium library is already loaded
      toActivate = activate;
      if (!window.Cesium) {
        loading = true;
        $.getScript(ol3CesiumLibUrl, function() {
          cesiumLoaded.resolve(toActivate);
          loading = false;
        });
      }
      else if (!loading) {
        cesiumLoaded.resolve(activate);
      }
    }
  }();

  // We need the Cesium lib and the Layers config to create
  // the 3D viewer
  $q.all([cesiumLoaded.promise, gaLayers.loadConfig()])
      .then(function(resolutions) {
        ol3d = initCesiumViewer(map, resolutions[0]);
        cesiumClients.resolve(ol3d);
  });

  this.enable = function(activate) {
    if (!ol3d && !loading) {
      loadCesiumLib(activate);
    } else if (ol3d && ol3d.getEnabled() != activate) {
      enableOl3d(ol3d, activate);
    }
  };

  this.loaded = function() {
    return cesiumClients.promise;
  };

  this.suspendRotation = function() {
    rotateOnEnable = false;
  };

};

var SSECorrector = function(gaPermalink) {
  var params = gaPermalink.getParams();
  this.mindist = parseInt(params['sseMindist'] || '5000', 10);
  this.maxdist = parseInt(params['sseMaxdist'] || '10000', 10);
  this.mincamfactor = parseFloat(params['sseMincamfactor'] || '0.9');
  this.maxcamfactor = parseFloat(params['sseMaxcamfactor'] || '1.2');
  // Max height to apply optmization
  this.maxheight = parseInt(params['sseMaxheight'] || '0', 10);
  this.allowtilelevels = parseInt(params['sseAllowtilelevels'] || '0', 10);
  this.pickglobe = !params['sseNopickglobe'];
  this.pickposition = parseFloat(params['ssePickposition'] || '0.6666');
  this.shouldCut = !!params['sseEnabled'];
  this.noheight = !!params['sseNoheight'];
  this.maxerrorfactor = parseFloat(params['sseMaxerrorfactor'] || '0.25');
  this.cameraHeight = undefined;
};

/**
 * Called before the Quadtree will update its tiles.
 * @param {Cesium.FrameState} frameState
 */
SSECorrector.prototype.newFrameState = function(frameState) {
    this.cameraHeight = frameState.camera.positionCartographic.height;

    if (this.pickglobe && !this.noheight &&
        (!this.maxHeight || this.cameraHeight < this.maxheight)) {
      var scene = frameState.camera._scene;
      var canvas = scene.canvas;
      var pixelHeight = this.pickposition * canvas.clientHeight;
      var pixel = new Cesium.Cartesian2(canvas.clientWidth / 2, pixelHeight);
      this.cameraHeight = undefined;
      var target = olcs.core.pickOnTerrainOrEllipsoid(scene, pixel);
      if (target) {
        var position = frameState.camera.position;
        var distance = Cesium.Cartesian3.distance(position, target);
        this.cameraHeight = Math.max(this.cameraHeight || 0, distance);
      }
    }

    this.min = this.mindist;
    this.max = this.maxdist;
    if (!this.noheight && this.cameraHeight) {
      this.min = Math.min(this.mindist, this.mincamfactor * this.cameraHeight);
      this.max = Math.max(this.maxdist, this.maxcamfactor * this.cameraHeight);
    }

    // 1 = a * min + b
    // maxerrorfactor = a * max + b
    this.a = (1 - this.maxerrorfactor) / (this.min - this.max);
    this.b = 1 - this.a * this.min;
};

/**
 * Called for each processed tile, in order to correct the error.
 * Far tiles will have their error diminished so that they pass earlier
 * the error test.
 * @param {Cesium.FrameState} frameState
 * @param {Cesium.GlobeSurfaceTile} tile
 * @param {number} distance
 * @param {number} original Screen space error before correction
 * @return {number} lower screen space error after correction
 */
SSECorrector.prototype.correct = function(frameState, tile, distance,
  original) {
    if (!this.shouldCut ||
        (this.maxheight && this.cameraHeight &&
          (this.cameraHeight > this.maxheight)) ||
        (this.allowtilelevels && (tile._level <= this.allowtilelevels))) {
      return original;
    }

    if (distance < this.max) {
      if (distance < this.min || this.min === this.max) {
        return original;
      } else {
        var linearFactor = this.a * distance + this.b;
        return linearFactor * original;
      }
    } else {
      return this.maxerrorfactor * original;
    }
};
