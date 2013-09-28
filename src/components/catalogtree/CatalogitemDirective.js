(function() {
  goog.provide('ga_catalogitem_directive');

  goog.require('ga_catalogtree_service');
  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_catalogitem_directive', [
    'ga_catalogtree_service',
    'ga_layer_metadata_popup_service',
    'ga_map_service'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogitem',
      function($compile, gaCatalogtreeMapUtils, gaLayers,
          gaLayerMetadataPopup) {
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
              scope.getLegend = getLegend;
              scope.toggle = toggle;
              scope.toggleLayer = toggleLayer;
              scope.addPreviewLayer = addPreviewLayer;
              scope.removePreviewLayer = removePreviewLayer;
              scope.inPreviewMode = inPreviewMode;

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
          var layer = gaCatalogtreeMapUtils.getMapLayer(map, item.idBod);
          if (!angular.isDefined(layer)) {
            // FIXME: we are super cautious here and display error messages
            // when either the layer identified by item.idBod doesn't exist
            // in the gaLayers service, or gaLayers cannot construct an ol
            // layer object for that layer.
            var error = true;
            if (angular.isDefined(gaLayers.getLayer(item.idBod))) {
              layer = gaLayers.getOlLayerById(item.idBod);
              if (angular.isDefined(layer)) {
                error = false;
                layer.preview = true;
                map.addLayer(layer);
              }
            }
            item.errorLoading = error;
          }
        }

        function removePreviewLayer() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = gaCatalogtreeMapUtils.getMapLayer(map, item.idBod);
          if (angular.isDefined(layer) && layer.preview) {
            map.removeLayer(layer);
            layer.preview = false;
          }
        }

        function inPreviewMode() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = gaCatalogtreeMapUtils.getMapLayer(map, item.idBod);
          return angular.isDefined(layer) && layer.preview;
        }

        function toggleLayer() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = gaCatalogtreeMapUtils.getMapLayer(map, item.idBod);
          if (!angular.isDefined(layer)) {
            gaCatalogtreeMapUtils.addLayer(map, item);
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
      }
  );
})();
