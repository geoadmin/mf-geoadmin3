goog.provide('ga_marker_overlay_service');

goog.require('ga_maputils_service');
goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_marker_overlay_service', [
    'ga_maputils_service',
    'ga_styles_service'
  ]);

  module.provider('gaMarkerOverlay', function() {

    this.$get = function(gaStyleFactory, gaMapUtils) {
      var bbox, isAlwaysVisible, layer;

      function initialize(map) {
        if (!layer) {
          layer = gaMapUtils.getFeatureOverlay([],
              gaStyleFactory.getStyle('marker'));
          map.addLayer(layer);
        }
      }

      function isPointData() {
        return bbox && (bbox[2] - bbox[0]) <= 1 &&
            (bbox[3] - bbox[1]) <= 1;
      }

      function addMarker(map, center, visible, extent) {
        initialize(map);
        bbox = extent || center.concat(center);
        removeMarker(map);
        isAlwaysVisible = visible;
        setVisibility(map.getView().getZoom());
        layer.getSource().addFeature(new ol.Feature({
          label: 'query_search',
          geometry: new ol.geom.Point(center)
        }));
      }

      function setVisibility(zoom) {
        if (isAlwaysVisible) {
          layer.setVisible(true);
          return;
        }
        if (!isPointData()) {
          if (zoom > 6) {
            layer.setVisible(false);
          } else {
            layer.setVisible(true);
          }
        }
      }

      function removeMarker(map) {
        if (layer) {
          layer.getSource().clear();
        }
      }

      return {
        add: addMarker,
        setVisibility: setVisibility,
        remove: removeMarker
      };
    };
  });
})();
