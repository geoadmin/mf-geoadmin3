olms =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./olms.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                              ol-mapbox-style - Use Mapbox Style objects with OpenLayers
                                                                                                                                                                                                                                                                              Copyright 2016-present Boundless Spatial, Inc.
                                                                                                                                                                                                                                                                              License: https://raw.githubusercontent.com/boundlessgeo/ol-mapbox-gl-style/master/LICENSE
                                                                                                                                                                                                                                                                              */

exports.applyStyle = applyStyle;
exports.applyBackground = applyBackground;
exports.apply = apply;
exports.getLayer = getLayer;
exports.getSource = getSource;

var _function = __webpack_require__(/*! @mapbox/mapbox-gl-style-spec/function */ "./node_modules/@mapbox/mapbox-gl-style-spec/function/index.js");

var _function2 = _interopRequireDefault(_function);

var _mapboxToCssFont = __webpack_require__(/*! mapbox-to-css-font */ "./node_modules/mapbox-to-css-font/index.js");

var _mapboxToCssFont2 = _interopRequireDefault(_mapboxToCssFont);

var _stylefunction = __webpack_require__(/*! ./stylefunction */ "./stylefunction.js");

var _stylefunction2 = _interopRequireDefault(_stylefunction);

var _google = __webpack_require__(/*! webfont-matcher/lib/fonts/google */ "./node_modules/webfont-matcher/lib/fonts/google.js");

var _google2 = _interopRequireDefault(_google);

var _proj = __webpack_require__(/*! ol/proj */ "ol/proj");

var _tilegrid = __webpack_require__(/*! ol/tilegrid */ "ol/tilegrid");

var _Map = __webpack_require__(/*! ol/Map */ "ol/Map");

var _Map2 = _interopRequireDefault(_Map);

var _GeoJSON = __webpack_require__(/*! ol/format/GeoJSON */ "ol/format/GeoJSON");

var _GeoJSON2 = _interopRequireDefault(_GeoJSON);

var _MVT = __webpack_require__(/*! ol/format/MVT */ "ol/format/MVT");

var _MVT2 = _interopRequireDefault(_MVT);

var _Observable = __webpack_require__(/*! ol/Observable */ "ol/Observable");

var _Tile = __webpack_require__(/*! ol/layer/Tile */ "ol/layer/Tile");

var _Tile2 = _interopRequireDefault(_Tile);

var _Vector = __webpack_require__(/*! ol/layer/Vector */ "ol/layer/Vector");

var _Vector2 = _interopRequireDefault(_Vector);

var _VectorTile = __webpack_require__(/*! ol/layer/VectorTile */ "ol/layer/VectorTile");

var _VectorTile2 = _interopRequireDefault(_VectorTile);

var _TileJSON = __webpack_require__(/*! ol/source/TileJSON */ "ol/source/TileJSON");

var _TileJSON2 = _interopRequireDefault(_TileJSON);

var _Vector3 = __webpack_require__(/*! ol/source/Vector */ "ol/source/Vector");

var _Vector4 = _interopRequireDefault(_Vector3);

var _VectorTile3 = __webpack_require__(/*! ol/source/VectorTile */ "ol/source/VectorTile");

var _VectorTile4 = _interopRequireDefault(_VectorTile3);

var _XYZ = __webpack_require__(/*! ol/source/XYZ */ "ol/source/XYZ");

var _XYZ2 = _interopRequireDefault(_XYZ);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var availableFonts;

function loadFont(fonts) {
  var i, ii;
  if (!Array.isArray(fonts)) {
    var stops = fonts.stops;
    if (stops) {
      for (i = 0, ii = stops.length; i < ii; ++i) {
        loadFont(stops[i][1]);
      }
    }
    return;
  }
  var googleFamilies = _google2.default.getNames();
  var families = fonts.map(function (font) {
    return (0, _mapboxToCssFont2.default)(font, 1).split(' 1px ')[1].replace(/"/g, '');
  });
  for (i = 0, ii = families.length; i < ii; ++i) {
    var family = families[i];
    var font = fonts[i];
    if (googleFamilies.indexOf(family) !== -1) {
      if (!availableFonts) {
        availableFonts = [];
      }
      if (availableFonts.indexOf(font) == -1) {
        availableFonts.push(font);
        var fontUrl = 'https://fonts.googleapis.com/css?family=' + family.replace(/ /g, '+');
        if (!document.querySelector('link[href="' + fontUrl + '"]')) {
          var markup = document.createElement('link');
          markup.href = fontUrl;
          markup.rel = 'stylesheet';
          document.getElementsByTagName('head')[0].appendChild(markup);
        }
      }
      break;
    }
  }
}

var defaultFont = ['Open Sans Regular', 'Arial Regular'];

function preprocess(layer) {
  if ('layout' in layer && 'text-field' in layer.layout) {
    loadFont(layer.layout['text-font'] || defaultFont);
  }
}

var spriteRegEx = /^(.*)(\?.*)$/;

function withPath(url, path) {
  if (path && url.indexOf('http') != 0) {
    url = path + url;
  }
  return url;
}

function toSpriteUrl(url, path, extension) {
  url = withPath(url, path);
  var parts = url.match(spriteRegEx);
  return parts ? parts[1] + extension + (parts.length > 2 ? parts[2] : '') : url + extension;
}

/**
 * Applies a style function to an `ol.layer.VectorTile` or `ol.layer.Vector`
 * with an `ol.source.VectorTile` or an `ol.source.Vector`. The style function
 * will render all layers from the `glStyle` object that use the specified
 * `source`, or a subset of layers from the same source. The source needs to be
 * a `"type": "vector"`, `"type": "geojson"` or `"type": "raster"` source.
 *
 * @param {ol.layer.VectorTile} layer OpenLayers layer.
 * @param {string|Object} glStyle Mapbox Style object.
 * @param {string} source `source` key or an array of layer `id`s from the
 * Mapbox Style object. When a `source` key is provided, all layers for the
 * specified source will be included in the style function. When layer `id`s
 * are provided, they must be from layers that use the same source.
 * @param {string} [path=undefined] Path of the style file. Only required when
 * a relative path is used with the `"sprite"` property of the style.
 * @param {Array<number>} [resolutions=undefined] Resolutions for mapping resolution to zoom level.
 * @return {Promise} Promise which will be resolved when the style can be used
 * for rendering.
 */
function applyStyle(layer, glStyle, source, path, resolutions) {
  return new Promise(function (resolve, reject) {

    if ((typeof glStyle === 'undefined' ? 'undefined' : _typeof(glStyle)) != 'object') {
      glStyle = JSON.parse(glStyle);
    }
    if (glStyle.version != 8) {
      reject(new Error('glStyle version 8 required.'));
    }
    var spriteScale, spriteData, spriteImageUrl;
    if (glStyle.sprite) {
      spriteScale = window.devicePixelRatio >= 1.5 ? 0.5 : 1;
      var sizeFactor = spriteScale == 0.5 ? '@2x' : '';
      var spriteUrl = toSpriteUrl(glStyle.sprite, path, sizeFactor + '.json');

      fetch(spriteUrl, { credentials: 'same-origin' }).then(function (response) {
        // if the response is ready return the JSON promise
        if (response.status === 200) {
          return response.json();
        } else if (sizeFactor !== '') {
          // return the JSON promise for the low-resolution sprites.
          sizeFactor = '';
          spriteUrl = toSpriteUrl(glStyle.sprite, path, '.json');
          return fetch(spriteUrl, { credentials: 'same-origin' }).then(function (r) {
            return r.json();
          });
        }
      }).then(function (spritesJson) {
        if (spritesJson === undefined) {
          throw 'No sprites found.';
        }
        spriteData = spritesJson;
        spriteImageUrl = toSpriteUrl(glStyle.sprite, path, sizeFactor + '.png');
        onChange();
      }).catch(function (err) {
        console.error(err);
        reject(new Error('Sprites cannot be loaded from ' + spriteUrl));
      });
    }

    var style;
    function onChange() {
      if (!style && (!glStyle.sprite || spriteData) && (!availableFonts || availableFonts.length > 0)) {
        style = (0, _stylefunction2.default)(layer, glStyle, source, resolutions, spriteData, spriteImageUrl, availableFonts);
        resolve();
      } else if (style) {
        layer.setStyle(style);
      }
    }

    if (layer instanceof _VectorTile2.default || layer instanceof _Vector2.default) {
      try {
        var layers = glStyle.layers;
        for (var i = 0, ii = layers.length; i < ii; ++i) {
          if (typeof source == 'string' && layers[i].source == source || source.indexOf(layers[i].id) >= 0) {
            preprocess(layers[i]);
          }
        }
        onChange();
      } catch (e) {
        setTimeout(function () {
          reject(e);
        }, 0);
      }
    }
  });
}

function setBackground(map, layer) {
  function updateStyle() {
    var element = map.getTargetElement();
    if (!element) {
      return;
    }
    var layout = layer.layout || {};
    var paint = layer.paint || {};
    var zoom = map.getView().getZoom();
    if ('background-color' in paint) {
      var bg = (0, _function2.default)(paint['background-color'], { function: 'interpolated', type: 'color' })(zoom);
      if (Array.isArray(bg)) {
        bg = 'rgba(' + Math.round(bg[0] * 255) + ',' + Math.round(bg[1] * 255) + ',' + Math.round(bg[2] * 255) + ',' + (bg[3] ? bg[3] : 1) + ')';
      }
      element.style.backgroundColor = bg;
    }
    if ('background-opacity' in paint) {
      element.style.backgroundOpacity = (0, _function2.default)(paint['background-opacity'], { function: 'interpolated', type: 'number' })(zoom);
    }
    if (layout.visibility == 'none') {
      element.style.backgroundColor = '';
      element.style.backgroundOpacity = '';
    }
  }
  if (map.getTargetElement()) {
    updateStyle();
  }
  map.on(['change:resolution', 'change:target'], updateStyle);
}

/**
 * Applies properties of the Mapbox Style's first `background` layer to the map.
 * @param {ol.Map} map OpenLayers Map.
 * @param {Object} glStyle Mapbox Style object.
 */
function applyBackground(map, glStyle) {
  glStyle.layers.some(function (l) {
    if (l.type == 'background') {
      setBackground(map, l);
      return true;
    }
  });
}

function getSourceIdByRef(layers, ref) {
  var sourceId;
  layers.some(function (layer) {
    if (layer.id == ref) {
      sourceId = layer.source;
      return true;
    }
  });
  return sourceId;
}

function processStyle(glStyle, map, baseUrl, host, path, accessToken) {
  var view = map.getView();
  if ('center' in glStyle && !view.getCenter()) {
    view.setCenter((0, _proj.fromLonLat)(glStyle.center));
  }
  if ('zoom' in glStyle && view.getZoom() === undefined) {
    view.setZoom(glStyle.zoom);
  }
  if (!view.getCenter() || view.getZoom() === undefined) {
    view.fit(view.getProjection().getExtent(), {
      nearest: true,
      size: map.getSize()
    });
  }
  if (glStyle.sprite) {
    if (glStyle.sprite.indexOf('mapbox://') == 0) {
      glStyle.sprite = baseUrl + '/sprite' + accessToken;
    } else if (glStyle.sprite.indexOf('http') != 0) {
      glStyle.sprite = (host ? host + path : '') + glStyle.sprite + accessToken;
    }
  }

  var glLayers = glStyle.layers;
  var geoJsonFormat = new _GeoJSON2.default();
  var layerIds = [];

  function finalizeLayer(layer) {
    if (layerIds.length > 0) {
      map.addLayer(layer);
      var setStyle = function setStyle() {
        applyStyle(layer, glStyle, layerIds, path).then(function () {
          layer.setVisible(true);
        }, function (e) {
          /*eslint no-console: ["error", { allow: ["error"] }] */
          console.error(e);
        });
      };
      if (layer.getSource()) {
        setStyle();
      } else {
        layer.once('change:source', setStyle);
      }
    }
  }

  var glLayer, glSource, glSourceId, id, layer, mapid, url;
  for (var i = 0, ii = glLayers.length; i < ii; ++i) {
    glLayer = glLayers[i];
    if (glLayer.type == 'background') {
      setBackground(map, glLayer);
    } else {
      id = glLayer.source || getSourceIdByRef(glLayers, glLayer.ref);
      if (id != glSourceId) {
        finalizeLayer(layer);
        layerIds = [];
        glSource = glStyle.sources[id];
        url = glSource.url;
        var tiles = glSource.tiles;
        if (url) {
          if (url.indexOf('mapbox://') == 0) {
            mapid = url.replace('mapbox://', '');
            tiles = ['a', 'b', 'c', 'd'].map(function (host) {
              return 'https://' + host + '.tiles.mapbox.com/v4/' + mapid + '/{z}/{x}/{y}.' + (glSource.type == 'vector' ? 'vector.pbf' : 'png') + accessToken;
            });
          }
        }

        if (glSource.type == 'vector') {
          layer = tiles ? function () {
            var tileGrid = (0, _tilegrid.createXYZ)({
              tileSize: 512,
              maxZoom: 'maxzoom' in glSource ? glSource.maxzoom : 22,
              minZoom: glSource.minzoom
            });
            return new _VectorTile2.default({
              declutter: true,
              maxResolution: tileGrid.getMinZoom() > 0 ? tileGrid.getResolution(tileGrid.getMinZoom()) : undefined,
              source: new _VectorTile4.default({
                attributions: glSource.attribution,
                format: new _MVT2.default(),
                tileGrid: tileGrid,
                urls: tiles
              }),
              visible: false,
              zIndex: i
            });
          }() : function () {
            var layer = new _VectorTile2.default({
              declutter: true,
              visible: false,
              zIndex: i
            });
            var tilejson = new _TileJSON2.default({
              url: url
            });
            var key = tilejson.on('change', function () {
              if (tilejson.getState() == 'ready') {
                var tileJSONDoc = tilejson.getTileJSON();
                var tiles = Array.isArray(tileJSONDoc.tiles) ? tileJSONDoc.tiles : [tileJSONDoc.tiles];
                for (var i = 0, ii = tiles.length; i < ii; ++i) {
                  var tile = tiles[i];
                  if (tile.indexOf('http') != 0) {
                    tiles[i] = glSource.url + tile;
                  }
                }
                var tileGrid = tilejson.getTileGrid();
                layer.setSource(new _VectorTile4.default({
                  attributions: tilejson.getAttributions() || tileJSONDoc.attribution,
                  format: new _MVT2.default(),
                  tileGrid: (0, _tilegrid.createXYZ)({
                    minZoom: tileGrid.getMinZoom(),
                    maxZoom: tileGrid.getMaxZoom(),
                    tileSize: 512
                  }),
                  urls: tiles
                }));
                if (tileGrid.getMinZoom() > 0) {
                  layer.setMaxResolution(tileGrid.getResolution(tileGrid.getMinZoom()));
                }
                (0, _Observable.unByKey)(key);
              }
            });
            return layer;
          }();
        } else if (glSource.type == 'raster') {
          var source;
          if (!glSource.tiles) {
            source = function () {
              return new _TileJSON2.default({
                url: url,
                crossOrigin: 'anonymous'
              });
            }();
          } else {
            source = new _XYZ2.default({
              attributions: glSource.attribution,
              minZoom: glSource.minzoom,
              maxZoom: 'maxzoom' in glSource ? glSource.maxzoom : 22,
              tileSize: glSource.tileSize || 512,
              url: url,
              urls: glSource.tiles,
              crossOrigin: 'anonymous'
            });
          }
          source.setTileLoadFunction(function (tile, src) {
            if (src.indexOf('{bbox-epsg-3857}') != -1) {
              var bbox = source.getTileGrid().getTileCoordExtent(tile.getTileCoord());
              src = src.replace('{bbox-epsg-3857}', bbox.toString());
            }
            tile.getImage().src = src;
          });
          layer = new _Tile2.default({
            source: source,
            visible: glLayer.layout ? glLayer.layout.visibility !== 'none' : true
          });
        } else if (glSource.type == 'geojson') {
          var data = glSource.data;
          var features, geoJsonUrl;
          if (typeof data == 'string') {
            geoJsonUrl = withPath(data, path);
          } else {
            features = geoJsonFormat.readFeatures(data, { featureProjection: 'EPSG:3857' });
          }
          layer = new _Vector2.default({
            source: new _Vector4.default({
              attributions: glSource.attribution,
              features: features,
              format: geoJsonFormat,
              url: geoJsonUrl
            }),
            visible: false,
            zIndex: i
          });
        }
        glSourceId = id;
      }
      layerIds.push(glLayer.id);
    }
  }
  finalizeLayer(layer);
  map.set('mapbox-style', glStyle);
}

/**
 * Loads and applies a Mapbox Style object to an OpenLayers Map. This includes
 * the map background, the layers, the center and the zoom.
 *
 * The center and zoom will only be set if present in the Mapbox Style document,
 * and if not already set on the OpenLayers map.
 *
 * Layers will be added to the OpenLayers map, without affecting any layers that
 * might already be set on the map.
 *
 * Layers added by `apply()` will have two additional properties:
 *
 *  * `mapbox-source`: The `id` of the Mapbox Style document's source that the
 *    OpenLayers layer was created from. Usually `apply()` creates one
 *    OpenLayers layer per Mapbox Style source, unless the layer stack has
 *    layers from different sources in between.
 *  * `mapbox-layers`: The `id`s of the Mapbox Style document's layers that are
 *    included in the OpenLayers layer.
 *
 * The map returned by this function will have an additional `mapbox-style`
 * property which holds the Mapbox Style object.
 *
 * @param {ol.Map|HTMLElement|string} map Either an existing OpenLayers Map
 * instance, or a HTML element, or the id of a HTML element that will be the
 * target of a new OpenLayers Map.
 * @param {string|Object} style JSON style object or style url pointing to a
 * Mapbox Style object. When using Mapbox APIs, the url must contain an access
 * token and look like
 * `https://api.mapbox.com/styles/v1/mapbox/bright-v9?access_token=[your_access_token_here]`.
 * When passed as JSON style object, all OpenLayers layers created by `apply()`
 * will be immediately available, but they may not have a source yet (i.e. when
 * they are defined by a TileJSON url in the Mapbox Style document). When passed
 * as style url, layers will be added to the map when the Mapbox Style document
 * is loaded and parsed.
 * @return {ol.Map} The OpenLayers Map instance that will be populated with the
 * contents described in the Mapbox Style object.
 */
function apply(map, style) {

  var accessToken, baseUrl, host, path;
  accessToken = baseUrl = host = path = '';

  if (!(map instanceof _Map2.default)) {
    map = new _Map2.default({
      target: map
    });
  }

  if (typeof style === 'string') {
    var parts = style.match(spriteRegEx);
    if (parts) {
      baseUrl = parts[1];
      accessToken = parts.length > 2 ? parts[2] : '';
    }

    fetch(style, {
      credentials: 'same-origin'
    }).then(function (response) {
      return response.json();
    }).then(function (glStyle) {
      var a = document.createElement('A');
      a.href = style;
      path = a.pathname.split('/').slice(0, -1).join('/') + '/';
      host = style.substr(0, style.indexOf(path));

      processStyle(glStyle, map, baseUrl, host, path, accessToken);
    }).catch(function (err) {
      console.error(err);
      throw new Error('Could not load ' + style);
    });
  } else {
    setTimeout(function () {
      processStyle(style, map);
    }, 0);
  }
  return map;
}

/**
 * Get the OpenLayers layer instance that contains the provided Mapbox Style
 * `layer`. Note that multiple Mapbox Style layers are combined in a single
 * OpenLayers layer instance when they use the same Mapbox Style `source`.
 * @param {ol.Map} map OpenLayers Map.
 * @param {string} layerId Mapbox Style layer id.
 * @return {ol.layer.Layer} layer OpenLayers layer instance.
 */
function getLayer(map, layerId) {
  var layers = map.getLayers().getArray();
  for (var i = 0, ii = layers.length; i < ii; ++i) {
    if (layers[i].get('mapbox-layers').indexOf(layerId) !== -1) {
      return layers[i];
    }
  }
}

/**
 * Get the OpenLayers source instance for the provided Mapbox Style `source`.
 * @param {ol.Map} map OpenLayers Map.
 * @param {string} sourceId Mapbox Style source id.
 * @return {ol.layer.Layer} layer OpenLayers layer instance.
 */
function getSource(map, sourceId) {
  var layers = map.getLayers().getArray();
  for (var i = 0, ii = layers.length; i < ii; ++i) {
    var source = layers[i].getSource();
    if (layers[i].get('mapbox-source').indexOf(sourceId) !== -1) {
      return source;
    }
  }
}

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/deref.js":
/*!************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/deref.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var refProperties = __webpack_require__(/*! ./util/ref_properties */ "./node_modules/@mapbox/mapbox-gl-style-spec/util/ref_properties.js");

