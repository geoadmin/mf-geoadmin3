goog.provide('ga_cesium');

/**
 * Class to handle cesium library and cesium view
 *
 * @param {ol.Map} map
 * @param {Object} gaPermalink
 * @param {Object} gaLayers
 * @param {Object} gaGlobalOptions
 * @param {Object} $q
 *
 * @constructor
 */
var GaCesium = function(map, gaPermalink, gaLayers, gaGlobalOptions, $q) {
  // Url of ol3cesium library
  var ol3CesiumLibUrl = gaGlobalOptions.resourceUrl + 'lib/ol3cesium.js';
  var cesiumLoaded = $q.defer();
  var cesiumClients = $q.defer();
  var ol3d = undefined;
  var rotateOnEnable = true;

  var intParam = function(name, defaultValue) {
    var params = gaPermalink.getParams();
    return parseInt(params[name] || defaultValue, 10);
  };

  // Create the cesium viewer with basic layers
  var initCesiumViewer = function(map, enabled) {
    var frustumFar = intParam('frustumFar', '500000000');
    var tileCacheSize = intParam('tileCacheSize', '100');
    var maximumScreenSpaceError = intParam('maximumScreenSpaceError', '2');
    window.minimumRetrievingLevel = intParam('minimumRetrievingLevel', '6');
    var cesiumViewer;
    try {
      cesiumViewer = new olcs.OLCesium({
        map: map,
        createSynchronizers: function(map, scene) {
           return [
             new ga.GaRasterSynchronizer(map, scene),
             new olcs.VectorSynchronizer(map, scene)
           ];
        }
      });
    } catch (e) {
      alert(e.message);
      return;
    }
    var globe = cesiumViewer.getCesiumScene().globe;
    globe.baseColor = Cesium.Color.WHITE;
    globe.tileCacheSize = tileCacheSize;
    globe.maximumScreenSpaceError = maximumScreenSpaceError;
    var scene = cesiumViewer.getCesiumScene();
    scene.camera.frustum.far = frustumFar;
    scene.globe.depthTestAgainstTerrain = true;
    scene.screenSpaceCameraController.minimumZoomDistance = 50;
    scene.terrainProvider =
        gaLayers.getCesiumTerrainProviderById(gaGlobalOptions.defaultTerrain);
    enableOl3d(cesiumViewer, enabled);
    return cesiumViewer;
  };

  var enableOl3d = function(ol3d, enable) {
    var scene = ol3d.getCesiumScene();
    var camera = scene.camera;
    var bottom = olcs.core.pickBottomPoint(scene);
    var transform = Cesium.Matrix4.fromTranslation(bottom);
    if (enable) {
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
  var loadCesiumLib = function() {
    var loading = false;
    var toActivate = false;
    return function(activate) {
      // Check if cesium library is already loaded
      toActivate = activate;
      if (!window.olcs) {
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
    if (!ol3d) {
      loadCesiumLib(activate);
    } else {
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

