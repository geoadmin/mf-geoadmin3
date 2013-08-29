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

  function addLayer(map, item, gaLayers) {
    // FIXME: we are super cautious here and display error messages
    // when either the layer identified by item.idBod doesn't exist
    // in the gaLayers service, or gaLayers cannot construct an ol
    // layer object for that layer.
    var error = true;
    if (angular.isDefined(gaLayers.getLayer(item.idBod))) {
      var layer = gaLayers.getOlLayerById(item.idBod);
      if (angular.isDefined(layer)) {
        error = false;
        map.addLayer(layer);
      }
    }
    if (error) {
      alert('Layer not supported by gaLayers (' + item.idBod + ').');
      item.errorLoading = true;
    }
  }

  function removeLayer(map, layer) {
    if (!layer.preview) {
      map.removeLayer(layer);
    } else {
      layer.preview = false;
    }
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
              scope.getLegend = getLegend;
              scope.toggle = toggle;
              scope.toggleLayer = toggleLayer;
              scope.addPreviewLayer = addPreviewLayer;
              scope.removePreviewLayer = removePreviewLayer;
              scope.inPreviewMode = inPreviewMode;

              // Only watch for leaves (layers)
              if (scope.item.children === undefined) {
                scope.$watch('item.selectedOpen', function() {
                  scope.toggleLayer();
                });
              }

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
          var layer = getMapLayer(map, item.idBod);
          if (angular.isDefined(layer) && layer.preview) {
            layer.preview = false;
            map.removeLayer(layer);
          }
        }

        function inPreviewMode() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = getMapLayer(map, item.idBod);
          return angular.isDefined(layer) && layer.preview;
        }

        function toggleLayer() {
          // "this" is the scope
          var item = this.item;
          var map = this.map;
          var layer = getMapLayer(map, item.idBod);
          if (!angular.isDefined(layer)) {
            if (item.selectedOpen === true) {
              addLayer(map, item, gaLayers);
            }
          } else {
            if (item.selectedOpen === false) {
              removeLayer(map, layer);
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
