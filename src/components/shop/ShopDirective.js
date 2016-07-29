goog.provide('ga_shop_directive');
goog.require('ga_identify_service');
goog.require('ga_map_service');
goog.require('ga_price_filter');

(function() {

  var module = angular.module('ga_shop_directive', [
    'ga_map_service',
    'ga_shop_service',
    'ga_identify_service'
  ]);

  module.directive('gaShop', function($rootScope, gaLayers, gaMapUtils,
      gaShop, gaIdentify) {
    return {
      restrict: 'A',
      templateUrl: function(element, attrs) {
        return 'components/shop/partials/shop.html';
      },
      scope: {
        map: '=gaShopMap',
        feature: '=gaShopFeature',
        clipperGeometry: '=gaShopClipperGeometry'
      },
      link: function(scope, elt, attrs, controller) {
        scope.clipperFeatures = {};
        scope.showRectangle = false;
        scope.price = null;
        // Remove the element if no feature defined
        if (!scope.feature) {
          elt.remove();
          return;
        }

        var getFeatureIdToRequest = function() {
          // If a map number is specified in the properties we use this as
          // feature's id
          var feat = scope.clipperFeatures[scope.orderType] || scope.feature;
          var idToRequest = feat.featureId;
          if (scope.feature.properties && scope.feature.properties.number) {
            idToRequest = scope.feature.properties.number;
          }
          return idToRequest;
        };


        var layerBodId = (scope.feature instanceof ol.Feature) ?
            scope.feature.get('layerId') : scope.feature.layerBodId;

        // Remove the element if no layerBodId associated
        if (!layerBodId) {
          elt.remove();
          return;
        }
        var layerConfig = gaLayers.getLayer(layerBodId);

        // Remove the element if no shop config available
        if (!layerConfig.shop || layerConfig.shop.length == 0) {
          elt.remove();
          return;
        }

        // We consider a shopable feature as available by default if not
        // explicitly defined.
        if (scope.feature.properties &&
            !angular.isDefined(scope.feature.properties.available)) {
          scope.feature.properties.available = true;
        }

        // The feature is not available in the shop so we display a message
        if (scope.feature.properties && !scope.feature.properties.available &&
            layerConfig.shop.length <= 1) {
          scope.notAvailable = true;
          return;
        }

        scope.getClipperFeatureLabel = function(orderType) {
          var feat = scope.clipperFeatures[orderType];
          if (!feat) {
            return;
          }
          var str = ' (';
          if (orderType == 'mapsheet') {
            str += feat.featureId + ' ';
          }
          if (feat.properties) {
            str += feat.properties.label;
          } else if (feat.attributes) {
            str += feat.attributes.label;
          }
          return str += ')';
        };

        // {mapsheet,commune,district,canton,rectangle,whole}
        // commune: ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill
        // district: ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill
        // canton: ch.swisstopo.swissboundaries3d-kanton-flaeche.fill
        // Order a mapsheet
        scope.order = function() {
          if (scope.orderType) {
            gaShop.dispatch(scope.orderType, layerBodId,
                getFeatureIdToRequest(), scope.geometry);
          }
        };

        scope.onChangeOrderType = function(orderType) {
          scope.orderType = orderType;
          // Warn all shop directives that the ordertyope has changed.
          $rootScope.$broadcast('gaShopOrderTypeChange', scope);

          // We try to find the correct clipper to use
          var clipper = (orderType == 'mapsheet') ?
              gaShop.getMapsheetClipperFromBodId(layerBodId) :
              gaShop.getClipperFromOrderType(scope.orderType);

          if (!scope.clipperFeatures[scope.orderType] && clipper) {
            var layers = [
              gaLayers.getOlLayerById(clipper)
            ];
            gaIdentify.get(scope.map, layers, scope.clipperGeometry, 1, false,
                null, 1).then(function(response) {
              var results = response.data.results;
              if (results.length) {
                scope.clipperFeatures[scope.orderType] = results[0];
                scope.updatePrice();
              } else {
                scope.price = null;
              }
            }, function() {
              scope.price = null;
            });
          } else {
            scope.updatePrice();
          }
        };

        scope.updatePrice = function(geometry) {
          if (scope.orderType == 'rectangle') {
            if (!geometry) {
              geometry = scope.geometry;
            } else {
              scope.geometry = geometry;
            }
          }
          if ((scope.orderType == 'rectangle' && geometry) ||
              (scope.orderType != 'rectangle' && !geometry)) {

            gaShop.getPrice(scope.orderType, layerBodId,
                getFeatureIdToRequest(), geometry).then(function(price) {
              scope.price = price;
            }, function() {
              scope.price = null;
            });
          } else {
            scope.price = null;
          }
        };

        // Init orderType variables
        scope.orderTypes = layerConfig.shop;
        scope.orderType = '';
        if (scope.orderTypes.length == 1) {
           // papierkarte(mapsheet), swissbuildings3d 2.0(commune)
           scope.orderType = scope.orderTypes[0];
           scope.onChangeOrderType(scope.orderType);
        }

        // Reset order type if another shop directive has changed one
        scope.$on('gaShopOrderTypeChange', function(evt, shopScope) {
          if (shopScope !== scope && scope.orderTypes.length > 1) {
            scope.orderType = '';
          }
        });
      }
    };
  });
})();
