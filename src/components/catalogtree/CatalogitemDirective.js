(function() {
  goog.provide('ga_catalogitem_directive');

  goog.require('ga_catalogtree_directive');
  goog.require('ga_layer_metadata_popup_service');

  var module = angular.module('ga_catalogitem_directive', [
    'ga_catalogtree_directive',
    'ga_layer_metadata_popup_service'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogitem',
      function($compile, gaCatalogtreeMapUtils, gaMapUtils,
          gaLayers, gaLayerMetadataPopup) {
        return {
          restrict: 'A',
          replace: true,
          require: '^gaCatalogtree',
          templateUrl: 'components/catalogtree/partials/catalogitem.html',
          scope: {
            item: '=gaCatalogitemItem',
            map: '=gaCatalogitemMap',
            options: '=gaCatalogitemOptions'
          },
          controller: function($scope) {
            $scope.addPreviewLayer = function() {
              var item = $scope.item;
              var map = $scope.map;
              var layer = gaMapUtils.getMapOverlayForBodId(
                  map, item.idBod);
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
              if (layer && layer.timeEnabled) {
                // options.currentYear is setted in CatalogTreeDirective
                layer.time = $scope.options.currentYear;
              }
            };

            $scope.removePreviewLayer = function() {
              var item = $scope.item;
              var map = $scope.map;
              var layer = gaMapUtils.getMapOverlayForBodId(
                  map, item.idBod);
              if (angular.isDefined(layer) && layer.preview) {
                map.removeLayer(layer);
                layer.preview = false;
              }
            };

            $scope.inPreviewMode = function() {
              var item = $scope.item;
              var map = $scope.map;
              var layer = gaMapUtils.getMapOverlayForBodId(
                  map, item.idBod);
              return angular.isDefined(layer) && layer.preview;
            };

            $scope.toggleLayer = function() {
              var item = $scope.item;
              var map = $scope.map;
              var layer = gaMapUtils.getMapOverlayForBodId(
                  map, item.idBod);
              if (!angular.isDefined(layer)) {
                gaCatalogtreeMapUtils.addLayer(map, item);
              } else {
                if (!layer.preview) {
                  map.removeLayer(layer);
                } else {
                  layer.preview = false;
                }
              }
            };

            $scope.toggle = function(ev) {
              $scope.item.selectedOpen = !$scope.item.selectedOpen;
              ev.preventDefault();
            };

            $scope.getLegend = function(ev, bodid) {
              gaLayerMetadataPopup(bodid);
              ev.stopPropagation();
            };
          },

          compile: function(tEl, tAttr) {
            var contents = tEl.contents().remove();
            var compiledContent;
            return function(scope, iEl, iAttr, controller) {
              if (!compiledContent) {
                compiledContent = $compile(contents);
              }
              if (angular.isDefined(scope.item.children)) {
                scope.$watch('item.selectedOpen', function(value) {
                  controller.updatePermalink(scope.item.id, value);
                });
              }
              compiledContent(scope, function(clone, scope) {
                iEl.append(clone);
              });
            };
          }
        };
      }
  );
})();
