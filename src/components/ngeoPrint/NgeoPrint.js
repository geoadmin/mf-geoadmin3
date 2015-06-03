//(function () {
/**
 * @fileoverview Provides a function to create ngeo.Print objects used to
 * interact with MapFish Print v3 services.
 *
 * ngeo.Print objects expose the following methods:
 *
 * - createSpec: create a report specification object
 * - createReport: send a create report request
 * - getStatus: get the status of a report
 * - getReportUrl: get the URL of a report
 *
 * Example:
 *
 * var printBaseUrl = 'http://example.com/print';
 * var print = new ngeo.Print(printBaseUrl);
 *
 * var scale = 5000;
 * var dpi = 72;
 * var layout = 'A4 portrait';
 * var reportSpec = print.createSpec(map, scale, dpi, layout,
 *     {'title': 'A title for my report'});
 *
 * TODO and limitations:
 *
 * - Add getCapabilities method that gets the print capabilities from the
 *   MapFish Print service.
 * - createSpec should also accept a bbox instead of a center and a scale.
 * - Add support for ol.style.RegularShape. MapFish Print supports symbols
 *   like crosses, stars and squares, so printing regular shapes should be
 *   possible.
 * - ol.style.Icon may use a sprite image, and offsets to define to rectangle
 *   to use within the sprite. This type of icons won't be printed correctly
 *   as MapFish Print does not support sprite icons.
 * - Text styles (ol.style.Text) are currently not supported/printed.
 */

goog.provide('ngeo_create_print');
goog.provide('ngeo_print');

goog.require('goog.color');
goog.require('goog.math');
goog.require('goog.object');
goog.require('ngeo');
goog.require('ol.format.GeoJSON');
goog.require('ol.layer.Image');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.size');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.Vector');
goog.require('ol.source.WMTS');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Image');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
goog.require('ol.tilegrid.WMTS');


/**
 * @typedef {function(string):!ngeo.Print}
 */
ngeo.CreatePrint;



/**
 * @constructor
 * @param {string} url URL to MapFish print web service.
 * @param {angular.$http} $http Angular $http service.
 * @param {angular.$window} $window Angural $window service
 */
ngeo.Print = function(url, $http, $window) {
  /**
   * @type {string}
   * @private
   */
  this.url_ = url;

  /**
   * @type {angular.$http}
   * @private
   */
  this.$http_ = $http;

  /**
   * @type {angular.$window}
   * @private
   */
  this.$window_ = $window;
};


/**
 * @const
 * @private
 */
ngeo.Print.FEAT_STYLE_PROP_PREFIX_ = '_ngeo_style_';


/**
 * Create a report specification.
 * @param {ol.Map} map Map.
 * @param {number} scale Scale.
 * @param {number} dpi DPI.
 * @param {string} layout Layout.
 * @param {Object.<string, *>} customAttributes Custom attributes.
 * @return {MapFishPrintSpec} The print spec.
 */
ngeo.Print.prototype.createSpec = function(
    map, scale, dpi, layout, customAttributes) {

  var specMap = /** @type {MapFishPrintMap} */ ({
    dpi: dpi
  });

  this.encodeMap_(map, scale, specMap);

  var attributes = /** @type {MapFishPrintAttributes} */ ({
    map: specMap
  });
  goog.object.extend(attributes, customAttributes);

  var spec = /** @type {MapFishPrintSpec} */ ({
    attributes: attributes,
    layout: layout
  });

  return spec;
};


/**
 * @param {ol.Map} map Map.
 * @param {number} scale Scale.
 * @param {MapFishPrintMap} object Object.
 * @private
 */