function deref(layer, parent) {
    var result = {};

    for (var k in layer) {
        if (k !== 'ref') {
            result[k] = layer[k];
        }
    }

    refProperties.forEach(function (k) {
        if (k in parent) {
            result[k] = parent[k];
        }
    });

    return result;
}

module.exports = derefLayers;

/**
 * Given an array of layers, some of which may contain `ref` properties
 * whose value is the `id` of another property, return a new array where
 * such layers have been augmented with the 'type', 'source', etc. properties
 * from the parent layer, and the `ref` property has been removed.
 *
 * The input is not modified. The output may contain references to portions
 * of the input.
 *
 * @private
 * @param {Array<Layer>} layers
 * @returns {Array<Layer>}
 */
function derefLayers(layers) {
    layers = layers.slice();

    var map = Object.create(null);
    for (var i = 0; i < layers.length; i++) {
        map[layers[i].id] = layers[i];
    }

    for (var _i = 0; _i < layers.length; _i++) {
        if ('ref' in layers[_i]) {
            layers[_i] = deref(layers[_i], map[layers[_i].ref]);
        }
    }

    return layers;
}

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/feature_filter/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/feature_filter/index.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = createFilter;

var types = ['Unknown', 'Point', 'LineString', 'Polygon'];

/**
 * Given a filter expressed as nested arrays, return a new function
 * that evaluates whether a given feature (with a .properties or .tags property)
 * passes its test.
 *
 * @private
 * @param {Array} filter mapbox gl filter
 * @returns {Function} filter-evaluating function
 */
function createFilter(filter) {
    return new Function('f', 'var p = (f && f.properties || {}); return ' + compile(filter));
}

function compile(filter) {
    if (!filter) return 'true';
    var op = filter[0];
    if (filter.length <= 1) return op === 'any' ? 'false' : 'true';
    var str = op === '==' ? compileComparisonOp(filter[1], filter[2], '===', false) : op === '!=' ? compileComparisonOp(filter[1], filter[2], '!==', false) : op === '<' || op === '>' || op === '<=' || op === '>=' ? compileComparisonOp(filter[1], filter[2], op, true) : op === 'any' ? compileLogicalOp(filter.slice(1), '||') : op === 'all' ? compileLogicalOp(filter.slice(1), '&&') : op === 'none' ? compileNegation(compileLogicalOp(filter.slice(1), '||')) : op === 'in' ? compileInOp(filter[1], filter.slice(2)) : op === '!in' ? compileNegation(compileInOp(filter[1], filter.slice(2))) : op === 'has' ? compileHasOp(filter[1]) : op === '!has' ? compileNegation(compileHasOp(filter[1])) : 'true';
    return '(' + str + ')';
}

function compilePropertyReference(property) {
    var ref = property === '$type' ? 'f.type' : property === '$id' ? 'f.id' : 'p[' + JSON.stringify(property) + ']';
    return ref;
}

function compileComparisonOp(property, value, op, checkType) {
    var left = compilePropertyReference(property);
    var right = property === '$type' ? types.indexOf(value) : JSON.stringify(value);
    return (checkType ? 'typeof ' + left + '=== typeof ' + right + '&&' : '') + left + op + right;
}

function compileLogicalOp(expressions, op) {
    return expressions.map(compile).join(op);
}

function compileInOp(property, values) {
    if (property === '$type') values = values.map(function (value) {
        return types.indexOf(value);
    });
    var left = JSON.stringify(values.sort(compare));
    var right = compilePropertyReference(property);

    if (values.length <= 200) return left + '.indexOf(' + right + ') !== -1';

    return '' + ('function(v, a, i, j) {' + 'while (i <= j) { var m = (i + j) >> 1;' + '    if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;' + '}' + 'return false; }(') + right + ', ' + left + ',0,' + (values.length - 1) + ')';
}

function compileHasOp(property) {
    return property === '$id' ? '"id" in f' : JSON.stringify(property) + ' in p';
}

function compileNegation(expression) {
    return '!(' + expression + ')';
}

// Comparison function to sort numbers and strings
function compare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/function/color_spaces.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/function/color_spaces.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Constants
var Xn = 0.950470,
    // D65 standard referent
Yn = 1,
    Zn = 1.088830,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1,
    deg2rad = Math.PI / 180,
    rad2deg = 180 / Math.PI;

// Utilities
function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
}

function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2xyz(x) {
    x /= 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

// LAB
function rgbToLab(rgbColor) {
    var b = rgb2xyz(rgbColor[0]),
        a = rgb2xyz(rgbColor[1]),
        l = rgb2xyz(rgbColor[2]),
        x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
        y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
        z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);

    return [116 * y - 16, 500 * (x - y), 200 * (y - z), rgbColor[3]];
}

function labToRgb(labColor) {
    var y = (labColor[0] + 16) / 116,
        x = isNaN(labColor[1]) ? y : y + labColor[1] / 500,
        z = isNaN(labColor[2]) ? y : y - labColor[2] / 200;
    y = Yn * lab2xyz(y);
    x = Xn * lab2xyz(x);
    z = Zn * lab2xyz(z);
    return [xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
    xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), labColor[3]];
}

// HCL
function rgbToHcl(rgbColor) {
    var labColor = rgbToLab(rgbColor);
    var l = labColor[0],
        a = labColor[1],
        b = labColor[2];
    var h = Math.atan2(b, a) * rad2deg;
    return [h < 0 ? h + 360 : h, Math.sqrt(a * a + b * b), l, rgbColor[3]];
}

function hclToRgb(hclColor) {
    var h = hclColor[0] * deg2rad,
        c = hclColor[1],
        l = hclColor[2];
    return labToRgb([l, Math.cos(h) * c, Math.sin(h) * c, hclColor[3]]);
}

module.exports = {
    lab: {
        forward: rgbToLab,
        reverse: labToRgb
    },
    hcl: {
        forward: rgbToHcl,
        reverse: hclToRgb
    }
};

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/function/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/function/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var colorSpaces = __webpack_require__(/*! ./color_spaces */ "./node_modules/@mapbox/mapbox-gl-style-spec/function/color_spaces.js");
var parseColor = __webpack_require__(/*! ../util/parse_color */ "./node_modules/@mapbox/mapbox-gl-style-spec/util/parse_color.js");
var extend = __webpack_require__(/*! ../util/extend */ "./node_modules/@mapbox/mapbox-gl-style-spec/util/extend.js");
var getType = __webpack_require__(/*! ../util/get_type */ "./node_modules/@mapbox/mapbox-gl-style-spec/util/get_type.js");
var interpolate = __webpack_require__(/*! ../util/interpolate */ "./node_modules/@mapbox/mapbox-gl-style-spec/util/interpolate.js");

function identityFunction(x) {
    return x;
}

