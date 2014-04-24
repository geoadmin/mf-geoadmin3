(function() {
  goog.provide('ga_custom_overlay_service');

  goog.require('ga_styles_service');

  var module = angular.module('ga_custom_overlay_service', [
    'ga_styles_service'
  ]);

  module.provider('gaCustomOverlay', function() {

    this.$get = function(gaStyleFactory) {
      var overlay;

      function addCross(map, center) {
        var cross = $('<div></div>')
            .addClass('ga-crosshair')
            .addClass('marker');
        overlay = new ol.Overlay({
          element: cross.get(0),
          position: center,
          stopEvent: false
        });
        map.addOverlay(overlay);
      }

      function addRectangle(map, extent, center) {
        var feature = new ol.Feature();
        var polygon = new ol.geom.Polygon(
            [[[extent[2], extent[3]], [extent[2], extent[1]],
            [extent[0], extent[1]], [extent[0], extent[3]]]]
        );
        feature.setGeometry(polygon);
        overlay = new ol.FeatureOverlay({
          position: center,
          stopEvent: false,
          style: gaStyleFactory.getStyle('defaultrectangle')
        });
        overlay.addFeature(feature);
        map.addOverlay(overlay);
      }

      function addOverlay(map, extent) {
        removeOverlay(map);
        var center = [(extent[0] + extent[2]) / 2,
            (extent[1] + extent[3]) / 2];

        if (extent[0] === extent[2] &&
            extent[1] == extent[3]) {
          addCross(map, center);
        } else {
          addRectangle(map, extent, center);
        }
      }

      function removeOverlay(map) {
        if (overlay) {
          map.removeOverlay(overlay);
          overlay = null;
        }
      }

      return {
        add: addOverlay,
        removeAll: removeOverlay
      };
    };
  });
})();