ngeo.Print.prototype.encodeMap_ = function(map, scale, object) {
  var view = map.getView();
  var viewCenter = view.getCenter();
  var viewProjection = view.getProjection();
  var viewResolution = view.getResolution();

  goog.asserts.assert(goog.isDef(viewCenter));
  goog.asserts.assert(goog.isDef(viewProjection));

  object.center = viewCenter;
  object.projection = viewProjection.getCode();
  object.scale = scale;
  object.layers = [];

  var layersCollection = map.getLayers();
  goog.asserts.assert(!goog.isNull(layersCollection));
  var layers = layersCollection.getArray().slice().reverse();

  goog.array.forEach(layers,
      /**
       * @param {ol.layer.Layer} layer Layer.
       * @param {number} idx Index.
       * @param {Array.<ol.layer.Layer>} layers Layers.
       */
      function(layer, idx, layers) {
        goog.asserts.assert(goog.isDef(viewResolution));
        this.encodeLayer_(object.layers, layer, viewResolution);
      }, this);
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {ol.layer.Base} layer Layer.
 * @param {number} resolution Resolution.
 * @private
 */
ngeo.Print.prototype.encodeLayer_ = function(arr, layer, resolution) {
  if (layer instanceof ol.layer.Image) {
    this.encodeImageLayer_(arr, layer);
  } else if (layer instanceof ol.layer.Tile) {
    this.encodeTileLayer_(arr, layer);
  } else if (layer instanceof ol.layer.Vector) {
    this.encodeVectorLayer_(arr, layer, resolution);
  }
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {ol.layer.Image} layer Layer.
 * @private
 */
ngeo.Print.prototype.encodeImageLayer_ = function(arr, layer) {
  goog.asserts.assertInstanceof(layer, ol.layer.Image);
  var source = layer.getSource();
  if (source instanceof ol.source.ImageWMS) {
    this.encodeImageWmsLayer_(arr, layer);
  }
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {ol.layer.Image} layer Layer.
 * @private
 */
ngeo.Print.prototype.encodeImageWmsLayer_ = function(arr, layer) {
  var url = this.getUrlImageWms_(layer);
  var source = layer.getSource();
  var params = source.getParams();
  var object = /** @type {MapFishPrintWmsLayer} */ ({
    baseURL: url,
    imageFormat: 'image/png',
    customParams: {
      transparent: true
    },
    layers: params['LAYERS'].split(','),
    type: 'wms'
  });
  arr.push(object);
};



/**
 * @param {ol.source.Tile|ol.source.Image} layer
 * @return {string} url
 * @private
 */
ngeo.Print.prototype.getUrlImageWms_ = function(layer) {
  var source = layer.getSource();
  var url;
  if (source instanceof ol.source.ImageWMS) {
    goog.asserts.assertInstanceof(layer, ol.layer.Image);
    goog.asserts.assertInstanceof(source, ol.source.ImageWMS);
    url = source.getUrl();
  } else if (source instanceof ol.source.TileWMS) {
    goog.asserts.assertInstanceof(layer, ol.layer.Tile);
    goog.asserts.assertInstanceof(source, ol.source.TileWMS);
    var url = this.$window_.location.protocol + source.getUrls()[0];
  }

  return url;
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {ol.layer.Tile} layer Layer.
 * @private
 */
ngeo.Print.prototype.encodeTileLayer_ = function(arr, layer) {
  goog.asserts.assertInstanceof(layer, ol.layer.Tile);
  var source = layer.getSource();
  if (source instanceof ol.source.WMTS) {
    this.encodeTileWmtsLayer_(arr, layer);
  } else if (source instanceof ol.source.TileWMS) {
    this.encodeImageWmsLayer_(arr, layer);
  }
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {ol.layer.Tile} layer Layer.
 * @private
 */
ngeo.Print.prototype.encodeTileWmtsLayer_ = function(arr, layer) {
  goog.asserts.assertInstanceof(layer, ol.layer.Tile);
  var source = layer.getSource();
  goog.asserts.assertInstanceof(source, ol.source.WMTS);

  var projection = source.getProjection();
  var tileGrid = source.getTileGrid();
  goog.asserts.assertInstanceof(tileGrid, ol.tilegrid.WMTS);
  var matrixIds = tileGrid.getMatrixIds();

  // FIXME:
  // matrixSize assumes a regular grid

  /** @type {Array.<MapFishPrintWmtsMatrix>} */
  var matrices = [];

  for (var i = 0, ii = matrixIds.length; i < ii; ++i) {
    var sqrZ = Math.pow(2, i);
    matrices.push(/** @type {MapFishPrintWmtsMatrix} */ ({
      identifier: matrixIds[i],
      scaleDenominator: tileGrid.getResolution(i) *
          projection.getMetersPerUnit() / 0.28E-3,
      tileSize: ol.size.toSize(tileGrid.getTileSize(i)),
      topLeftCorner: tileGrid.getOrigin(i),
      matrixSize: [sqrZ, sqrZ]
    }));
  }

  var dimensions = source.getDimensions();
  var dimensionKeys = goog.object.getKeys(dimensions);

  var object = /** @type {MapFishPrintWmtsLayer} */ ({
    baseURL: this.getWmtsUrl_(source),
    dimensions: dimensionKeys,
    dimensionParams: dimensions,
    imageFormat: source.getFormat(),
    layer: source.getLayer(),
    matrices: matrices,
    matrixSet: source.getMatrixSet(),
    requestEncoding: /** @type {string} */ (source.getRequestEncoding()),
    style: source.getStyle(),
    type: 'WMTS',
    version: source.getVersion()
  });

  arr.push(object);
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {ol.layer.Vector} layer Layer.
 * @param {number} resolution Resolution.
 * @private
 */
ngeo.Print.prototype.encodeVectorLayer_ = function(arr, layer, resolution) {
  var source = layer.getSource();
  goog.asserts.assertInstanceof(source, ol.source.Vector);

  var features = source.getFeatures();

  var geojsonFormat = new ol.format.GeoJSON();

  var /** @type {Array.<GeoJSONFeature>} */ geojsonFeatures = [];
  var mapfishStyleObject = /** @type {MapFishPrintVectorStyle} */ ({
    version: 2
  });

  for (var i = 0, ii = features.length; i < ii; ++i) {
    var feature = features[i];
    var geojsonFeature = geojsonFormat.writeFeatureObject(feature);

    var styles = null;
    var styleFunction = feature.getStyleFunction();
    if (goog.isDef(styleFunction)) {
      styles = styleFunction.call(feature, resolution);
    } else {
      styleFunction = layer.getStyleFunction();
      if (goog.isDef(styleFunction)) {
        styles = styleFunction.call(layer, feature, resolution);
      }
    }
    if (!goog.isNull(styles) && styles.length > 0) {
      geojsonFeatures.push(geojsonFeature);
      if (goog.isNull(geojsonFeature.properties)) {
        geojsonFeature.properties = {};
      }
      for (var j = 0, jj = styles.length; j < jj; ++j) {
        var style = styles[j];
        var styleId = goog.getUid(style).toString();
        var featureStyleProp = ngeo.Print.FEAT_STYLE_PROP_PREFIX_ + j;
        this.encodeVectorStyle_(
            mapfishStyleObject, style, styleId, featureStyleProp);
        geojsonFeature.properties[featureStyleProp] = styleId;
      }
    }
  }

  var geojsonFeatureCollection = /** @type {GeoJSONFeatureCollection} */ ({
    type: 'FeatureCollection',
    features: geojsonFeatures
  });

  var object = /** @type {MapFishPrintVectorLayer} */ ({
    geoJson: geojsonFeatureCollection,
    style: mapfishStyleObject,
    type: 'geojson'
  });

  arr.push(object);
};


/**
 * @param {MapFishPrintVectorStyle} object MapFish style object.
 * @param {ol.style.Style} style Style.
 * @param {string} styleId Style id.
 * @param {string} featureStyleProp Feature style property name.
 * @private
 */
ngeo.Print.prototype.encodeVectorStyle_ =
    function(object, style, styleId, featureStyleProp) {
  var key = '[' + featureStyleProp + ' = \'' + styleId + '\']';
  if (key in object) {
    // do nothing if we already have a style object for this CQL rule
    return;
  }
  var styleObject = /** @type {MapFishPrintSymbolizers} */ ({
    symbolizers: []
  });
  object[key] = styleObject;
  var fillStyle = style.getFill();
  var imageStyle = style.getImage();
  var strokeStyle = style.getStroke();
  if (!goog.isNull(fillStyle)) {
    this.encodeVectorStylePolygon_(
        styleObject.symbolizers, fillStyle, strokeStyle);
  } else if (!goog.isNull(strokeStyle)) {
    this.encodeVectorStyleLine_(styleObject.symbolizers, strokeStyle);
  } else if (!goog.isNull(imageStyle)) {
    this.encodeVectorStylePoint_(styleObject.symbolizers, imageStyle);
  }
};


/**
 * @param {MapFishPrintSymbolizer} symbolizer MapFish Print symbolizer.
 * @param {!ol.style.Fill} fillStyle Fill style.
 * @private
 */
ngeo.Print.prototype.encodeVectorStyleFill_ = function(symbolizer, fillStyle) {
  var fillColor = fillStyle.getColor();
  if (!goog.isNull(fillColor)) {
    var fillColorRgba = ol.color.asArray(fillColor);
    symbolizer.fillColor = goog.color.rgbArrayToHex(fillColorRgba);
    symbolizer.fillOpacity = fillColorRgba[3];
  }
};


/**
 * @param {Array.<MapFishPrintSymbolizer>} symbolizers Array of MapFish Print
 *     symbolizers.
 * @param {!ol.style.Stroke} strokeStyle Stroke style.
 * @private
 */
ngeo.Print.prototype.encodeVectorStyleLine_ =
    function(symbolizers, strokeStyle) {
  var symbolizer = /** @type {MapFishPrintSymbolizerLine} */ ({
    type: 'line'
  });
  this.encodeVectorStyleStroke_(symbolizer, strokeStyle);
  symbolizers.push(symbolizer);
};


/**
 * @param {Array.<MapFishPrintSymbolizer>} symbolizers Array of MapFish Print
 *     symbolizers.
 * @param {!ol.style.Image} imageStyle Image style.
 * @private
 */
ngeo.Print.prototype.encodeVectorStylePoint_ =
    function(symbolizers, imageStyle) {
  var symbolizer;
  if (imageStyle instanceof ol.style.Circle) {
    symbolizer = /** @type {MapFishPrintSymbolizerPoint} */ ({
      type: 'point'
    });
    symbolizer.pointRadius = imageStyle.getRadius();
    var fillStyle = imageStyle.getFill();
    if (!goog.isNull(fillStyle)) {
      this.encodeVectorStyleFill_(symbolizer, fillStyle);
    }
    var strokeStyle = imageStyle.getStroke();
    if (!goog.isNull(strokeStyle)) {
      this.encodeVectorStyleStroke_(symbolizer, strokeStyle);
    }
    symbolizers.push(symbolizer);
  } else if (imageStyle instanceof ol.style.Icon) {
    var src = imageStyle.getSrc();
    if (goog.isDef(src)) {
      symbolizer = /** @type {MapFishPrintSymbolizerPoint} */ ({
        type: 'point',
        externalGraphic: src
      });
      var rotation = imageStyle.getRotation();
      if (rotation !== 0) {
        symbolizer.rotation = goog.math.toDegrees(rotation);
      }
    }
  }
};


/**
 * @param {Array.<MapFishPrintSymbolizer>} symbolizers Array of MapFish Print
 *     symbolizers.
 * @param {!ol.style.Fill} fillStyle Fill style.
 * @param {ol.style.Stroke} strokeStyle Stroke style.
 * @private
 */
ngeo.Print.prototype.encodeVectorStylePolygon_ =
    function(symbolizers, fillStyle, strokeStyle) {
  var symbolizer = /** @type {MapFishPrintSymbolizerPolygon} */ ({
    type: 'polygon'
  });
  this.encodeVectorStyleFill_(symbolizer, fillStyle);
  if (!goog.isNull(strokeStyle)) {
    this.encodeVectorStyleStroke_(symbolizer, strokeStyle);
  }
  symbolizers.push(symbolizer);
};


/**
 * @param {MapFishPrintSymbolizer} symbolizer MapFish Print symbolizer.
 * @param {!ol.style.Stroke} strokeStyle Stroke style.
 * @private
 */
ngeo.Print.prototype.encodeVectorStyleStroke_ =
    function(symbolizer, strokeStyle) {
  var strokeColor = strokeStyle.getColor();
  if (!goog.isNull(strokeColor)) {
    var strokeColorRgba = ol.color.asArray(strokeColor);
    symbolizer.strokeColor = goog.color.rgbArrayToHex(strokeColorRgba);
    symbolizer.strokeOpacity = strokeColorRgba[3];
  }
  var strokeWidth = strokeStyle.getWidth();
  if (goog.isDef(strokeWidth)) {
    symbolizer.strokeWidth = strokeWidth;
  }
};


/**
 * Return the WMTS URL to use in the print spec.
 * @param {ol.source.WMTS} source The WMTS source.
 * @return {string} URL.
 * @private
 */
ngeo.Print.prototype.getWmtsUrl_ = function(source) {
  var urls = source.getUrls();
  goog.asserts.assert(urls.length > 0);
  var url = urls[0];
  // Replace {Layer} in the URL
  // See <https://github.com/mapfish/mapfish-print/issues/236>
  var layer = source.getLayer();
  if (url.indexOf('{Layer}') >= 0) {
    url = url.replace('{Layer}', layer);
  }
  return url;
};


/**
 * Send a create report request to the MapFish Print service.
 * @param {MapFishPrintSpec} printSpec Print specification.
 * @param {angular.$http.Config=} opt_httpConfig $http config object.
 * @return {angular.$http.HttpPromise} HTTP promise.
 */
ngeo.Print.prototype.createReport = function(printSpec, opt_httpConfig) {
  var url = this.url_ + '/report.pdf';
  var httpConfig = /** @type {angular.$http.Config} */ ({
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  });
  goog.object.extend(httpConfig,
      goog.isDef(opt_httpConfig) ? opt_httpConfig : {});
  return this.$http_.post(url, printSpec, httpConfig);
};


/**
 * Get the status of a report.
 * @param {string} ref Print report reference.
 * @param {angular.$http.Config=} opt_httpConfig $http config object.
 * @return {angular.$http.HttpPromise} HTTP promise.
 */
ngeo.Print.prototype.getStatus = function(ref, opt_httpConfig) {
  var httpConfig = goog.isDef(opt_httpConfig) ? opt_httpConfig :
      /** @type {angular.$http.Config} */ ({});
  var url = this.url_ + '/status/' + ref + '.json';
  return this.$http_.get(url, httpConfig);
};


/**
 * Get the URL of a report.
 * @param {string} ref Print report reference.
 * @return {string} The report URL for this ref.
 */
ngeo.Print.prototype.getReportUrl = function(ref) {
  return this.url_ + '/report/' + ref;
};


/**
 * @param {angular.$http} $http Angular $http service.
 * @param {angular.$window} $window Angular $window service.
 * @return {ngeo.CreatePrint} The function to create a print service.
 * @ngInject
 */
ngeo.createPrintServiceFactory = function($http, $window) {
  return (
      /**
       * @param {string} url URL to MapFish print service.
       */
      function(url) {
        return new ngeo.Print(url, $http, $window);
      });
};


angular.module('ngeo_create_print', [])
        .factory('ngeoCreatePrint', ngeo.createPrintServiceFactory);
