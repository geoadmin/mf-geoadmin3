(function() {
  goog.provide('ga_catalogitem_directive');

  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');

  // Utility function that look up a layer by its id from the map.
  function getMapLayer(map, id) {
    var layer;
    map.getLayers().forEach(function(l) {
      if (l.get('id') == id) {
        layer = l;
      }
    });
    return layer;
  }

  var module = angular.module('ga_catalogitem_directive', [
    'ga_layer_metadata_popup_service',
    'ga_map_service'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogitem',
      ['$compile', 'gaLayers', 'gaLayerMetadataPopup',
      function($compile, gaLayers, gaLayerMetadataPopup) {

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/catalogtree/partials/catalogitem.html',
          scope: {
            item: '=gaCatalogitemItem',
            map: '=gaCatalogitemMap'
          },
          compile: function(tEl, tAttr) {
            var contents = tEl.contents().remove();
            var compiledContent;
            return function(scope, iEl, iAttr) {
              if (!compiledContent) {
                compiledContent = $compile(contents);
              }
              scope.gaLayers = gaLayers;
              scope.getLegend = getLegend;
              scope.toggle = toggle;
              scope.toggleLayer = toggleLayer;
              scope.addPreviewLayer = addPreviewLayer;
              scope.removePreviewLayer = removePreviewLayer;

              compiledContent(scope, function(clone, scope) {
                iEl.append(clone);
              });
            };
          }
        };

        function addPreviewLayer() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = getMapLayer(map, item.idBod);
          if (!angular.isDefined(layer)) {
            layer = gaLayers.getOlLayerById(item.idBod);
            if (angular.isDefined(layer)) {
              layer.preview = true;
              map.addLayer(layer);
            }
          }
          item.preview = true;
        }

        function removePreviewLayer() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = getMapLayer(map, item.idBod);
          if (angular.isDefined(layer) && layer.preview) {
            layer.preview = false;
            map.removeLayer(layer);
          }
          item.preview = false;
        }

        function toggleLayer() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = getMapLayer(map, item.idBod);
          if (!angular.isDefined(layer)) {
            layer = gaLayers.getOlLayerById(item.idBod);
            // FIXME: the following if/else should not be necessary, as the
            // gaLayers service should always return a layer object for an
            // idBod.
            if (!angular.isDefined(layer)) {
              alert('Layer no defined by gaLayers (' + item.idBod + ').');
              item.errorLoading = true;
            } else {
              map.addLayer(layer);
            }
          } else {
            if (!layer.preview) {
              map.removeLayer(layer);
            } else {
              layer.preview = false;
            }
          }
        }

        function toggle(ev) {
          this.item.selectedOpen = !this.item.selectedOpen;
          ev.preventDefault();
        }

        function getLegend(ev, bodid) {
          gaLayerMetadataPopup(bodid);
          ev.stopPropagation();
        }
      }]
  );
})();
