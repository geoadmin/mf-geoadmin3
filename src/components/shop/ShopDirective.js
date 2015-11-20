goog.provide('ga_shop_directive');
goog.require('ga_map_service');
(function() {

  var module = angular.module('ga_shop_directive', [
    'ga_map_service'
  ]);

  module.directive('gaShop', function($window, gaLang, gaLayers, gaMapUtils,
      gaGlobalOptions) {
    return {
      restrict: 'A',
      templateUrl: function(element, attrs) {
        return 'components/shop/partials/shop.html';
      },
      scope: {
        map: '=gaShopMap',
        feature: '=gaShopFeature'
      },
      link: function(scope, elt, attrs, controller) {
        var winShopName = 'toposhop';
        var winShop;
        scope.showConfirm = false;

        // Remove the element if no feature defined
        if (!scope.feature) {
          elt.remove();
          return;
        }

        var layerBodId = (scope.feature instanceof ol.Feature) ?
            scope.feature.get('layerId') : scope.feature.layerBodId;

        // Remove the element if no layerBodId associated
        if (!layerBodId) {
          elt.remove();
          return;
        }
        var layerConfig = gaLayers.getLayer(layerBodId);

        // Remove the element if no shop config available
        if (!layerConfig || !layerConfig.shop ||
            layerConfig.shop.length == 0) {
          elt.remove();
          return;
        }

        // The feature is not available in the shop so we display a message
        if (!scope.feature.properties.available) {
          scope.notAvailable = true;
          return;
        }

        scope.orderTypes = layerConfig.shop;
        scope.orderType = scope.orderTypes[0];
        scope.orderMapsheet = function() {
          gaMapUtils.zoomToExtent(scope.map, null, scope.feature.bbox);
          scope.showConfirm = true;
        };
        scope.confirm = function(showConfirm) {
           scope.showConfirm = showConfirm;
        };
        // {mapsheet,commune,district,canton,rectangle,whole}
        // Order a mapsheet
        scope.goToShop = function() {
          if (winShop) {
            winShop.focus();
          }
          var shopUrl = gaGlobalOptions.shopUrl + '/';
          winShop = $window.open(shopUrl + gaLang.get() +
              '/dispatcher?layers=' + layerBodId + '&' + layerBodId + '=' +
              scope.feature.id + '&target=' + winShopName, winShopName);
          scope.showConfirm = false;
        };
        scope.chooseOrderType = function(ifScope) {
          scope.orderType = ifScope.orderType;
          var cap = scope.orderType.charAt(0).toUpperCase() +
              scope.orderType.substr(1).toLowerCase();
          var func = scope['order' + cap];
          if (typeof func == 'function') {
            func();
          }
        };
      }

    };
  });
})();
