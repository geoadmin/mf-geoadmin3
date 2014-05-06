(function() {
  goog.provide('ga_marker_overlay_service');

  var module = angular.module('ga_marker_overlay_service', []);

  module.provider('gaMarkerOverlay', function() {

    this.$get = function(gaStyleFactory) {
      var overlay, bbox, isAlwaysVisible;
      var marker = $('<div></div>')
          .addClass('ga-crosshair')
          .addClass('marker');

      function isPointData() {
        return bbox && (bbox[2] - bbox[0]) <= 1 &&
            (bbox[3] - bbox[1]) <= 1;
      }

      function addMarker(map, center, extent, visible) {
        bbox = extent;
        removeMarker(map);
        overlay = new ol.Overlay({
          element: marker.get(0),
          position: center,
          stopEvent: false
        });
        isAlwaysVisible = visible;
        setVisibility(map.getView().getZoom());
        map.addOverlay(overlay);
      }

      function setVisibility(zoom) {
        if (isAlwaysVisible) {
          marker.removeClass('hide');
          return;
        }
        if (overlay) {
          if (!isPointData()) {
            if (zoom > 6) {
              marker.addClass('hide');
            } else {
              marker.removeClass('hide');
            }
          }
        }
      }

      function removeMarker(map) {
        if (overlay) {
          map.removeOverlay(overlay);
          overlay = null;
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
