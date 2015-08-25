goog.provide('ga_marker_overlay_service');
(function() {

  var module = angular.module('ga_marker_overlay_service', []);

  module.provider('gaMarkerOverlay', function() {

    this.$get = function(gaStyleFactory) {
      var bbox, isAlwaysVisible;
      var source, layer;
      var feature = null;

      /** @const */
      var style = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'img/marker.png'
        })
      });

      function initialize(map) {
        if (!layer) {
          source = new ol.source.Vector();
          layer = new ol.layer.Vector({
            source: source
          });
          layer.set('altitudeMode', 'clampToGround');
          map.addLayer(layer);
        }
      }

      function isPointData() {
        return bbox && (bbox[2] - bbox[0]) <= 1 &&
            (bbox[3] - bbox[1]) <= 1;
      }

      function addMarker(map, center, extent, visible) {
        initialize(map);
        bbox = extent;
        removeMarker(map);
        feature = new ol.Feature({
          geometry: new ol.geom.Point(center),
          style: style
        });
        isAlwaysVisible = visible;
        setVisibility(map.getView().getZoom());
        source.addFeature(feature);
      }

      function setVisibility(zoom) {
        if (isAlwaysVisible) {
          feature.setStyle(style);
          return;
        }
        if (feature) {
          if (!isPointData()) {
            if (zoom > 6) {
              feature.setStyle(null);
            } else {
              feature.setStyle(style);
            }
          }
        }
      }

      function removeMarker(map) {
        if (feature) {
          source.clear();
          feature = null;
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
