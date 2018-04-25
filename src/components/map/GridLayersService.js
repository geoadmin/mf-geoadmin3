goog.provide('ga_gridlayers_service');

goog.require('ga_definepropertiesforlayer_service');
goog.require('ga_layerfilters_service');
goog.require('ga_maputils_service');
goog.require('ga_permalink_service');
goog.require('ga_tilegrid_service');

(function() {

  var module = angular.module('ga_gridlayers_service', [
    'ga_definepropertiesforlayer_service',
    'ga_layerfilters_service',
    'ga_maputils_service',
    'ga_permalink_service',
    'ga_tilegrid_service'
  ]);

  /**
   * Service to show different wmts grids
   */
  module.provider('gaGridLayersManager', function() {
    this.$get = function(gaPermalink, gaLayerFilters, gaTileGrid,
        gaDefinePropertiesForLayer, gaMapUtils) {

      var labelStyle = new ol.style.Text({
        show: true,
        color: 'yellow',
        outlineColor: 'yellow',
        outlineWidth: 3,
        labelStyle: 2,
        font: '24px arial',
        offsetY: 20,
        fill: new ol.style.Fill({
          color: 'yellow'
        }),
        stroke: new ol.style.Stroke({
          color: 'yellow',
          width: 1
        }),
        scaleByDistanceNearRange: 1000.0,
        scaleByDistanceNearValue: 2.0,
        scaleByDistanceFarRange: 10000.0,
        scaleByDistanceFarValue: 0.4
      });

      var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'yellow',
          width: 4
        }),
        text: labelStyle
      });
      var source = new ol.source.Vector();
      var vector = new ol.layer.Vector({
        source: source,
        style: function(feature) {
          style.getText().setText(feature.get('name'));
          return style;
        },
        // visible: false,
        label: '[DEBUG] WMTS GRID LV95'
      });

      gaDefinePropertiesForLayer(vector);
      vector.preview = true;
      vector.displayInLayerManager = true;
      vector.setZIndex(gaMapUtils.Z_PREVIEW_FEATURE);

      var grid = gaTileGrid.get([4000, 3750, 3500, 3250, 3000, 2750,
        2500, 2250,
        2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250,
        100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1], 0.1);
      // var allLayers = [];
      // var is3dActive = false;

      var updateLayer = function(map) {
        var z = map.getView().getZoom();
        var extent = map.getView().calculateExtent(map.getSize());
        var viewres = gaMapUtils.getViewResolutionForZoom(z);
        var pyrz = grid.getResolutions().indexOf(viewres);
        // window.console.log(z, viewres);
        // window.console.log(extent);
        // window.console.log(pyrz);
        if (pyrz > -1) {
          source.clear();
          grid.forEachTileCoord(extent, pyrz, function(tc, bb) {
            var tcext = grid.getTileCoordExtent(tc);
            source.addFeature(new ol.Feature({
              'geometry': new ol.geom.LineString([
                [tcext[0], tcext[1]],
                [tcext[0], tcext[3]],
                [tcext[2], tcext[3]],
                [tcext[2], tcext[1]]]),
              'name': tc[0] + '/' + Math.abs(tc[1]) + '/' + Math.abs(tc[2])
            }));

            // window.console.log(tc, tcext);
          });
        }
        /*
        if (is3dActive) {
          map.removeLayer(vector);
        } else {
          map.addLayer(vector);
        }
        */
      }

      return function(parentScope) {
        var scope = parentScope.$new();
        scope.layers = scope.map.getLayers().getArray();
        scope.f = function(l) {
          return l.bodId && (gaLayerFilters.background(l) ||
              gaLayerFilters.selected(l));
        };
        scope.$watchCollection('layers | filter:f', function(l) {
          // allLayers = l || [];
        });
        scope.$watch('globals.is3dActive', function(val) {
          // is3dActive = val;
          updateLayer(scope.map);
        });

        scope.map.on('change:size', function(evt) {
          updateLayer(scope.map);
        });

        scope.map.getView().on('propertychange', function(evt) {
          updateLayer(scope.map);
        });

        scope.map.addLayer(vector);
      };
    };
  });
})();
