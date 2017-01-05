goog.provide('ga_sharedraw_directive');

goog.require('ga_permalink_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_sharedraw_directive', [
    'ga_permalink_service',
    'ga_urlutils_service'
  ]);

  /**
   * This component is a modal window, it CAN'T be reused multiple times.
   * This modal window can be opened from aanother component broadcasting a
   * gaShareDrawActive event on the $rootScope with an ol layer (containing an
   * dminId property) as parameter.
   */
  module.directive('gaShareDraw', function(gaPermalink, gaUrlUtils) {
    return {
      restrict: 'A',
      templateUrl: 'components/share/partials/share-draw.html',
      scope: {},
      link: function(scope, element) {
        var modal = element.find('.modal');

        scope.$on('gaShareDrawActive', function(evt, layer) {
          if (!layer.adminId) {
            return;
          }

          var regex = ',{0,1}' + gaUrlUtils.encodeUriQuery(layer.id, true);
          var href = gaPermalink.getHref();
          var adminHref = href.replace(new RegExp(regex), '') + '&adminId=' +
              layer.adminId;

          gaUrlUtils.shorten(href).then(function(url) {
            scope.userShareUrl = url;
          });
          gaUrlUtils.shorten(adminHref).then(function(url) {
            scope.adminShareUrl = url;
          });

          modal.modal('show');
        });
      }
    };
  });
})();

