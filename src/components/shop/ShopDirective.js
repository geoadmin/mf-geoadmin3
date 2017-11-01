goog.provide('ga_shop_directive');
goog.require('ga_identify_service');
goog.require('ga_map_service');
goog.require('ga_previewfeatures_service');
goog.require('ga_price_filter');

(function() {

  var module = angular.module('ga_shop_directive', [
    'ga_map_service',
    'ga_shop_service',
    'ga_identify_service',
    'ga_previewfeatures_service',
    'ga_price_filter'
  ]);

  module.directive('gaShop', function($rootScope, gaLayers, gaShop, gaIdentify,
      gaPreviewFeatures) {
    var geojson = new ol.format.GeoJSON();
    return {
      restrict: 'A',
      templateUrl: 'components/shop/partials/shop.html',
      scope: {
        map: '=gaShopMap',
        feature: '=gaShopFeature',
        clipperGeometry: '=gaShopClipperGeometry'
      },
      link: function(scope, elt, attrs, controller) {
        scope.clipperFeatures = {};
        scope.showRectangle = false;
        scope.price = null;
        var proj = scope.map.getView().getProjection();
        // Remove the element if no feature defined
        if (!scope.feature) {
          elt.remove();
          return;
        }
        var previewFeat;

        var getFeatureIdToRequest = function() {
          // Use feature's id for id to resquest
          var feat = scope.clipperFeatures[scope.orderType] || scope.feature;
          var idToRequest = feat.featureId;
          return idToRequest;
        };

        var layerBodId = (scope.feature instanceof ol.Feature) ?
          scope.feature.get('layerId') : scope.feature.layerBodId;
        // For rectangle directive
        scope.layerBodId = layerBodId;

        var layerConfig = gaLayers.getLayer(layerBodId);
        // Remove the element if no layerBodId associated
        if (!layerConfig) {
          elt.remove();
          return;
        }

        // Remove the element if no shop config available
        if (!layerConfig.shop || !layerConfig.shop.length) {
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

        // On hover, we highlight the preview feature
        elt.on('mouseenter', function() {
          gaPreviewFeatures.highlight(scope.map, previewFeat);
        }).on('mouseleave', function() {
          gaPreviewFeatures.clearHighlight(scope.map);
        });

        scope.getClipperFeatureLabel = function(orderType) {
          var feat = scope.clipperFeatures[orderType];
          if (!feat) {
            return;
          }
          var str = ' (';
          if (orderType === 'mapsheet') {
            str += feat.featureId + ' ';
          }
          if (feat.properties) {
            str += feat.properties.label;
          } else if (feat.attributes) {
            str += feat.attributes.label;
          }
          str += ')';
          return str;
        };

        // {tile,commune,district,canton,rectangle,whole}
        // commune: ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill
        // district: ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill
        // canton: ch.swisstopo.swissboundaries3d-kanton-flaeche.fill
        // Order a mapsheet
        scope.order = function() {
          if (scope.orderType) {
            gaShop.dispatch(scope.orderType, layerBodId,
                getFeatureIdToRequest(), scope.geometry, proj);
          }
        };

        scope.onChangeOrderType = function(orderType, silent) {
          scope.orderType = orderType;
          scope.price = null;

          if (!silent) {
            // Warn all shop directives that the ordertyope has changed.
            $rootScope.$broadcast('gaShopOrderTypeChange', scope);
          }
          // We try to find the correct clipper to use
          var clipper = gaShop.getClipperFromOrderType(scope.orderType,
              layerBodId);
          gaPreviewFeatures.clearHighlight(scope.map);
          gaPreviewFeatures.remove(scope.map, previewFeat);
          previewFeat = null;
          if (!scope.clipperFeatures[scope.orderType] && clipper) {
            var layers = [
              gaLayers.getOlLayerById(clipper)
            ];
            gaIdentify.get(scope.map, layers, scope.clipperGeometry, 1, true,
                null).then(function(response) {
              var results = response.data.results;
              if (results.length) {
                var res = results[0];
                // Might contain several results, try to match via id/layerid
                if (results.length > 1) {
                  for (var i = 0; i < results.length; i++) {
                    res = results[i];
                    if (scope.feature.featureId === res.featureId &&
                        scope.feature.layerBodId === res.layerBodId) {
                      break;
                    }
                  }
                }
                scope.clipperFeatures[scope.orderType] = res;
                scope.addPreview();
                scope.updatePrice();
              }
            });
          } else {
            if (clipper) {
              scope.addPreview();
            }
            scope.updatePrice();
          }
        };

        scope.addPreview = function() {
          var gFeat = scope.clipperFeatures[scope.orderType];
          previewFeat = geojson.readFeature(gFeat);
          gaPreviewFeatures.add(scope.map, previewFeat);
        };

        scope.updatePrice = function(geometry, cutArea) {
          if (scope.orderType === 'rectangle') {
            if (!geometry) {
              geometry = scope.geometry;
            } else {
              scope.geometry = geometry;
            }
          }
          scope.price = null;
          if ((scope.orderType === 'rectangle' && geometry && cutArea) ||
              (scope.orderType !== 'rectangle' && !geometry)) {
            gaShop.getPrice(scope.orderType, layerBodId,
                getFeatureIdToRequest(), geometry, proj).then(function(price) {
              scope.price = price;
            });
          }
        };

        // Init orderType variables
        scope.orderTypes = layerConfig.shop;
        if (scope.orderTypes.length) {
          scope.orderType = scope.orderTypes[0];
          scope.onChangeOrderType(scope.orderType);
        }

        // Reset order type if another shop directive has activated the
        // rectangle.
        scope.$on('gaShopOrderTypeChange', function(evt, shopScope) {
          if (shopScope !== scope && scope.orderTypes.length > 1 &&
              scope.orderType === 'rectangle') {
            scope.onChangeOrderType(scope.orderTypes[0], true);
          }
        });
      }
    };
  });
})();
