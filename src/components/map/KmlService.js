goog.provide('ga_kml_service');

goog.require('ga_map_service');
goog.require('ga_measure_service');
goog.require('ga_networkstatus_service');
goog.require('ga_storage_service');
goog.require('ga_styles_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_kml_service', [
    'pascalprecht.translate',
    'ga_networkstatus_service',
    'ga_storage_service',
    'ga_styles_service',
    'ga_urlutils_service',
    'ga_measure_service'
  ]);

  /**
   * Manage KML layers
   */
  module.provider('gaKml', function() {

    // Ensure linear rings are closed
    var closeLinearRing = function(linearRing) {
      if (linearRing.getFirstCoordinate() != linearRing.getLastCoordinate()) {
        var coords = linearRing.getCoordinates();
        coords.push(linearRing.getFirstCoordinate());
        linearRing.setCoordinates(coords);

      }
    };
    var closePolygon = function(polygon) {
      var coords = [];
      var linearRings = polygon.getLinearRings();
      for (var i = 0, ii = linearRings.length; i < ii; i++) {
        closeLinearRing(linearRings[i]);
        coords.push(linearRings[i].getCoordinates());
      }
      polygon.setCoordinates(coords);
    };
    var closeMultiPolygon = function(multiPolygon) {
      var coords = [];
      var polygons = multiPolygon.getPolygons();
      for (var i = 0, ii = polygons.length; i < ii; i++) {
        closePolygon(polygons[i]);
        coords.push(polygons[i].getCoordinates());
      }
      multiPolygon.setCoordinates(coords);
    };
    var closeGeometry = function(geom) {
      var geometries = [geom];
      if (geom instanceof ol.geom.GeometryCollection) {
        geometries = geom.getGeometries();
      }
      for (var i = 0, ii = geometries.length; i < ii; i++) {
        var geometry = geometries[i];
        if (geometry instanceof ol.geom.MultiPolygon) {
          closeMultiPolygon(geometry);
        } else if (geometry instanceof ol.geom.Polygon) {
          closePolygon(geometry);
        } else if (geometry instanceof ol.geom.LinearRing) {
          closeLinearRing(geometry);
        }
      }
      if (geom instanceof ol.geom.GeometryCollection) {
        geom.setGeometries(geometries);
      }
    };

    this.$get = function($http, $q, $rootScope, $timeout, $translate,
        gaDefinePropertiesForLayer, gaGlobalOptions, gaMapClick, gaMapUtils,
        gaNetworkStatus, gaStorage, gaStyleFactory, gaUrlUtils, gaMeasure) {

      // Store the parser.
      var kmlFormat;

      // Read a kml string then return a list of features.
      var readFeatures = function(kml) {
        // Replace all hrefs to prevent errors if image doesn't have
        // CORS headers. Exception for *.geo.admin.ch, *.bgdi.ch and google
        // markers icons (lightblue.png, ltblue-dot.png, ltblu-pushpin.png, ...)
        // to keep the OL3 magic for anchor origin.
        // Test regex here: http://regex101.com/r/tF3vM0/3
        // List of google icons: http://www.lass.it/Web/viewer.aspx?id=4
        kml = kml.replace(
          /<href>http(?!(s?):\/\/(maps\.(?:google|gstatic)\.com.*(blue|green|orange|pink|purple|red|yellow|pushpin).*\.png|.*(bgdi|geo.admin)\.ch))/g,
          '<href>' + gaGlobalOptions.ogcproxyUrl + 'http'
        );

        // Replace all http hrefs from *.geo.admin.ch or *.bgdi.ch by https
        // Test regex here: http://regex101.com/r/fY7wB3/3
        kml = kml.replace(
          /<href>http(?!(s))(?=:\/\/(.*(bgdi|geo.admin)\.ch))/g,
          '<href>https'
        );

        // Load the parser only when needed.
        // WARNING: it's needed to initialize it here for test.
        if (!kmlFormat) {
          kmlFormat = new ol.format.KML({
            extractStyles: true,
            defaultStyle: [gaStyleFactory.getStyle('kml')]
          });
        }

        // Manage networkLink tags
        var all = [];
        var features = kmlFormat.readFeatures(kml);
        var networkLinks = kmlFormat.readNetworkLinks(kml);
        if (networkLinks.length) {
          angular.forEach(networkLinks, function(networkLink) {
            if (gaUrlUtils.isValid(networkLink.href)) {
              all.push($http.get(networkLink.href).then(function(response) {
                return readFeatures(response.data).then(function(newFeatures) {
                  features = features.concat(newFeatures);
                });
              }));
            }
          });
        }

        return $q.all(all).then(function() {
          return features;
        });
      };

      // Sanitize the feature's properties (id, geometry, style).
      var sanitizeFeature = function(feature, projection) {
        var geometry = feature.getGeometry();
        // Remove feature without geometry.
        if (!geometry) {
          return;
        }
        // Ensure polygons are closed.
        // Reason: print server failed when polygons are not closed.
        closeGeometry(geometry);

        // Replace empty id by undefined.
        // Reason: If 2 features have their id empty, an assertion error
        // occurs when we add them to the source
        if (feature.getId() === '') {
          feature.setId(undefined);
        }
        feature.getGeometry().transform('EPSG:4326', projection);
        var geom = feature.getGeometry();
        var styles = feature.getStyleFunction().call(feature);
        var style = styles[0];

        // if the feature is a Point and we are offline, we use default kml
        // style.
        // if the feature is a Point and has a name with a text style, we
        // create a correct text style.
        // TODO Handle GeometryCollection displaying name on the first Point
        // geometry.
        if (style && (geom instanceof ol.geom.Point ||
            geom instanceof ol.geom.MultiPoint)) {
          var image = style.getImage();
          var text = null;

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
          }

          styles = [new ol.style.Style({
            fill: style.getFill(),
            stroke: style.getStroke(),
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
            stroke: style.getStroke(),
            image: null,
            text: null,
            zIndex: style.getZIndex()
          })];
          feature.setStyle(styles);
        }
        return feature;
      };

      var Kml = function() {

        // Create a vector layer from a kml string.
        var createKmlLayer = function(kml, options) {
          options = options || {};
          options.id = 'KML||' + options.url;

          // Update data stored for offline or use it if kml is null
          var offlineData = gaStorage.getItem(options.id);
          if (offlineData) {
            if (kml) {
              gaStorage.setItem(options.id, kml);
            } else {
              kml = offlineData;
            }
          } else if (!kml) {
            var deferred = $q.defer();
            deferred.reject('No KML data found');
            return deferred.promise;
          }

          // Read features available in a kml string, then create an ol layer.
          return readFeatures(kml).then(function(features) {
            var sanitizedFeatures = [];
            for (var i = 0, ii = features.length; i < ii; i++) {
              var feat = sanitizeFeature(features[i], options.projection);
              if (feat) {
                sanitizedFeatures.push(feat);
              }
            }

            // #2820: we set useSpatialIndex to false for KML created with draw
            // tool
            var source = new ol.source.Vector({
              features: sanitizedFeatures,
              useSpatialIndex: !gaMapUtils.isStoredKmlLayer(options.id)
            });

            var sourceExtent = gaMapUtils.getVectorSourceExtent(source);
            var layerOptions = {
              id: options.id,
              adminId: options.adminId,
              url: options.url,
              type: 'KML',
              label: options.label || kmlFormat.readName(kml) || 'KML',
              opacity: options.opacity,
              visible: options.visible,
              source: source,
              extent: gaMapUtils.intersectWithDefaultExtent(sourceExtent),
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

            return olLayer;
          });
        };

        // Add an ol layer to the map
        var addKmlLayer = function(olMap, kmlString, options, index) {
          options.projection = olMap.getView().getProjection();
          return createKmlLayer(kmlString, options).then(function(olLayer) {
            if (olLayer) {
              if (index) {
                olMap.getLayers().insertAt(index, olLayer);
              } else {
                olMap.addLayer(olLayer);
              }

              // If the layer can contain measure features, we register some
              // events to add/remove correctly the overlays
              if (gaMapUtils.isStoredKmlLayer(olLayer)) {
                if (olLayer.getVisible()) {
                  angular.forEach(olLayer.getSource().getFeatures(),
                      function(feature) {
                    if (gaMapUtils.isMeasureFeature(feature)) {
                      gaMeasure.addOverlays(olMap, olLayer, feature);
                    }
                  });
                }
                gaMeasure.registerOverlaysEvents(olMap, olLayer);
              }

              if (options.zoomToExtent) {
                var extent = olLayer.getExtent();
                if (extent) {
                  olMap.getView().fit(extent, olMap.getSize());
                }
              }
            }
            return olLayer;
          });
        };

        this.addKmlToMap = function(map, kmlString, layerOptions, index) {
          return addKmlLayer(map, kmlString, layerOptions || {}, index);
        };

        this.addKmlToMapForUrl = function(map, url, layerOptions, index) {
          var that = this;
          layerOptions = layerOptions || {};
          layerOptions.url = url;
          if (gaNetworkStatus.offline) {
            return this.addKmlToMap(map, null, layerOptions, index);
          } else {
            return $http.get(gaGlobalOptions.ogcproxyUrl +
                encodeURIComponent(url), {
              cache: true
            }).then(function(response) {
              var data = response.data;
              var fileSize = response.headers('content-length');
              if (that.isValidFileContent(data) &&
                  that.isValidFileSize(fileSize)) {
                layerOptions.useImageVector = that.useImageVector(fileSize);
                return that.addKmlToMap(map, data, layerOptions, index);
              }
            }, function() {
              // Try to get offline data if exist
              return that.addKmlToMap(map, null, layerOptions, index);
            });
          }
        };

        // Defines if we should use a ol.layer.Image instead of a
        // ol.layer.Vector. Currently we define this, only testing the
        // file size but it could be another condition.
        this.useImageVector = function(fileSize) {
          return (!!fileSize && parseInt(fileSize) >= 1000000); // < 1mo
        };

        // Test the validity of the file size
        this.isValidFileSize = function(fileSize) {
          if (fileSize > 20000000) { // 20 Mo
            alert($translate.instant('file_too_large') + ' (max. 20 MB)');
            return false;
          }
          return true;
        };

        // Test the validity of the file content
        this.isValidFileContent = function(fileContent) {
          if (!/<kml/.test(fileContent) || !/<\/kml>/.test(fileContent)) {
            alert($translate.instant('file_is_not_kml'));
            return false;
          }
          return true;
        };
      };
      return new Kml();
    };
  });
})();
