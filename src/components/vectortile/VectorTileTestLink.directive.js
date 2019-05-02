goog.provide('ga_vector_tile_test_link');

goog.require('ga_translation_service');
goog.require('ga_permalink_service');
goog.require('ga_urlutils_service');

(function() {

  angular.module('ga_vector_tile_test_link', [
    'ga_translation_service',
    'ga_permalink_service',
    'ga_urlutils_service'
  ]).

      directive('gaVectorTileTestLink', function($window, gaLang, gaPermalink,
          gaUrlUtils) {

        function generateTestLinkUrl() {
          var params = gaUrlUtils.toKeyValue(gaPermalink.getParams()) || '';
          return '//test.map.geo.admin.ch?lang=' + gaLang.get() +
        (params.length > 0 ? '&' + params : '');
        }

        return {
          restrict: 'A',
          transclude: true,
          templateUrl: 'components/vectortile/partials/testlink.html',
          link: function(scope, element, attrs) {
            scope.url = generateTestLinkUrl();
            scope.openTestViewerWithSamePermalink = function(e) {
              var url = generateTestLinkUrl();
              $window.open(url, '_blank');
              e.preventDefault();
            };
          }
        };
      })
})();