function createFunction(parameters, propertySpec) {
    var isColor = propertySpec.type === 'color';

    var fun = void 0;

    if (!isFunctionDefinition(parameters)) {
        if (isColor && parameters) {
            parameters = parseColor(parameters);
        }
        fun = function fun() {
            return parameters;
        };
        fun.isFeatureConstant = true;
        fun.isZoomConstant = true;
    } else {
        var zoomAndFeatureDependent = parameters.stops && _typeof(parameters.stops[0][0]) === 'object';
        var featureDependent = zoomAndFeatureDependent || parameters.property !== undefined;
        var zoomDependent = zoomAndFeatureDependent || !featureDependent;
        var type = parameters.type || (propertySpec.function === 'interpolated' ? 'exponential' : 'interval');

        if (isColor) {
            parameters = extend({}, parameters);

            if (parameters.stops) {
                parameters.stops = parameters.stops.map(function (stop) {
                    return [stop[0], parseColor(stop[1])];
                });
            }

            if (parameters.default) {
                parameters.default = parseColor(parameters.default);
            } else {
                parameters.default = parseColor(propertySpec.default);
            }
        }

        var innerFun = void 0;
        var hashedStops = void 0;
        var categoricalKeyType = void 0;
        if (type === 'exponential') {
            innerFun = evaluateExponentialFunction;
        } else if (type === 'interval') {
            innerFun = evaluateIntervalFunction;
        } else if (type === 'categorical') {
            innerFun = evaluateCategoricalFunction;

            // For categorical functions, generate an Object as a hashmap of the stops for fast searching
            hashedStops = Object.create(null);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var  i = 0; i < parameters.stops.length; i++) {
                   var stop = parameters.stops[i]
                   hashedStops[stop[0]] = stop[1];
                }
                /*for (var _iterator = parameters.stops[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stop = _step.value;

                    hashedStops[stop[0]] = stop[1];
                }*/

                // Infer key type based on first stop key-- used to encforce strict type checking later
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            categoricalKeyType = _typeof(parameters.stops[0][0]);
        } else if (type === 'identity') {
            innerFun = evaluateIdentityFunction;
        } else {
            throw new Error('Unknown function type "' + type + '"');
        }

        var outputFunction = void 0;

        // If we're interpolating colors in a color system other than RGBA,
        // first translate all stop values to that color system, then interpolate
        // arrays as usual. The `outputFunction` option lets us then translate
        // the result of that interpolation back into RGBA.
        if (parameters.colorSpace && parameters.colorSpace !== 'rgb') {
            if (colorSpaces[parameters.colorSpace]) {
                var colorspace = colorSpaces[parameters.colorSpace];
                // Avoid mutating the parameters value
                parameters = JSON.parse(JSON.stringify(parameters));
                for (var s = 0; s < parameters.stops.length; s++) {
                    parameters.stops[s] = [parameters.stops[s][0], colorspace.forward(parameters.stops[s][1])];
                }
                outputFunction = colorspace.reverse;
            } else {
                throw new Error('Unknown color space: ' + parameters.colorSpace);
            }
        } else {
            outputFunction = identityFunction;
        }

        if (zoomAndFeatureDependent) {
            var featureFunctions = {};
            var zoomStops = [];
            for (var _s = 0; _s < parameters.stops.length; _s++) {
                var _stop = parameters.stops[_s];
                var zoom = _stop[0].zoom;
                if (featureFunctions[zoom] === undefined) {
                    featureFunctions[zoom] = {
                        zoom: zoom,
                        type: parameters.type,
                        property: parameters.property,
                        default: parameters.default,
                        stops: []
                    };
                    zoomStops.push(zoom);
                }
                featureFunctions[zoom].stops.push([_stop[0].value, _stop[1]]);
            }

            var featureFunctionStops = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              
                for (var  i = 0; i < zoomStops.length; i++) {
                    var z = zoomStops[i]
                    featureFunctionStops.push([featureFunctions[z].zoom, createFunction(featureFunctions[z], propertySpec)]);
                }
                /*for (var _iterator2 = zoomStops[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var z = _step2.value;

                    featureFunctionStops.push([featureFunctions[z].zoom, createFunction(featureFunctions[z], propertySpec)]);
                }*/
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            fun = function fun(zoom, feature) {
                return outputFunction(evaluateExponentialFunction({
                    stops: featureFunctionStops,
                    base: parameters.base
                }, propertySpec, zoom)(zoom, feature));
            };
            fun.isFeatureConstant = false;
            fun.isZoomConstant = false;
        } else if (zoomDependent) {
            fun = function fun(zoom) {
                return outputFunction(innerFun(parameters, propertySpec, zoom, hashedStops, categoricalKeyType));
            };
            fun.isFeatureConstant = true;
            fun.isZoomConstant = false;
        } else {
            fun = function fun(zoom, feature) {
                var value = feature[parameters.property];
                if (value === undefined) {
                    return coalesce(parameters.default, propertySpec.default);
                }
                return outputFunction(innerFun(parameters, propertySpec, value, hashedStops, categoricalKeyType));
            };
            fun.isFeatureConstant = false;
            fun.isZoomConstant = true;
        }
    }

    return fun;
}

function coalesce(a, b, c) {
    if (a !== undefined) return a;
    if (b !== undefined) return b;
    if (c !== undefined) return c;
}

function evaluateCategoricalFunction(parameters, propertySpec, input, hashedStops, keyType) {
    var evaluated = (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === keyType ? hashedStops[input] : undefined; // Enforce strict typing on input
    return coalesce(evaluated, parameters.default, propertySpec.default);
}

function evaluateIntervalFunction(parameters, propertySpec, input) {
    // Edge cases
    if (getType(input) !== 'number') return coalesce(parameters.default, propertySpec.default);
    var n = parameters.stops.length;
    if (n === 1) return parameters.stops[0][1];
    if (input <= parameters.stops[0][0]) return parameters.stops[0][1];
    if (input >= parameters.stops[n - 1][0]) return parameters.stops[n - 1][1];

    var index = findStopLessThanOrEqualTo(parameters.stops, input);

    return parameters.stops[index][1];
}

function evaluateExponentialFunction(parameters, propertySpec, input) {
    var base = parameters.base !== undefined ? parameters.base : 1;

    // Edge cases
    if (getType(input) !== 'number') return coalesce(parameters.default, propertySpec.default);
    var n = parameters.stops.length;
    if (n === 1) return parameters.stops[0][1];
    if (input <= parameters.stops[0][0]) return parameters.stops[0][1];
    if (input >= parameters.stops[n - 1][0]) return parameters.stops[n - 1][1];

    var index = findStopLessThanOrEqualTo(parameters.stops, input);
    var t = interpolationFactor(input, base, parameters.stops[index][0], parameters.stops[index + 1][0]);

    var outputLower = parameters.stops[index][1];
    var outputUpper = parameters.stops[index + 1][1];
    var interp = interpolate[propertySpec.type] || identityFunction;

    if (typeof outputLower === 'function') {
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var evaluatedLower = outputLower.apply(undefined, args);
            var evaluatedUpper = outputUpper.apply(undefined, args);
            // Special case for fill-outline-color, which has no spec default.
            if (evaluatedLower === undefined || evaluatedUpper === undefined) {
                return undefined;
            }
            return interp(evaluatedLower, evaluatedUpper, t);
        };
    }

    return interp(outputLower, outputUpper, t);
}

function evaluateIdentityFunction(parameters, propertySpec, input) {
    if (propertySpec.type === 'color') {
        input = parseColor(input);
    } else if (getType(input) !== propertySpec.type && (propertySpec.type !== 'enum' || !propertySpec.values[input])) {
        input = undefined;
    }
    return coalesce(input, parameters.default, propertySpec.default);
}

/**
 * Returns the index of the last stop <= input, or 0 if it doesn't exist.
 *
 * @private
 */
function findStopLessThanOrEqualTo(stops, input) {
    var n = stops.length;
    var lowerIndex = 0;
    var upperIndex = n - 1;
    var currentIndex = 0;
    var currentValue = void 0,
        upperValue = void 0;

    while (lowerIndex <= upperIndex) {
        currentIndex = Math.floor((lowerIndex + upperIndex) / 2);
        currentValue = stops[currentIndex][0];
        upperValue = stops[currentIndex + 1][0];
        if (input === currentValue || input > currentValue && input < upperValue) {
            // Search complete
            return currentIndex;
        } else if (currentValue < input) {
            lowerIndex = currentIndex + 1;
        } else if (currentValue > input) {
            upperIndex = currentIndex - 1;
        }
    }

    return Math.max(currentIndex - 1, 0);
}

function isFunctionDefinition(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && (value.stops || value.type === 'identity');
}

/**
 * Returns a ratio that can be used to interpolate between exponential function
 * stops.
 *
 * How it works:
 * Two consecutive stop values define a (scaled and shifted) exponential
 * function `f(x) = a * base^x + b`, where `base` is the user-specified base,
 * and `a` and `b` are constants affording sufficient degrees of freedom to fit
 * the function to the given stops.
 *
 * Here's a bit of algebra that lets us compute `f(x)` directly from the stop
 * values without explicitly solving for `a` and `b`:
 *
 * First stop value: `f(x0) = y0 = a * base^x0 + b`
 * Second stop value: `f(x1) = y1 = a * base^x1 + b`
 * => `y1 - y0 = a(base^x1 - base^x0)`
 * => `a = (y1 - y0)/(base^x1 - base^x0)`
 *
 * Desired value: `f(x) = y = a * base^x + b`
 * => `f(x) = y0 + a * (base^x - base^x0)`
 *
 * From the above, we can replace the `a` in `a * (base^x - base^x0)` and do a
 * little algebra:
 * ```
 * a * (base^x - base^x0) = (y1 - y0)/(base^x1 - base^x0) * (base^x - base^x0)
 *                     = (y1 - y0) * (base^x - base^x0) / (base^x1 - base^x0)
 * ```
 *
 * If we let `(base^x - base^x0) / (base^x1 base^x0)`, then we have
 * `f(x) = y0 + (y1 - y0) * ratio`.  In other words, `ratio` may be treated as
 * an interpolation factor between the two stops' output values.
 *
 * (Note: a slightly different form for `ratio`,
 * `(base^(x-x0) - 1) / (base^(x1-x0) - 1) `, is equivalent, but requires fewer
 * expensive `Math.pow()` operations.)
 *
 * @private
*/
function interpolationFactor(input, base, lowerValue, upperValue) {
    var difference = upperValue - lowerValue;
    var progress = input - lowerValue;

    if (difference === 0) {
        return 0;
    } else if (base === 1) {
        return progress / difference;
    } else {
        return (Math.pow(base, progress) - 1) / (Math.pow(base, difference) - 1);
    }
}

module.exports = createFunction;
module.exports.isFunctionDefinition = isFunctionDefinition;
module.exports.interpolationFactor = interpolationFactor;
module.exports.findStopLessThanOrEqualTo = findStopLessThanOrEqualTo;

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/util/extend.js":
/*!******************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/util/extend.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (output) {
    for (var _len = arguments.length, inputs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        inputs[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try { 
        for (var  i = 0; i < inputs.length; i++) {
            var input = inputs[i];
 
            for (var k in input) {
                output[k] = input[k];
            }       
        }
        /*for (var _iterator = inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var input = _step.value;

            for (var k in input) {
                output[k] = input[k];
            }
        }*/
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return output;
};

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/util/get_type.js":
/*!********************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/util/get_type.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function getType(val) {
    if (val instanceof Number) {
        return 'number';
    } else if (val instanceof String) {
        return 'string';
    } else if (val instanceof Boolean) {
        return 'boolean';
    } else if (Array.isArray(val)) {
        return 'array';
    } else if (val === null) {
        return 'null';
    } else {
        return typeof val === 'undefined' ? 'undefined' : _typeof(val);
    }
};

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/util/interpolate.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/util/interpolate.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = interpolate;

function interpolate(a, b, t) {
    return a * (1 - t) + b * t;
}

interpolate.number = interpolate;

interpolate.vec2 = function (from, to, t) {
    return [interpolate(from[0], to[0], t), interpolate(from[1], to[1], t)];
};

/*
 * Interpolate between two colors given as 4-element arrays.
 *
 * @param {Color} from
 * @param {Color} to
 * @param {number} t interpolation factor between 0 and 1
 * @returns {Color} interpolated color
 */
interpolate.color = function (from, to, t) {
    return [interpolate(from[0], to[0], t), interpolate(from[1], to[1], t), interpolate(from[2], to[2], t), interpolate(from[3], to[3], t)];
};

interpolate.array = function (from, to, t) {
    return from.map(function (d, i) {
        return interpolate(d, to[i], t);
    });
};

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/util/parse_color.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/util/parse_color.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseColorString = __webpack_require__(/*! csscolorparser */ "./node_modules/csscolorparser/csscolorparser.js").parseCSSColor;

module.exports = function parseColor(input) {
    if (typeof input === 'string') {
        var rgba = parseColorString(input);
        if (!rgba) {
            return undefined;
        }

        // GL expects all components to be in the range [0, 1] and to be
        // multipled by the alpha value.
        return [rgba[0] / 255 * rgba[3], rgba[1] / 255 * rgba[3], rgba[2] / 255 * rgba[3], rgba[3]];
    } else if (Array.isArray(input)) {
        return input;
    } else {
        return undefined;
    }
};

/***/ }),

/***/ "./node_modules/@mapbox/mapbox-gl-style-spec/util/ref_properties.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@mapbox/mapbox-gl-style-spec/util/ref_properties.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ['type', 'source', 'source-layer', 'minzoom', 'maxzoom', 'filter', 'layout'];

/***/ }),

