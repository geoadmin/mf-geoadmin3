/**
 * @fileoverview Provides a function to create ngeo.Print objects used to
 * interact with MapFish Print v3 services.
 *
 * This module comes from the ngeo project:
 *  https://github.com/camptocamp/ngeo
 * It is published under the MIT license:
 *  https://github.com/camptocamp/ngeo/blob/master/LICENSE
 *
 * It is used to print with mapfish v3
 *
 * ngeo.Print objects expose the following methods:
 *
 * - createSpec: create a report specification object
 * - createReport: send a create report request
 * - getStatus: get the status of a report
 * - getReportUrl: get the URL of a report
 * - getCapabilities: get the capabilities of the server
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
 * - createSpec should also accept a bbox instead of a center and a scale.
 * - Add support for ol.style.RegularShape. MapFish Print supports symbols
 *   like crosses, stars and squares, so printing regular shapes should be
 *   possible.
 * - ol.style.Icon may use a sprite image, and offsets to define to rectangle
 *   to use within the sprite. This type of icons won't be printed correctly
 *   as MapFish Print does not support sprite icons.
 */

goog.provide('ngeo.CreatePrint');
goog.provide('ngeo.Print');

goog.require('goog.color');
goog.require('goog.math');
goog.require('goog.object');
goog.require('ngeo');


/**
 * @typedef {function(string):!ngeo.Print}
 */
ngeo.CreatePrint;


// ol.geom.GeometryType is only included in the debug version of OpenLayers.
// See: https://github.com/openlayers/ol3/issues/3671
/**
 * The geometry type. One of `'Point'`, `'LineString'`, `'LinearRing'`,
 * `'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`,
 * `'GeometryCollection'`, `'Circle'`.
 * @enum {string}
 * @api stable
 */
ol.geom.GeometryType = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  LINEAR_RING: 'LinearRing',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
  CIRCLE: 'Circle'
};


/**
 * @enum {string}
 */
ngeo.PrintStyleType = {
  LINE_STRING: 'LineString',
  POINT: 'Point',
  POLYGON: 'Polygon'
};


/**
 * @type {Object.<ol.geom.GeometryType, ngeo.PrintStyleType>}
 * @private
 */
ngeo.PrintStyleTypes_ = {};

ngeo.PrintStyleTypes_[ol.geom.GeometryType.LINE_STRING] =
    ngeo.PrintStyleType.LINE_STRING;
ngeo.PrintStyleTypes_[ol.geom.GeometryType.POINT] =
    ngeo.PrintStyleType.POINT;
ngeo.PrintStyleTypes_[ol.geom.GeometryType.POLYGON] =
    ngeo.PrintStyleType.POLYGON;
ngeo.PrintStyleTypes_[ol.geom.GeometryType.MULTI_LINE_STRING] =
    ngeo.PrintStyleType.LINE_STRING;
ngeo.PrintStyleTypes_[ol.geom.GeometryType.MULTI_POINT] =
    ngeo.PrintStyleType.POINT;
ngeo.PrintStyleTypes_[ol.geom.GeometryType.MULTI_POLYGON] =
    ngeo.PrintStyleType.POLYGON;



/**
 * @constructor
 * @param {string} url URL to MapFish print web service.
 * @param {angular.$http} $http Angular $http service.
 */
ngeo.Print = function(url, $http) {
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
};


/**
 * @const
 * @private
 */
ngeo.Print.FEAT_STYLE_PROP_PREFIX_ = '_ngeo_style_';


/**
 * Cancel a report.
 * @param {string} ref Print report reference.
 * @param {angular.$http.Config=} opt_httpConfig $http config object.
 * @return {angular.$http.HttpPromise} HTTP promise.
 */
ngeo.Print.prototype.cancel = function(ref, opt_httpConfig) {
  var httpConfig = goog.isDef(opt_httpConfig) ? opt_httpConfig :
      /** @type {angular.$http.Config} */ ({});
  var url = this.url_ + '/cancel/' + ref;
  // "delete" is a reserved word, so use ['delete']
  return this.$http_['delete'](url, httpConfig);
};


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
  var viewRotation = view.getRotation();

  goog.asserts.assert(goog.isDef(viewCenter));
  goog.asserts.assert(goog.isDef(viewProjection));

  object.center = viewCenter;
  object.projection = viewProjection.getCode();
  object.rotation = viewRotation * 180 / Math.PI;
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
        this.encodeLayer(object.layers, layer, viewResolution);
      }, this);
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {ol.layer.Base} layer Layer.
 * @param {number} resolution Resolution.
 */
