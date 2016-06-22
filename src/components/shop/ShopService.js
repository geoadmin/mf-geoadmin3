goog.provide('ga_shop_service');
goog.require('ga_translation_service');

(function() {

  var module = angular.module('ga_shop_service', [
    'ga_translation_service',
    'ga_browsersniffer_service'
  ]);

  /**
   * Shop manager.
   */
  module.provider('gaShop', function() {
    var WIN_SHOP_PREFIX = 'toposhop-';
    var WIN_MAP_PREFIX = 'map-' + WIN_SHOP_PREFIX;
    var WIN_MAP_REG = new RegExp('^' + WIN_MAP_PREFIX + '(.*)$');
    var winShop;

    this.$get = function($q, $window, $http, gaBrowserSniffer, gaGlobalOptions,
        gaLang) {
      var priceUrl = gaGlobalOptions.shopUrl +
          '/shop-server/resources/products/price?';
      var clipper = {
        'commune': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
        'district': 'ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill',
        'canton': 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill'
      };
      var mapsheetClipper = {
        'ch.swisstopo.pixelkarte-farbe-pk25.noscale':
            'ch.swisstopo.pixelkarte-pk25.metadata',
        'ch.swisstopo.pixelkarte-farbe-pk50.noscale':
            'ch.swisstopo.pixelkarte-pk50.metadata',
        'ch.swisstopo.pixelkarte-farbe-pk100.noscale':
            'ch.swisstopo.pixelkarte-pk100.metadata',
        'ch.swisstopo.pixelkarte-farbe-pk200.noscale':
            'ch.swisstopo.pixelkarte-pk200.metadata'
        //,'ch.swisstopo.digitales-hoehenmodell_25_reliefschattierung': '
      };
      var getParams = function(orderType, layerBodId, featureId, geometry) {
        var params = {
          layer: layerBodId
        };

        if (orderType == 'mapsheet') {
          if (mapsheetClipper[layerBodId]) {
            params.clipper = mapsheetClipper[layerBodId];
          }
          params.featureid = featureId;
        } else if (clipper[orderType]) {
          params.clipper = clipper[orderType];
          params.featureid = featureId;
        } else if (orderType == 'whole') {
          params.clipper = layerBodId;
        } else if (geometry) {
          params.geometry = geometry;
        }

        var paramsStr = '';
        for (var i in params) {
           paramsStr += i + '=' + params[i] + '&';
        }
        return paramsStr.substring(0, paramsStr.length - 1);
      };

      var Shop = function() {

        this.dispatch = function(orderType, layerBodId, featureId, geometry) {
          if (!orderType || !layerBodId) {
            return;
          }
          var sessionId;
          // If the map viewer is opened from the shop, the session id is set
          // in its name.
          // ex: map-toposhop-MonApr112016093724GMT0200(CEST)
          if ($window.name && WIN_MAP_REG.test($window.name)) {
            sessionId = $window.name.match(WIN_MAP_REG)[1];
            winShop = $window.opener;
          }

          if (winShop) {
            // WARNING: Scripts don't allow to close the window if the window
            // hasn't been opened by it. FF and Chrome simply ignore it.
            // IE displays an alert message.
            winShop.close();
          } else if (gaBrowserSniffer.msie) {
            // The following hack allow IE to close a window which has not been
            // opened by a script and remove the display of the alert message.
            $window.open('', '_self', '');
          }
          sessionId = sessionId || new Date();
          var url = gaGlobalOptions.shopUrl + '/' + gaLang.get() +
              '/dispatcher?' + getParams(orderType, layerBodId, featureId,
              geometry);
          //console.log(url);
          winShop = $window.open(url, WIN_SHOP_PREFIX + sessionId);
        };

        this.getPrice = function(orderType, layerBodId, featureId, geometry) {
          if (!orderType || !layerBodId) {
            var defer = $q.defer();
            defer.reject();
            return defer.promise;
          }
          var url = priceUrl + getParams(orderType, layerBodId, featureId,
              geometry);
          return $http.get(url, {
            cache: true
          }).then(function(response) {
            return response.data.productPrice;
          });
        };

        this.getClipperFromOrderType = function(orderType) {
          return clipper[orderType];
        };

        this.getMapsheetClipperFromBodId = function(layerBodId) {
          return mapsheetClipper[layerBodId];
        };

      };
      return new Shop();
    };
  });
})();