/***/ "./node_modules/csscolorparser/csscolorparser.js":
/*!*******************************************************!*\
  !*** ./node_modules/csscolorparser/csscolorparser.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (c) Dean McNamee <dean@gmail.com>, 2012.
//
// https://github.com/deanm/css-color-parser-js
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

// http://www.w3.org/TR/css3-color/
var kCSSColorTable = {
  "transparent": [0, 0, 0, 0], "aliceblue": [240, 248, 255, 1],
  "antiquewhite": [250, 235, 215, 1], "aqua": [0, 255, 255, 1],
  "aquamarine": [127, 255, 212, 1], "azure": [240, 255, 255, 1],
  "beige": [245, 245, 220, 1], "bisque": [255, 228, 196, 1],
  "black": [0, 0, 0, 1], "blanchedalmond": [255, 235, 205, 1],
  "blue": [0, 0, 255, 1], "blueviolet": [138, 43, 226, 1],
  "brown": [165, 42, 42, 1], "burlywood": [222, 184, 135, 1],
  "cadetblue": [95, 158, 160, 1], "chartreuse": [127, 255, 0, 1],
  "chocolate": [210, 105, 30, 1], "coral": [255, 127, 80, 1],
  "cornflowerblue": [100, 149, 237, 1], "cornsilk": [255, 248, 220, 1],
  "crimson": [220, 20, 60, 1], "cyan": [0, 255, 255, 1],
  "darkblue": [0, 0, 139, 1], "darkcyan": [0, 139, 139, 1],
  "darkgoldenrod": [184, 134, 11, 1], "darkgray": [169, 169, 169, 1],
  "darkgreen": [0, 100, 0, 1], "darkgrey": [169, 169, 169, 1],
  "darkkhaki": [189, 183, 107, 1], "darkmagenta": [139, 0, 139, 1],
  "darkolivegreen": [85, 107, 47, 1], "darkorange": [255, 140, 0, 1],
  "darkorchid": [153, 50, 204, 1], "darkred": [139, 0, 0, 1],
  "darksalmon": [233, 150, 122, 1], "darkseagreen": [143, 188, 143, 1],
  "darkslateblue": [72, 61, 139, 1], "darkslategray": [47, 79, 79, 1],
  "darkslategrey": [47, 79, 79, 1], "darkturquoise": [0, 206, 209, 1],
  "darkviolet": [148, 0, 211, 1], "deeppink": [255, 20, 147, 1],
  "deepskyblue": [0, 191, 255, 1], "dimgray": [105, 105, 105, 1],
  "dimgrey": [105, 105, 105, 1], "dodgerblue": [30, 144, 255, 1],
  "firebrick": [178, 34, 34, 1], "floralwhite": [255, 250, 240, 1],
  "forestgreen": [34, 139, 34, 1], "fuchsia": [255, 0, 255, 1],
  "gainsboro": [220, 220, 220, 1], "ghostwhite": [248, 248, 255, 1],
  "gold": [255, 215, 0, 1], "goldenrod": [218, 165, 32, 1],
  "gray": [128, 128, 128, 1], "green": [0, 128, 0, 1],
  "greenyellow": [173, 255, 47, 1], "grey": [128, 128, 128, 1],
  "honeydew": [240, 255, 240, 1], "hotpink": [255, 105, 180, 1],
  "indianred": [205, 92, 92, 1], "indigo": [75, 0, 130, 1],
  "ivory": [255, 255, 240, 1], "khaki": [240, 230, 140, 1],
  "lavender": [230, 230, 250, 1], "lavenderblush": [255, 240, 245, 1],
  "lawngreen": [124, 252, 0, 1], "lemonchiffon": [255, 250, 205, 1],
  "lightblue": [173, 216, 230, 1], "lightcoral": [240, 128, 128, 1],
  "lightcyan": [224, 255, 255, 1], "lightgoldenrodyellow": [250, 250, 210, 1],
  "lightgray": [211, 211, 211, 1], "lightgreen": [144, 238, 144, 1],
  "lightgrey": [211, 211, 211, 1], "lightpink": [255, 182, 193, 1],
  "lightsalmon": [255, 160, 122, 1], "lightseagreen": [32, 178, 170, 1],
  "lightskyblue": [135, 206, 250, 1], "lightslategray": [119, 136, 153, 1],
  "lightslategrey": [119, 136, 153, 1], "lightsteelblue": [176, 196, 222, 1],
  "lightyellow": [255, 255, 224, 1], "lime": [0, 255, 0, 1],
  "limegreen": [50, 205, 50, 1], "linen": [250, 240, 230, 1],
  "magenta": [255, 0, 255, 1], "maroon": [128, 0, 0, 1],
  "mediumaquamarine": [102, 205, 170, 1], "mediumblue": [0, 0, 205, 1],
  "mediumorchid": [186, 85, 211, 1], "mediumpurple": [147, 112, 219, 1],
  "mediumseagreen": [60, 179, 113, 1], "mediumslateblue": [123, 104, 238, 1],
  "mediumspringgreen": [0, 250, 154, 1], "mediumturquoise": [72, 209, 204, 1],
  "mediumvioletred": [199, 21, 133, 1], "midnightblue": [25, 25, 112, 1],
  "mintcream": [245, 255, 250, 1], "mistyrose": [255, 228, 225, 1],
  "moccasin": [255, 228, 181, 1], "navajowhite": [255, 222, 173, 1],
  "navy": [0, 0, 128, 1], "oldlace": [253, 245, 230, 1],
  "olive": [128, 128, 0, 1], "olivedrab": [107, 142, 35, 1],
  "orange": [255, 165, 0, 1], "orangered": [255, 69, 0, 1],
  "orchid": [218, 112, 214, 1], "palegoldenrod": [238, 232, 170, 1],
  "palegreen": [152, 251, 152, 1], "paleturquoise": [175, 238, 238, 1],
  "palevioletred": [219, 112, 147, 1], "papayawhip": [255, 239, 213, 1],
  "peachpuff": [255, 218, 185, 1], "peru": [205, 133, 63, 1],
  "pink": [255, 192, 203, 1], "plum": [221, 160, 221, 1],
  "powderblue": [176, 224, 230, 1], "purple": [128, 0, 128, 1],
  "rebeccapurple": [102, 51, 153, 1],
  "red": [255, 0, 0, 1], "rosybrown": [188, 143, 143, 1],
  "royalblue": [65, 105, 225, 1], "saddlebrown": [139, 69, 19, 1],
  "salmon": [250, 128, 114, 1], "sandybrown": [244, 164, 96, 1],
  "seagreen": [46, 139, 87, 1], "seashell": [255, 245, 238, 1],
  "sienna": [160, 82, 45, 1], "silver": [192, 192, 192, 1],
  "skyblue": [135, 206, 235, 1], "slateblue": [106, 90, 205, 1],
  "slategray": [112, 128, 144, 1], "slategrey": [112, 128, 144, 1],
  "snow": [255, 250, 250, 1], "springgreen": [0, 255, 127, 1],
  "steelblue": [70, 130, 180, 1], "tan": [210, 180, 140, 1],
  "teal": [0, 128, 128, 1], "thistle": [216, 191, 216, 1],
  "tomato": [255, 99, 71, 1], "turquoise": [64, 224, 208, 1],
  "violet": [238, 130, 238, 1], "wheat": [245, 222, 179, 1],
  "white": [255, 255, 255, 1], "whitesmoke": [245, 245, 245, 1],
  "yellow": [255, 255, 0, 1], "yellowgreen": [154, 205, 50, 1] };

function clamp_css_byte(i) {
  // Clamp to integer 0 .. 255.
  i = Math.round(i); // Seems to be what Chrome does (vs truncation).
  return i < 0 ? 0 : i > 255 ? 255 : i;
}

function clamp_css_float(f) {
  // Clamp to float 0.0 .. 1.0.
  return f < 0 ? 0 : f > 1 ? 1 : f;
}

function parse_css_int(str) {
  // int or percentage.
  if (str[str.length - 1] === '%') return clamp_css_byte(parseFloat(str) / 100 * 255);
  return clamp_css_byte(parseInt(str));
}

function parse_css_float(str) {
  // float or percentage.
  if (str[str.length - 1] === '%') return clamp_css_float(parseFloat(str) / 100);
  return clamp_css_float(parseFloat(str));
}

function css_hue_to_rgb(m1, m2, h) {
  if (h < 0) h += 1;else if (h > 1) h -= 1;

  if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
  if (h * 2 < 1) return m2;
  if (h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  return m1;
}

function parseCSSColor(css_str) {
  // Remove all whitespace, not compliant, but should just be more accepting.
  var str = css_str.replace(/ /g, '').toLowerCase();

  // Color keywords (and transparent) lookup.
  if (str in kCSSColorTable) return kCSSColorTable[str].slice(); // dup.

  // #abc and #abc123 syntax.
  if (str[0] === '#') {
    if (str.length === 4) {
      var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.
      if (!(iv >= 0 && iv <= 0xfff)) return null; // Covers NaN.
      return [(iv & 0xf00) >> 4 | (iv & 0xf00) >> 8, iv & 0xf0 | (iv & 0xf0) >> 4, iv & 0xf | (iv & 0xf) << 4, 1];
    } else if (str.length === 7) {
      var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.
      if (!(iv >= 0 && iv <= 0xffffff)) return null; // Covers NaN.
      return [(iv & 0xff0000) >> 16, (iv & 0xff00) >> 8, iv & 0xff, 1];
    }

    return null;
  }

  var op = str.indexOf('('),
      ep = str.indexOf(')');
  if (op !== -1 && ep + 1 === str.length) {
    var fname = str.substr(0, op);
    var params = str.substr(op + 1, ep - (op + 1)).split(',');
    var alpha = 1; // To allow case fallthrough.
    switch (fname) {
      case 'rgba':
        if (params.length !== 4) return null;
        alpha = parse_css_float(params.pop());
      // Fall through.
      case 'rgb':
        if (params.length !== 3) return null;
        return [parse_css_int(params[0]), parse_css_int(params[1]), parse_css_int(params[2]), alpha];
      case 'hsla':
        if (params.length !== 4) return null;
        alpha = parse_css_float(params.pop());
      // Fall through.
      case 'hsl':
        if (params.length !== 3) return null;
        var h = (parseFloat(params[0]) % 360 + 360) % 360 / 360; // 0 .. 1
        // NOTE(deanm): According to the CSS spec s/l should only be
        // percentages, but we don't bother and let float or percentage.
        var s = parse_css_float(params[1]);
        var l = parse_css_float(params[2]);
        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var m1 = l * 2 - m2;
        return [clamp_css_byte(css_hue_to_rgb(m1, m2, h + 1 / 3) * 255), clamp_css_byte(css_hue_to_rgb(m1, m2, h) * 255), clamp_css_byte(css_hue_to_rgb(m1, m2, h - 1 / 3) * 255), alpha];
      default:
        return null;
    }
  }

  return null;
}

try {
  exports.parseCSSColor = parseCSSColor;
} catch (e) {}

/***/ }),

/***/ "./node_modules/mapbox-to-css-font/index.js":
/*!**************************************************!*\
  !*** ./node_modules/mapbox-to-css-font/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fontWeights = {
  thin: 100,
  hairline: 100,
  'ultra-light': 100,
  'extra-light': 100,
  light: 200,
  book: 300,
  regular: 400,
  normal: 400,
  plain: 400,
  roman: 400,
  standard: 400,
  medium: 500,
  'semi-bold': 600,
  'demi-bold': 600,
  bold: 700,
  heavy: 800,
  black: 800,
  'extra-bold': 800,
  'ultra-black': 900,
  'extra-black': 900,
  'ultra-bold': 900,
  'heavy-black': 900,
  fat: 900,
  poster: 900
};
var sp = ' ';

var fontCache = {};

module.exports = function (font, size) {
  var cssData = fontCache[font];
  if (!cssData) {
    var parts = font.split(' ');
    var maybeWeight = parts[parts.length - 1].toLowerCase();
    var weight = 'normal';
    var style = 'normal';
    if (maybeWeight == 'normal' || maybeWeight == 'italic' || maybeWeight == 'oblique') {
      style = maybeWeight;
      parts.pop();
      maybeWeight = parts[parts.length - 1].toLowerCase();
    }
    for (var w in fontWeights) {
      if (maybeWeight == w || maybeWeight == w.replace('-', '') || maybeWeight == w.replace('-', ' ')) {
        weight = fontWeights[w];
        parts.pop();
        break;
      }
    }
    if (typeof maybeWeight == 'number') {
      weight = maybeWeight;
    }
    var fontFamily = parts.join(' ').replace('Klokantech Noto Sans', 'Noto Sans');
    if (fontFamily.indexOf(' ') !== -1) {
      fontFamily = '"' + fontFamily + '"';
    }
    // CSS font property: font-style font-weight font-size font-family
    cssData = fontCache[font] = [style, weight, fontFamily];
  }
  return cssData[0] + sp + cssData[1] + sp + size + 'px' + sp + cssData[2];
};

/***/ }),

/***/ "./node_modules/ol/AssertionError.js":
/*!*******************************************!*\
  !*** ./node_modules/ol/AssertionError.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(/*! ./index.js */ "./node_modules/ol/index.js");

/**
 * Error object thrown when an assertion failed. This is an ECMA-262 Error,
 * extended with a `code` property.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 * @constructor
 * @extends {Error}
 * @param {number} code Error code.
 */
var AssertionError = function AssertionError(code) {

  var path = _index.VERSION ? _index.VERSION.split('-')[0] : 'latest';

  /**
   * @type {string}
   */
  this.message = 'Assertion failed. See https://openlayers.org/en/' + path + '/doc/errors/#' + code + ' for details.';

  /**
   * Error code. The meaning of the code can be found on
   * {@link https://openlayers.org/en/latest/doc/errors/} (replace `latest` with
   * the version found in the OpenLayers script's header comment if a version
   * other than the latest is used).
   * @type {number}
   * @api
   */
  this.code = code;

  this.name = 'AssertionError';
}; /**
    * @module ol/AssertionError
    */


(0, _index.inherits)(AssertionError, Error);

exports.default = AssertionError;

/***/ }),

/***/ "./node_modules/ol/asserts.js":
/*!************************************!*\
  !*** ./node_modules/ol/asserts.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = assert;

var _AssertionError = __webpack_require__(/*! ./AssertionError.js */ "./node_modules/ol/AssertionError.js");

var _AssertionError2 = _interopRequireDefault(_AssertionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {*} assertion Assertion we expected to be truthy.
 * @param {number} errorCode Error code.
 */
function assert(assertion, errorCode) {
  if (!assertion) {
    throw new _AssertionError2.default(errorCode);
  }
} /**
   * @module ol/asserts
   */

/***/ }),

/***/ "./node_modules/ol/color.js":
/*!**********************************!*\
  !*** ./node_modules/ol/color.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromString = undefined;
exports.asString = asString;
exports.asArray = asArray;
exports.normalize = normalize;
exports.toString = toString;

var _asserts = __webpack_require__(/*! ./asserts.js */ "./node_modules/ol/asserts.js");

var _math = __webpack_require__(/*! ./math.js */ "./node_modules/ol/math.js");

/**
 * A color represented as a short array [red, green, blue, alpha].
 * red, green, and blue should be integers in the range 0..255 inclusive.
 * alpha should be a float in the range 0..1 inclusive. If no alpha value is
 * given then `1` will be used.
 * @typedef {Array.<number>} Color
 * @api
 */

/**
 * This RegExp matches # followed by 3, 4, 6, or 8 hex digits.
 * @const
 * @type {RegExp}
 * @private
 */
/**
 * @module ol/color
 */
var HEX_COLOR_RE_ = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i;

/**
 * Regular expression for matching potential named color style strings.
 * @const
 * @type {RegExp}
 * @private
 */
var NAMED_COLOR_RE_ = /^([a-z]*)$/i;

/**
 * Return the color as an rgba string.
 * @param {module:ol/color~Color|string} color Color.
 * @return {string} Rgba string.
 * @api
 */
function asString(color) {
  if (typeof color === 'string') {
    return color;
  } else {
    return toString(color);
  }
}

/**
 * Return named color as an rgba string.
 * @param {string} color Named color.
 * @return {string} Rgb string.
 */
function fromNamed(color) {
  var el = document.createElement('div');
  el.style.color = color;
  if (el.style.color !== '') {
    document.body.appendChild(el);
    var rgb = getComputedStyle(el).color;
    document.body.removeChild(el);
    return rgb;
  } else {
    return '';
  }
}

/**
 * @param {string} s String.
 * @return {module:ol/color~Color} Color.
 */
var fromString = exports.fromString = function () {

  // We maintain a small cache of parsed strings.  To provide cheap LRU-like
  // semantics, whenever the cache grows too large we simply delete an
  // arbitrary 25% of the entries.

  /**
   * @const
   * @type {number}
   */
  var MAX_CACHE_SIZE = 1024;

  /**
   * @type {Object.<string, module:ol/color~Color>}
   */
  var cache = {};

  /**
   * @type {number}
   */
  var cacheSize = 0;

  return (
    /**
     * @param {string} s String.
     * @return {module:ol/color~Color} Color.
     */
    function (s) {
      var color = void 0;
      if (cache.hasOwnProperty(s)) {
        color = cache[s];
      } else {
        if (cacheSize >= MAX_CACHE_SIZE) {
          var i = 0;
          for (var key in cache) {
            if ((i++ & 3) === 0) {
              delete cache[key];
              --cacheSize;
            }
          }
        }
        color = fromStringInternal_(s);
        cache[s] = color;
        ++cacheSize;
      }
      return color;
    }
  );
}();

/**
 * Return the color as an array. This function maintains a cache of calculated
 * arrays which means the result should not be modified.
 * @param {module:ol/color~Color|string} color Color.
 * @return {module:ol/color~Color} Color.
 * @api
 */
