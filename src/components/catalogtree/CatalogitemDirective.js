import gaEventService from '../EventService.js';

goog.provide('ga_catalogitem_directive');

goog.require('ga_catalogtree_directive');
goog.require('ga_layermetadatapopup_service');
goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_previewlayers_service');

var gaCatalogitemDirective = angular.module('ga_catalogitem_directive', [
  'ga_catalogtree_directive',
  'ga_layermetadatapopup_service',
  'ga_layers_service',
  'ga_maputils_service',
  'ga_previewlayers_service',
  gaEventService
]);

/**
 * See examples on how it can be used
 */
gaCatalogitemDirective.directive('gaCatalogitem',
    function($compile, gaMapUtils, gaLayerMetadataPopup,
        gaPreviewLayers, gaLayers, gaEvent) {

      var addBodLayer = function(map, layerBodId) {
        if (gaLayers.getLayer(layerBodId)) {
          var layer = gaLayers.getOlLayerById(layerBodId);
          if (layer) {
            map.addLayer(layer);
          }
        }
      };

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

      var getOlLayer = function(map, item) {
        if (!item) {
          return undefined;
        }
        return gaMapUtils.getMapOverlayForBodId(map, item.layerBodId);
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

          $scope.item.active = function(activate) {
            var layer = getOlLayer($scope.map, $scope.item);
            // setter called
            if (arguments.length) {
              if (layer) {
                layer.visible = activate;
              }
              if (activate) {
                $scope.item.selectedOpen = true;
                // Add it if it's not already on the map
                if (!layer) {
                  removePreviewLayer($scope.map);
                  addBodLayer($scope.map, $scope.item.layerBodId);
                }
              }
            } else { // getter called
              return $scope.item.selectedOpen && layer && layer.visible;
            }
          };

          $scope.toggle = function(evt) {
            $scope.item.selectedOpen = !$scope.item.selectedOpen;
            evt.preventDefault();
            evt.stopPropagation();
          };

          $scope.getLegend = function(evt, bodId) {
            gaLayerMetadataPopup.toggle(bodId);
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
            } else {
              gaEvent.onMouseOverOut(iEl, function(evt) {
                addPreviewLayer(scope.map, scope.item);
              }, function(evt) {
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

export default gaCatalogitemDirective;
