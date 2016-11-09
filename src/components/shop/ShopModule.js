goog.provide('ga_shop');

goog.require('ga_price_filter');
goog.require('ga_shop_directive');
goog.require('ga_shop_service');
goog.require('ga_shopmsg_directive');
goog.require('ga_shoprectangle_directive');


(function() {

  angular.module('ga_shop', [
    'ga_price_filter',
    'ga_shop_directive',
    'ga_shoprectangle_directive',
    'ga_shopmsg_directive',
    'ga_shop_service'
 ]);
})();