function asArray(color) {
  if (Array.isArray(color)) {
    return color;
  } else {
    return fromString( /** @type {string} */color);
  }
}

/**
 * @param {string} s String.
 * @private
 * @return {module:ol/color~Color} Color.
 */
function fromStringInternal_(s) {
  var r = void 0,
      g = void 0,
      b = void 0,
      a = void 0,
      color = void 0;

  if (NAMED_COLOR_RE_.exec(s)) {
    s = fromNamed(s);
  }

  if (HEX_COLOR_RE_.exec(s)) {
    // hex
    var n = s.length - 1; // number of hex digits
    var d = void 0; // number of digits per channel
    if (n <= 4) {
      d = 1;
    } else {
      d = 2;
    }
    var hasAlpha = n === 4 || n === 8;
    r = parseInt(s.substr(1 + 0 * d, d), 16);
    g = parseInt(s.substr(1 + 1 * d, d), 16);
    b = parseInt(s.substr(1 + 2 * d, d), 16);
    if (hasAlpha) {
      a = parseInt(s.substr(1 + 3 * d, d), 16);
    } else {
      a = 255;
    }
    if (d == 1) {
      r = (r << 4) + r;
      g = (g << 4) + g;
      b = (b << 4) + b;
      if (hasAlpha) {
        a = (a << 4) + a;
      }
    }
    color = [r, g, b, a / 255];
  } else if (s.indexOf('rgba(') == 0) {
    // rgba()
    color = s.slice(5, -1).split(',').map(Number);
    normalize(color);
  } else if (s.indexOf('rgb(') == 0) {
    // rgb()
    color = s.slice(4, -1).split(',').map(Number);
    color.push(1);
    normalize(color);
  } else {
    (0, _asserts.assert)(false, 14); // Invalid color
  }
  return (
    /** @type {module:ol/color~Color} */color
  );
}

/**
 * TODO this function is only used in the test, we probably shouldn't export it
 * @param {module:ol/color~Color} color Color.
 * @return {module:ol/color~Color} Clamped color.
 */
function normalize(color) {
  color[0] = (0, _math.clamp)(color[0] + 0.5 | 0, 0, 255);
  color[1] = (0, _math.clamp)(color[1] + 0.5 | 0, 0, 255);
  color[2] = (0, _math.clamp)(color[2] + 0.5 | 0, 0, 255);
  color[3] = (0, _math.clamp)(color[3], 0, 1);
  return color;
}

/**
 * @param {module:ol/color~Color} color Color.
 * @return {string} String.
 */
function toString(color) {
  var r = color[0];
  if (r != (r | 0)) {
    r = r + 0.5 | 0;
  }
  var g = color[1];
  if (g != (g | 0)) {
    g = g + 0.5 | 0;
  }
  var b = color[2];
  if (b != (b | 0)) {
    b = b + 0.5 | 0;
  }
  var a = color[3] === undefined ? 1 : color[3];
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

/***/ }),

/***/ "./node_modules/ol/index.js":
/*!**********************************!*\
  !*** ./node_modules/ol/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = exports.WEBGL_EXTENSIONS = exports.WEBGL_MAX_TEXTURE_SIZE = exports.HAS_WEBGL = exports.DEBUG_WEBGL = undefined;
exports.inherits = inherits;
exports.getUid = getUid;

var _webgl = __webpack_require__(/*! ./webgl.js */ "./node_modules/ol/webgl.js");

/**
 * An array with two elements, representing a pixel. The first element is the
 * x-coordinate, the second the y-coordinate of the pixel.
 * @typedef {Array.<number>} Pixel
 * @api
 */

/**
 * Include debuggable shader sources.  Default is `true`. This should be set to
 * `false` for production builds.
 * TODO: move to a separate ol-webgl package
 * @type {boolean}
 */
var DEBUG_WEBGL = exports.DEBUG_WEBGL = true;

/**
 * TODO: move to a separate ol-webgl package
 * The maximum supported WebGL texture size in pixels. If WebGL is not
 * supported, the value is set to `undefined`.
 * @type {number|undefined}
 */
/**
 * @module ol
 */

var WEBGL_MAX_TEXTURE_SIZE = void 0; // value is set below


/**
 * TODO: move to a separate ol-webgl package
 * List of supported WebGL extensions.
 * @type {Array.<string>}
 */
var WEBGL_EXTENSIONS = void 0; // value is set below


/**
 * TODO: move to a separate ol-webgl package
 * WebGL is available.
 * @type {boolean}
 */
var HAS_WEBGL = false;

if (typeof window !== 'undefined' && 'WebGLRenderingContext' in window) {
  try {
    var canvas = /** @type {HTMLCanvasElement} */document.createElement('CANVAS');
    var gl = (0, _webgl.getContext)(canvas, { failIfMajorPerformanceCaveat: true });
    if (gl) {
      exports.HAS_WEBGL = HAS_WEBGL = true;
      exports.WEBGL_MAX_TEXTURE_SIZE = WEBGL_MAX_TEXTURE_SIZE = /** @type {number} */gl.getParameter(gl.MAX_TEXTURE_SIZE);
      exports.WEBGL_EXTENSIONS = WEBGL_EXTENSIONS = gl.getSupportedExtensions();
    }
  } catch (e) {
    // pass
  }
}

exports.HAS_WEBGL = HAS_WEBGL;
exports.WEBGL_MAX_TEXTURE_SIZE = WEBGL_MAX_TEXTURE_SIZE;
exports.WEBGL_EXTENSIONS = WEBGL_EXTENSIONS;

/**
 * OpenLayers version.
 * @type {string}
 */

var VERSION = exports.VERSION = 'v4.6.4';

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 *
 *     function ParentClass(a, b) { }
 *     ParentClass.prototype.foo = function(a) { }
 *
 *     function ChildClass(a, b, c) {
 *       // Call parent constructor
 *       ParentClass.call(this, a, b);
 *     }
 *     inherits(ChildClass, ParentClass);
 *
 *     var child = new ChildClass('a', 'b', 'see');
 *     child.foo(); // This works.
 *
 * @param {!Function} childCtor Child constructor.
 * @param {!Function} parentCtor Parent constructor.
 * @function
 * @api
 */
function inherits(childCtor, parentCtor) {
  childCtor.prototype = Object.create(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
}

/**
 * Counter for getUid.
 * @type {number}
 * @private
 */
var uidCounter_ = 0;

/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are generated
 * as a strictly increasing sequence. Adapted from goog.getUid.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
function getUid(obj) {
  return obj.ol_uid || (obj.ol_uid = ++uidCounter_);
}

/***/ }),

/***/ "./node_modules/ol/math.js":
/*!*********************************!*\
  !*** ./node_modules/ol/math.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cosh = undefined;
exports.clamp = clamp;
exports.roundUpToPowerOfTwo = roundUpToPowerOfTwo;
exports.squaredSegmentDistance = squaredSegmentDistance;
exports.squaredDistance = squaredDistance;
exports.solveLinearSystem = solveLinearSystem;
exports.toDegrees = toDegrees;
exports.toRadians = toRadians;
exports.modulo = modulo;
exports.lerp = lerp;

var _asserts = __webpack_require__(/*! ./asserts.js */ "./node_modules/ol/asserts.js");

/**
 * Takes a number and clamps it to within the provided bounds.
 * @param {number} value The input number.
 * @param {number} min The minimum value to return.
 * @param {number} max The maximum value to return.
 * @return {number} The input number if it is within bounds, or the nearest
 *     number within the bounds.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Return the hyperbolic cosine of a given number. The method will use the
 * native `Math.cosh` function if it is available, otherwise the hyperbolic
 * cosine will be calculated via the reference implementation of the Mozilla
 * developer network.
 *
 * @param {number} x X.
 * @return {number} Hyperbolic cosine of x.
 */
/**
 * @module ol/math
 */
var cosh = exports.cosh = function () {
  // Wrapped in a iife, to save the overhead of checking for the native
  // implementation on every invocation.
  var cosh = void 0;
  if ('cosh' in Math) {
    // The environment supports the native Math.cosh function, use it…
    cosh = Math.cosh;
  } else {
    // … else, use the reference implementation of MDN:
    cosh = function cosh(x) {
      var y = Math.exp(x);
      return (y + 1 / y) / 2;
    };
  }
  return cosh;
}();

/**
 * @param {number} x X.
 * @return {number} The smallest power of two greater than or equal to x.
 */
function roundUpToPowerOfTwo(x) {
  (0, _asserts.assert)(0 < x, 29); // `x` must be greater than `0`
  return Math.pow(2, Math.ceil(Math.log(x) / Math.LN2));
}

/**
 * Returns the square of the closest distance between the point (x, y) and the
 * line segment (x1, y1) to (x2, y2).
 * @param {number} x X.
 * @param {number} y Y.
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
function squaredSegmentDistance(x, y, x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  if (dx !== 0 || dy !== 0) {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else if (t > 0) {
      x1 += dx * t;
      y1 += dy * t;
    }
  }
  return squaredDistance(x, y, x1, y1);
}

/**
 * Returns the square of the distance between the points (x1, y1) and (x2, y2).
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
function squaredDistance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return dx * dx + dy * dy;
}

/**
 * Solves system of linear equations using Gaussian elimination method.
 *
 * @param {Array.<Array.<number>>} mat Augmented matrix (n x n + 1 column)
 *                                     in row-major order.
 * @return {Array.<number>} The resulting vector.
 */
function solveLinearSystem(mat) {
  var n = mat.length;

  for (var i = 0; i < n; i++) {
    // Find max in the i-th column (ignoring i - 1 first rows)
    var maxRow = i;
    var maxEl = Math.abs(mat[i][i]);
    for (var r = i + 1; r < n; r++) {
      var absValue = Math.abs(mat[r][i]);
      if (absValue > maxEl) {
        maxEl = absValue;
        maxRow = r;
      }
    }

    if (maxEl === 0) {
      return null; // matrix is singular
    }

    // Swap max row with i-th (current) row
    var tmp = mat[maxRow];
    mat[maxRow] = mat[i];
    mat[i] = tmp;

    // Subtract the i-th row to make all the remaining rows 0 in the i-th column
    for (var j = i + 1; j < n; j++) {
      var coef = -mat[j][i] / mat[i][i];
      for (var k = i; k < n + 1; k++) {
        if (i == k) {
          mat[j][k] = 0;
        } else {
          mat[j][k] += coef * mat[i][k];
        }
      }
    }
  }

  // Solve Ax=b for upper triangular matrix A (mat)
  var x = new Array(n);
  for (var l = n - 1; l >= 0; l--) {
    x[l] = mat[l][n] / mat[l][l];
    for (var m = l - 1; m >= 0; m--) {
      mat[m][n] -= mat[m][l] * x[l];
    }
  }
  return x;
}

/**
 * Converts radians to to degrees.
 *
 * @param {number} angleInRadians Angle in radians.
 * @return {number} Angle in degrees.
 */
function toDegrees(angleInRadians) {
  return angleInRadians * 180 / Math.PI;
}

/**
 * Converts degrees to radians.
 *
 * @param {number} angleInDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */
function toRadians(angleInDegrees) {
  return angleInDegrees * Math.PI / 180;
}

/**
 * Returns the modulo of a / b, depending on the sign of b.
 *
 * @param {number} a Dividend.
 * @param {number} b Divisor.
 * @return {number} Modulo.
 */
function modulo(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
}

/**
 * Calculates the linearly interpolated value of x between a and b.
 *
 * @param {number} a Number
 * @param {number} b Number
 * @param {number} x Value to be interpolated.
 * @return {number} Interpolated value.
 */
function lerp(a, b, x) {
  return a + x * (b - a);
}

/***/ }),

/***/ "./node_modules/ol/webgl.js":
/*!**********************************!*\
  !*** ./node_modules/ol/webgl.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContext = getContext;
/**
 * @module ol/webgl
 */

/**
 * Constants taken from goog.webgl
 */

/**
 * @const
 * @type {number}
 */
var ONE = exports.ONE = 1;

/**
 * @const
 * @type {number}
 */
var SRC_ALPHA = exports.SRC_ALPHA = 0x0302;

/**
 * @const
 * @type {number}
 */
var COLOR_ATTACHMENT0 = exports.COLOR_ATTACHMENT0 = 0x8CE0;

/**
 * @const
 * @type {number}
 */
var COLOR_BUFFER_BIT = exports.COLOR_BUFFER_BIT = 0x00004000;

/**
 * @const
 * @type {number}
 */
var TRIANGLES = exports.TRIANGLES = 0x0004;

/**
 * @const
 * @type {number}
 */
var TRIANGLE_STRIP = exports.TRIANGLE_STRIP = 0x0005;

/**
 * @const
 * @type {number}
 */
var ONE_MINUS_SRC_ALPHA = exports.ONE_MINUS_SRC_ALPHA = 0x0303;

/**
 * @const
 * @type {number}
 */
var ARRAY_BUFFER = exports.ARRAY_BUFFER = 0x8892;

/**
 * @const
 * @type {number}
 */
var ELEMENT_ARRAY_BUFFER = exports.ELEMENT_ARRAY_BUFFER = 0x8893;

/**
 * @const
 * @type {number}
 */
var STREAM_DRAW = exports.STREAM_DRAW = 0x88E0;

/**
 * @const
 * @type {number}
 */
var STATIC_DRAW = exports.STATIC_DRAW = 0x88E4;

/**
 * @const
 * @type {number}
 */
var DYNAMIC_DRAW = exports.DYNAMIC_DRAW = 0x88E8;

/**
 * @const
 * @type {number}
 */
var CULL_FACE = exports.CULL_FACE = 0x0B44;

/**
 * @const
 * @type {number}
 */
var BLEND = exports.BLEND = 0x0BE2;

/**
 * @const
 * @type {number}
 */
var STENCIL_TEST = exports.STENCIL_TEST = 0x0B90;

/**
 * @const
 * @type {number}
 */
var DEPTH_TEST = exports.DEPTH_TEST = 0x0B71;

/**
 * @const
 * @type {number}
 */
var SCISSOR_TEST = exports.SCISSOR_TEST = 0x0C11;

/**
 * @const
 * @type {number}
 */
var UNSIGNED_BYTE = exports.UNSIGNED_BYTE = 0x1401;

/**
 * @const
 * @type {number}
 */
var UNSIGNED_SHORT = exports.UNSIGNED_SHORT = 0x1403;

/**
 * @const
 * @type {number}
 */
var UNSIGNED_INT = exports.UNSIGNED_INT = 0x1405;

/**
 * @const
 * @type {number}
 */
var FLOAT = exports.FLOAT = 0x1406;

/**
 * @const
 * @type {number}
 */
