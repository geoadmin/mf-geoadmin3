goog.provide('ga_gpx_service');

goog.require('ga_geomutils_service');
goog.require('ga_map_service');
goog.require('ga_measure_service');
goog.require('ga_networkstatus_service');
goog.require('ga_storage_service');
goog.require('ga_styles_service');
goog.require('ga_urlutils_service');
goog.require('ngeo.fileService');

(function() {

  var module = angular.module('ga_gpx_service', [
    'pascalprecht.translate',
    'ga_networkstatus_service',
    'ga_storage_service',
    'ga_styles_service',
    'ga_urlutils_service',
    'ga_measure_service',
    'ga_geomutils_service',
    'ngeo.fileService'
  ]);

  /**
   * Manage GPX layers
   */
  module.provider('gaGpx', function() {

    this.$get = function($http, $q, $rootScope, $timeout, $translate,
        gaDefinePropertiesForLayer, gaGlobalOptions, gaMapClick, gaMapUtils,
        gaNetworkStatus, gaStorage, gaStyleFactory, gaUrlUtils, gaMeasure,
        gaGeomUtils, ngeoFile) {

      // Store the parser.
      var format;

      // Create the parser/writer
      var setFormat = function() {
        if (!format) {
          format = new ol.format.GPX({
            readExtensions: false
          });
        }
      };

      // Sanitize GPX changing href links if necessary
      var sanitizeXml = function(xml) {
        return xml;
      };

      // Read a gpx string then return a list of features.
      var readFeatures = function(xml, projection) {

        // Create the parser
        setFormat();

        // Sanitize GPX
        xml = sanitizeXml(xml);

        // Read features
        var features = format.readFeatures(xml);

        // Sanitize features
        var dfltStyle = gaStyleFactory.getStyle('kml');
        var sanitizedFeatures = [];
        for (var i = 0, ii = features.length; i < ii; i++) {
          features[i].setStyle([dfltStyle]);
          var feat = sanitizeFeature(features[i], projection);
          if (feat) {
            sanitizedFeatures.push(feat);
          }
        }
        return $q.when(sanitizedFeatures);
      };

      // Sanitize the feature's properties (id, geometry, style).
      var sanitizeFeature = function(feature, projection) {
        var geom = feature.getGeometry();

        // Remove feature without good geometry.
        if (!gaGeomUtils.isValid(geom)) {
          return;
        }
        // Ensure polygons are closed.
        // Reason: print server failed when polygons are not closed.
        gaGeomUtils.close(geom);

        // Replace empty id by undefined.
        // Reason: If 2 features have their id empty, an assertion error
        // occurs when we add them to the source
        if (feature.getId() === '') {
          feature.setId(undefined);
        }
        geom.transform('EPSG:4326', projection);
        var styles = feature.getStyleFunction().call(feature);

        // The use of clone is part of the scale fix line 156
        var style = styles[0].clone();

        // The canvas draws a stroke width=1 by default if width=0, so we
        // remove the stroke style in that case.
        // See https://github.com/geoadmin/mf-geoadmin3/issues/3421
        var stroke = style.getStroke();
        if (stroke && stroke.getWidth() == 0) {
          stroke = undefined;
        }

        // if the feature is a Point and we are offline, we use default gpx
        // style.
        // if the feature is a Point and has a name with a text style, we
        // create a correct text style.
        // TODO Handle GeometryCollection displaying name on the first Point
        // geometry.
        if (style && (geom instanceof ol.geom.Point ||
            geom instanceof ol.geom.MultiPoint)) {
          var image = style.getImage();
          var text = null;
          var fill = style.getFill();

          if (gaNetworkStatus.offline) {
            image = gaStyleFactory.getStyle('kml').getImage();
          }

          // If the feature has name we display it on the map as Google does
          if (feature.get('name') && style.getText() &&
              style.getText().getScale() != 0) {

            if (image && image.getScale() == 0) {
              // transparentCircle is used to allow selection
              image = gaStyleFactory.getStyle('transparentCircle');
            }
            text = new ol.style.Text({
              font: gaStyleFactory.FONT,
              text: feature.get('name'),
              fill: style.getText().getFill(),
              stroke: gaStyleFactory.getTextStroke(
                  style.getText().getFill().getColor()),
              scale: style.getText().getScale()
            });

            fill = undefined;
            stroke = undefined;
          }

          styles = [new ol.style.Style({
            fill: fill,
            stroke: stroke,
            image: image,
            text: text,
            zIndex: style.getZIndex()
          })];
          feature.setStyle(styles);
        }

        // Get the type of the feature (creates by drawing tools)
        if (feature.getId()) {
          var split = feature.getId().split('_');
          if (split.length == 2) {
            feature.set('type', split[0]);
          }
        }

        // Apply the good style (with azimuth drawn) for measure feature
        if (style && gaMapUtils.isMeasureFeature(feature)) {
          feature.set('type', 'measure');
          feature.setStyle(gaStyleFactory.getFeatureStyleFunction('measure'));
        // Remove image and text styles for polygons and lines
        } else if (!(geom instanceof ol.geom.Point ||
            geom instanceof ol.geom.MultiPoint ||
            geom instanceof ol.geom.GeometryCollection)) {
          styles = [new ol.style.Style({
            fill: style.getFill(),
            stroke: stroke,
            image: null,
            text: null,
            zIndex: style.getZIndex()
          })];
          feature.setStyle(styles);
        }
        return feature;
      };

      var Gpx = function() {

        // Create a vector layer from a xml string.
        var createLayer = function(xml, options) {
          options = options || {};
          options.id = 'GPX||' + options.url;

          // Update data stored for offline or use it if xml is null
          var offlineData = gaStorage.getItem(options.id);
          if (offlineData) {
            if (xml) {
              gaStorage.setItem(options.id, xml);
            } else {
              xml = offlineData;
            }
          } else if (!xml) {
            var deferred = $q.defer();
            deferred.reject('No GPX data found');
            return deferred.promise;
          }

          // Read features available in a xml string, then create an ol layer.
          return readFeatures(xml, options.projection).then(function(features) {

            var source = new ol.source.Vector({
              features: features
            });

            var layerOptions = {
              id: options.id,
              adminId: options.adminId,
              url: options.url,
              type: 'GPX',
              label: options.label || 'GPX',
              opacity: options.opacity,
              visible: options.visible,
              source: source,
              // extent: gaMapUtils.intersectWithDefaultExtent(sourceExtent),
              attribution: options.attribution
            };

            // Be sure to remove all html tags
            layerOptions.label = $('<p>' + layerOptions.label + '<p>').text();

            var olLayer;
            if (options.useImageVector === true) {
              layerOptions.source = new ol.source.ImageVector({
                source: layerOptions.source
              });

              olLayer = new ol.layer.Image(layerOptions);
            } else {
              olLayer = new ol.layer.Vector(layerOptions);
            }
            gaDefinePropertiesForLayer(olLayer);
            olLayer.useThirdPartyData = true;
            olLayer.updateDelay = options.updateDelay;

            // Save the xml content for for offline and 3d parsing
            olLayer.getSource().setProperties({
              'gpxString': sanitizeXml(xml)
            });

            return olLayer;
          });
        };

        // Add an ol layer to the map
        var addLayer = function(olMap, xmlString, options, index) {
          options.projection = olMap.getView().getProjection();
          return createLayer(xmlString, options).then(function(olLayer) {
            if (olLayer) {
              if (index) {
                olMap.getLayers().insertAt(index, olLayer);
              } else {
                olMap.addLayer(olLayer);
              }

              var source = olLayer.getSource();
              if (source instanceof ol.source.ImageVector) {
                source = source.getSource();
              }

              // If the layer can contain measure features, we register some
              // events to add/remove correctly the overlays
              if (gaMapUtils.isLocalGpxLayer(olLayer)) {
                if (olLayer.getVisible()) {
                  angular.forEach(source.getFeatures(),
                      function(feature) {
                        if (gaMapUtils.isMeasureFeature(feature)) {
                          gaMeasure.addOverlays(olMap, olLayer, feature);
                        }
                      });
                }
                gaMeasure.registerOverlaysEvents(olMap, olLayer);
              }

              if (options.zoomToExtent) {
                var sourceExtent = gaMapUtils.getVectorSourceExtent(source);
                var ext = gaMapUtils.intersectWithDefaultExtent(sourceExtent);
                if (ext) {
                  olMap.getView().fit(ext, {
                    size: olMap.getSize()
                  });
                }
              }
            }
            return olLayer;
          });
        };

        // Returns a promis
        this.readFeatures = function(xmlString, projection) {
          return readFeatures(xmlString, projection);
        };

        this.addToMap = function(map, xmlString, layerOptions, index) {
          return addLayer(map, xmlString, layerOptions || {}, index);
        };

        this.addToMapForUrl = function(map, url, layerOptions, index) {
          var that = this;
          layerOptions = layerOptions || {};
          layerOptions.url = url;
          if (gaNetworkStatus.offline) {
            return this.addToMap(map, null, layerOptions, index);
          } else {
            return gaUrlUtils.proxifyUrl(url).then(function(proxyUrl) {
              return $http.get(proxyUrl, {
                cache: true
              }).then(function(response) {
                var data = response.data;
                var fileSize = response.headers('content-length');
                if (ngeoFile.isGpx(data) &&
                    ngeoFile.isValidFileSize(fileSize)) {
                  layerOptions.useImageVector = that.useImageVector(fileSize);
                  return that.addToMap(map, data, layerOptions, index);
                }
              }, function() {
                // Try to get offline data if exist
                return that.addToMap(map, null, layerOptions, index);
              });
            });
          }
        };

        // Defines if we should use a ol.layer.Image instead of a
        // ol.layer.Vector. Currently we define this, only testing the
        // file size but it could be another condition.
        this.useImageVector = function(fileSize) {
          return (!!fileSize && parseInt(fileSize) >= 1000000); // < 1mo
        };

        // Returns the unique format used by the application
        this.getFormat = function() {
          setFormat();
          return format;
        };
      };
      return new Gpx();
    };
  });
})();
