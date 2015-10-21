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

  // Building related code taken from original POC
  // https://raw.githubusercontent.com/geoadmin/3d-testapp/198e5c3f5c5d22841d78183585874b4b5c85ddf4/poc.js?token=ACdAHY4w9qWFM6-g6ZISbNJWkhsLbEG7ks5WL2p0wA%3D%3D
  //// This is a very simplified loading strategy for building tiles
  var tileModelProvider = {
     add: function(swCorner, neCorner, gltf) {
        var rectangle = Cesium.Rectangle.fromCartographicArray([
          Cesium.Cartographic.fromDegrees.apply(null, swCorner),
          Cesium.Cartographic.fromDegrees.apply(null, neCorner)]
        );
        var center = Cesium.Rectangle.center(rectangle);
        center.height = Math.max(swCorner[2], neCorner[2]) + 1400;
        var top = Cesium.Ellipsoid.WGS84.cartographicToCartesian(center);
        var tile = {
          rectangle: rectangle,
          southwest: Cesium.Cartesian3.fromDegrees.apply(null, swCorner),
          top: top,
          loaded: false,
          gltf: 'https://mf-chsdi3.dev.bgdi.ch/ltjeg/files/buildings/' + gltf
        };
        this.tiles.push(tile);
        return this;
     },
     tiles: [],

     loadModel: function(tiles, scene) {
        var camera = scene.camera;
        var ray = new Cesium.Ray(camera.position, camera.direction);
        var pointed = scene.globe.pick(ray, scene);
        if (!Cesium.defined(pointed)) return;

        var tile = [];
        var bottom = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pointed);
        for (var i = 0; i < tiles.length; ++i) {
          if (!Cesium.Rectangle.contains(tiles[i].rectangle, bottom)) continue;
          tile.push(tiles[i]);
        }
        tile.forEach(function(tile) {
          if (tile.loaded) {
            return;
          }
          console.log('Loading model');
          var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                                tile.southwest);
          tile.model = scene.primitives.add(Cesium.Model.fromGltf({
             url: tile.gltf,
             modelMatrix: modelMatrix
          }));
          tile.loaded = true;
          tile.show = true;
        });
     },

     init: function(scene) {
        var camera = scene.camera;

        var lastCameraPos = new Cesium.Cartesian3(0, 0, 0);
        scene.preRender.addEventListener(function() {
          if (lastCameraPos.x != camera.position.x) {
              camera.position.clone(lastCameraPos);
              this.loadModel(this.tiles, scene);
         }
        }, this);
    }
  };

  // Available tiles are added here
  tileModelProvider
  .add( // bern
      [7.43818019986291, 46.9167638125432, 553.550877136178],
      [7.4653662804426, 46.9333388028237, 892.672429788858],
      'swissBUILDINGS3d.gltf')
  .add(
      [8.05009141910919, 47.381108240219, 391.473011062481],
      [8.10900374809093, 47.4079011196116, 520.223172678612],
      '1089_23b.gltf')
  .add(
      [7.8142161084778, 46.6804275671058, 605.808860636316],
      [7.87238112753256, 46.7073213352311, 1461.69092196133],
      '1208-43_1208-43.gltf')
  .add(
      [7.8712796027115, 46.6804421789384, 610.622131710872],
      [7.92885675463667, 46.7072134531994, 1346.55061065778],
      '1208-44_1208-44.gltf')
  .add(
      [7.81419746559074, 46.6536001948296, 569.625796063803],
      [7.87167296424733, 46.6807611299416, 1453.67397088744],
      '1228-21_1228-21.gltf')
  .add(
      [7.8712254319155, 46.6532888648325, 618.052885887213],
      [7.92864745579657, 46.6802126075228, 2047.47427189257],
      '1228-22_1228-22.gltf')
  .add(
      [7.83135480023845, 46.6685359653302, 607.396762281656],
      [7.87370750067964, 46.694607752753, 643.499991984107],
      'ponts_cityGML_test3.gltf')
  .add(
      [7.85529638642568, 46.6888939188272, 614.424975835718],
      [7.86755034897686, 46.6908704351679, 617.587541328743],
      'ponts_Eis_cityGML.gltf');




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

    tileModelProvider.init(scene);
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