var RGBA = exports.RGBA = 0x1908;

/**
 * @const
 * @type {number}
 */
var FRAGMENT_SHADER = exports.FRAGMENT_SHADER = 0x8B30;

/**
 * @const
 * @type {number}
 */
var VERTEX_SHADER = exports.VERTEX_SHADER = 0x8B31;

/**
 * @const
 * @type {number}
 */
var LINK_STATUS = exports.LINK_STATUS = 0x8B82;

/**
 * @const
 * @type {number}
 */
var LINEAR = exports.LINEAR = 0x2601;

/**
 * @const
 * @type {number}
 */
var TEXTURE_MAG_FILTER = exports.TEXTURE_MAG_FILTER = 0x2800;

/**
 * @const
 * @type {number}
 */
var TEXTURE_MIN_FILTER = exports.TEXTURE_MIN_FILTER = 0x2801;

/**
 * @const
 * @type {number}
 */
var TEXTURE_WRAP_S = exports.TEXTURE_WRAP_S = 0x2802;

/**
 * @const
 * @type {number}
 */
var TEXTURE_WRAP_T = exports.TEXTURE_WRAP_T = 0x2803;

/**
 * @const
 * @type {number}
 */
var TEXTURE_2D = exports.TEXTURE_2D = 0x0DE1;

/**
 * @const
 * @type {number}
 */
var TEXTURE0 = exports.TEXTURE0 = 0x84C0;

/**
 * @const
 * @type {number}
 */
var CLAMP_TO_EDGE = exports.CLAMP_TO_EDGE = 0x812F;

/**
 * @const
 * @type {number}
 */
var COMPILE_STATUS = exports.COMPILE_STATUS = 0x8B81;

/**
 * @const
 * @type {number}
 */
var FRAMEBUFFER = exports.FRAMEBUFFER = 0x8D40;

/** end of goog.webgl constants
 */

/**
 * @const
 * @type {Array.<string>}
 */
var CONTEXT_IDS = ['experimental-webgl', 'webgl', 'webkit-3d', 'moz-webgl'];

/**
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {Object=} opt_attributes Attributes.
 * @return {WebGLRenderingContext} WebGL rendering context.
 */
function getContext(canvas, opt_attributes) {
  var ii = CONTEXT_IDS.length;
  for (var i = 0; i < ii; ++i) {
    try {
      var context = canvas.getContext(CONTEXT_IDS[i], opt_attributes);
      if (context) {
        return (/** @type {!WebGLRenderingContext} */context
        );
      }
    } catch (e) {
      // pass
    }
  }
  return null;
}

/***/ }),

/***/ "./node_modules/webfont-matcher/lib/fonts/google.js":
/*!**********************************************************!*\
  !*** ./node_modules/webfont-matcher/lib/fonts/google.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Generated by CoffeeScript 1.10.0
(function () {
  var families;

  module.exports = {
    icon: 'icons/google.svg',
    name: 'google',
    title: 'Google Fonts',
    link: 'google.com/fonts',
    getNames: function getNames() {
      return families;
    },
    getLink: function getLink(name) {
      return "https://fonts.google.com/specimen/" + name.replace(/( )/g, '+');
    },
    normalizeName: function normalizeName(name) {
      return name;
    }
  };

  families = ["ABeeZee", "Abel", "Abril Fatface", "Aclonica", "Acme", "Actor", "Adamina", "Advent Pro", "Aguafina Script", "Akronim", "Aladin", "Aldrich", "Alef", "Alegreya", "Alegreya SC", "Alegreya Sans", "Alegreya Sans SC", "Alex Brush", "Alfa Slab One", "Alice", "Alike", "Alike Angular", "Allan", "Allerta", "Allerta Stencil", "Allura", "Almendra", "Almendra Display", "Almendra SC", "Amarante", "Amaranth", "Amatic SC", "Amethysta", "Amiri", "Amita", "Anaheim", "Andada", "Andika", "Angkor", "Annie Use Your Telescope", "Anonymous Pro", "Antic", "Antic Didone", "Antic Slab", "Anton", "Arapey", "Arbutus", "Arbutus Slab", "Architects Daughter", "Archivo Black", "Archivo Narrow", "Arimo", "Arizonia", "Armata", "Artifika", "Arvo", "Arya", "Asap", "Asar", "Asset", "Astloch", "Asul", "Atomic Age", "Aubrey", "Audiowide", "Autour One", "Average", "Average Sans", "Averia Gruesa Libre", "Averia Libre", "Averia Sans Libre", "Averia Serif Libre", "Bad Script", "Balthazar", "Bangers", "Basic", "Battambang", "Baumans", "Bayon", "Belgrano", "Belleza", "BenchNine", "Bentham", "Berkshire Swash", "Bevan", "Bigelow Rules", "Bigshot One", "Bilbo", "Bilbo Swash Caps", "Biryani", "Bitter", "Black Ops One", "Bokor", "Bonbon", "Boogaloo", "Bowlby One", "Bowlby One SC", "Brawler", "Bree Serif", "Bubblegum Sans", "Bubbler One", "Buda", "Buenard", "Butcherman", "Butterfly Kids", "Cabin", "Cabin Condensed", "Cabin Sketch", "Caesar Dressing", "Cagliostro", "Calligraffitti", "Cambay", "Cambo", "Candal", "Cantarell", "Cantata One", "Cantora One", "Capriola", "Cardo", "Carme", "Carrois Gothic", "Carrois Gothic SC", "Carter One", "Catamaran", "Caudex", "Caveat", "Caveat Brush", "Cedarville Cursive", "Ceviche One", "Changa One", "Chango", "Chau Philomene One", "Chela One", "Chelsea Market", "Chenla", "Cherry Cream Soda", "Cherry Swash", "Chewy", "Chicle", "Chivo", "Chonburi", "Cinzel", "Cinzel Decorative", "Clicker Script", "Coda", "Coda Caption", "Codystar", "Combo", "Comfortaa", "Coming Soon", "Concert One", "Condiment", "Content", "Contrail One", "Convergence", "Cookie", "Copse", "Corben", "Courgette", "Cousine", "Coustard", "Covered By Your Grace", "Crafty Girls", "Creepster", "Crete Round", "Crimson Text", "Croissant One", "Crushed", "Cuprum", "Cutive", "Cutive Mono", "Damion", "Dancing Script", "Dangrek", "Dawning of a New Day", "Days One", "Dekko", "Delius", "Delius Swash Caps", "Delius Unicase", "Della Respira", "Denk One", "Devonshire", "Dhurjati", "Didact Gothic", "Diplomata", "Diplomata SC", "Domine", "Donegal One", "Doppio One", "Dorsa", "Dosis", "Dr Sugiyama", "Droid Sans", "Droid Sans Mono", "Droid Serif", "Duru Sans", "Dynalight", "EB Garamond", "Eagle Lake", "Eater", "Economica", "Eczar", "Ek Mukta", "Electrolize", "Elsie", "Elsie Swash Caps", "Emblema One", "Emilys Candy", "Engagement", "Englebert", "Enriqueta", "Erica One", "Esteban", "Euphoria Script", "Ewert", "Exo", "Exo 2", "Expletus Sans", "Fanwood Text", "Fascinate", "Fascinate Inline", "Faster One", "Fasthand", "Fauna One", "Federant", "Federo", "Felipa", "Fenix", "Finger Paint", "Fira Mono", "Fira Sans", "Fjalla One", "Fjord One", "Flamenco", "Flavors", "Fondamento", "Fontdiner Swanky", "Forum", "Francois One", "Freckle Face", "Fredericka the Great", "Fredoka One", "Freehand", "Fresca", "Frijole", "Fruktur", "Fugaz One", "GFS Didot", "GFS Neohellenic", "Gabriela", "Gafata", "Galdeano", "Galindo", "Gentium Basic", "Gentium Book Basic", "Geo", "Geostar", "Geostar Fill", "Germania One", "Gidugu", "Gilda Display", "Give You Glory", "Glass Antiqua", "Glegoo", "Gloria Hallelujah", "Goblin One", "Gochi Hand", "Gorditas", "Goudy Bookletter 1911", "Graduate", "Grand Hotel", "Gravitas One", "Great Vibes", "Griffy", "Gruppo", "Gudea", "Gurajada", "Habibi", "Halant", "Hammersmith One", "Hanalei", "Hanalei Fill", "Handlee", "Hanuman", "Happy Monkey", "Headland One", "Henny Penny", "Herr Von Muellerhoff", "Hind", "Hind Siliguri", "Hind Vadodara", "Holtwood One SC", "Homemade Apple", "Homenaje", "IM Fell DW Pica", "IM Fell DW Pica SC", "IM Fell Double Pica", "IM Fell Double Pica SC", "IM Fell English", "IM Fell English SC", "IM Fell French Canon", "IM Fell French Canon SC", "IM Fell Great Primer", "IM Fell Great Primer SC", "Iceberg", "Iceland", "Imprima", "Inconsolata", "Inder", "Indie Flower", "Inika", "Inknut Antiqua", "Irish Grover", "Istok Web", "Italiana", "Italianno", "Itim", "Jacques Francois", "Jacques Francois Shadow", "Jaldi", "Jim Nightshade", "Jockey One", "Jolly Lodger", "Josefin Sans", "Josefin Slab", "Joti One", "Judson", "Julee", "Julius Sans One", "Junge", "Jura", "Just Another Hand", "Just Me Again Down Here", "Kadwa", "Kalam", "Kameron", "Kantumruy", "Karla", "Karma", "Kaushan Script", "Kavoon", "Kdam Thmor", "Keania One", "Kelly Slab", "Kenia", "Khand", "Khmer", "Khula", "Kite One", "Knewave", "Kotta One", "Koulen", "Kranky", "Kreon", "Kristi", "Krona One", "Kurale", "La Belle Aurore", "Laila", "Lakki Reddy", "Lancelot", "Lateef", "Lato", "League Script", "Leckerli One", "Ledger", "Lekton", "Lemon", "Libre Baskerville", "Life Savers", "Lilita One", "Lily Script One", "Limelight", "Linden Hill", "Lobster", "Lobster Two", "Londrina Outline", "Londrina Shadow", "Londrina Sketch", "Londrina Solid", "Lora", "Love Ya Like A Sister", "Loved by the King", "Lovers Quarrel", "Luckiest Guy", "Lusitana", "Lustria", "Macondo", "Macondo Swash Caps", "Magra", "Maiden Orange", "Mako", "Mallanna", "Mandali", "Marcellus", "Marcellus SC", "Marck Script", "Margarine", "Marko One", "Marmelad", "Martel", "Martel Sans", "Marvel", "Mate", "Mate SC", "Maven Pro", "McLaren", "Meddon", "MedievalSharp", "Medula One", "Megrim", "Meie Script", "Merienda", "Merienda One", "Merriweather", "Merriweather Sans", "Metal", "Metal Mania", "Metamorphous", "Metrophobic", "Michroma", "Milonga", "Miltonian", "Miltonian Tattoo", "Miniver", "Miss Fajardose", "Modak", "Modern Antiqua", "Molengo", "Molle", "Monda", "Monofett", "Monoton", "Monsieur La Doulaise", "Montaga", "Montez", "Montserrat", "Montserrat Alternates", "Montserrat Subrayada", "Moul", "Moulpali", "Mountains of Christmas", "Mouse Memoirs", "Mr Bedfort", "Mr Dafoe", "Mr De Haviland", "Mrs Saint Delafield", "Mrs Sheppards", "Muli", "Mystery Quest", "NTR", "Neucha", "Neuton", "New Rocker", "News Cycle", "Niconne", "Nixie One", "Nobile", "Nokora", "Norican", "Nosifer", "Nothing You Could Do", "Noticia Text", "Noto Sans", "Noto Serif", "Nova Cut", "Nova Flat", "Nova Mono", "Nova Oval", "Nova Round", "Nova Script", "Nova Slim", "Nova Square", "Numans", "Nunito", "Odor Mean Chey", "Offside", "Old Standard TT", "Oldenburg", "Oleo Script", "Oleo Script Swash Caps", "Open Sans", "Open Sans Condensed", "Oranienbaum", "Orbitron", "Oregano", "Orienta", "Original Surfer", "Oswald", "Over the Rainbow", "Overlock", "Overlock SC", "Ovo", "Oxygen", "Oxygen Mono", "PT Mono", "PT Sans", "PT Sans Caption", "PT Sans Narrow", "PT Serif", "PT Serif Caption", "Pacifico", "Palanquin", "Palanquin Dark", "Paprika", "Parisienne", "Passero One", "Passion One", "Pathway Gothic One", "Patrick Hand", "Patrick Hand SC", "Patua One", "Paytone One", "Peddana", "Peralta", "Permanent Marker", "Petit Formal Script", "Petrona", "Philosopher", "Piedra", "Pinyon Script", "Pirata One", "Plaster", "Play", "Playball", "Playfair Display", "Playfair Display SC", "Podkova", "Poiret One", "Poller One", "Poly", "Pompiere", "Pontano Sans", "Poppins", "Port Lligat Sans", "Port Lligat Slab", "Pragati Narrow", "Prata", "Preahvihear", "Press Start 2P", "Princess Sofia", "Prociono", "Prosto One", "Puritan", "Purple Purse", "Quando", "Quantico", "Quattrocento", "Quattrocento Sans", "Questrial", "Quicksand", "Quintessential", "Qwigley", "Racing Sans One", "Radley", "Rajdhani", "Raleway", "Raleway Dots", "Ramabhadra", "Ramaraja", "Rambla", "Rammetto One", "Ranchers", "Rancho", "Ranga", "Rationale", "Ravi Prakash", "Redressed", "Reenie Beanie", "Revalia", "Rhodium Libre", "Ribeye", "Ribeye Marrow", "Righteous", "Risque", "Roboto", "Roboto Condensed", "Roboto Mono", "Roboto Slab", "Rochester", "Rock Salt", "Rokkitt", "Romanesco", "Ropa Sans", "Rosario", "Rosarivo", "Rouge Script", "Rozha One", "Rubik", "Rubik Mono One", "Rubik One", "Ruda", "Rufina", "Ruge Boogie", "Ruluko", "Rum Raisin", "Ruslan Display", "Russo One", "Ruthie", "Rye", "Sacramento", "Sahitya", "Sail", "Salsa", "Sanchez", "Sancreek", "Sansita One", "Sarala", "Sarina", "Sarpanch", "Satisfy", "Scada", "Scheherazade", "Schoolbell", "Seaweed Script", "Sevillana", "Seymour One", "Shadows Into Light", "Shadows Into Light Two", "Shanti", "Share", "Share Tech", "Share Tech Mono", "Shojumaru", "Short Stack", "Siemreap", "Sigmar One", "Signika", "Signika Negative", "Simonetta", "Sintony", "Sirin Stencil", "Six Caps", "Skranji", "Slabo 13px", "Slabo 27px", "Slackey", "Smokum", "Smythe", "Sniglet", "Snippet", "Snowburst One", "Sofadi One", "Sofia", "Sonsie One", "Sorts Mill Goudy", "Source Code Pro", "Source Sans Pro", "Source Serif Pro", "Special Elite", "Spicy Rice", "Spinnaker", "Spirax", "Squada One", "Sree Krushnadevaraya", "Stalemate", "Stalinist One", "Stardos Stencil", "Stint Ultra Condensed", "Stint Ultra Expanded", "Stoke", "Strait", "Sue Ellen Francisco", "Sumana", "Sunshiney", "Supermercado One", "Sura", "Suranna", "Suravaram", "Suwannaphum", "Swanky and Moo Moo", "Syncopate", "Tangerine", "Taprom", "Tauri", "Teko", "Telex", "Tenali Ramakrishna", "Tenor Sans", "Text Me One", "The Girl Next Door", "Tienne", "Tillana", "Timmana", "Tinos", "Titan One", "Titillium Web", "Trade Winds", "Trocchi", "Trochut", "Trykker", "Tulpen One", "Ubuntu", "Ubuntu Condensed", "Ubuntu Mono", "Ultra", "Uncial Antiqua", "Underdog", "Unica One", "UnifrakturCook", "UnifrakturMaguntia", "Unkempt", "Unlock", "Unna", "VT323", "Vampiro One", "Varela", "Varela Round", "Vast Shadow", "Vesper Libre", "Vibur", "Vidaloka", "Viga", "Voces", "Volkhov", "Vollkorn", "Voltaire", "Waiting for the Sunrise", "Wallpoet", "Walter Turncoat", "Warnes", "Wellfleet", "Wendy One", "Wire One", "Work Sans", "Yanone Kaffeesatz", "Yantramanav", "Yellowtail", "Yeseva One", "Yesteryear", "Zeyada"];
}).call(undefined);

/***/ }),

