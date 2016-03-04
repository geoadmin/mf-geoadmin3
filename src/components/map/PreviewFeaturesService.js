goog.provide('ga_previewfeatures_service');

goog.require('ga_map_service');
goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_previewfeatures_service', [
    'ga_map_service',
    'ga_styles_service'
  ]);

  /**
   * This service manage features on vector preview layer.
   * This preview layer is used to display temporary features.
   * Used by Tooltip, FeatureTree, Search and Permalink.
   */
  module.provider('gaPreviewFeatures', function() {
    var MINIMAL_EXTENT_SIZE = 1965;
    var highlightedFeature, onClear, listenerKeyRemove, listenerKeyAdd;
    var geojson = new ol.format.GeoJSON();
    var source = new ol.source.Vector();
    var vector = new ol.layer.Vector({
      source: source
    });

    this.$get = function($rootScope, $q, $http, gaDefinePropertiesForLayer,
        gaStyleFactory, gaMapUtils) {
      var url = this.url;
      var selectStyle = gaStyleFactory.getStyle('select');
      var highlightStyle = gaStyleFactory.getStyle('highlight');

      // Define layer default properties
      gaDefinePropertiesForLayer(vector);
      vector.preview = true;
      vector.displayInLayerManager = false;
      vector.setZIndex(gaMapUtils.Z_PREVIEW_FEATURE);

      // TO DO: May be this method should be elsewher?
      var getFeatures = function(featureIdsByBodId) {
        var promises = [];
        angular.forEach(featureIdsByBodId, function(featureIds, bodId) {
          Array.prototype.push.apply(promises, $.map(featureIds,
              function(featureId) {
                return $http.get(url + bodId + '/' +
                  featureId + '?geometryFormat=geojson');
              }
          ));
        });
        return $q.all(promises);
      };

      // Get a buffered extent if necessary
      var getMinimalExtent = function(extent) {
        if (ol.extent.getHeight(extent) < MINIMAL_EXTENT_SIZE &&
            ol.extent.getWidth(extent) < MINIMAL_EXTENT_SIZE) {
          var center = ol.extent.getCenter(extent);
          return ol.extent.buffer(center.concat(center),
              MINIMAL_EXTENT_SIZE / 2);
        } else {
          return extent;
        }
      };

      // Remove features associated with a layer.
      var removeFromLayer = function(layer) {
        var features = source.getFeatures();
        for (var i = 0, ii = features.length; i < ii; i++) {
          var layerId = features[i].get('layerId');
          if (angular.isDefined(layerId) && layerId == layer.id) {
            source.removeFeature(features[i]);
          }
        }
      };

      // Add/remove/move to top the vector layer.
      var updateLayer = function(map) {
        if (source.getFeatures().length == 0) {
          ol.Observable.unByKey(listenerKeyRemove);
          ol.Observable.unByKey(listenerKeyAdd);
          map.removeLayer(vector);
        } else if (map.getLayers().getArray().indexOf(vector) == -1) {
          map.addLayer(vector);

          // Add event for automatically removing the features when the
          // corresponding layer is removed.
          listenerKeyRemove = map.getLayers().on('remove', function(event) {
            removeFromLayer(event.element);
          });
        }
      };

      var PreviewFeatures = function() {

        // Add a feature.
        this.add = function(map, feature) {
          feature.setStyle(selectStyle);
          source.addFeature(feature);
          updateLayer(map);
        };

        // Add features from an array<layerBodId,array<featureIds>>.
        // Param onNextClear is a function to call on the next execution of
        // clear function.
        this.addBodFeatures = function(map, featureIdsByBodId, onNextClear) {
          var defer = $q.defer();
          var features = [];
          this.clear(map);
          var that = this;
          getFeatures(featureIdsByBodId).then(function(results) {
            angular.forEach(results, function(result) {
              result.data.feature.properties.layerId =
                  result.data.feature.layerBodId;
              features.push(result.data.feature);
              that.add(map, geojson.readFeature(result.data.feature));
            });
            that.zoom(map);
            defer.resolve(features);
          });

          onClear = onNextClear;
          return defer.promise;
        };

        // Remove all.
        this.clear = function(map) {
          source.clear();
          if (map) {
            updateLayer(map);
          }
          highlightedFeature = undefined;

          if (onClear) {
            onClear();
            onClear = undefined;
          }
        };

        // Remove only the highlighted feature.
        this.clearHighlight = function(map) {
          if (highlightedFeature) {
            source.removeFeature(highlightedFeature);
            highlightedFeature = undefined;
          }
        };

        // Remove the precedent feature highlighted then add the new one.
        this.highlight = function(map, feature) {
          this.clearHighlight();
          if (feature) {
            // We clone the feature to avoid duplicate features with same ids
            highlightedFeature = new ol.Feature(feature.getGeometry());
            highlightedFeature.setStyle(highlightStyle);
            source.addFeature(highlightedFeature);
            updateLayer(map);
          }
        };

        // Zoom on a feature (if defined) or zoom on the entire source
        // extent.
        this.zoom = function(map, ol3d, feature) {
          var extent = getMinimalExtent((feature) ?
              feature.getGeometry().getExtent() : source.getExtent());
          gaMapUtils.zoomToExtent(map, ol3d, extent);
        };
      };
      return new PreviewFeatures();
    };
  });
})();
