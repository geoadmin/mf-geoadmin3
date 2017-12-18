goog.provide('ga_wmtsgetcap_directive');

(function() {

  var module = angular.module('ga_wmtsgetcap_directive', [
    'pascalprecht.translate'
  ]);

  module.directive('gaWmtsGetCap', function($translate) {

    // Get the layer extent defines in the GetCapabilities
    var getLayerExtentFromGetCap = function(getCapLayer, proj) {
      var wgs84 = 'EPSG:4326';
      var layer = getCapLayer;
      var projCode = proj.getCode();
      var wgs84Extent = layer.WGS84BoundingBox;
      if (wgs84Extent) {
        // If only an extent in wgs 84 is available, we use the
        // intersection between proj extent and layer extent as the new
        // layer extent. We compare extents in wgs 84 to avoid
        // transformations errors of large wgs 84 extent like
        // (-180,-90,180,90)
        var projWgs84Extent = ol.proj.transformExtent(proj.getExtent(),
            projCode, wgs84);
        var layerWgs84Extent = ol.extent.getIntersection(projWgs84Extent,
            wgs84Extent);
        if (layerWgs84Extent) {
          return ol.proj.transformExtent(layerWgs84Extent, wgs84, projCode);
        }
      }
    };

    // Go through all layers, assign needed properties,
    // and remove useless layers (no name or bad crs without children
    // or no intersection between map extent and layer extent)
    var getLayersList = function(getCap, getCapUrl, proj) {
      var layers = [];

      for (var layer of getCap.Contents.Layer) {
        // If the WMTS layer has no title, it can't be displayed
        if (!layer.Title) {
          layer.isInvalid = true;
          layer.Abstract = $translate.instant('layer_invalid_no_name');
        }

        if (!layer.isInvalid) {
          var layerOptions = {
            'layer': layer.Identifier
          };
          layer.sourceConfig = ol.source.WMTS.optionsFromCapabilities(getCap,
              layerOptions);
          if ('ServiceProvider' in getCap) {
            layer.attribution = getCap.ServiceProvider.ProviderName;
            layer.attributionUrl = getCap.ServiceProvider.ProviderSite;
          }
          layer.capabilitiesUrl = getCapUrl;
          layer.extent = getLayerExtentFromGetCap(layer, proj);
        }

        layers.push(layer);
      }

      return layers;
    };

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/wmts-get-cap.html',
      scope: {
        'getCap': '=gaWmtsGetCap',
        'map': '=gaWmtsGetCapMap',
        'url': '=gaWmtsGetCapUrl',
        'options': '=gaWmtsGetCapOptions'
      },
      link: function(scope) {

        // List of layers available in the GetCapabilities.
        // The layerXXXX properties use layer objects from the parsing of
        // a  GetCapabilities file, not ol layer object.
        scope.layers = [];
        scope.options = scope.options || {};
        scope.$watch('getCap', function(val) {
          var err = void 0;
          try {
            val = new ol.format.WMTSCapabilities().read(val);
          } catch (e) {
            err = e;
          }

          if (err || !val) {
            console.error('WMTS GetCap parsing failed: ', err || val);
            scope.userMsg = $translate.instant('parsing_failed');
            return;
          }

          scope.layers = [];
          scope.options.layerSelected = null; // the layer selected on click
          scope.options.layerHovered = null;

          if (val && val.Contents && val.Contents.Layer) {
            scope.layers = getLayersList(val, scope.url,
                scope.map.getView().getProjection());
          }
        });

        // Add the selected layer to the map
        scope.addLayerSelected = function() {
          var getCapLay = scope.options.layerSelected;
          if (getCapLay && scope.options.getOlLayerFromGetCapLayer) {
            var msg = $translate.instant('wmts_layer_added_succesfully');
            try {
              var olLayer = scope.options.getOlLayerFromGetCapLayer(getCapLay);
              if (olLayer) {
                scope.map.addLayer(olLayer);
              }
            } catch (e) {
              console.error('Add layer failed:', e);
              msg = $translate.instant('wmts_layer_could_not_be_added') +
                  e.message;
            }
            alert(msg);
          }
        };

        // Get the abstract to display in the text area
        scope.getAbstract = function() {
          var l = scope.options.layerSelected || scope.options.layerHovered ||
              {};
          return l.Abstract || '';
        };
      }
    };
  });
})();