ngeo.Print.prototype.encodeLayer = function(arr, layer, resolution) {
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
  var source = layer.getSource();

  goog.asserts.assertInstanceof(layer, ol.layer.Image);
  goog.asserts.assertInstanceof(source, ol.source.ImageWMS);

  var url = source.getUrl();
  var params = source.getParams();
  this.encodeWmsLayer_(arr, layer.getOpacity(), url, params);
};


/**
 * @param {Array.<MapFishPrintLayer>} arr Array.
 * @param {number} opacity Opacity of the layer.
 * @param {string|undefined} url Url of the WMS server.
 * @param {Object} params Url parameters
 * @private
 */
ngeo.Print.prototype.encodeWmsLayer_ = function(arr, opacity, url, params) {
  var customParams = {'TRANSPARENT': true};
  goog.object.extend(customParams, params);

  goog.object.remove(customParams, 'LAYERS');
  goog.object.remove(customParams, 'FORMAT');

  var object = /** @type {MapFishPrintWmsLayer} */ ({
    baseURL: url,
    imageFormat: 'FORMAT' in params ? params['FORMAT'] : 'image/png',
    layers: params['LAYERS'].split(','),
    customParams: customParams,
    type: 'wms',
    opacity: opacity
  });
  arr.push(object);
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
    this.encodeTileWmsLayer_(arr, layer);
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
 * @param {ol.layer.Tile} layer Layer.
 * @private
 */
ngeo.Print.prototype.encodeTileWmsLayer_ = function(arr, layer) {
  var source = layer.getSource();

  goog.asserts.assertInstanceof(layer, ol.layer.Tile);
  goog.asserts.assertInstanceof(source, ol.source.TileWMS);

  var url = source.getUrls()[0];
  var params = source.getParams();
  this.encodeWmsLayer_(arr, layer.getOpacity(), url, params);
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
    var geometry = feature.getGeometry();

    // no need to encode features with no geometry
    if (!goog.isDefAndNotNull(geometry)) {
      continue;
    }

    var geometryType = geometry.getType();
    var geojsonFeature = geojsonFormat.writeFeatureObject(feature);

    // Remove style property to avoid problem when converting to JSON
    // This should be fixed in OpenLayers 3.7, see: https://github.com/openlayers/ol3/issues/3832
    if (geojsonFeature.hasOwnProperty('properties') &&
            geojsonFeature.properties &&
            geojsonFeature.properties.hasOwnProperty('Style')) {
      delete geojsonFeature.properties.Style;
    }

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
            mapfishStyleObject, geometryType, style, styleId, featureStyleProp);
        geojsonFeature.properties[featureStyleProp] = styleId;
      }
    }
  }

  // MapFish Print fails if there are no style rules, even if there are no
  // features either. To work around this we just ignore the layer if the
  // array of GeoJSON features is empty.
  // See https://github.com/mapfish/mapfish-print/issues/279

  if (geojsonFeatures.length > 0) {
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
  }
};


/**
 * @param {MapFishPrintVectorStyle} object MapFish style object.
 * @param {ol.geom.GeometryType} geometryType Type of the GeoJSON geometry
 * @param {ol.style.Style} style Style.
 * @param {string} styleId Style id.
 * @param {string} featureStyleProp Feature style property name.
 * @private
 */
