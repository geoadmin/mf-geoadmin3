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

        // Don't add preview layer if the layer is already on the map
        var addPreviewLayer = function(map, item) {
          if (!item.selectedOpen) {
            gaPreviewLayers.addBodLayer(map, item.layerBodId);
          }
        };

        // Remove all preview layers
        var removePreviewLayer = function(map) {
          gaPreviewLayers.removeAll(map);
        };

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

            $scope.toggleLayer = function() {
              removePreviewLayer($scope.map);
              if ($scope.item.selectedOpen) {
                gaCatalogtreeMapUtils.addLayer($scope.map, $scope.item);
              } else {
                var layer = gaMapUtils.getMapOverlayForBodId(
                    $scope.map, $scope.item.layerBodId);
                $scope.map.removeLayer(layer);
              }
            };

            $scope.toggle = function(evt) {
              $scope.item.selectedOpen = !$scope.item.selectedOpen;
              evt.preventDefault();
              evt.stopPropagation();
            };

            $scope.getLegend = function(evt, bodid) {
              gaLayerMetadataPopup.toggle(bodid);
              evt.stopPropagation();
            };
          },

          compile: function(tEl, tAttr) {
            var contents = tEl.contents().remove();
            var compiledContent;
            return function(scope, iEl, iAttr, controller) {
              if (!compiledContent) {
                compiledContent = $compile(contents);
              }

              // Node
              if (angular.isDefined(scope.item.children)) {
                scope.$watch('item.selectedOpen', function(value) {
                  controller.updatePermalink(scope.item.id, value);
                });

              // Leaf
              } else if (!gaBrowserSniffer.mobile) {
                iEl.on('mouseenter', function(evt) {
                  addPreviewLayer(scope.map, scope.item);
                }).on('mouseleave', function(evt) {
                  removePreviewLayer(scope.map);
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
