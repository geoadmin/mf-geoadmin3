goog.provide('ga_shopmsg_directive');

goog.require('ga_storage_service');

(function() {

  var module = angular.module('ga_shopmsg_directive', [
    'ga_storage_service'
  ]);

  module.directive('gaShopMsg', function($window, gaStorage) {
    var KEY = 'ga-shop-msg-never-show-again';
    return {
      restrict: 'A',
      templateUrl: 'components/shop/partials/shopmsg.html',
      scope: {},
      link: function(scope, elt) {
        scope.neverShowAgain = gaStorage.getItem(KEY) || false;

        if (!/^map-toposhop/.test($window.name) || scope.neverShowAgain) {
          elt.remove();
          scope.$destroy();
          return;
        }

        elt.addClass('modal fade');
        elt.modal().on('hidden.bs.modal', function() {
          gaStorage.setItem(KEY, scope.neverShowAgain);
        });
      }
    };
  });
})();
