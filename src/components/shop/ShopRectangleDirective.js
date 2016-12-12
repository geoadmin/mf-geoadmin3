goog.provide('ga_shoprectangle_directive');
goog.require('ga_debounce_service');
goog.require('ga_map_service');
goog.require('ga_measure_filter');

(function() {

  var module = angular.module('ga_shoprectangle_directive', [
    'ga_debounce_service',
    'ga_map_service'
  ]);

  module.directive('gaShopRectangle', function(gaDebounce, gaMapUtils, gaShop) {
    return {
      restrict: 'A',
      templateUrl: function(element, attrs) {
        return 'components/shop/partials/shoprectangle.html';
      },
      scope: {
        map: '=gaShopRectangleMap',
        isActive: '=gaShopRectangleActive',
        layerBodId: '=gaShopRectangleLayerBodId',
        updatePrice: '=gaShopRectangleUpdatePrice'
      },
      link: function(scope, elt, attrs, controller) {
        var map = scope.map;
        var layer = gaMapUtils.getFeatureOverlay();
        var source = layer.getSource();

        // Create the interaction
        scope.dragBox = new ol.interaction.DragBox();
        scope.dragBox.on('boxstart', function(evt) {
          source.clear();
          updateInputsDebounced(evt.target.getGeometry());
        });
        scope.dragBox.on('boxdrag', function(evt) {
          updateInputsDebounced(evt.target.getGeometry());
        });
        scope.dragBox.on('boxend', function(evt) {
          var geom = evt.target.getGeometry();
          source.addFeature(new ol.Feature(geom));
          updateInputsDebounced(geom);
          scope.dragBox.setActive(false);
        });

        var activate = function() {
          layer.setMap(map);
          map.addInteraction(scope.dragBox);
          scope.dragBox.setActive(true);
          // Reload price.
          scope.onInputChange();
        };

        var deactivate = function() {
          map.removeInteraction(scope.dragBox);
          layer.setMap(null);
        };

        scope.$watch('isActive', function(isActive) {
          if (isActive) {
            activate();
          } else {
            deactivate();
          }
        });

        scope.$on('$destroy', function() {
          deactivate();
        });

        scope.onInputChange = function() {
          source.clear();
          var extent = gaMapUtils.intersectWithDefaultExtent([
            scope.west, scope.south, scope.east, scope.north
          ]);
          if (extent) {
            var geom = ol.geom.Polygon.fromExtent(extent);
            source.addFeature(new ol.Feature(geom));
            updatePriceDebounced(extent);
          }
        };

        var updateInputs = function(geom) {
          var extent = geom.getExtent();
          scope.north = parseInt(extent[3], 10);
          scope.south = parseInt(extent[1], 10);
          scope.west = parseInt(extent[0], 10);
          scope.east = parseInt(extent[2], 10);
          scope.onInputChange();
        };

        var updateInputsDebounced = gaDebounce.debounce(updateInputs, 300,
            false, true);
        var updatePriceDebounced = gaDebounce.debounce(function(extent) {
          // Get the area from the cut service
          gaShop.cut(extent.toString(), scope.layerBodId).then(function(area) {
            scope.updatePrice(extent.toString(), area);
            scope.area = area * 1000 * 1000;
          }, function() {
            scope.area = null;
          });
        }, 300, false, false);
      }
    };
  });
})();
