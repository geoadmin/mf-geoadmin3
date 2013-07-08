(function() {
  goog.provide('ga_map_service');

  var module = angular.module('ga_map_service', []);


  // Define map-related objects

  var swissExtent = [485869.5728, 837076.5648, 76443.1884, 299941.7864];
  var swissProjection = ol.proj.configureProj4jsProjection({
    code: 'EPSG:21781', extent: swissExtent});

  var viewResolutions = [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0,
    2.5, 2.0, 1.0, 0.5, 0.25, 0.1];

  var map = new ol.Map({
    controls: ol.control.defaults({
      attribution: false
    }),
    renderer: ol.RendererHint.CANVAS
  });

  var view = new ol.View2D({
    projection: swissProjection,
    resolutions: viewResolutions
  });

  /**
   * gaMap is a service that provides the map object and other
   * map-related properties.
   *
   * The gaMapProvider makes the initial center and zoom configurable
   * at the application level.
   */
  module.provider('gaMap', function() {

    var initialCenter = ol.extent.getCenter(swissExtent);
    var initialZoom = 1;

    this.setInitialCenter = function(center) {
      initialCenter = center;
    };

    this.setInitialZoom = function(zoom) {
      initialZoom = zoom;
    };

    this.$get = function() {

      view.setCenter(initialCenter);
      view.setZoom(initialZoom);

      map.setView(view);

      return {
        map: map,
        resolutions: viewResolutions
      };

    };

  });

})();