ngeo.Print.prototype.encodeVectorStyle_ =
    function(object, geometryType, style, styleId, featureStyleProp) {
  if (!(geometryType in ngeo.PrintStyleTypes_)) {
    // unsupported geometry type
    return;
  }
  var styleType = ngeo.PrintStyleTypes_[geometryType];
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
  var textStyle = style.getText();
  if (styleType == ngeo.PrintStyleType.POLYGON) {
    if (!goog.isNull(fillStyle)) {
      this.encodeVectorStylePolygon_(
          styleObject.symbolizers, fillStyle, strokeStyle);
    }
  } else if (styleType == ngeo.PrintStyleType.LINE_STRING) {
    if (!goog.isNull(strokeStyle)) {
      this.encodeVectorStyleLine_(styleObject.symbolizers, strokeStyle);
    }
  } else if (styleType == ngeo.PrintStyleType.POINT) {
    if (!goog.isNull(imageStyle)) {
      this.encodeVectorStylePoint_(styleObject.symbolizers, imageStyle);
    }
  }
  if (!goog.isNull(textStyle)) {
    this.encodeTextStyle_(styleObject.symbolizers, textStyle);
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
 * @param {Array.<MapFishPrintSymbolizer>} symbolizers Array of MapFish Print
 *     symbolizers.
 * @param {!ol.style.Text} textStyle Text style.
 * @private
 */
ngeo.Print.prototype.encodeTextStyle_ = function(symbolizers, textStyle) {
  var symbolizer = /** @type {MapFishPrintSymbolizerText} */ ({
    type: 'Text'
  });
  var label = textStyle.getText();
  if (goog.isDef(label)) {
    symbolizer.label = label;

    var labelAlign = textStyle.getTextAlign();
    if (goog.isDef(labelAlign)) {
      symbolizer.labelAlign = labelAlign;
    }

    var labelRotation = textStyle.getRotation();
    if (goog.isDef(labelRotation)) {
      // Mapfish print expects a string, not a number to rotate text
      symbolizer.labelRotation = (labelRotation * 180 / Math.PI).toString();
    }

    var fontStyle = textStyle.getFont();
    if (goog.isDef(fontStyle)) {
      var font = fontStyle.split(' ');
      if (font.length >= 3) {
        symbolizer.fontWeight = font[0];
        symbolizer.fontSize = font[1];
        symbolizer.fontFamily = font.splice(2).join(' ');
      }
    }

    var strokeStyle = textStyle.getStroke();
    if (!goog.isNull(strokeStyle)) {
      var strokeColorRgba = ol.color.asArray(strokeStyle.getColor());
      symbolizer.haloColor = goog.color.rgbArrayToHex(strokeColorRgba);
      symbolizer.haloOpacity = strokeColorRgba[3];
      var width = strokeStyle.getWidth();
      if (goog.isDef(width)) {
        symbolizer.haloRadius = width;
      }
    }

    var fillStyle = textStyle.getFill();
    if (!goog.isNull(fillStyle)) {
      var fillColorRgba = ol.color.asArray(fillStyle.getColor());
      symbolizer.fontColor = goog.color.rgbArrayToHex(fillColorRgba);
    }

    symbolizer.XOffset = textStyle.getOffsetX();
    symbolizer.YOffset = textStyle.getOffsetY();

    symbolizers.push(symbolizer);
  }
};


/**
 * Return the WMTS URL to use in the print spec.
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
 * Get the URL of a report.
 * @param {string} ref Print report reference.
 * @return {string} The report URL for this ref.
 */
ngeo.Print.prototype.getReportUrl = function(ref) {
  return this.url_ + '/report/' + ref;
};


/**
 * Get the print capabilities from MapFish Print.
 * @param {angular.$http.Config=} opt_httpConfig $http config object.
 * @return {angular.$http.HttpPromise} HTTP promise.
 */
ngeo.Print.prototype.getCapabilities = function(opt_httpConfig) {
  var httpConfig = goog.isDef(opt_httpConfig) ? opt_httpConfig :
          /** @type {angular.$http.Config} */ ({});
  var url = this.url_ + '/capabilities.json';
  return this.$http_.get(url, httpConfig);
};


/**
 * @param {angular.$http} $http Angular $http service.
 * @return {ngeo.CreatePrint} The function to create a print service.
 * @ngInject
 */
ngeo.createPrintServiceFactory = function($http) {
  return (
      /**
       * @param {string} url URL to MapFish print service.
       */
      function(url) {
        return new ngeo.Print(url, $http);
      });
};


ngeoModule.factory('ngeoCreatePrint', ngeo.createPrintServiceFactory);
