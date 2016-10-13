goog.provide('ngeo.wmsGetCapDirective');

(function() {

  var module = angular.module('ngeo.wmsGetCapDirective', [
    'pascalprecht.translate'
  ]);

  /**
   * This directive displays the list of layers available in the
   * GetCapabilities object.
   */
  module.directive('ngeoWmsGetCap', function($window, $translate) {

    // Get the layer extent defines in the GetCapabilities
    var getLayerExtentFromGetCap = function(getCapLayer, proj) {
      var wgs84 = 'EPSG:4326';
      var layer = getCapLayer;
      var projCode = proj.getCode();

      if (layer.BoundingBox) {
        for (var i = 0, ii = layer.BoundingBox.length; i < ii; i++) {
          var bbox = layer.BoundingBox[i];
          var code = bbox.crs || bbox.srs;
          if (code && code.toUpperCase() == projCode.toUpperCase()) {
            return bbox.extent;
          }
        }
      }

      var wgs84Extent = layer.EX_GeographicBoundingBox ||
          layer.LatLonBoundingBox;
      if (wgs84Extent) {
        // If only an extent in wgs 84 is available, we use the
        // intersection between proj extent and layer extent as the new
        // layer extent. We compare extients in wgs 84 to avoid
        // transformations errors of large wgs 84 extent like
        // (-180,-90,180,90)
        var projWgs84Extent = ol.proj.transformExtent(proj.getExtent(),
            projCode, wgs84);
        var layerWgs84Extent = ol.extent.getIntersection(projWgs84Extent,
            wgs84Extent);
        if (layerWgs84Extent) {
          return ol.proj.transformExtent(layerWgs84Extent, wgs84,
              projCode);
        }
      }
    };

    // Test if the layer can be displayed with a specific projection
    var canUseProj = function(layer, projCode) {
      var projCodeList = layer.CRS || layer.SRS || [];
      return (projCodeList.indexOf(projCode.toUpperCase()) != -1 ||
          projCodeList.indexOf(projCode.toLowerCase()) != -1);
    };

    // Go through all layers, assign needed properties,
    // and remove useless layers (no name or bad crs without children
    // or no intersection between map extent and layer extent)
    var getChildLayers = function(getCap, layer, proj) {

      // If the WMS layer has no name, it can't be displayed
      if (!layer.Name) {
        layer.isInvalid = true;
        layer.Abstract = 'layer_invalid_no_name';
      }

      if (!layer.isInvalid) {
        layer.wmsUrl = getCap.Service.OnlineResource;
        layer.wmsVersion = getCap.version;
        layer.id = 'WMS||' + layer.wmsUrl + '||' + layer.Name;
        layer.extent = getLayerExtentFromGetCap(layer, proj);

        // if the layer has no extent, it is set as invalid.
        // We don't have proj codes list for wms 1.1.1 so we assume the
        // layer can be displayed (wait for
        // https://github.com/openlayers/ol3/pull/2944)
        var projCode = proj.getCode();
        if (getCap.version == '1.3.0' && !canUseProj(layer, projCode)) {
          layer.useReprojection = true;

          if (!layer.extent) {
            layer.isInvalid = true;
            layer.Abstract = 'layer_invalid_outside_map';
          }
        }
      }

      // Go through the child to get valid layers
      if (layer.Layer) {

        for (var i = 0; i < layer.Layer.length; i++) {
          var l = getChildLayers(getCap, layer.Layer[i], proj);
          if (!l) {
            layer.Layer.splice(i, 1);
            i--;
          }
        }

        // No valid child
        if (layer.Layer.length == 0) {
          layer.Layer = undefined;
        }
      }

      if (layer.isInvalid && !layer.Layer) {
        return undefined;
      }

      return layer;
    };

    return {
      restrict: 'A',
      templateUrl: 'components/ngeo.import/partials/wms-get-cap.html',
      scope: {
        getCap: '=ngeoWmsGetCap',
        map: '=ngeoWmsGetCapMap',
        options: '=ngeoWmsGetCapOptions'
      },
      link: function(scope) {

        // List of layers available in the GetCapabilities.
        // The layerXXXX properties use layer objects from the parsing of
        // a  GetCapabilities file, not ol layer object.
        scope.layers = [];
        scope.options = scope.options || {};
        scope.$watch('getCap', function(val) {
          var err;
          try {
            val = new ol.format.WMSCapabilities().read(val);
          } catch (e) {
            err = e;
          }

          if (err || !val) {
            $window.console.error('WMS GetCap parsing failed: ', err || val);
            scope.userMsg = 'parse_failed';
            return;
          }

          scope.limitations = '';
          scope.layers = [];
          scope.options.layerSelected = null; // the layer selected on click
          scope.options.layerHovered = null;

          if (val && val.Service && val.Capability) {
            if (val.Service.MaxWidth) {
              scope.limitations = $translate.instant('wms_max_size_allowed') +
                  ' ' + val.Service.MaxWidth +
                  ' * ' + val.Service.MaxHeight;
            }

            if (val.Capability.Layer) {
              var root = getChildLayers(val, val.Capability.Layer,
                  scope.map.getView().getProjection());
              if (root) {
                scope.layers = root.Layer || [root];
              }
            }
          }
        });

        // Add the selected layer to the map
        scope.addLayerSelected = function() {
          var getCapLay = scope.options.layerSelected;
          if (getCapLay && scope.options.getOlLayerFromGetCapLayer) {
            var msg = 'add_wms_layer_succeeded';
            try {
              var olLayer = scope.options.getOlLayerFromGetCapLayer(getCapLay);
              if (olLayer) {
                scope.map.addLayer(olLayer);
              }

            } catch (e) {
              $window.console.error('Add layer failed:' + e);
              msg = 'add_wms_layer_failed' + e.message;
            }
            $window.alert($translate.instant(msg));
          }
        };

        // Get the abstract to display in the text area
        scope.getAbstract = function() {
          var l = scope.options.layerSelected || scope.options.layerHovered ||
              {};
          return $translate.instant(l.Abstract) || '';
        };
      }
    };
  });
})();