/***/ "./olms.js":
/*!*****************!*\
  !*** ./olms.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(/*! ./index */ "./index.js");

var _stylefunction = __webpack_require__(/*! ./stylefunction */ "./stylefunction.js");

var _stylefunction2 = _interopRequireDefault(_stylefunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  apply: _index.apply,
  applyBackground: _index.applyBackground,
  applyStyle: _index.applyStyle,
  stylefunction: _stylefunction2.default
};

/***/ }),

/***/ "./stylefunction.js":
/*!**************************!*\
  !*** ./stylefunction.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                              ol-mapbox-style - Use Mapbox Style objects with OpenLayers
                                                                                                                                                                                                                                                                              Copyright 2016-present Boundless Spatial, Inc.
                                                                                                                                                                                                                                                                              License: https://raw.githubusercontent.com/boundlessgeo/ol-mapbox-gl-style/master/LICENSE
                                                                                                                                                                                                                                                                              */

exports.default = function (olLayer, glStyle, source, resolutions, spriteData, spriteImageUrl, fonts) {
  if (!resolutions) {
    resolutions = [];
    for (var res = 78271.51696402048; resolutions.length < 21; res /= 2) {
      resolutions.push(res);
    }
  }
  if (typeof glStyle == 'string') {
    glStyle = JSON.parse(glStyle);
  }
  if (glStyle.version != 8) {
    throw new Error('glStyle version 8 required.');
  }

  var spriteImage = void 0,
      spriteImgSize = void 0;
  if (spriteImageUrl) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      spriteImage = img;
      spriteImgSize = [img.width, img.height];
      olLayer.changed();
    };
    img.src = spriteImageUrl;
  }

  var ctx = document.createElement('CANVAS').getContext('2d');
  var measureCache = {};
  function wrapText(text, font, em) {
    var key = em + ',' + font + ',' + text;
    var wrappedText = measureCache[key];
    if (!wrappedText) {
      ctx.font = font;
      var oneEm = ctx.measureText('M').width;
      var width = oneEm * em;
      var words = text.split(' ');
      var line = '';
      var lines = [];
      for (var i = 0, ii = words.length; i < ii; ++i) {
        var word = words[i];
        if (ctx.measureText(line + word).width <= width) {
          line += (line ? ' ' : '') + word;
        } else {
          if (line) {
            lines.push(line);
          }
          line = word;
        }
      }
      if (line) {
        lines.push(line);
      }
      measureCache[key] = wrappedText = lines.join('\n');
    }
    return wrappedText;
  }

  var allLayers = (0, _deref2.default)(glStyle.layers);

  var layersBySourceLayer = {};
  var mapboxLayers = [];
  var mapboxSource = void 0;
  for (var i = 0, ii = allLayers.length; i < ii; ++i) {
    var layer = allLayers[i];
    var layerId = layer.id;
    if (typeof source == 'string' && layer.source == source || source.indexOf(layerId) !== -1) {
      var sourceLayer = layer['source-layer'];
      if (!mapboxSource) {
        mapboxSource = layer.source;
      }
      var layers = layersBySourceLayer[sourceLayer];
      if (!layers) {
        layers = layersBySourceLayer[sourceLayer] = [];
      }
      layers.push({
        layer: layer,
        index: i
      });
      mapboxLayers.push(layerId);
    }
    // TODO revisit when diffing gets added
    delete functionCache[layerId];
    delete filterCache[layerId];
  }

  var textHalo = new _Stroke2.default();
  var textColor = new _Fill2.default();

  var iconImageCache = {};

  var styles = [];

  var styleFunction = function styleFunction(feature, resolution) {
    var properties = feature.getProperties();
    var layers = layersBySourceLayer[properties.layer];
    if (!layers) {
      return;
    }
    var zoom = resolutions.indexOf(resolution);
    if (zoom == -1) {
      zoom = (0, _util.getZoomForResolution)(resolution, resolutions);
    }
    var type = types[feature.getGeometry().getType()];
    var f = {
      properties: properties,
      type: type
    };
    var stylesLength = -1;
    for (var _i = 0, _ii = layers.length; _i < _ii; ++_i) {
      var layerData = layers[_i];
      var _layer = layerData.layer;
      var _layerId = _layer.id;

      var layout = _layer.layout || emptyObj;
      var paint = _layer.paint || emptyObj;
      if (layout.visibility === 'none' || 'minzoom' in _layer && zoom < _layer.minzoom || 'maxzoom' in _layer && zoom >= _layer.maxzoom) {
        continue;
      }
      var filter = _layer.filter;
      if (!filter || evaluateFilter(_layerId, filter, f)) {
        var color = void 0,
            opacity = void 0,
            fill = void 0,
            stroke = void 0,
            strokeColor = void 0,
            style = void 0;
        var index = layerData.index;
        if (type == 3) {
          if (!('fill-pattern' in paint) && 'fill-color' in paint) {
            opacity = getValue(_layerId, paint, 'fill-opacity', zoom, properties);
            color = colorWithOpacity(getValue(_layerId, paint, 'fill-color', zoom, properties), opacity);
            if (color) {
              ++stylesLength;
              style = styles[stylesLength];
              if (!style || !style.getFill() || style.getStroke() || style.getText()) {
                style = styles[stylesLength] = new _Style2.default({
                  fill: new _Fill2.default()
                });
              }
              fill = style.getFill();
              fill.setColor(color);
              style.setZIndex(index);
            }
            if ('fill-outline-color' in paint) {
              strokeColor = colorWithOpacity(getValue(_layerId, paint, 'fill-outline-color', zoom, properties), opacity);
            }
            if (strokeColor) {
              ++stylesLength;
              style = styles[stylesLength];
              if (!style || !style.getStroke() || style.getFill() || style.getText()) {
                style = styles[stylesLength] = new _Style2.default({
                  stroke: new _Stroke2.default()
                });
              }
              stroke = style.getStroke();
              stroke.setLineCap(defaults['line-cap']);
              stroke.setLineJoin(defaults['line-join']);
              stroke.setMiterLimit(defaults['line-miter-limit']);
              stroke.setColor(strokeColor);
              stroke.setWidth(1);
              stroke.setLineDash(null);
              style.setZIndex(index);
            }
          }
        }
        if (type != 1) {
          (function () {
            color = !('line-pattern' in paint) && 'line-color' in paint ? colorWithOpacity(getValue(_layerId, paint, 'line-color', zoom, properties), getValue(_layerId, paint, 'line-opacity', zoom, properties)) : undefined;
            var width = getValue(_layerId, paint, 'line-width', zoom, properties);
            if (color && width > 0) {
              ++stylesLength;
              style = styles[stylesLength];
              if (!style || !style.getStroke() || style.getFill() || style.getText()) {
                style = styles[stylesLength] = new _Style2.default({
                  stroke: new _Stroke2.default()
                });
              }
              stroke = style.getStroke();
              stroke.setLineCap(getValue(_layerId, layout, 'line-cap', zoom, properties));
              stroke.setLineJoin(getValue(_layerId, layout, 'line-join', zoom, properties));
              stroke.setMiterLimit(getValue(_layerId, layout, 'line-miter-limit', zoom, properties));
              stroke.setColor(color);
              stroke.setWidth(width);
              stroke.setLineDash(paint['line-dasharray'] ? getValue(_layerId, paint, 'line-dasharray', zoom, properties).map(function (x) {
                return x * width;
              }) : null);
              style.setZIndex(index);
            }
          })();
        }

        var hasImage = false;
        var text = null;
        var icon = void 0,
            iconImg = void 0,
            skipLabel = void 0;
        if ((type == 1 || type == 2) && 'icon-image' in layout) {
          var iconImage = getValue(_layerId, layout, 'icon-image', zoom, properties);
          if (iconImage) {
            icon = fromTemplate(iconImage, properties);
            var styleGeom = undefined;
            if (spriteImage && spriteData && spriteData[icon]) {
              if (type == 2) {
                var geom = feature.getGeometry();
                // ol package and ol-debug.js only
                if (geom.getFlatMidpoint) {
                  var extent = geom.getExtent();
                  var size = Math.sqrt(Math.max(Math.pow((extent[2] - extent[0]) / resolution, 2), Math.pow((extent[3] - extent[1]) / resolution, 2)));
                  if (size > 150) {
                    //FIXME Do not hard-code a size of 150
                    styleGeom = new _Point2.default(geom.getFlatMidpoint());
                  }
                }
              }
              if (type !== 2 || styleGeom) {
                ++stylesLength;
                style = styles[stylesLength];
                if (!style || !style.getImage() || style.getFill() || style.getStroke()) {
                  style = styles[stylesLength] = new _Style2.default();
                }
                style.setGeometry(styleGeom);
                var iconSize = getValue(_layerId, layout, 'icon-size', zoom, properties);
                var iconColor = paint['icon-color'] !== undefined ? getValue(_layerId, paint, 'icon-color', zoom, properties) : null;
                var icon_cache_key = icon + '.' + iconSize;
                if (iconColor !== null) {
                  icon_cache_key += '.' + iconColor;
                }
                iconImg = iconImageCache[icon_cache_key];
                if (!iconImg) {
                  var spriteImageData = spriteData[icon];
                  if (iconColor !== null) {
                    // cut out the sprite and color it
                    color = colorWithOpacity(iconColor, 1);
                    var canvas = document.createElement('canvas');
                    canvas.width = spriteImageData.width;
                    canvas.height = spriteImageData.height;
                    var _ctx = canvas.getContext('2d');
                    _ctx.drawImage(spriteImage, spriteImageData.x, spriteImageData.y, spriteImageData.width, spriteImageData.height, 0, 0, spriteImageData.width, spriteImageData.height);
                    var data = _ctx.getImageData(0, 0, canvas.width, canvas.height);
                    for (var c = 0, cc = data.data.length; c < cc; c += 4) {
                      data.data[c] = color[0];
                      data.data[c + 1] = color[1];
                      data.data[c + 2] = color[2];
                    }
                    _ctx.putImageData(data, 0, 0);
                    iconImg = iconImageCache[icon_cache_key] = new _Icon2.default({
                      img: canvas,
                      imgSize: [canvas.width, canvas.height],
                      scale: iconSize / spriteImageData.pixelRatio
                    });
                  } else {
                    iconImg = iconImageCache[icon_cache_key] = new _Icon2.default({
                      img: spriteImage,
                      imgSize: spriteImgSize,
                      size: [spriteImageData.width, spriteImageData.height],
                      offset: [spriteImageData.x, spriteImageData.y],
                      scale: iconSize / spriteImageData.pixelRatio
                    });
                  }
                }
                iconImg.setRotation((0, _util.deg2rad)(getValue(_layerId, layout, 'icon-rotate', zoom, properties)));
                iconImg.setOpacity(getValue(_layerId, paint, 'icon-opacity', zoom, properties));
                style.setImage(iconImg);
                text = style.getText();
                style.setText(undefined);
                style.setZIndex(99999 - index);
                hasImage = true;
                skipLabel = false;
              } else {
                skipLabel = true;
              }
            }
          }
        }

        if (type == 1 && 'circle-radius' in paint) {
          ++stylesLength;
          style = styles[stylesLength];
          if (!style || !style.getImage() || style.getFill() || style.getStroke()) {
            style = styles[stylesLength] = new _Style2.default();
          }
          var circleRadius = getValue(_layerId, paint, 'circle-radius', zoom, properties);
          var circleStrokeColor = getValue(_layerId, paint, 'circle-stroke-color', zoom, properties);
          var circleColor = getValue(_layerId, paint, 'circle-color', zoom, properties);
          var circleOpacity = getValue(_layerId, paint, 'circle-opacity', zoom, properties);
          var circleStrokeWidth = getValue(_layerId, paint, 'circle-stroke-width', zoom, properties);
          var cache_key = circleRadius + '.' + circleStrokeColor + '.' + circleColor + '.' + circleOpacity + '.' + circleStrokeWidth;
          iconImg = iconImageCache[cache_key];
          if (!iconImg) {
            iconImg = new _Circle2.default({
              radius: circleRadius,
              stroke: circleStrokeWidth === 0 ? undefined : new _Stroke2.default({
                width: circleStrokeWidth,
                color: colorWithOpacity(circleStrokeColor, circleOpacity)
              }),
              fill: new _Fill2.default({
                color: colorWithOpacity(circleColor, circleOpacity)
              })
            });
          }
          style.setImage(iconImg);
          text = style.getText();
          style.setText(undefined);
          style.setGeometry(undefined);
          style.setZIndex(99999 - index);
          hasImage = true;
        }

        var label = void 0;
        if ('text-field' in layout) {
          var textField = getValue(_layerId, layout, 'text-field', zoom, properties);
          label = fromTemplate(textField, properties);
        }
        if (label && !skipLabel) {
          if (!hasImage) {
            ++stylesLength;
            style = styles[stylesLength];
            if (!style || !style.getText() || style.getFill() || style.getStroke()) {
              style = styles[stylesLength] = new _Style2.default();
            }
            style.setImage(undefined);
            style.setGeometry(undefined);
          }
          if (!style.getText()) {
            style.setText(text || new _Text2.default());
          }
          text = style.getText();
          var textSize = getValue(_layerId, layout, 'text-size', zoom, properties);
          var font = (0, _mapboxToCssFont2.default)(chooseFont(getValue(_layerId, layout, 'text-font', zoom, properties)), textSize);
          var textTransform = layout['text-transform'];
          if (textTransform == 'uppercase') {
            label = label.toUpperCase();
          } else if (textTransform == 'lowercase') {
            label = label.toLowerCase();
          }
          var wrappedLabel = type == 2 ? label : wrapText(label, font, getValue(_layerId, layout, 'text-max-width', zoom, properties));
          text.setText(wrappedLabel);
          text.setFont(font);
          text.setRotation((0, _util.deg2rad)(getValue(_layerId, layout, 'text-rotate', zoom, properties)));
          var textAnchor = getValue(_layerId, layout, 'text-anchor', zoom, properties);
          var placement = hasImage || type == 1 ? 'point' : getValue(_layerId, layout, 'symbol-placement', zoom, properties);
          text.setPlacement(placement);
          if (placement == 'point') {
            var textAlign = 'center';
            if (textAnchor.indexOf('left') !== -1) {
              textAlign = 'left';
            } else if (textAnchor.indexOf('right') !== -1) {
              textAlign = 'right';
            }
            text.setTextAlign(textAlign);
          } else {
            text.setTextAlign();
          }
          var textBaseline = 'middle';
          if (textAnchor.indexOf('bottom') == 0) {
            textBaseline = 'bottom';
          } else if (textAnchor.indexOf('top') == 0) {
            textBaseline = 'top';
          }
          text.setTextBaseline(textBaseline);
          var textOffset = getValue(_layerId, layout, 'text-offset', zoom, properties);
          text.setOffsetX(textOffset[0] * textSize);
          text.setOffsetY(textOffset[1] * textSize);
          opacity = getValue(_layerId, paint, 'text-opacity', zoom, properties);
          textColor.setColor(colorWithOpacity(getValue(_layerId, paint, 'text-color', zoom, properties), opacity));
          text.setFill(textColor);
          var haloColor = colorWithOpacity(getValue(_layerId, paint, 'text-halo-color', zoom, properties), opacity);
          if (haloColor) {
            textHalo.setColor(haloColor);
            textHalo.setWidth(getValue(_layerId, paint, 'text-halo-width', zoom, properties));
            text.setStroke(textHalo);
          } else {
            text.setStroke(undefined);
          }
          style.setZIndex(99999 - index);
        }
      }
    }

    if (stylesLength > -1) {
      styles.length = stylesLength + 1;
      return styles;
    }
  };

  olLayer.setStyle(styleFunction);
  olLayer.set('mapbox-source', mapboxSource);
  olLayer.set('mapbox-layers', mapboxLayers);
  return styleFunction;
};

