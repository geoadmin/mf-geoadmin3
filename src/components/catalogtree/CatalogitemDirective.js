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
          gaLayers, gaLayerMetadataPopup, gaBrowserSniffer, gaPreviewLayers) {
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
            $scope.isPreviewMode = false;

            $scope.addPreviewLayer = function(evt) {
              if (gaBrowserSniffer.mobile) {
                if (evt) {
                  evt.preventDefault();
                }
                return;
              }
              var layer = gaMapUtils.getMapOverlayForBodId(
                  $scope.map, $scope.item.layerBodId);

              // Don't add preview layer if the layer is already on the map
              if (!layer) {
                $scope.inPreviewMode = true;
                $scope.item.errorLoading = (!gaPreviewLayers.addBodLayer(
                    $scope.map, $scope.item.layerBodId));
              }
            };

            $scope.removePreviewLayer = function(evt) {
              if (gaBrowserSniffer.mobile) {
                if (evt) {
                  evt.preventDefault();
                }
                return;
              }
              gaPreviewLayers.removeAll($scope.map);
              $scope.inPreviewMode = false;
            };

            $scope.toggleLayer = function() {
              // Avoid to have the same layer twice on the map
              $scope.removePreviewLayer();
              var item = $scope.item;
              var map = $scope.map;
              var layer = gaMapUtils.getMapOverlayForBodId(
                  map, item.layerBodId);
              if (!angular.isDefined(layer)) {
                gaCatalogtreeMapUtils.addLayer(map, item);
              } else {
                map.removeLayer(layer);
              }
            };

            $scope.toggle = function(ev) {
              $scope.item.selectedOpen = !$scope.item.selectedOpen;
              ev.preventDefault();
            };

            $scope.getLegend = function(ev, bodid) {
              gaLayerMetadataPopup.toggle(bodid);
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
