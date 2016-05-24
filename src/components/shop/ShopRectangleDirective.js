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
        return 'components/shop/partials/shop-rectangle.html';
      },
      scope: {
        map: '=gaShopRectangleMap',
        isActive: '=gaShopRectangleActive',
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
          map.addLayer(layer);
          map.addInteraction(scope.dragBox);
          scope.dragBox.setActive(true);
        };

        var deactivate = function() {
          map.removeInteraction(scope.dragBox);
          map.removeLayer(layer);
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

        scope.onInputChange = function(evt) {
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
          scope.north = extent[3];
          scope.south = extent[1];
          scope.west = extent[0];
          scope.east = extent[2];
          updatePriceDebounced(extent);
          scope.area = geom.getArea();
        };

        var updateInputsDebounced = gaDebounce.debounce(updateInputs, 300,
            false, true);
        var updatePriceDebounced = gaDebounce.debounce(function(extent) {
          scope.updatePrice(extent.toString());
        }, 300, false, false);

      }
    };
  });
})();