var _Style = ol.style.Style;

var _Style2 = _interopRequireDefault(_Style);

var _Fill = ol.style.Fill;

var _Fill2 = _interopRequireDefault(_Fill);

var _Stroke = ol.style.Stroke;

var _Stroke2 = _interopRequireDefault(_Stroke);

var _Icon = ol.style.Icon;

var _Icon2 = _interopRequireDefault(_Icon);

var _Text = ol.style.Text;

var _Text2 = _interopRequireDefault(_Text);

var _Circle = ol.style.Circle;

var _Circle2 = _interopRequireDefault(_Circle);

var _Point = ol.geom.Point;

var _Point2 = _interopRequireDefault(_Point);

var _deref = __webpack_require__(/*! @mapbox/mapbox-gl-style-spec/deref */ "./node_modules/@mapbox/mapbox-gl-style-spec/deref.js");

var _deref2 = _interopRequireDefault(_deref);

var _function = __webpack_require__(/*! @mapbox/mapbox-gl-style-spec/function */ "./node_modules/@mapbox/mapbox-gl-style-spec/function/index.js");

var _function2 = _interopRequireDefault(_function);

var _feature_filter = __webpack_require__(/*! @mapbox/mapbox-gl-style-spec/feature_filter */ "./node_modules/@mapbox/mapbox-gl-style-spec/feature_filter/index.js");

var _feature_filter2 = _interopRequireDefault(_feature_filter);

var _mapboxToCssFont = __webpack_require__(/*! mapbox-to-css-font */ "./node_modules/mapbox-to-css-font/index.js");

var _mapboxToCssFont2 = _interopRequireDefault(_mapboxToCssFont);

var _util = __webpack_require__(/*! ./util */ "./util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var functionTypes = {
  'line-miter-limit': 'interpolated',
  'fill-opacity': 'interpolated',
  'line-opacity': 'interpolated',
  'line-width': 'interpolated',
  'text-halo-width': 'interpolated',
  'text-max-width': 'interpolated',
  'text-offset': 'interpolated',
  'text-opacity': 'interpolated',
  'text-rotate': 'interpolated',
  'text-size': 'interpolated',
  'icon-opacity': 'interpolated',
  'icon-rotate': 'interpolated',
  'icon-size': 'interpolated',
  'icon-color': 'interpolated',
  'circle-radius': 'interpolated',
  'circle-opacity': 'interpolated',
  'circle-stroke-width': 'interpolated',
  'circle-color': 'interpolated',
  'circle-stroke-color': 'interpolated',
  'text-halo-color': 'interpolated',
  'text-color': 'interpolated',
  'line-color': 'interpolated',
  'fill-outline-color': 'interpolated',
  'fill-color': 'interpolated',
  'icon-image': 'piecewise-constant',
  'line-cap': 'piecewise-constant',
  'line-join': 'piecewise-constant',
  'line-dasharray': 'piecewise-constant',
  'symbol-placement': 'piecewise-constant',
  'text-anchor': 'piecewise-constant',
  'text-field': 'piecewise-constant',
  'text-font': 'piecewise-constant'
};

var defaults = {
  'fill-opacity': 1,
  'line-cap': 'butt',
  'line-join': 'miter',
  'line-miter-limit': 2,
  'line-opacity': 1,
  'line-width': 1,
  'symbol-placement': 'point',
  'text-anchor': 'center',
  'text-color': '#000000',
  'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
  'text-halo-color': 'rgba(0, 0, 0, 0)',
  'text-halo-width': 0,
  'text-max-width': 10,
  'text-offset': [0, 0],
  'text-opacity': 1,
  'text-rotate': 0,
  'text-size': 16,
  'icon-opacity': 1,
  'icon-rotate': 0,
  'icon-size': 1,
  'circle-color': '#000000',
  'circle-stroke-color': '#000000',
  'circle-opacity': 1,
  'circle-stroke-width': 0
};

var types = {
  'Point': 1,
  'MultiPoint': 1,
  'LineString': 2,
  'MultiLineString': 2,
  'Polygon': 3,
  'MultiPolygon': 3
};

var functionCache = {};
function getValue(layerId, layoutOrPaint, property, zoom, properties) {
  if (!functionCache[layerId]) {
    functionCache[layerId] = {};
  }
  var functions = functionCache[layerId];
  if (!functions[property]) {
    var value = layoutOrPaint[property];
    if (value === undefined) {
      value = defaults[property];
    }
    functions[property] = (0, _function2.default)(value, {
      function: functionTypes[property],
      type: property.indexOf('color') !== -1 ? 'color' : (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && value.stops && typeof value.stops[0][0] == 'number' ? 'number' : undefined
    });
  }
  return functions[property](zoom, properties);
}

var fontMap = {};
function chooseFont(fonts, availableFonts) {
  if (fontMap[fonts]) {
    return fontMap[fonts];
  }
  if (availableFonts) {
    for (var i = 0, ii = fonts.length; i < ii; ++i) {
      var font = fonts[i];
      if (availableFonts.indexOf(font) != -1) {
        fontMap[fonts] = font;
        break;
      }
    }
    if (!fontMap[fonts]) {
      // fallback font
      fontMap[fonts] = fonts[fonts.length - 1];
    }
  } else {
    fontMap[fonts] = fonts[0];
  }
  return fontMap[fonts];
}

var filterCache = {};
function evaluateFilter(layerId, filter, feature) {
  if (!(layerId in filterCache)) {
    filterCache[layerId] = (0, _feature_filter2.default)(filter);
  }
  return filterCache[layerId](feature);
}

var colorCache = {};
function colorWithOpacity(color, opacity) {
  if (color && opacity !== undefined) {
    var colorData = colorCache[color];
    if (!colorData) {
      colorCache[color] = colorData = {
        color: [color[0] * 255 / color[3], color[1] * 255 / color[3], color[2] * 255 / color[3], color[3]],
        opacity: color[3]
      };
    }
    color = colorData.color;
    color[3] = colorData.opacity * opacity;
    if (color[3] === 0) {
      color = undefined;
    }
  }
  return color;
}

var templateRegEx = /^([^]*)\{(.*)\}([^]*)$/;
function fromTemplate(text, properties) {
  var parts = void 0;
  do {
    parts = text.match(templateRegEx);
    if (parts) {
      var value = properties[parts[2]] || '';
      text = parts[1] + value + parts[3];
    }
  } while (parts);
  return text;
}

var emptyObj = {};

/**
 * Creates a style function from the `glStyle` object for all layers that use
 * the specified `source`, which needs to be a `"type": "vector"` or
 * `"type": "geojson"` source and applies it to the specified OpenLayers layer.
 *
 * @param {ol.layer.Vector|ol.layer.VectorTile} olLayer OpenLayers layer to
 * apply the style to. In addition to the style, the layer will get two
 * properties: `mapbox-source` will be the `id` of the `glStyle`'s source used
 * for the layer, and `mapbox-layers` will be an array of the `id`s of the
 * `glStyle`'s layers.
 * @param {string|Object} glStyle Mapbox Style object.
 * @param {string|Array<string>} source `source` key or an array of layer `id`s
 * from the Mapbox Style object. When a `source` key is provided, all layers for
 * the specified source will be included in the style function. When layer `id`s
 * are provided, they must be from layers that use the same source.
 * @param {Array<number>} [resolutions=[78271.51696402048, 39135.75848201024,
 * 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564,
 * 1222.99245256282, 611.49622628141, 305.748113140705, 152.8740565703525,
 * 76.43702828517625, 38.21851414258813, 19.109257071294063, 9.554628535647032,
 * 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395,
 * 0.29858214173896974, 0.14929107086948487, 0.07464553543474244]]
 * Resolutions for mapping resolution to zoom level.
 * @param {Object} [spriteData=undefined] Sprite data from the url specified in
 * the Mapbox Style object's `sprite` property. Only required if a `sprite`
 * property is specified in the Mapbox Style object.
 * @param {Object} [spriteImageUrl=undefined] Sprite image url for the sprite
 * specified in the Mapbox Style object's `sprite` property. Only required if a
 * `sprite` property is specified in the Mapbox Style object.
 * @param {Array<string>} [fonts=undefined] Array of available fonts, using the
 * same font names as the Mapbox Style object. If not provided, the style
 * function will always use the first font from the font array.
 * @return {ol.style.StyleFunction} Style function for use in
 * `ol.layer.Vector` or `ol.layer.VectorTile`.
 */

/***/ }),

/***/ "./util.js":
/*!*****************!*\
  !*** ./util.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deg2rad = deg2rad;
exports.getZoomForResolution = getZoomForResolution;
function deg2rad(degrees) {
  return degrees * Math.PI / 180;
}

function getZoomForResolution(resolution, resolutions) {
  var i = 0;
  var ii = resolutions.length;
  for (; i < ii; ++i) {
    var candidate = resolutions[i];
    if (candidate < resolution && i + 1 < ii) {
      var zoomFactor = resolutions[i] / resolutions[i + 1];
      return i + Math.log(resolutions[i] / resolution) / Math.log(zoomFactor);
    }
  }
  return ii - 1;
}

/***/ }),

/***/ "ol/Map":
/*!*************************!*\
  !*** external "ol.Map" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.Map;

/***/ }),

/***/ "ol/Observable":
/*!********************************!*\
  !*** external "ol.Observable" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.Observable;

/***/ }),

/***/ "ol/format/GeoJSON":
/*!************************************!*\
  !*** external "ol.format.GeoJSON" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.format.GeoJSON;

/***/ }),

/***/ "ol/format/MVT":
/*!********************************!*\
  !*** external "ol.format.MVT" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.format.MVT;

/***/ }),

/***/ "ol/geom/Point":
/*!********************************!*\
  !*** external "ol.geom.Point" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.geom.Point;

/***/ }),

/***/ "ol/layer/Tile":
/*!********************************!*\
  !*** external "ol.layer.Tile" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.Tile;

/***/ }),

/***/ "ol/layer/Vector":
/*!**********************************!*\
  !*** external "ol.layer.Vector" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.Vector;

/***/ }),

/***/ "ol/layer/VectorTile":
/*!**************************************!*\
  !*** external "ol.layer.VectorTile" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.VectorTile;

/***/ }),

/***/ "ol/proj":
/*!**************************!*\
  !*** external "ol.proj" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.proj;

/***/ }),

/***/ "ol/source/TileJSON":
/*!*************************************!*\
  !*** external "ol.source.TileJSON" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.TileJSON;

/***/ }),

/***/ "ol/source/Vector":
/*!***********************************!*\
  !*** external "ol.source.Vector" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.Vector;

/***/ }),

/***/ "ol/source/VectorTile":
/*!***************************************!*\
  !*** external "ol.source.VectorTile" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.VectorTile;

/***/ }),

/***/ "ol/source/XYZ":
/*!********************************!*\
  !*** external "ol.source.XYZ" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.XYZ;

/***/ }),

/***/ "ol/style/Circle":
/*!**********************************!*\
  !*** external "ol.style.Circle" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.style.Circle;

/***/ }),

/***/ "ol/style/Fill":
/*!********************************!*\
  !*** external "ol.style.Fill" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.style.Fill;

/***/ }),

/***/ "ol/style/Icon":
/*!********************************!*\
  !*** external "ol.style.Icon" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.style.Icon;

/***/ }),

/***/ "ol/style/Stroke":
/*!**********************************!*\
  !*** external "ol.style.Stroke" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.style.Stroke;

/***/ }),

/***/ "ol/style/Style":
/*!*********************************!*\
  !*** external "ol.style.Style" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.style.Style;

/***/ }),

/***/ "ol/tilegrid":
/*!******************************!*\
  !*** external "ol.tilegrid" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.tilegrid;

/***/ })

/******/ })["default"];
